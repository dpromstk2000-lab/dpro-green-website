(() => {
  "use strict";

  const config = window.GREEN_WEB_CONFIG || {};
  const site = config.site || {};
  const links = config.links || {};
  const flags = config.featureFlags || {};
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function setText(selector, value) {
    qsa(selector).forEach((element) => {
      element.textContent = value || "";
    });
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
    setText("[data-site-address]", site.address);
    setText("[data-business-hours]", site.businessHours);
    setText("[data-closed-days]", site.closedDays);
    qsa("[data-site-field-row]").forEach((row) => {
      const key = row.dataset.siteFieldRow;
      const value = String(site[key] || "").trim();
      row.hidden = !value;
      row.setAttribute("aria-hidden", String(!value));
    });
    qsa("[data-demo-only]").forEach((element) => {
      element.hidden = !site.demo;
    });
    const year = new Date().getFullYear();
    setText("[data-current-year]", String(year));
  }

  function applyFeatureFlags() {
    qsa("[data-feature]").forEach((element) => {
      const key = element.dataset.feature;
      const enabled = flags[key] === true;
      element.hidden = !enabled;
      element.setAttribute("aria-hidden", String(!enabled));
    });
  }

  function setContactLinks() {
    const target = resolveSiteLink(links.contact || "index.html#contact");
    qsa("[data-link='contact']").forEach((element) => {
      element.setAttribute("href", target);
    });

    qsa("[data-link='privacy']").forEach((element) => {
      element.setAttribute("href", resolveSiteLink(links.privacy || "privacy.html"));
    });
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

  function configurePortal() {
    const enabled = flags.show_customer_portal_link === true && Boolean(links.customerPortal);
    qsa("[data-portal-action]").forEach((element) => {
      element.hidden = !enabled;
      element.setAttribute("aria-hidden", String(!enabled));
      if (enabled) element.setAttribute("href", resolveSiteLink(links.customerPortal));
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

  const dialog = qs("[data-line-dialog]");
  let dialogReturnFocus = null;

  function openLineDialog(trigger) {
    if (!dialog) return;
    dialogReturnFocus = trigger || document.activeElement;
    const message = qs("[data-line-message]", dialog);
    if (message) message.value = config.lineFallbackMessage || "観葉植物レンタルについて相談したいです。";
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    document.body.classList.add("dialog-open");
  }

  function closeLineDialog() {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    document.body.classList.remove("dialog-open");
    if (dialogReturnFocus && typeof dialogReturnFocus.focus === "function") dialogReturnFocus.focus();
  }

  function configureLine() {
    const featureEnabled = flags.show_line_consultation === true;
    qsa("[data-line-action]").forEach((element) => {
      element.hidden = !featureEnabled;
      element.setAttribute("aria-hidden", String(!featureEnabled));
      if (!featureEnabled) return;
      element.addEventListener("click", (event) => {
        event.preventDefault();
        if (links.line) {
          window.open(links.line, "_blank", "noopener,noreferrer");
        } else {
          openLineDialog(element);
        }
      });
    });

    qsa("[data-dialog-close]").forEach((button) => button.addEventListener("click", closeLineDialog));
    if (dialog) {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closeLineDialog();
      });
      dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeLineDialog();
      });
    }
  }

  function copyLineMessage() {
    const message = qs("[data-line-message]");
    const button = qs("[data-copy-line-message]");
    if (!message || !button) return;

    button.addEventListener("click", async () => {
      const value = message.value;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          message.focus();
          message.select();
          document.execCommand("copy");
        }
        button.textContent = "コピーしました";
      } catch (error) {
        message.focus();
        message.select();
        button.textContent = "選択しました";
      }
      window.setTimeout(() => {
        button.textContent = "相談文面をコピー";
      }, 1800);
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
        const answerId = button.getAttribute("aria-controls");
        const answer = document.getElementById(answerId);

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

  function configureReveal() {
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
    const update = () => {
      const keyboardOpen = window.innerHeight - window.visualViewport.height > 160;
      bar.classList.toggle("is-keyboard-open", keyboardOpen);
    };
    window.visualViewport.addEventListener("resize", update);
  }

  function init() {
    applySiteData();
    applyFeatureFlags();
    setContactLinks();
    configurePhone();
    configurePortal();
    configurePhotoCopy();
    configureLine();
    copyLineMessage();
    configureMenu();
    configureFaq();
    configureHeader();
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
