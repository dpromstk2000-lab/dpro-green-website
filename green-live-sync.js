/* DPRO GREEN KASUYA — PUBLIC EXPERIENCE GUARD V1.0 / 2026-09-11
   Live Sync remains active, while public-facing brand/copy stays production-safe. */
(() => {
  "use strict";

  const config = window.GREEN_WEB_CONFIG || {};
  const liveSync = config.liveSync || {};
  const apiBase = String(config.api?.baseUrl || "").trim().replace(/\/+$/, "");
  if (!liveSync.enabled || !apiBase) return;

  const endpointPath = String(liveSync.endpointPath || "/api/public/site-profile?target=website");
  const endpoint = `${apiBase}${endpointPath.startsWith("/") ? endpointPath : `/${endpointPath}`}`;
  const cacheKey = `green-live-site-profile:${config.api?.facilityCode || "default"}`;
  const timeoutMs = Math.max(2000, Math.min(Number(liveSync.timeoutMs || 8000), 20000));
  const cacheMs = Math.max(1, Number(liveSync.cacheMinutes || 10)) * 60 * 1000;

  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));

  function ensureInformationPositionAssets() {
    if (!document.querySelector('link[href*="kasuya-information-position.css"]')) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "kasuya-information-position.css?v=INFO-ALL-PAGES-V1.0-20260911";
      css.dataset.kasuyaInformationPosition = "live-sync";
      document.head.append(css);
    }
    if (!document.querySelector('script[src*="kasuya-information-position.js"]')) {
      const script = document.createElement("script");
      script.src = "kasuya-information-position.js?v=INFO-ALL-PAGES-V1.0-20260911";
      script.defer = true;
      script.dataset.kasuyaInformationPosition = "live-sync";
      document.head.append(script);
    }
  }
  ensureInformationPositionAssets();

  function setText(selector, value) {
    if (value === undefined || value === null || value === "") return;
    qsa(selector).forEach((node) => { node.textContent = String(value); });
  }

  function safeTime(value) {
    const text = String(value || "");
    return /^\d{2}:\d{2}$/.test(text) ? text : "";
  }

  function validDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
  }

  function sanitizeSnapshot(payload) {
    const data = payload?.data && typeof payload.data === "object" ? payload.data : {};
    return {
      facilityCode: String(data.facilityCode || "").slice(0, 80),
      facilityName: String(data.facilityName || "").slice(0, 200),
      postalCode: String(data.postalCode || "").slice(0, 20),
      address: String(data.address || "").slice(0, 500),
      phone: String(data.phone || "").slice(0, 50),
      businessHoursSummary: String(data.businessHoursSummary || "").slice(0, 1000),
      closedDaysSummary: String(data.closedDaysSummary || "").slice(0, 1000),
      businessHours: (Array.isArray(data.businessHours) ? data.businessHours : []).slice(0, 7).map((row) => ({
        weekday: Number(row?.weekday),
        isOpen: row?.isOpen === true,
        openTime: safeTime(row?.openTime),
        closeTime: safeTime(row?.closeTime),
        note: String(row?.note || "").slice(0, 300),
      })).filter((row) => Number.isInteger(row.weekday) && row.weekday >= 0 && row.weekday <= 6),
      upcomingHolidays: (Array.isArray(data.upcomingHolidays) ? data.upcomingHolidays : []).slice(0, 20).map((row) => ({
        date: String(row?.date || "").slice(0, 10),
        title: String(row?.title || "休業").slice(0, 160),
        isClosed: row?.isClosed !== false,
        note: String(row?.note || "").slice(0, 500),
        openTime: safeTime(row?.openTime),
        closeTime: safeTime(row?.closeTime),
      })).filter((row) => validDate(row.date)),
      announcements: (Array.isArray(data.announcements) ? data.announcements : []).slice(0, 20).map((row) => ({
        title: String(row?.title || "").slice(0, 160),
        body: String(row?.body || "").slice(0, 5000),
        isImportant: row?.isImportant === true,
        period: String(row?.period || "").slice(0, 120),
      })).filter((row) => row.title && row.body),
    };
  }

  function loadCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
      if (!cached?.snapshot || !cached?.savedAt) return null;
      return cached;
    } catch {
      return null;
    }
  }

  function saveCache(snapshot) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        savedAt: Date.now(),
        snapshot,
        adapterVersion: liveSync.adapterVersion || "",
      }));
    } catch {
      // Storage may be unavailable. The page still keeps config.js fallback.
    }
  }

  function applyPhone(phone) {
    if (!phone) return;
    const tel = phone.replace(/[^0-9+]/g, "");
    qsa("[data-phone-number]").forEach((node) => { node.textContent = phone; });
    qsa("[data-phone-action]").forEach((node) => {
      node.hidden = false;
      node.removeAttribute("aria-hidden");
      node.setAttribute("href", `tel:${tel}`);
    });
  }

  function updateMobileNote(snapshot) {
    const note = qs(".mobile-menu__note");
    if (!note) return;
    const hours = snapshot.businessHoursSummary || config.site?.businessHours || "";
    const closed = snapshot.closedDaysSummary || config.site?.closedDays || "";
    note.textContent = [hours ? `受付 ${hours}` : "", closed].filter(Boolean).join("／");
  }

  function productionPublicName(snapshot) {
    const configured = String(config.site?.publicName || config.site?.operatorName || "").trim();
    const liveName = String(snapshot.facilityName || "").trim();
    const isProduction = config.release?.mode === "production" && config.site?.demo !== true;
    if (isProduction && configured) return configured;
    return liveName || configured;
  }

  function replaceExactText(from, to) {
    qsa("a,button,strong,p,span,small").forEach((node) => {
      if (node.children.length === 0 && node.textContent.trim() === from) {
        node.textContent = to;
      }
    });
  }

  function sanitizePublicCopy() {
    const publicName = String(config.site?.publicName || "グリーン・ポケット福岡粕屋店").trim();

    qsa("[data-site-name]").forEach((node) => {
      const current = node.textContent.trim();
      if (!current || /DEMO|デモ/i.test(current) || config.release?.mode === "production") {
        node.textContent = publicName;
      }
    });

    replaceExactText("無料で設置相談", "設置を相談する");
    replaceExactText("無料で設置相談する", "設置を相談する");
    replaceExactText("無料相談", "WEB相談");
    replaceExactText("Free consultation", "CONTACT");
    replaceExactText("「必ず交換」などの断定はしません", "植物の状態に合わせて対応");
    replaceExactText(
      "交換や追加対応の条件は、実際の契約内容を確認してご案内します。",
      "植物の状態や設置環境を確認し、必要な手入れや対応をご案内します。"
    );
    replaceExactText("DPRO GREEN × LINE", "AFTER SERVICE / FOLLOW UP");
    replaceExactText(
      "契約後は、LINE公式とDPRO GREENをつなぎ、次回訪問予定・作業内容・写真・追加相談を分かりやすくする運用を想定しています。",
      "契約後も、次回訪問予定・作業内容・写真・追加相談を確認しやすい流れを整えています。"
    );
    replaceExactText(
      "お客様画面URLが未設定の間、リンクは自動的に非表示になります。",
      "ご利用方法は、契約後に分かりやすくご案内します。"
    );
    replaceExactText("表示想定", "確認");
    replaceExactText(
      "相談受付は無料です。サービス料金が無料という意味ではありません。",
      "設置場所やご希望が決まっていない段階からご相談いただけます。"
    );
    replaceExactText(
      "作業イメージ｜実際の店舗スタッフではありません。",
      "定期メンテナンスの作業イメージ"
    );

    qsa("[data-headquarters-action]").forEach((node) => {
      node.hidden = true;
      node.setAttribute("aria-hidden", "true");
    });

    qsa("[data-official-store-link]").forEach((node) => {
      node.href = "about.html";
      node.textContent = "福岡粕屋店について";
      node.removeAttribute("target");
      node.removeAttribute("rel");
    });
  }

  function publicNoticeSection(snapshot, source, savedAt) {
    const holidays = snapshot.upcomingHolidays || [];
    const announcements = snapshot.announcements || [];
    const existing = qs("[data-green-live-public-info]");
    const section = existing || document.createElement("section");
    section.className = "green-live-public-info";
    section.dataset.greenLivePublicInfo = "";
    section.setAttribute("aria-label", "店舗からの営業情報");

    const holidayHtml = holidays.map((item) => {
      const schedule = item.isClosed
        ? "休業"
        : `${escapeHtml(item.openTime || "時間未定")}〜${escapeHtml(item.closeTime || "時間未定")}`;
      return `<article class="green-live-holiday ${item.isClosed ? "is-closed" : "is-open"}">
        <span class="green-live-date">${escapeHtml(item.date)}</span>
        <div><strong>${escapeHtml(item.title)}</strong><p>${schedule}${item.note ? `／${escapeHtml(item.note)}` : ""}</p></div>
      </article>`;
    }).join("");

    const announcementHtml = announcements.map((item) => `
      <article class="green-live-announcement ${item.isImportant ? "is-important" : ""}">
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.body).replace(/\n/g, "<br>")}</p>
        ${item.period ? `<small>${escapeHtml(item.period)}</small>` : ""}
      </article>`).join("");

    const updatedLabel = savedAt
      ? `更新 ${new Intl.DateTimeFormat("ja-JP", {
          month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
        }).format(new Date(savedAt))}`
      : "";

    section.innerHTML = `
      <div class="green-live-public-info__inner">
        <header class="green-live-public-info__head">
          <div><span>INFORMATION</span><h2>営業時間・休業日のお知らせ</h2></div>
          ${liveSync.showSyncStatus === false || !updatedLabel ? "" : `<small>${updatedLabel}</small>`}
        </header>
        ${announcements.length ? `<div class="green-live-announcements">${announcementHtml}</div>` : ""}
        ${holidays.length ? `<div class="green-live-holidays"><h3>今後の休業・特別営業</h3>${holidayHtml}</div>` : ""}
        ${!announcements.length && !holidays.length ? `<p class="green-live-empty">現在、公開中の臨時休業・特別なお知らせはありません。</p>` : ""}
      </div>`;

    if (!existing) {
      const header = qs("[data-site-header], .site-header");
      if (header) header.insertAdjacentElement("afterend", section);
      else document.body.prepend(section);
    }
  }

  function applySnapshot(snapshot, source = "live", savedAt = Date.now()) {
    setText("[data-site-name]", productionPublicName(snapshot));
    setText("[data-business-hours]", snapshot.businessHoursSummary);
    setText("[data-closed-days]", snapshot.closedDaysSummary);
    setText("[data-site-postal-code]", snapshot.postalCode);
    setText("[data-site-address]", snapshot.address);
    applyPhone(snapshot.phone);
    updateMobileNote(snapshot);
    publicNoticeSection(snapshot, source, savedAt);
    sanitizePublicCopy();
    document.documentElement.dataset.greenLiveSync = source;
    window.dispatchEvent(new CustomEvent("green:live-sync", {
      detail: {
        source,
        savedAt,
        adapterVersion: liveSync.adapterVersion || "",
        facilityCode: snapshot.facilityCode,
      },
    }));
  }

  async function fetchLive() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { accept: "application/json" },
        cache: "no-store",
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.message || payload?.error || `HTTP ${response.status}`);
      }
      const snapshot = sanitizeSnapshot(payload);
      if (!snapshot.facilityCode || !snapshot.facilityName) throw new Error("public_profile_invalid");
      saveCache(snapshot);
      applySnapshot(snapshot, "live", Date.now());
    } finally {
      clearTimeout(timer);
    }
  }

  async function sync() {
    sanitizePublicCopy();
    const cached = loadCache();
    if (cached && Date.now() - Number(cached.savedAt) <= cacheMs) {
      applySnapshot(cached.snapshot, "cache", cached.savedAt);
    }
    try {
      await fetchLive();
    } catch (error) {
      if (cached?.snapshot) {
        applySnapshot(cached.snapshot, "cache", cached.savedAt);
      } else {
        sanitizePublicCopy();
        document.documentElement.dataset.greenLiveSync = "fallback";
      }
      console.warn("[GREEN live sync] config.js fallback is active", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sync, { once: true });
  } else {
    sync();
  }
})();