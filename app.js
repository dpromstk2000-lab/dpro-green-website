(() => {
  "use strict";

  const config = window.GREEN_WEB_CONFIG || {};
  const site = config.site || {};
  const links = config.links || {};
  const flags = config.featureFlags || {};
  const lineConfig = config.line || {};
  const publication = config.publication || {};
  const brand = config.brand || {};
  const media = config.media || {};
  const mapConfig = config.map || {};
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function setText(selector, value) {
    qsa(selector).forEach((element) => { element.textContent = value || ""; });
  }

  function resolveSiteLink(value) {
    const raw = String(value || "").trim();
    if (!raw || /^(?:[a-z]+:|#|\/\/)/i.test(raw) || raw.startsWith("/")) return raw;
    const root = (document.body && document.body.dataset.siteRoot) || ".";
    if (root === "." || root === "./") return raw;
    return `${root.replace(/\/$/, "")}/${raw.replace(/^\.\//, "")}`;
  }

  function applySiteData() {
    setText("[data-site-name]", site.publicName);
    setText("[data-service-name]", site.serviceName);
    setText("[data-site-region]", site.region);
    setText("[data-operator-name]", site.operatorName);
    setText("[data-site-postal-code]", site.postalCode);
    setText("[data-site-address]", site.address);
    setText("[data-business-hours]", site.businessHours);
    setText("[data-closed-days]", site.closedDays);
    setText("[data-site-manager]", site.managerName);
    setText("[data-site-manager-title]", site.managerTitle);
    setText("[data-site-fax]", site.fax);
    qsa("[data-site-field-row]").forEach((row) => {
      const key = row.dataset.siteFieldRow;
      const value = String(site[key] || "").trim();
      row.hidden = !value;
      row.setAttribute("aria-hidden", String(!value));
    });
    qsa("[data-demo-only]").forEach((element) => { element.hidden = !site.demo; });
    setText("[data-current-year]", String(new Date().getFullYear()));
  }

  function applyFeatureFlags() {
    qsa("[data-feature]").forEach((element) => {
      const enabled = flags[element.dataset.feature] === true;
      element.hidden = !enabled;
      element.setAttribute("aria-hidden", String(!enabled));
    });
  }


  function configureBrand() {
    const logoUrl = String(brand.logoUrl || "").trim();
    const approved = publication.logoApproved === true && Boolean(logoUrl);
    qsa(".brand-mark").forEach((mark) => {
      mark.classList.toggle("brand-mark--image", approved);
      const existing = qs("img", mark);
      if (!approved) {
        existing?.remove();
        return;
      }
      const image = existing || document.createElement("img");
      image.src = resolveSiteLink(logoUrl);
      image.alt = "";
      image.setAttribute("aria-hidden", "true");
      image.decoding = "async";
      if (!existing) mark.append(image);
    });

    const headquartersEnabled = flags.show_headquarters_branding === true
      && publication.headquartersTextApproved === true
      && Boolean(String(links.headquarters || "").trim());
    qsa("[data-headquarters-action]").forEach((element) => {
      element.hidden = !headquartersEnabled;
      element.setAttribute("aria-hidden", String(!headquartersEnabled));
      if (!headquartersEnabled) return;
      element.setAttribute("href", resolveSiteLink(links.headquarters));
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
      element.textContent = brand.headquartersLabel || "本部サイト";
    });
    setText("[data-official-brand-name]", publication.brandNameApproved ? brand.officialBrandName : "");
    setText("[data-brand-approved-notice]", publication.headquartersTextApproved ? brand.approvedNotice : "");
  }

  function configureMedia() {
    const images = media.images || {};
    qsa("[data-media-key]").forEach((image) => {
      const item = images[image.dataset.mediaKey] || {};
      const src = String(item.src || "").trim();
      if (src) image.setAttribute("src", resolveSiteLink(src));
      if (item.alt) image.setAttribute("alt", item.alt);
      if (Number(item.width) > 0) image.setAttribute("width", String(item.width));
      if (Number(item.height) > 0) image.setAttribute("height", String(item.height));
      image.dataset.mediaReal = String(media.useRealPhotos === true && publication.realPhotosApproved === true);
    });
    qsa("[data-media-caption-key]").forEach((caption) => {
      const item = images[caption.dataset.mediaCaptionKey] || {};
      caption.textContent = item.caption || "";
      caption.hidden = !item.caption;
      caption.setAttribute("aria-hidden", String(!item.caption));
    });
    const realApproved = media.useRealPhotos === true && publication.realPhotosApproved === true;
    qsa("[data-demo-media-only]").forEach((element) => {
      const scope = element.dataset.demoMediaOnly || "all";
      const hide = realApproved && (scope !== "cases" || publication.customerCasesApproved === true);
      element.hidden = hide;
      element.setAttribute("aria-hidden", String(hide));
    });
  }

  function configureMap() {
    const featureEnabled = flags.show_google_map === true;
    const approved = publication.googleMapApproved === true;
    const embedUrl = String(mapConfig.embedUrl || "").trim();
    const viewUrl = String(mapConfig.viewUrl || "").trim();
    qsa("[data-map-container]").forEach((container) => {
      const enabled = featureEnabled && approved && Boolean(embedUrl || viewUrl);
      container.hidden = !featureEnabled;
      container.setAttribute("aria-hidden", String(!featureEnabled));
      if (!featureEnabled) return;
      const frame = qs("[data-map-frame]", container);
      const link = qs("[data-map-link]", container);
      const placeholder = qs("[data-map-placeholder]", container);
      if (frame) {
        frame.hidden = !enabled || !embedUrl;
        if (enabled && embedUrl) {
          frame.src = embedUrl;
          frame.title = mapConfig.title || "店舗所在地のGoogleマップ";
        } else {
          frame.removeAttribute("src");
        }
      }
      if (link) {
        link.hidden = !enabled || !viewUrl;
        if (enabled && viewUrl) {
          link.href = viewUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
      }
      if (placeholder) {
        placeholder.hidden = enabled;
        const note = qs("[data-map-note]", placeholder);
        if (note) note.textContent = mapConfig.note || "店舗所在地をご案内します。";
      }
    });
  }

  const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  function captureTracking() {
    try {
      const params = new URLSearchParams(location.search);
      const saved = JSON.parse(sessionStorage.getItem("greenWebTracking") || "{}");
      TRACKING_KEYS.forEach((key) => {
        const value = params.get(key);
        if (value) saved[key] = value.slice(0, 200);
      });
      if (!saved.landingPage) saved.landingPage = location.href.slice(0, 1500);
      sessionStorage.setItem("greenWebTracking", JSON.stringify(saved));
    } catch { /* sessionStorage unavailable */ }
  }

  function contactTarget(element) {
    const target = resolveSiteLink(links.contact || "contact.html");
    if (!target || /^(?:https?:)?\/\//i.test(target) || target.startsWith("#")) return target;
    try {
      const url = new URL(target, location.href);
      const current = new URLSearchParams(location.search);
      let saved = {};
      try { saved = JSON.parse(sessionStorage.getItem("greenWebTracking") || "{}"); } catch { saved = {}; }
      TRACKING_KEYS.forEach((key) => {
        const value = current.get(key) || saved[key];
        if (value) url.searchParams.set(key, value);
      });
      const page = document.body?.dataset.page || "home";
      url.searchParams.set("from", page);
      const category = element?.dataset.contactCategory;
      if (category) url.searchParams.set("category", category);
      return `${url.pathname.split("/").pop()}${url.search}${url.hash}`;
    } catch { return target; }
  }

  function setContactLinks() {
    qsa("[data-link='contact']").forEach((element) => { element.setAttribute("href", contactTarget(element)); });
    qsa("[data-link='privacy']").forEach((element) => { element.setAttribute("href", resolveSiteLink(links.privacy || "privacy.html")); });
    qsa("[data-link='line-guide']").forEach((element) => { element.setAttribute("href", resolveSiteLink(links.lineGuide || "line.html")); });
  }

  function configurePhone() {
    const phone = String(links.phone || "").trim();
    qsa("[data-phone-info-row]").forEach((row) => {
      row.hidden = !phone;
      row.setAttribute("aria-hidden", String(!phone));
    });
    qsa("[data-phone-action]").forEach((element) => {
      if (!phone) {
        element.hidden = true;
        element.setAttribute("aria-hidden", "true");
        return;
      }
      const tel = phone.replace(/[^0-9+]/g, "");
      element.hidden = false;
      element.removeAttribute("aria-hidden");
      element.setAttribute("href", `tel:${tel}`);
      const number = qs("[data-phone-number]", element);
      if (number) number.textContent = phone;
    });
  }

  const lineDialog = qs("[data-line-dialog]");
  let dialogReturnFocus = null;

  function receptionNumber() {
    const value = qs("#thanks-reception-number")?.textContent || "";
    return /GRN-[A-Z0-9-]+/i.test(value) ? value.trim() : "（受付完了画面に表示された番号）";
  }

  function lineTemplate(key) {
    const templates = lineConfig.templates || {};
    const base = templates[key] || templates.consultation || {};
    return {
      title: base.title || "LINEで相談する",
      note: base.note || "相談内容をコピーしてLINEでお送りください。",
      message: String(base.message || config.lineFallbackMessage || "観葉植物レンタルについて相談したいです。").replaceAll("{receptionNumber}", receptionNumber())
    };
  }

  function openLineDialog(trigger, forcedKey) {
    if (!lineDialog) return;
    dialogReturnFocus = trigger || document.activeElement;
    const key = forcedKey || trigger?.dataset.lineMessageKey || "consultation";
    const template = lineTemplate(key);
    const title = qs("[data-line-dialog-title]", lineDialog);
    const description = qs("[data-line-dialog-description]", lineDialog);
    const message = qs("[data-line-message]", lineDialog);
    const note = qs("[data-line-dialog-note]", lineDialog);
    if (title) title.textContent = template.title;
    if (description) description.textContent = links.line
      ? "LINE公式を開いて相談を続けます。"
      : "下の文面をコピーしてLINEでお送りいただけます。";
    if (message) message.value = template.message;
    if (note) note.textContent = template.note;
    if (typeof lineDialog.showModal === "function") lineDialog.showModal();
    else lineDialog.setAttribute("open", "");
    document.body.classList.add("dialog-open");
  }

  function closeLineDialog() {
    if (!lineDialog) return;
    if (typeof lineDialog.close === "function") lineDialog.close();
    else lineDialog.removeAttribute("open");
    document.body.classList.remove("dialog-open");
    if (dialogReturnFocus && typeof dialogReturnFocus.focus === "function") dialogReturnFocus.focus();
  }

  function configurePortal() {
    const enabled = flags.show_customer_portal_link === true;
    const guide = resolveSiteLink(links.customerGuide || "line.html#customer-portal");
    qsa("[data-portal-action]").forEach((element) => {
      element.hidden = !enabled;
      element.setAttribute("aria-hidden", String(!enabled));
      if (enabled) element.setAttribute("href", guide);
    });
    qsa("[data-customer-portal-open]").forEach((element) => {
      element.hidden = !enabled;
      element.setAttribute("aria-hidden", String(!enabled));
      if (!enabled) return;
      element.addEventListener("click", (event) => {
        event.preventDefault();
        if (links.customerPortal) window.open(resolveSiteLink(links.customerPortal), "_blank", "noopener,noreferrer");
        else openLineDialog(element, element.dataset.lineMessageKey || "portal_help");
      });
    });
    qsa("[data-customer-portal-state]").forEach((element) => {
      element.textContent = links.customerPortal
        ? "お客様画面へ移動できます"
        : "LINEから導入後サポートをご案内します";
      element.dataset.ready = String(Boolean(links.customerPortal));
    });
  }

  function updateMobileCtaLayout() {
    const bar = qs("[data-mobile-cta]");
    if (!bar) return;
    const phoneVisible = Boolean(qs("[data-phone-action]:not([hidden])", bar));
    const lineVisible = Boolean(qs("[data-line-action]:not([hidden])", bar));
    bar.classList.toggle("is-no-phone", !phoneVisible && lineVisible);
    bar.classList.toggle("is-no-line", phoneVisible && !lineVisible);
    bar.classList.toggle("is-contact-only", !phoneVisible && !lineVisible);
  }

  function configurePhotoCopy() {
    const enabled = flags.show_photo_inquiry === true;
    setText("[data-line-label]", enabled ? "LINEで写真相談" : "LINEで相談");
    setText("[data-contact-kicker]", enabled ? "写真が1枚あると、相談がよりスムーズです" : "内容が決まっていなくても相談できます");
  }

  function configureLine() {
    const featureEnabled = flags.show_line_consultation === true;
    qsa("[data-line-action]").forEach((element) => {
      element.hidden = !featureEnabled;
      element.setAttribute("aria-hidden", String(!featureEnabled));
      if (!featureEnabled) return;
      element.addEventListener("click", (event) => {
        event.preventDefault();
        if (links.line) window.open(resolveSiteLink(links.line), "_blank", "noopener,noreferrer");
        else openLineDialog(element);
      });
    });
    qsa("[data-dialog-close]").forEach((button) => button.addEventListener("click", closeLineDialog));
    if (lineDialog) {
      lineDialog.addEventListener("click", (event) => { if (event.target === lineDialog) closeLineDialog(); });
      lineDialog.addEventListener("cancel", (event) => { event.preventDefault(); closeLineDialog(); });
    }
  }

  async function writeClipboard(value, fallbackNode) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(value);
    if (fallbackNode) {
      fallbackNode.focus();
      fallbackNode.select?.();
      document.execCommand("copy");
      return;
    }
    const area = document.createElement("textarea");
    area.value = value;
    area.className = "clipboard-fallback";
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }

  function copyLineMessage() {
    const message = qs("[data-line-message]");
    const button = qs("[data-copy-line-message]");
    if (message && button) {
      button.addEventListener("click", async () => {
        try { await writeClipboard(message.value, message); button.textContent = "コピーしました"; }
        catch { message.focus(); message.select(); button.textContent = "選択しました"; }
        window.setTimeout(() => { button.textContent = "相談文面をコピー"; }, 1800);
      });
    }
    qsa("[data-copy-message]").forEach((copyButton) => {
      const key = copyButton.dataset.copyMessage || "consultation";
      const preview = qs(`[data-message-preview='${CSS.escape(key)}']`);
      const template = lineTemplate(key);
      if (preview) preview.textContent = template.message;
      copyButton.addEventListener("click", async () => {
        const original = copyButton.textContent;
        try { await writeClipboard(lineTemplate(key).message, preview); copyButton.textContent = "コピーしました"; }
        catch { copyButton.textContent = "文面を選択してください"; }
        window.setTimeout(() => { copyButton.textContent = original; }, 1800);
      });
    });
  }

  const menuButton = qs("[data-menu-button]");
  const mobileMenu = qs("[data-mobile-menu]");
  const menuBackdrop = qs("[data-menu-backdrop]");

  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    if (menuBackdrop) menuBackdrop.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  }

  function configureMenu() {
    if (!menuButton || !mobileMenu) return;
    menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
    if (menuBackdrop) menuBackdrop.addEventListener("click", () => setMenu(false));
    qsa("a, button", mobileMenu).forEach((element) => element.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") setMenu(false);
    });
  }

  function configureFaq() {
    qsa("[data-faq-button]").forEach((button) => {
      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        const answer = document.getElementById(button.getAttribute("aria-controls"));
        qsa("[data-faq-button]").forEach((otherButton) => {
          if (otherButton !== button) {
            otherButton.setAttribute("aria-expanded", "false");
            const otherAnswer = document.getElementById(otherButton.getAttribute("aria-controls"));
            if (otherAnswer) otherAnswer.hidden = true;
          }
        });
        button.setAttribute("aria-expanded", String(!expanded));
        if (answer) answer.hidden = expanded;
      });
    });
  }

  function configureHeader() {
    const header = qs("[data-site-header]");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function configureHeroMotion() {
    const gallery = qs("[data-hero-gallery]");
    if (!gallery) return;
    const frames = qsa(".present-hero__frame", gallery);
    const progress = qs("[data-hero-progress]", gallery);
    if (frames.length < 2) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      frames.forEach((frame, index) => frame.classList.toggle("is-active", index === 0));
      return;
    }

    const intervalMs = 9000;
    let current = 0;
    let timer = 0;

    const restartProgress = () => {
      if (!progress) return;
      progress.classList.remove("is-running");
      void progress.offsetWidth;
      progress.classList.add("is-running");
    };

    const showNext = () => {
      frames[current].classList.remove("is-active");
      current = (current + 1) % frames.length;
      frames[current].classList.add("is-active");
      restartProgress();
    };

    const start = () => {
      window.clearInterval(timer);
      restartProgress();
      timer = window.setInterval(showNext, intervalMs);
    };

    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
      if (progress) progress.classList.remove("is-running");
    };

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
    start();
  }

  function configureReveal() {
    qsa("[data-reveal-stagger]").forEach((group) => {
      Array.from(group.children).forEach((item, index) => {
        item.setAttribute("data-reveal", "");
        item.style.setProperty("--reveal-delay", `${Math.min(index, 6) * 90}ms`);
      });
    });
    const items = qsa("[data-reveal]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    items.forEach((item) => observer.observe(item));
  }

  function configureScrollSpy() {
    if (!("IntersectionObserver" in window)) return;
    const navLinks = qsa("[data-nav-link]");
    const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("is-current", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-30% 0px -60%", threshold: [0.05, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
  }

  function configureCurrentPage() {
    const current = document.body ? document.body.dataset.page : "";
    qsa("[data-page-link]").forEach((link) => {
      const active = Boolean(current) && link.dataset.pageLink === current;
      link.classList.toggle("is-current", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function configureFaqFilters() {
    const buttons = qsa("[data-faq-filter]");
    const items = qsa("[data-faq-category]");
    if (!buttons.length || !items.length) return;
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.faqFilter || "all";
        buttons.forEach((other) => {
          const selected = other === button;
          other.classList.toggle("is-active", selected);
          other.setAttribute("aria-pressed", String(selected));
        });
        items.forEach((item) => {
          const categories = String(item.dataset.faqCategory || "").split(/\s+/);
          item.hidden = category !== "all" && !categories.includes(category);
        });
      });
    });
  }

  function configureContactKeyboardMode() {
    const bar = qs("[data-mobile-cta]");
    if (!bar || !window.visualViewport) return;
    const update = () => { bar.classList.toggle("is-keyboard-open", window.innerHeight - window.visualViewport.height > 160); };
    window.visualViewport.addEventListener("resize", update);
  }

  function init() {
    captureTracking();
    applySiteData();
    applyFeatureFlags();
    configureBrand();
    configureMedia();
    configureMap();
    setContactLinks();
    configurePhone();
    configurePortal();
    configurePhotoCopy();
    configureLine();
    copyLineMessage();
    configureMenu();
    configureFaq();
    configureHeader();
    configureHeroMotion();
    configureReveal();
    configureScrollSpy();
    configureCurrentPage();
    configureFaqFilters();
    configureContactKeyboardMode();
    updateMobileCtaLayout();
    document.documentElement.dataset.ready = "true";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
