(() => {
  "use strict";

  const catalogRoot = document.querySelector("[data-product-catalog]");
  const data = window.KASUYA_PRODUCT_CATALOG;

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

  if (catalogRoot && data && Array.isArray(data.items)) renderCatalog(data.items);

  // Public interface for future API/Supabase binding.
  window.DPRO_KASUYA_PRODUCTS = Object.freeze({
    render(items) { renderCatalog(items); },
    getItems() { return data && Array.isArray(data.items) ? [...data.items] : []; }
  });
})();