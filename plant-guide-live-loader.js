(() => {
  "use strict";

  const VERSION = "ATLAS-LIVE-LOADER-R1.2-20261004";
  const SUPABASE_URL = "https://jjmcavcuujkcwifuxonl.supabase.co";
  const SUPABASE_KEY = "sb_publishable_OtSNyipbXnlX-DcuOnCL_A_XA_1O3FP";
  const PREVIEW_SCRIPT = "plant-guide-preview.js?v=ATLAS-R1.3-20261003";

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
      image: imageFor(item.code, item.image)
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
    loadPreviewScript();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => void boot(), { once: true });
  } else {
    void boot();
  }
})();
