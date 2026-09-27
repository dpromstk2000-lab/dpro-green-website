(() => {
  "use strict";

  const VERSION = "GREEN-SHOP-PUBLIC-PROD-R2.4-20260927";
  if (window.__DPRO_GREEN_SHOP_RUNTIME_R24__) return;
  window.__DPRO_GREEN_SHOP_RUNTIME_R24__ = VERSION;

  const API = "https://dpro-cl-000001-green-shop.dpromstk2000.workers.dev";
  const CART_KEY = "dpro_green_shop_cart_v2";
  let liveSettings = {
    enabled: false,
    onlineShop: false,
    delivery: false,
    pickup: false,
    gift: false,
    orderingEnabled: false,
    squareEnabled: false
  };
  let liveProducts = [];
  let loading = null;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function settings() {
    return {
      enabled: Boolean(liveSettings.enabled),
      onlineShop: Boolean(liveSettings.onlineShop),
      delivery: Boolean(liveSettings.delivery),
      pickup: Boolean(liveSettings.pickup),
      gift: Boolean(liveSettings.gift),
      orderingEnabled: Boolean(liveSettings.orderingEnabled),
      // Legacy shop.html uses `square` only to decide whether order reception can open.
      // Real Square payment remains OFF until squareEnabled becomes true.
      square: Boolean(liveSettings.orderingEnabled),
      squareReady: Boolean(liveSettings.squareEnabled)
    };
  }

  function products() {
    return liveProducts.slice();
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
    const s = settings();
    if (!s.enabled || !s.onlineShop) return;
    addLink($(".desktop-nav"), "SHOP");
    addLink($(".mobile-menu__nav"), "ONLINE SHOP");
    addLink($(".footer-nav"), "ONLINE SHOP");
  }

  function polish() {
    if (!document.querySelector('meta[name="dpro-green-shop-standalone"]')) return;

    const bar = $(".demo-bar");
    if (bar) {
      bar.textContent = "ONLINE SHOP｜商品・在庫は本番データと同期しています。現在は注文受付後に決済方法をご案内します。";
    }

    const strong = $(".square-box strong");
    if (strong) strong.textContent = "注文受付（決済前）";

    const small = $(".square-box small");
    if (small) {
      small.textContent = "Square実決済は準備中です。送信後は注文受付として登録し、決済方法は店舗からご案内します。";
    }

    const submit = $('#checkout-form button[type="submit"][data-shop-feature="square"]');
    if (submit && !submit.disabled) submit.textContent = "この内容で注文を受け付ける";

    $$('[data-shop-feature="square"]').forEach((el) => {
      if (!el.matches(".trust div")) return;
      const b = $("b", el);
      const sp = $("span", el);
      if (b) b.textContent = "注文受付";
      if (sp) sp.textContent = "決済方法は後ほどご案内";
    });

    const connected = $(".connected [data-shop-feature='square']");
    if (connected) {
      const h = $("h3", connected);
      const p = $("p", connected);
      if (h) h.textContent = "受付・決済案内";
      if (p) p.textContent = "注文受付後、店舗から決済方法をご案内します。";
    }

    document.body.dataset.greenShopRuntime = VERSION;
  }

  function refreshLegacyUi() {
    // Current shop.html renderer listens for these events.
    // R2.4 is idempotent, so duplicate module execution no longer occurs.
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
        liveSettings = {...liveSettings, enabled: false, onlineShop: false};
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
        note: String(fd.get("note") || ""),
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
            <p>現在は決済前です。店舗から決済方法・在庫確定についてご案内します。</p>
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
      applyNav();
      polish();
      refreshLegacyUi();
    },
    reload: () => load(),
    createOrder: (payload) => post("/api/public/orders", payload)
  });

  function boot() {
    installAddons();
    installSubmitGuard();
    polish();
    load();
    document.documentElement.dataset.dproGreenShopRuntime = VERSION;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, {once: true});
  } else {
    boot();
  }
})();
