(() => {
  "use strict";

  const config = window.GREEN_WEB_CONFIG || {};
  const apiConfig = config.api || {};
  const flags = config.featureFlags || {};
  const form = document.querySelector("#inquiry-form");
  const thanksRoot = document.querySelector("[data-thanks-page]");
  const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
  const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  let selectedFiles = [];
  let objectUrls = [];
  let submitting = false;

  function apiUrl(path) {
    const base = String(apiConfig.baseUrl || "").replace(/\/+$/, "");
    if (!base) throw new Error("問い合わせ送信先が設定されていません。");
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  }

  function newId() {
    return crypto.randomUUID ? crypto.randomUUID() : `green-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function safeJson(response) {
    return response.json().catch(() => ({ ok: false, message: "API応答を読み取れませんでした。" }));
  }

  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (options.json !== undefined) headers.set("Content-Type", "application/json");
    if (options.idempotencyKey) headers.set("Idempotency-Key", options.idempotencyKey);
    const response = await fetch(apiUrl(path), {
      method: options.method || "GET",
      mode: "cors",
      credentials: "omit",
      headers,
      body: options.json !== undefined ? JSON.stringify(options.json) : options.body
    });
    const payload = await safeJson(response);
    if (!response.ok || payload.ok === false) {
      const error = new Error(payload.message || payload.error || "処理に失敗しました。");
      error.code = payload.error || payload.code || "request_failed";
      error.fields = payload.fields || payload.details || null;
      throw error;
    }
    return payload.data || payload;
  }

  function showError(message) {
    const box = document.querySelector("#form-error");
    if (!box) return;
    box.textContent = message || "入力内容をご確認ください。";
    box.hidden = false;
    box.focus({ preventScroll: true });
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function clearError() {
    const box = document.querySelector("#form-error");
    if (box) { box.hidden = true; box.textContent = ""; }
  }

  function setStatus(message, tone = "") {
    const node = document.querySelector("#submission-status");
    if (!node) return;
    node.textContent = message || "";
    node.dataset.tone = tone;
    node.hidden = !message;
  }

  function setBusy(busy, text = "") {
    const button = document.querySelector("#submit-button");
    if (!button) return;
    button.disabled = busy;
    button.setAttribute("aria-busy", String(busy));
    button.textContent = busy ? (text || "送信中…") : "この内容で無料相談を送る";
    form?.classList.toggle("is-submitting", busy);
  }

  function getTracking() {
    const params = new URLSearchParams(location.search);
    let saved = {};
    try { saved = JSON.parse(sessionStorage.getItem("greenWebTracking") || "{}"); } catch { saved = {}; }
    TRACKING_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) saved[key] = value.slice(0, 200);
    });
    if (!saved.landingPage) saved.landingPage = document.referrer || location.href;
    try { sessionStorage.setItem("greenWebTracking", JSON.stringify(saved)); } catch { /* unavailable */ }
    return saved;
  }

  function prefillTracking() {
    if (!form) return;
    const tracking = getTracking();
    form.elements.pageUrl.value = String(tracking.landingPage || document.referrer || location.href).slice(0, 1500);
    form.elements.utmSource.value = tracking.utm_source || "";
    form.elements.utmMedium.value = tracking.utm_medium || "";
    form.elements.utmCampaign.value = tracking.utm_campaign || "";
  }

  function roundUpHalfHour(date = new Date()) {
    const result = new Date(date);
    result.setSeconds(0, 0);
    const minutes = result.getMinutes();
    result.setMinutes(minutes < 30 ? 30 : 60);
    const pad = (value) => String(value).padStart(2, "0");
    return `${result.getFullYear()}-${pad(result.getMonth() + 1)}-${pad(result.getDate())}T${pad(result.getHours())}:${pad(result.getMinutes())}`;
  }

  function configureCandidates() {
    const min = roundUpHalfHour();
    document.querySelectorAll("input[type='datetime-local'][data-candidate]").forEach((input) => {
      input.min = min;
      input.step = "1800";
    });
  }

  function prefillFromQuery() {
    if (!form) return;
    const params = new URLSearchParams(location.search);
    const category = String(params.get("category") || "").trim();
    const allowed = new Set(Array.from(document.querySelectorAll("#inquiry-category option")).map((option) => option.value));
    if (category && allowed.has(category)) selectCategory(category);
    const source = String(params.get("from") || "").trim();
    if (source === "line") {
      const message = form.elements.inquiryDetail;
      if (message && !message.value) message.placeholder = "LINE・お客様案内ページからのご相談内容をご記入ください。";
    }
  }

  function configureCategories() {
    const featureMap = {
      photo_consultation: "show_photo_inquiry",
      spot_event: "show_spot_rental",
      pickup_disposal: "show_plant_disposal"
    };
    document.querySelectorAll("[data-category]").forEach((button) => {
      const feature = featureMap[button.dataset.category];
      const enabled = !feature || flags[feature] === true;
      button.hidden = !enabled;
      button.disabled = !enabled;
      button.addEventListener("click", () => selectCategory(button.dataset.category));
    });
    const select = document.querySelector("#inquiry-category");
    if (select) {
      [...select.options].forEach((option) => {
        const feature = featureMap[option.value];
        if (feature && flags[feature] !== true) option.remove();
      });
      select.addEventListener("change", () => selectCategory(select.value, false));
    }
    const photoSection = document.querySelector("[data-photo-section]");
    if (photoSection && flags.show_photo_inquiry !== true) photoSection.hidden = true;
  }

  function selectCategory(value, sync = true) {
    document.querySelectorAll("[data-category]").forEach((button) => {
      const selected = button.dataset.category === value;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const select = document.querySelector("#inquiry-category");
    if (sync && select) select.value = value;
    const categoryNote = document.querySelector("#category-note");
    if (categoryNote) {
      categoryNote.textContent = value === "photo_consultation"
        ? "写真で相談する場合は、写真を1枚以上添付してください。"
        : "内容が決まっていない場合は「その他」を選択して、そのまま状況をご記入ください。";
    }
  }

  function releaseObjectUrls() {
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    objectUrls = [];
  }

  function renderPreviews() {
    const preview = document.querySelector("#photo-preview");
    const count = document.querySelector("#photo-count");
    if (!preview) return;
    releaseObjectUrls();
    preview.replaceChildren();
    selectedFiles.forEach((file, index) => {
      const item = document.createElement("figure");
      item.className = "photo-preview-item";
      const image = document.createElement("img");
      const url = URL.createObjectURL(file);
      objectUrls.push(url);
      image.src = url;
      image.alt = `選択した相談写真 ${index + 1}`;
      const caption = document.createElement("figcaption");
      caption.textContent = `${index + 1}枚目・${Math.max(1, Math.round(file.size / 1024))}KB`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "photo-remove";
      button.textContent = "削除";
      button.setAttribute("aria-label", `${index + 1}枚目の写真を削除`);
      button.addEventListener("click", () => {
        selectedFiles.splice(index, 1);
        renderPreviews();
      });
      item.append(image, caption, button);
      preview.append(item);
    });
    if (count) count.textContent = `${selectedFiles.length}/${apiConfig.maxPhotos || 4}枚`;
    const caution = document.querySelector("#photo-confirm-row");
    if (caution) caution.hidden = selectedFiles.length === 0;
  }

  function loadImage(file) {
    if ("createImageBitmap" in window) return createImageBitmap(file, { imageOrientation: "from-image" });
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: image.naturalWidth, height: image.naturalHeight, draw: (ctx, w, h) => ctx.drawImage(image, 0, 0, w, h), close() {} });
      };
      image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("画像を読み込めませんでした。")); };
      image.src = url;
    });
  }

  async function compressImage(file) {
    if (!ALLOWED_MIME.has(file.type)) throw new Error("写真はJPEG・PNG・WebP形式を選択してください。");
    if (file.size < 1 || file.size > (apiConfig.maxOriginalImageBytes || 12582912)) throw new Error("1枚の写真は12MB以下にしてください。");
    const image = await loadImage(file);
    const maxEdge = apiConfig.maxImageEdge || 1600;
    const ratio = Math.min(1, maxEdge / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * ratio));
    const height = Math.max(1, Math.round(image.height * ratio));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: false });
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    if (image.draw) image.draw(context, width, height);
    else context.drawImage(image, 0, 0, width, height);
    image.close?.();
    let quality = apiConfig.jpegQuality || 0.82;
    const maxBytes = apiConfig.maxUploadImageBytes || 5242880;
    let blob;
    do {
      blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("画像を圧縮できませんでした。")), "image/jpeg", quality));
      quality -= 0.1;
    } while (blob.size > maxBytes && quality >= 0.42);
    if (blob.size > maxBytes) throw new Error("写真を5MB以下に圧縮できませんでした。別の写真をお試しください。");
    const base = String(file.name || "photo").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 50) || "photo";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
  }

  async function handlePhotos(event) {
    clearError();
    const max = apiConfig.maxPhotos || 4;
    const files = [...event.target.files];
    if (files.length > max) showError(`写真は最大${max}枚までです。先頭の${max}枚を読み込みます。`);
    const candidates = files.slice(0, max);
    selectedFiles = [];
    setStatus(candidates.length ? "写真を安全に縮小しています…" : "", "loading");
    try {
      for (const file of candidates) selectedFiles.push(await compressImage(file));
      renderPreviews();
      setStatus(candidates.length ? "写真の準備ができました。" : "", "success");
    } catch (error) {
      selectedFiles = [];
      renderPreviews();
      showError(error.message);
      setStatus("", "");
    } finally {
      event.target.value = "";
    }
  }

  function validateContact(data) {
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const preferred = String(data.get("preferredContactMethod") || "");
    if (!phone && !email) throw new Error("電話番号またはメールアドレスのどちらかを入力してください。");
    if (preferred === "phone" && !phone) throw new Error("電話連絡を希望する場合は電話番号を入力してください。");
    if (preferred === "email" && !email) throw new Error("メール連絡を希望する場合はメールアドレスを入力してください。");
    const category = String(data.get("inquiryCategory") || "");
    if (category === "photo_consultation" && selectedFiles.length === 0) throw new Error("写真で相談する場合は、写真を1枚以上添付してください。");
    if (selectedFiles.length && data.get("photoConfirmed") !== "on") throw new Error("写真に個人情報や機密情報が写っていないことを確認してください。");
  }

  function buildPayload() {
    const data = new FormData(form);
    validateContact(data);
    return {
      facilityCode: apiConfig.facilityCode,
      source: document.body.dataset.source || "website",
      companyName: String(data.get("companyName") || "").trim(),
      contactName: String(data.get("contactName") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      postalCode: String(data.get("postalCode") || "").trim(),
      address: String(data.get("address") || "").trim(),
      inquiryCategory: String(data.get("inquiryCategory") || ""),
      siteType: String(data.get("siteType") || ""),
      desiredCount: data.get("desiredCount") === "" ? null : Number(data.get("desiredCount")),
      desiredSize: String(data.get("desiredSize") || ""),
      desiredStartPeriod: String(data.get("desiredStartPeriod") || "").trim(),
      siteCheckCandidates: [data.get("candidate1"), data.get("candidate2"), data.get("candidate3")].filter(Boolean),
      preferredContactMethod: String(data.get("preferredContactMethod") || ""),
      inquiryText: String(data.get("inquiryText") || "").trim(),
      consent: data.get("consent") === "on",
      website: String(data.get("website") || ""),
      pageUrl: String(data.get("pageUrl") || location.href),
      utm: {
        source: String(data.get("utmSource") || ""),
        medium: String(data.get("utmMedium") || ""),
        campaign: String(data.get("utmCampaign") || "")
      }
    };
  }

  function idempotencyKey() {
    try {
      let key = sessionStorage.getItem("greenWebInquiryIdempotency");
      if (!key) {
        key = newId();
        sessionStorage.setItem("greenWebInquiryIdempotency", key);
      }
      return key;
    } catch { return newId(); }
  }

  async function uploadPhoto(inquiryId, file, token, index) {
    const body = new FormData();
    body.append("file", file, file.name || `photo-${index + 1}.jpg`);
    body.append("caption", `ホームページ相談写真 ${index + 1}`);
    return request(`/api/public/inquiries/${encodeURIComponent(inquiryId)}/photos`, {
      method: "POST",
      headers: { "X-Upload-Token": token },
      body
    });
  }

  function storeReceipt(data, photoState = "complete") {
    const summary = {
      receptionNumber: data.receptionNumber || data.reception_number || "",
      duplicateCandidate: Boolean(data.duplicateCandidate || data.duplicate_candidate),
      photoCount: selectedFiles.length,
      photoState,
      submittedAt: new Date().toISOString()
    };
    try { sessionStorage.setItem("greenWebLastReceipt", JSON.stringify(summary)); } catch { /* unavailable */ }
    return summary;
  }

  function goThanks(summary) {
    const params = new URLSearchParams();
    params.set("receipt", summary.receptionNumber);
    if (summary.duplicateCandidate) params.set("duplicate", "1");
    if (summary.photoState !== "complete") params.set("photo", summary.photoState);
    location.assign(`thanks.html?${params.toString()}`);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    clearError();
    setStatus("", "");
    if (!form.reportValidity()) return;
    submitting = true;
    setBusy(true, "受付情報を送信中…");
    let created = null;
    try {
      const payload = buildPayload();
      created = await request("/api/public/inquiries", {
        method: "POST",
        json: payload,
        idempotencyKey: idempotencyKey()
      });
      const inquiryId = created.inquiryId || created.inquiry_id;
      const receptionNumber = created.receptionNumber || created.reception_number;
      const uploadToken = created.uploadToken || created.upload_token;
      if (!inquiryId || !receptionNumber) throw new Error("受付番号を確認できませんでした。");
      if (selectedFiles.length) {
        if (!uploadToken) throw new Error("写真送信用の確認情報を取得できませんでした。");
        for (let index = 0; index < selectedFiles.length; index += 1) {
          setBusy(true, `写真を保存中 ${index + 1}/${selectedFiles.length}`);
          setStatus(`問い合わせは受付済みです。写真${index + 1}枚目を保存しています。`, "loading");
          await uploadPhoto(inquiryId, selectedFiles[index], uploadToken, index);
        }
      }
      try { sessionStorage.removeItem("greenWebInquiryIdempotency"); } catch { /* unavailable */ }
      goThanks(storeReceipt({ ...created, receptionNumber }, "complete"));
    } catch (error) {
      if (created) {
        const summary = storeReceipt(created, "partial");
        try { sessionStorage.removeItem("greenWebInquiryIdempotency"); } catch { /* unavailable */ }
        goThanks(summary);
        return;
      }
      showError(error.message || "送信できませんでした。通信環境をご確認のうえ、もう一度お試しください。");
      setStatus("送信は完了していません。入力内容は画面に残っています。", "error");
      submitting = false;
      setBusy(false);
    }
  }

  async function loadPublicInfo() {
    const note = document.querySelector("#service-note");
    const apiState = document.querySelector("#api-state");
    try {
      const [facility, services] = await Promise.all([
        request("/api/public/facility"),
        request("/api/public/services")
      ]);
      const name = facility.facilityName || facility.facility_name;
      if (name) document.querySelectorAll("[data-api-facility-name]").forEach((node) => { node.textContent = name; });
      const rows = services.services || [];
      if (note) note.textContent = `${rows.length || "複数"}種類の相談区分をDPRO GREENで受け付けます。料金確定ではなく、担当者が内容を確認するための受付です。`;
      if (apiState) { apiState.textContent = "受付システム接続：確認済み"; apiState.dataset.tone = "success"; }
    } catch {
      if (note) note.textContent = "フォームは入力できます。送信時に受付システムとの接続を確認します。";
      if (apiState) { apiState.textContent = "受付システム接続：送信時に再確認"; apiState.dataset.tone = "warning"; }
    }
  }

  function initForm() {
    if (!form) return;
    prefillTracking();
    configureCandidates();
    configureCategories();
    prefillFromQuery();
    document.querySelector("#photos")?.addEventListener("change", handlePhotos);
    form.addEventListener("submit", handleSubmit);
    window.addEventListener("pagehide", releaseObjectUrls);
    loadPublicInfo();
  }

  function initThanks() {
    if (!thanksRoot) return;
    const params = new URLSearchParams(location.search);
    let saved = {};
    try { saved = JSON.parse(sessionStorage.getItem("greenWebLastReceipt") || "{}"); } catch { saved = {}; }
    const candidate = params.get("receipt") || saved.receptionNumber || "";
    const receipt = /^[A-Z0-9-]{4,50}$/i.test(candidate) ? candidate : "受付番号を確認できませんでした";
    const receiptNode = document.querySelector("#thanks-reception-number");
    if (receiptNode) receiptNode.textContent = receipt;
    const duplicate = params.get("duplicate") === "1" || saved.duplicateCandidate === true;
    const duplicateNode = document.querySelector("#thanks-duplicate");
    if (duplicateNode) duplicateNode.hidden = !duplicate;
    const photoState = params.get("photo") || saved.photoState || "complete";
    const photoNode = document.querySelector("#thanks-photo-state");
    if (photoNode) {
      photoNode.hidden = photoState === "complete";
      if (photoState !== "complete") photoNode.textContent = "相談内容は受付済みですが、一部の写真を保存できなかった可能性があります。受付番号を控え、担当者からの連絡時にお伝えください。";
    }
    const copy = document.querySelector("#copy-reception-number");
    copy?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(receipt);
        copy.textContent = "コピーしました";
      } catch {
        copy.textContent = "受付番号を選択してください";
      }
      setTimeout(() => { copy.textContent = "受付番号をコピー"; }, 1800);
    });
  }

  initForm();
  initThanks();
})();
