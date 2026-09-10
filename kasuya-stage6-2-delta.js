(() => {
  "use strict";

  const catalogRoot = document.querySelector("[data-product-catalog]");
  const data = window.KASUYA_PRODUCT_CATALOG;
  const shopRoot = document.querySelector("[data-shop-catalog]");

  const esc = (value) => String(value ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;");

  function renderCatalog(items) {
    if (!catalogRoot) return;
    const visible = (items || []).filter(item => item && item.visible !== false);
    catalogRoot.innerHTML = visible.map(item => {
      const chips = [];
      if (item.size) chips.push(`<span>${esc(item.size)}</span>`);
      if (item.monthly_price) chips.push(`<span>${esc(item.monthly_price)}</span>`);
      if (item.material) chips.push(`<span>${esc(item.material)}</span>`);
      if (item.recommended_for) chips.push(`<span>${esc(item.recommended_for)}</span>`);
      const body = `
        <span class="catalog-item__meta">${esc(item.category || "PRODUCT")}</span>
        <strong class="catalog-item__name">${esc(item.name)}</strong>
        ${item.feature ? `<small class="catalog-item__feature">${esc(item.feature)}</small>` : ""}
        ${chips.length ? `<span class="catalog-item__data">${chips.join("")}</span>` : ""}
      `;
      return item.source_url
        ? `<a class="catalog-item" href="${esc(item.source_url)}" target="_blank" rel="noopener">${body}</a>`
        : `<article class="catalog-item">${body}</article>`;
    }).join("");
  }

  function renderShop(items) {
    if (!shopRoot) return;
    const visible = (items || []).filter(item => item && item.visible !== false);
    shopRoot.innerHTML = visible.map(item => {
      const flags = [];
      if (item.rental_enabled) flags.push(`<span>レンタル相談</span>`);
      if (item.purchase_enabled) flags.push(`<span>購入</span>`);
      return `<article class="shop-product-card">
        <a href="shop.html" aria-label="${esc(item.name)}をONLINE SHOPで見る">
          <img src="${esc(item.image)}" alt="${esc(item.name)}のイメージ" width="1080" height="1440" loading="lazy">
          <div class="shop-product-card__body">
            <span class="shop-product-card__cat">${esc(item.category || "PRODUCT")}</span>
            <strong>${esc(item.name)}</strong>
            ${item.feature ? `<small>${esc(item.feature)}</small>` : ""}
            <div class="shop-product-card__meta"><span>${esc(item.size || "")}</span>${flags.join("")}</div>
          </div>
        </a>
      </article>`;
    }).join("");
  }

  if (catalogRoot && data && Array.isArray(data.items)) renderCatalog(data.items);
  if (shopRoot && data && Array.isArray(data.shop_items)) renderShop(data.shop_items);

  // Public interface for future API/Supabase binding.
  window.DPRO_KASUYA_PRODUCTS = Object.freeze({
    render(items) { renderCatalog(items); },
    renderShop(items) { renderShop(items); },
    getItems() { return data && Array.isArray(data.items) ? [...data.items] : []; },
    getShopItems() { return data && Array.isArray(data.shop_items) ? [...data.shop_items] : []; }
  });

  // STAGE 6.9 is isolated as a home-only additive delta so the accepted STAGE 6.2 logic stays intact.
  const canonical = document.querySelector('link[rel="canonical"]')?.href || "";
  const isHome = /\/dpro-green-website\/?$/.test(canonical) || /\/index\.html$/.test(location.pathname) || location.pathname.endsWith('/dpro-green-website/');
  if (isHome && !document.querySelector('script[data-stage69-yamanashi-gap]')) {
    const script = document.createElement("script");
    script.src = "kasuya-stage6-9-yamanashi-gap.js?v=STAGE6.9-20260910";
    script.async = false;
    script.dataset.stage69YamanashiGap = "1";
    document.head.append(script);
  }
})();
