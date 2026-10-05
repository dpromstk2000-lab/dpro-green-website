(() => {
  "use strict";

  const VERSION = "GREEN-SHOP-PUBLIC-PROD-R3.2-CASH-READY-20261005";
  if (window.__DPRO_GREEN_SHOP_RUNTIME_R32__) return;
  window.__DPRO_GREEN_SHOP_RUNTIME_R32__ = VERSION;
  // Compatibility guard: if an older cached loader tries to execute after R3.1, stop it.
  window.__DPRO_GREEN_SHOP_RUNTIME_R30__ = VERSION;

  const API = "https://dpro-cl-000001-green-shop.dpromstk2000.workers.dev";
  const CART_KEY = "dpro_green_shop_cart_v2";
  let liveSettings = {
    enabled: false,
    onlineShop: false,
    delivery: false,
    pickup: false,
    gift: false,
    orderingEnabled: false,
    squareEnabled: false,
    reservation: false,
    localDelivery: false,
    rental: false,
    rentalDelivery: false
  };
  let liveProducts = [];
  let loading = null;
  let shopState = "pending"; // pending | ready | error

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  document.documentElement.dataset.greenShopState = "pending";

  function settings() {
    return {
      enabled: Boolean(liveSettings.enabled),
      onlineShop: Boolean(liveSettings.onlineShop),
      delivery: Boolean(liveSettings.delivery),
      pickup: Boolean(liveSettings.pickup),
      gift: Boolean(liveSettings.gift),
      orderingEnabled: Boolean(liveSettings.orderingEnabled),
      reservation: Boolean(liveSettings.reservation),
      localDelivery: Boolean(liveSettings.localDelivery),
      rental: Boolean(liveSettings.rental),
      rentalDelivery: Boolean(liveSettings.rentalDelivery),
      // Legacy shop.html uses `square` only to decide whether order reception can open.
      // Real Square payment remains OFF until squareEnabled becomes true.
      square: Boolean(liveSettings.orderingEnabled),
      squareReady: Boolean(liveSettings.squareEnabled)
    };
  }

  function products() {
    return liveProducts.slice();
  }

  function isShopOpen() {
    const s = settings();
    return Boolean(s.enabled && s.onlineShop);
  }

  function installStateGateStyle() {
    if (document.querySelector('style[data-green-shop-state-gate]')) return;
    const style = document.createElement("style");
    style.dataset.greenShopStateGate = "R31";
    style.textContent = `
      html[data-green-shop-state="pending"] [data-stage6-shop] { display:none !important; }
      body[data-shop-enabled="false"] .hero__rail { grid-template-columns:repeat(3,minmax(0,1fr)); }
      body[data-shop-enabled="false"] .trust-strip__grid { grid-template-columns:repeat(3,minmax(0,1fr)); }
      body[data-shop-enabled="false"] .choice-grid { grid-template-columns:1fr; }
      body[data-shop-enabled="false"] .choice-grid .choice-card--rental { max-width:760px; width:100%; margin-inline:auto; }
      @media(max-width:800px){
        body[data-shop-enabled="false"] .hero__rail { grid-template-columns:1fr 1fr; }
        body[data-shop-enabled="false"] .hero__rail article:nth-child(3) { grid-column:1 / -1; border-right:0; }
        body[data-shop-enabled="false"] .trust-strip__grid { grid-template-columns:1fr 1fr; }
        body[data-shop-enabled="false"] .trust-strip__grid > div:nth-child(3) { grid-column:1 / -1; border-right:0; }
      }
    `;
    document.head.append(style);
  }

  installStateGateStyle();

  function ensurePausedSection() {
    if (document.querySelector('meta[name="dpro-green-shop-standalone"]')) return null;
    let section = document.querySelector('[data-green-shop-paused]');
    if (section) return section;
    const activeShopSection = document.querySelector('.shop-showcase[data-stage6-shop]');
    if (!activeShopSection) return null;

    section = document.createElement("section");
    section.className = "shop-showcase";
    section.dataset.greenShopPaused = "1";
    section.hidden = true;
    section.innerHTML = `
      <div aria-hidden="true" class="shop-showcase__backdrop"><img alt="" height="800" src="shop-set-natural.webp" width="1200"></div>
      <div aria-hidden="true" class="shop-showcase__shade"></div>
      <div class="wrap shop-showcase__inner">
        <div class="shop-showcase__copy">
          <p class="eyebrow eyebrow--lime">ONLINE SHOP</p>
          <h2><span>オンラインショップは、</span><span data-green-shop-paused-title>現在準備中です。</span></h2>
          <p data-green-shop-paused-message>商品・在庫の確認や入れ替えを行っています。準備が整い次第、こちらで注文受付を再開します。レンタルや植物選びのご相談は、LINE・WEBからいつでも受け付けています。</p>
          <div class="shop-showcase__badges"><span>商品確認中</span><span>在庫調整</span><span>再開後に注文受付</span></div>
          <div class="shop-showcase__actions">
            <a class="btn btn--lime btn--large" href="line.html">LINEで植物を相談 →</a>
            <a class="btn btn--glass btn--large" href="plant-guide.html">植物・鉢図鑑を見る</a>
          </div>
        </div>
        <div class="shop-showcase__cards">
          <article><img alt="植物と鉢の商品イメージ" height="800" src="shop-monstera-main.webp" width="1200"><span>PREPARING</span><strong>商品・在庫を確認中</strong></article>
          <article><img alt="グリーン相談のイメージ" height="800" src="shop-gift-green.webp" width="1200"><span>CONSULTATION</span><strong>LINE相談は受付中</strong></article>
        </div>
      </div>`;
    activeShopSection.insertAdjacentElement("afterend", section);
    return section;
  }

  function applyPublicShopState() {
    const open = shopState === "ready" && isShopOpen();
    const resolved = shopState === "ready" || shopState === "error";
    document.documentElement.dataset.greenShopState = shopState === "error" ? "error" : open ? "open" : shopState === "ready" ? "closed" : "pending";

    if (document.body) {
      document.body.dataset.shopEnabled = resolved ? String(open) : "pending";
    }

    $$('[data-stage6-shop]').forEach((el) => {
      el.hidden = !open;
    });

    const paused = ensurePausedSection();
    if (paused) {
      paused.hidden = !resolved || open;
      const title = $('[data-green-shop-paused-title]', paused);
      const message = $('[data-green-shop-paused-message]', paused);
      if (shopState === "error") {
        if (title) title.textContent = "現在情報を確認できません。";
        if (message) message.textContent = "オンラインショップの状態を一時的に確認できません。レンタルや植物選びのご相談は、LINE・WEBから受け付けています。";
      } else {
        if (title) title.textContent = "現在準備中です。";
        if (message) message.textContent = "商品・在庫の確認や入れ替えを行っています。準備が整い次第、こちらで注文受付を再開します。レンタルや植物選びのご相談は、LINE・WEBからいつでも受け付けています。";
      }
    }

    const purchaseBadge = $('.shop-showcase[data-stage6-shop] .shop-showcase__badges span:last-child');
    if (purchaseBadge && open) {
      purchaseBadge.textContent = "注文受付";
    }
  }

  function polishDisabledPanel() {
    const panel = $('[data-shop-disabled]');
    if (!panel) return;
    const title = $('h1', panel);
    const message = $('p', panel);
    const links = $$('a', panel);

    if (shopState === "error") {
      if (title) title.textContent = "オンラインショップ情報を確認できません";
      if (message) message.textContent = "一時的にショップの状態を確認できません。レンタルや植物選びのご相談は、LINEから受け付けています。";
    } else if (!isShopOpen()) {
      if (title) title.textContent = "オンラインショップは現在準備中です";
      if (message) message.textContent = "商品・在庫の確認や入れ替えのため、オンライン注文を一時停止しています。準備が整い次第、こちらで受付を再開します。";
    }

    if (links[0]) {
      links[0].href = "plant-guide.html";
      links[0].textContent = "植物・鉢図鑑を見る";
    }
    if (links[1]) {
      links[1].href = "line.html";
      links[1].textContent = "LINEで相談する";
    }
  }

  function normalizePhone(value) {
    let phone = String(value || "").trim().replace(/[^\d+]/g, "");
    if (phone.startsWith("+81")) phone = "0" + phone.slice(3);
    return phone.replace(/\D/g, "");
  }

  async function request(path, options = {}) {
    const response = await fetch(API + path, {
      cache: "no-store",
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? {"Content-Type": "application/json"} : {}),
        ...(options.headers || {})
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      throw new Error(data.message || data.error || `SHOP API HTTP ${response.status}`);
    }
    return data.data;
  }

  const get = (path) => request(path);
  const post = (path, json) => request(path, {
    method: "POST",
    body: JSON.stringify(json)
  });

  function addLink(nav, label) {
    if (!nav || nav.querySelector('[data-green-shop-link]')) return;
    const a = document.createElement("a");
    a.href = "shop.html";
    a.textContent = label;
    a.dataset.greenShopLink = "1";
    nav.append(a);
  }

  function applyNav() {
    $$('[data-green-shop-link]').forEach((x) => x.remove());
    if (!isShopOpen()) return;
    addLink($(".desktop-nav"), "SHOP");
    addLink($(".mobile-menu__nav"), "ONLINE SHOP");
    addLink($(".footer-nav"), "ONLINE SHOP");
  }

  function polish() {
    if (!document.querySelector('meta[name="dpro-green-shop-standalone"]')) return;

    const open = shopState === "ready" && isShopOpen();
    const bar = $(".demo-bar");
    if (bar) {
      if (shopState === "error") {
        bar.textContent = "ONLINE SHOP｜現在ショップ情報を確認できません。LINEからご相談ください。";
      } else if (!open) {
        bar.textContent = "ONLINE SHOP｜現在準備中です。商品・在庫の確認や入れ替えを行っています。";
      } else {
        bar.textContent = "ONLINE SHOP｜商品・在庫は本番データと同期しています。現在のお支払い方法は現金です。";
      }
    }

    polishDisabledPanel();

    const strong = $(".square-box strong");
    if (strong) strong.textContent = "お支払い方法：現金";

    const small = $(".square-box small");
    if (small) {
      small.textContent = "現在は現金払いで受け付けています。Squareカード決済は準備中です。";
    }

    const submit = $('#checkout-form button[type="submit"][data-shop-feature="square"]');
    if (submit && !submit.disabled) {
      submit.textContent = "この内容で注文を受け付ける";
    }

    $$('[data-shop-feature="square"]').forEach((el) => {
      if (!el.matches(".trust div")) return;
      const b = $("b", el);
      const sp = $("span", el);
      if (b) b.textContent = "現金払い";
      if (sp) sp.textContent = "Squareは準備中";
    });

    const connected = $(".connected [data-shop-feature='square']");
    if (connected) {
      const h = $("h3", connected);
      const p = $("p", connected);
      if (h) h.textContent = "現金でお支払い";
      if (p) p.textContent = "現在は現金払いで受け付けています。Squareカード決済は準備中です。";
    }

    if (document.body) document.body.dataset.greenShopRuntime = VERSION;
  }

  function refreshLegacyUi() {
    // Current shop.html renderer listens for these events.
    // R3.0 is idempotent, so duplicate module execution no longer occurs.
    try {
      window.dispatchEvent(new StorageEvent("storage", {
        key: "dpro_green_shop_products_v1"
      }));
    } catch {}
    window.dispatchEvent(new Event("pageshow"));
  }

  async function load({silent = false} = {}) {
    if (loading) return loading;

    loading = (async () => {
      try {
        const [s, p] = await Promise.all([
          get("/api/public/settings"),
          get("/api/public/products")
        ]);
        liveSettings = s || liveSettings;
        liveProducts = Array.isArray(p) ? p : [];
        shopState = "ready";
        applyPublicShopState();
        applyNav();
        polish();
        refreshLegacyUi();
        window.dispatchEvent(new CustomEvent("dpro-green-shop-ready", {
          detail: {
            version: VERSION,
            settings: settings(),
            productCount: liveProducts.length
          }
        }));
        return true;
      } catch (error) {
        console.error(VERSION, error);
        liveSettings = {...liveSettings, enabled: false, onlineShop: false, orderingEnabled: false};
        shopState = "error";
        applyPublicShopState();
        applyNav();
        polish();
        if (!silent) {
          window.dispatchEvent(new CustomEvent("dpro-green-shop-error", {
            detail: {message: error.message || "SHOP情報を読み込めませんでした。"}
          }));
        }
        refreshLegacyUi();
        return false;
      } finally {
        loading = null;
      }
    })();

    return loading;
  }

  function readCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }

  function orderItems() {
    return readCart()
      .map((x) => ({
        id: String(x?.id || ""),
        qty: Math.max(1, Number(x?.qty) || 1)
      }))
      .filter((x) => x.id);
  }

  function setSubmitBusy(form, busy) {
    const button = form.querySelector('button[type="submit"]');
    if (!button) return;
    button.disabled = busy;
    button.textContent = busy ? "送信中…" : "この内容で注文を受け付ける";
  }

  async function submitOrder(form) {
    try {
      const freshSettings = await get("/api/public/settings");
      liveSettings = freshSettings || liveSettings;
      shopState = "ready";
      applyPublicShopState();
      applyNav();
      polish();
    } catch {
      alert("SHOP設定を確認できませんでした。時間をおいて再度お試しください。");
      return;
    }

    const s = settings();
    if (!s.enabled || !s.onlineShop || !s.orderingEnabled) {
      alert("現在オンライン注文を受け付けていません。LINEからご相談ください。");
      return;
    }

    const items = orderItems();
    if (!items.length) {
      alert("カートが空です。");
      return;
    }

    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const rawPhone = String(fd.get("phone") || "").trim();
    const phone = normalizePhone(rawPhone);
    const email = String(fd.get("email") || "").trim();
    const address = String(fd.get("address") || "").trim();
    const deliveryMethod = String(fd.get("deliveryMethod") || "配送");

    if (!name) {
      alert("お名前を入力してください。");
      return;
    }
    if (phone.length < 10 || phone.length > 11) {
      alert("電話番号を確認してください。");
      return;
    }
    if (deliveryMethod === "配送" && !address) {
      alert("配送の場合はお届け先住所を入力してください。");
      return;
    }

    setSubmitBusy(form, true);
    try {
      const result = await post("/api/public/orders", {
        deliveryMethod,
        customer: {
          name,
          phone,
          email,
          address,
          contactMethod: String(fd.get("contactMethod") || "LINE")
        },
        note: `[支払方法：現金] ${String(fd.get("note") || "")}`.trim().slice(0, 3000),
        items
      });

      localStorage.setItem(CART_KEY, "[]");

      const card = $("#checkout-card");
      if (card) {
        const orderNumber = String(result?.orderNumber || "");
        card.innerHTML = `
          <div class="complete">
            <div class="complete-icon">✓</div>
            <div class="eyebrow">ORDER RECEIVED</div>
            <h2>注文を受け付けました</h2>
            <p>注文番号 <strong>${orderNumber}</strong></p>
            <p>お支払い方法は現金です。商品・在庫の最終確認後、店舗から受取方法をご案内します。</p>
            <div class="hero-actions" style="justify-content:center">
              <a class="btn primary" href="index.html">公式HPへ戻る</a>
              <a class="btn line" href="line.html">LINEで相談</a>
            </div>
          </div>`;
      }

      refreshLegacyUi();
      window.dispatchEvent(new CustomEvent("dpro-green-shop-order-created", {
        detail: {orderNumber: String(result?.orderNumber || "")}
      }));
    } catch (error) {
      alert(error.message || "注文を受け付けできませんでした。");
      setSubmitBusy(form, false);
    }
  }

  function installSubmitGuard() {
    if (document.documentElement.dataset.greenShopSubmitGuardR24 === "1") return;
    document.documentElement.dataset.greenShopSubmitGuardR24 = "1";

    // Capture phase blocks the legacy local-only form handler before it can run.
    document.addEventListener("submit", (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || form.id !== "checkout-form") return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      submitOrder(form);
    }, true);
  }

  function installAddons() {
    if (!document.querySelector('script[data-kasuya-language-lite]')) {
      const x = document.createElement("script");
      x.src = "kasuya-language-lite.js?v=LANG-LITE-V1.1-20260910";
      x.defer = true;
      x.dataset.kasuyaLanguageLite = "1";
      document.head.append(x);
    }
    if (!document.querySelector('script[data-kasuya-hq-local-routing]')) {
      const x = document.createElement("script");
      x.src = "kasuya-hq-local-routing.js?v=HQ-LOCAL-ROUTING-V1.0-20260910";
      x.defer = true;
      x.dataset.kasuyaHqLocalRouting = "1";
      document.head.append(x);
    }
  }

  window.DPROGreenShop = Object.freeze({
    version: VERSION,
    settings,
    products,
    apply: () => {
      applyPublicShopState();
      applyNav();
      polish();
      refreshLegacyUi();
    },
    reload: () => load(),
    createOrder: (payload) => post("/api/public/orders", payload)
  });

  function refreshWhenReturning(event) {
    // Ignore the synthetic pageshow event used only to refresh the legacy renderer.
    if (event?.type === "pageshow" && event.isTrusted === false) return;
    if (document.hidden) return;
    load({silent: true});
  }

  function boot() {
    installStateGateStyle();
    ensurePausedSection();
    applyPublicShopState();
    installAddons();
    installSubmitGuard();
    polish();
    load();
    document.documentElement.dataset.dproGreenShopRuntime = VERSION;
    window.addEventListener("focus", refreshWhenReturning, {passive: true});
    window.addEventListener("pageshow", refreshWhenReturning, {passive: true});
    document.addEventListener("visibilitychange", refreshWhenReturning, {passive: true});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, {once: true});
  } else {
    boot();
  }
})();
