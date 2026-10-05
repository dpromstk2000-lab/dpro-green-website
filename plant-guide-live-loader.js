(() => {
  "use strict";

  const VERSION = "ATLAS-LIVE-LOADER-R1.6-POSITION-FIX-20261005";
  const SUPABASE_URL = "https://jjmcavcuujkcwifuxonl.supabase.co";
  const SUPABASE_KEY = "sb_publishable_OtSNyipbXnlX-DcuOnCL_A_XA_1O3FP";
  const PREVIEW_SCRIPT = "plant-guide-preview.js?v=ATLAS-R1.4-20261004";

  function imageFor(code, current) {
    if (current) return current;
    if (/^SP-GP-\d{4}$/.test(code)) {
      return new URL(`atlas-plant-${code.toLowerCase()}.png`, location.href).toString();
    }
    if (/^CM-GP-\d{4}$/.test(code)) {
      return new URL(`atlas-pot-${code.toLowerCase()}.png`, location.href).toString();
    }
    return null;
  }

  function applyImages(items) {
    return (items || []).map((item) => ({
      ...item,
      material: item.material === "未設定" ? null : item.material,
      size: item.size === "未設定" ? null : item.size,
      image: imageFor(item.code, item.image),
      imageScale: Number.isFinite(Number(item.imageScale)) ? Number(item.imageScale) : 1,
      imageCardFit: item.imageCardFit === "contain" ? "contain" : "cover",
      imageShiftX: Number.isFinite(Number(item.imageShiftX)) ? Number(item.imageShiftX) : 0,
      imageShiftY: Number.isFinite(Number(item.imageShiftY)) ? Number(item.imageShiftY) : 0,
      detailImageScale: Number.isFinite(Number(item.detailImageScale)) ? Number(item.detailImageScale) : 1,
      detailImageShiftX: Number.isFinite(Number(item.detailImageShiftX)) ? Number(item.detailImageShiftX) : 0,
      detailImageShiftY: Number.isFinite(Number(item.detailImageShiftY)) ? Number(item.detailImageShiftY) : 0
    }));
  }

  function buildDetail(plants, pots, fallback) {
    const detail = { ...(fallback || {}) };
    for (const item of plants || []) {
      detail[item.code] = {
        lead: item.lead || detail[item.code]?.lead || "",
        places: Array.isArray(item.places) ? item.places : (detail[item.code]?.places || []),
        moods: Array.isArray(item.moods) ? item.moods : (detail[item.code]?.moods || []),
        care: item.care || detail[item.code]?.care || "",
        pots: Array.isArray(item.pots) ? item.pots : (detail[item.code]?.pots || []),
        quality: item.quality || detail[item.code]?.quality || ""
      };
    }
    for (const item of pots || []) {
      detail[item.code] = {
        lead: item.lead || detail[item.code]?.lead || "",
        moods: Array.isArray(item.moods) ? item.moods : (detail[item.code]?.moods || []),
        plants: Array.isArray(item.plants) ? item.plants : (detail[item.code]?.plants || []),
        quality: item.quality || detail[item.code]?.quality || ""
      };
    }
    return detail;
  }

  function applyPotCardImageFit() {
    if (document.querySelector('style[data-atlas-pot-fit]')) return;
    const style = document.createElement("style");
    style.dataset.atlasPotFit = VERSION;
    style.textContent = `
      .atlas-card[data-kind="pots"] .atlas-card__media img {
        object-fit: contain;
        padding: 10px;
        background: #f7f5ef;
      }
    `;
    document.head.append(style);
  }

  function applyPlantImageTuning(plants) {
    document.querySelector('style[data-atlas-plant-tuning]')?.remove();
    document.querySelector('style[data-atlas-plant-scale]')?.remove();

    const clamp = (v, min, max, fallback) => {
      const n = Number(v);
      return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
    };

    const rules = [];
    for (const item of plants || []) {
      const code = String(item?.code || "").trim();
      if (!/^SP-(?:GP-\d{4}|PACHIRA-\d{3})$/.test(code)) continue;

      const scale = clamp(item.imageScale, .85, 1.4, 1);
      const shiftX = clamp(item.imageShiftX, -18, 18, 0);
      const shiftY = clamp(item.imageShiftY, -18, 18, 0);
      const fit = item.imageCardFit === "contain" ? "contain" : "cover";

      if (fit !== "cover" || Math.abs(scale - 1) > .001 || shiftX || shiftY) {
        rules.push(
          `.atlas-card[data-kind="plants"][data-code="${code}"] .atlas-card__media img {`,
          `  object-fit: ${fit};`,
          `  transform: translate(${shiftX.toFixed(2)}%, ${shiftY.toFixed(2)}%) scale(${scale.toFixed(2)});`,
          `  transform-origin: center center;`,
          fit === "contain" ? `  background: #f7f7f2;` : "",
          `}`
        );
      }
    }

    if (!rules.length) return;

    const style = document.createElement("style");
    style.dataset.atlasPlantTuning = VERSION;
    style.textContent = `
      .atlas-card[data-kind="plants"] .atlas-card__media img {
        transition: transform .18s ease;
        transform-origin: center center;
      }
      ${rules.filter(Boolean).join("\n")}
    `;
    document.head.append(style);
  }

  function installDetailImageTuning(plants) {
    const dialog = document.querySelector("#atlas-dialog");
    if (!dialog || dialog.dataset.atlasDetailTuning === VERSION) return;
    dialog.dataset.atlasDetailTuning = VERSION;

    const byName = new Map((plants || []).map((item) => [String(item?.name || "").trim(), item]));
    const clamp = (v, min, max, fallback) => {
      const n = Number(v);
      return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
    };

    const apply = () => {
      const title = dialog.querySelector(".atlas-detail__body h2")?.textContent?.trim();
      const img = dialog.querySelector(".atlas-detail__media img");
      if (!title || !img) return;

      const item = byName.get(title);
      if (!item) return;

      const scale = clamp(item.detailImageScale, .85, 1.2, 1);
      const shiftX = clamp(item.detailImageShiftX, -18, 18, 0);
      const shiftY = clamp(item.detailImageShiftY, -18, 18, 0);

      img.style.objectFit = "contain";
      img.style.objectPosition = "center center";
      img.style.transformOrigin = "center center";
      img.style.transform = `translate(${shiftX.toFixed(2)}%, ${shiftY.toFixed(2)}%) scale(${scale.toFixed(2)})`;
      img.style.transition = "transform .18s ease";
    };

    const observer = new MutationObserver(apply);
    observer.observe(dialog, { childList: true, subtree: true });
    dialog.addEventListener("toggle", apply);
    apply();
  }

  function loadPreviewScript() {
    if (document.querySelector('script[data-atlas-preview-runtime]')) return;
    const script = document.createElement("script");
    script.src = PREVIEW_SCRIPT;
    script.defer = true;
    script.dataset.atlasPreviewRuntime = VERSION;
    document.head.append(script);
  }

  async function boot() {
    const fallbackData = window.DPRO_GREEN_ATLAS_DATA || { plants: [], pots: [] };
    const fallbackDetail = window.DPRO_GREEN_ATLAS_DETAIL_DATA || {};

    let data = {
      version: fallbackData.version || "ATLAS-FALLBACK",
      plants: applyImages(fallbackData.plants),
      pots: applyImages(fallbackData.pots)
    };
    let detail = { ...fallbackDetail };
    let source = "snapshot";

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/green_preview_atlas`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "apikey": SUPABASE_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: "{}"
      });
      if (!response.ok) throw new Error(`RPC ${response.status}`);

      const live = await response.json();
      if (!live || !Array.isArray(live.plants) || !Array.isArray(live.pots)) {
        throw new Error("Invalid atlas payload");
      }
      if (live.plants.length !== 74 || live.pots.length !== 22) {
        throw new Error(`Unexpected atlas count ${live.plants.length}/${live.pots.length}`);
      }

      const plants = applyImages(live.plants);
      const pots = applyImages(live.pots);
      data = {
        version: live.version || "GREEN-PREVIEW-ATLAS-R1",
        plants,
        pots
      };
      detail = buildDetail(plants, pots, fallbackDetail);
      source = "supabase";
    } catch (error) {
      console.warn("[DPRO GREEN ATLAS] Supabase preview unavailable; snapshot fallback used.", error);
    }

    window.DPRO_GREEN_ATLAS_DATA = Object.freeze(data);
    window.DPRO_GREEN_ATLAS_DETAIL_DATA = Object.freeze(detail);
    window.DPRO_GREEN_ATLAS_RUNTIME_SOURCE = source;
    document.documentElement.dataset.atlasDataSource = source;
    applyPotCardImageFit();
    applyPlantImageTuning(data.plants);
    installDetailImageTuning(data.plants);
    loadPreviewScript();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => void boot(), { once: true });
  } else {
    void boot();
  }
})();
