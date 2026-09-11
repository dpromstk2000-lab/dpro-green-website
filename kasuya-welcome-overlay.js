(() => {
  "use strict";

  const VERSION = "WELCOME-V1.1-20260911";
  const SEEN_KEY = "dpro-green-kasuya:welcome-notice:seen";
  const FORCE = new URLSearchParams(location.search).get("welcome") === "1";
  const cfg = window.GREEN_WEB_CONFIG || {};
  let overlay = null;
  let currentFingerprint = "";
  let lastFocused = null;
  let fallbackTimer = null;
  let initialAttempted = false;

  const text = (value) => String(value ?? "").trim();
  const hash = (input) => {
    let h = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  };

  const getLiveNotice = () => {
    const section = document.querySelector("[data-green-live-public-info]");
    if (!section) {
      return {
        summary: "現在、公開中の臨時休業・特別なお知らせはありません。",
        detail: "",
        signature: "fallback-no-live"
      };
    }

    const announcements = [...section.querySelectorAll(".green-live-announcement")].map((node) => ({
      title: text(node.querySelector("strong")?.textContent),
      body: text(node.querySelector("p")?.textContent),
      period: text(node.querySelector("small")?.textContent)
    }));

    const holidays = [...section.querySelectorAll(".green-live-holiday")].map((node) => ({
      date: text(node.querySelector(".green-live-date")?.textContent),
      title: text(node.querySelector("strong")?.textContent),
      body: text(node.querySelector("p")?.textContent)
    }));

    const empty = text(section.querySelector(".green-live-empty")?.textContent);
    if (!announcements.length && !holidays.length) {
      return {
        summary: empty || "現在、公開中の臨時休業・特別なお知らせはありません。",
        detail: "",
        signature: empty || "live-empty"
      };
    }

    const lines = [];
    announcements.forEach((item) => {
      lines.push([item.title, item.body, item.period].filter(Boolean).join("｜"));
    });
    holidays.forEach((item) => {
      lines.push([item.date, item.title, item.body].filter(Boolean).join("｜"));
    });

    return {
      summary: announcements.length ? announcements[0].title : "今後の休業・特別営業があります。",
      detail: lines.join("\n"),
      signature: lines.join("|")
    };
  };

  const getSnapshot = () => {
    const live = getLiveNotice();
    const openDays = text(cfg.site?.openDays || cfg.site?.openDaysLabel) || "月〜金";
    const hours = text(cfg.site?.businessHours) || "09:00～17:30";
    const closed = text(cfg.site?.closedDays) || "土日祝日・GW・年末年始";
    const shopEnabled = cfg.featureFlags?.show_online_shop !== false;
    const lineReady = cfg.publication?.lineApproved === true && !!text(cfg.links?.line);
    const signature = [
      VERSION,
      openDays,
      hours,
      closed,
      live.signature,
      shopEnabled ? "shop:on" : "shop:off",
      lineReady ? `line:${text(cfg.links?.line)}` : "line:pending"
    ].join("||");
    return {
      openDays,
      hours,
      closed,
      live,
      shopEnabled,
      lineReady,
      lineUrl: text(cfg.links?.line),
      fingerprint: hash(signature)
    };
  };

  const make = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  };

  const closeOverlay = ({ remember = true } = {}) => {
    if (!overlay) return;
    if (remember && currentFingerprint) {
      try { localStorage.setItem(SEEN_KEY, currentFingerprint); } catch {}
    }
    overlay.classList.add("is-closing");
    document.documentElement.classList.remove("welcome-overlay-open");
    const target = overlay;
    overlay = null;
    window.setTimeout(() => target.remove(), 220);
    if (lastFocused && typeof lastFocused.focus === "function") {
      window.setTimeout(() => lastFocused.focus({ preventScroll: true }), 0);
    }
  };

  const buildServiceCard = ({ title, note, href, qr, status, enabled = true }) => {
    const card = make(enabled && href ? "a" : "div", "welcome-service");
    if (enabled && href) card.href = href;

    const copy = make("div", "welcome-service__copy");
    copy.append(
      make("span", "welcome-service__eyebrow", status),
      make("strong", "", title),
      make("small", "", note)
    );

    const visual = make("div", "welcome-service__visual");
    if (qr && enabled) {
      const img = document.createElement("img");
      img.src = qr;
      img.alt = `${title}のQRコード`;
      img.width = 132;
      img.height = 132;
      visual.append(img);
    } else {
      visual.append(make("span", "welcome-service__pending", "準備中"));
    }

    card.append(copy, visual);
    return card;
  };

  const buildFactCard = (label, value, hint = "") => {
    const card = make("div", "welcome-notice__fact");
    card.append(
      make("span", "", label),
      make("strong", "", value)
    );
    if (hint) card.append(make("small", "", hint));
    return card;
  };

  const renderOverlay = ({ force = false } = {}) => {
    const snapshot = getSnapshot();
    currentFingerprint = snapshot.fingerprint;

    let seen = "";
    try { seen = localStorage.getItem(SEEN_KEY) || ""; } catch {}
    if (!force && !FORCE && seen === snapshot.fingerprint) return false;

    if (overlay) overlay.remove();
    lastFocused = document.activeElement;

    const root = make("div", "welcome-overlay");
    root.dataset.welcomeOverlay = "";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "welcome-overlay-title");

    const shade = make("button", "welcome-overlay__shade");
    shade.type = "button";
    shade.setAttribute("aria-label", "お知らせを閉じる");

    const panel = make("div", "welcome-overlay__panel");
    const close = make("button", "welcome-overlay__close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "閉じる");

    const head = make("header", "welcome-overlay__head");
    const brand = make("div", "welcome-overlay__brand");
    const mark = make("span", "welcome-overlay__mark", "葉");
    mark.setAttribute("aria-hidden", "true");

    const brandCopy = make("div", "");
    brandCopy.append(
      make("span", "welcome-overlay__eyebrow", "FUKUOKA KASUYA / WELCOME"),
      make("h2", "", "福岡粕屋店からのお知らせ")
    );
    brandCopy.querySelector("h2").id = "welcome-overlay-title";

    const headLead = make("p", "welcome-overlay__lead",
      "植物のある空間づくりを、相談しやすく・分かりやすく。営業案内と相談導線をまとめています。"
    );

    brand.append(mark, brandCopy);
    head.append(brand, headLead, close);

    const body = make("div", "welcome-overlay__body");

    const notice = make("section", "welcome-notice");
    const intro = make("div", "welcome-notice__intro");
    intro.append(
      make("span", "welcome-notice__intro-eyebrow", "BOTANICAL WELCOME"),
      make("h3", "", "グリーンのある毎日を、\nここから始めましょう。"),
      make("p", "", "ご来店前に営業時間とお知らせをご確認いただき、気になる方法からそのままご相談ください。")
    );

    const chips = make("div", "welcome-notice__chips");
    ["レンタルグリーン", "植物販売", "空間づくり相談"].forEach((label) => {
      chips.append(make("span", "welcome-notice__chip", label));
    });
    intro.append(chips);

    const facts = make("div", "welcome-notice__facts");
    facts.append(
      buildFactCard("通常営業日", snapshot.openDays, "ご相談受付の基本日程"),
      buildFactCard("営業時間", snapshot.hours, "店舗・対応時間"),
      buildFactCard("定休日", snapshot.closed, "祝日・長期休暇を含む")
    );

    const liveBox = make("div", "welcome-notice__live");
    liveBox.append(
      make("span", "", "臨時休業・特別営業"),
      make("strong", "", snapshot.live.summary)
    );
    if (snapshot.live.detail) {
      liveBox.append(make("p", "", snapshot.live.detail));
    }

    const noticeFoot = make("p", "welcome-notice__foot",
      "同じお知らせは次回から表示しません。臨時休業など内容が更新された場合は、もう一度表示します。"
    );
    notice.append(intro, facts, liveBox, noticeFoot);

    const services = make("section", "welcome-services");
    const servicesHead = make("div", "welcome-services__head");
    servicesHead.append(
      make("span", "", "QUICK ACCESS"),
      make("h3", "", "スマホで、そのまま相談・購入"),
      make("p", "welcome-services__lead", "気になる方法を選ぶだけで、福岡粕屋店の導線へそのまま進めます。")
    );

    const grid = make("div", "welcome-services__grid");
    grid.append(
      buildServiceCard({
        title: "レンタル・設置相談",
        note: "設置場所の写真や希望時期から相談できます。",
        href: "contact.html",
        qr: "kasuya-qr-rental-contact.png",
        status: "RENTAL / CONTACT"
      }),
      buildServiceCard({
        title: "植物・鉢の販売",
        note: snapshot.shopEnabled ? "ONLINE SHOPで植物・鉢を確認できます。" : "現在準備中です。",
        href: snapshot.shopEnabled ? "shop.html" : "",
        qr: snapshot.shopEnabled ? "kasuya-qr-online-shop.png" : "",
        status: "ONLINE SHOP",
        enabled: snapshot.shopEnabled
      }),
      buildServiceCard({
        title: "LINE公式",
        note: snapshot.lineReady ? "LINE公式から相談できます。" : "LINE公式の公開準備が整い次第、ここにQRを表示します。",
        href: snapshot.lineReady ? snapshot.lineUrl : "",
        qr: "",
        status: "LINE OFFICIAL",
        enabled: snapshot.lineReady
      })
    );
    services.append(servicesHead, grid);

    body.append(notice, services);

    const foot = make("footer", "welcome-overlay__foot");
    const enter = make("button", "welcome-overlay__enter", "サイトを見る →");
    enter.type = "button";
    foot.append(
      make("small", "", "この案内はいつでも「営業時間・休業日のお知らせ」から開き直せます。"),
      enter
    );

    panel.append(head, body, foot);
    root.append(shade, panel);
    document.body.append(root);
    overlay = root;
    document.documentElement.classList.add("welcome-overlay-open");

    const dismiss = () => closeOverlay({ remember: true });
    close.addEventListener("click", dismiss);
    shade.addEventListener("click", dismiss);
    enter.addEventListener("click", dismiss);

    root.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = [...root.querySelectorAll('a[href],button:not([disabled])')]
        .filter((el) => !el.hidden && el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });

    window.requestAnimationFrame(() => {
      root.classList.add("is-open");
      close.focus({ preventScroll: true });
    });
    return true;
  };

  const addReopenButton = () => {
    const section = document.querySelector("[data-green-live-public-info]");
    if (!section || section.querySelector("[data-welcome-notice-open]")) return;
    const inner = section.querySelector(".green-live-public-info__inner") || section;
    const button = make("button", "welcome-reopen", "お知らせ・QRを開く");
    button.type = "button";
    button.dataset.welcomeNoticeOpen = "";
    button.addEventListener("click", () => renderOverlay({ force: true }));
    inner.append(button);
  };

  const attemptInitial = (source = "fallback") => {
    if (source === "fallback" && initialAttempted) return;
    if (source !== "fallback") initialAttempted = true;
    addReopenButton();
    renderOverlay({ force: false });
  };

  window.addEventListener("green:live-sync", () => {
    if (fallbackTimer) window.clearTimeout(fallbackTimer);
    initialAttempted = true;
    addReopenButton();

    const snapshot = getSnapshot();
    let seen = "";
    try { seen = localStorage.getItem(SEEN_KEY) || ""; } catch {}

    if (overlay) {
      closeOverlay({ remember: false });
      window.setTimeout(() => renderOverlay({ force: true }), 260);
    } else if (FORCE || seen !== snapshot.fingerprint) {
      renderOverlay({ force: false });
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      fallbackTimer = window.setTimeout(() => attemptInitial("fallback"), 1800);
    }, { once: true });
  } else {
    fallbackTimer = window.setTimeout(() => attemptInitial("fallback"), 1800);
  }

  const observer = new MutationObserver(addReopenButton);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();