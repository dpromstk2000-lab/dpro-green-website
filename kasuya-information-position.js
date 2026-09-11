(() => {
  "use strict";

  const HOME_RE = /(?:\/dpro-green-website\/?|\/index\.html)$/i;
  const ALERT_ATTR = "data-kasuya-important-alert";
  let queued = false;

  function isHome() {
    const path = location.pathname.replace(/\/+$/, "/");
    return HOME_RE.test(path) || path === "/";
  }

  function noticeData(section) {
    const important = [...section.querySelectorAll(".green-live-announcement.is-important")];
    const holidays = [...section.querySelectorAll(".green-live-holiday")];

    if (important.length) {
      const item = important[0];
      return {
        show: true,
        label: "IMPORTANT",
        title: item.querySelector("strong")?.textContent?.trim() || "重要なお知らせがあります",
        detail: item.querySelector("small")?.textContent?.trim() || ""
      };
    }

    if (holidays.length) {
      const item = holidays[0];
      const date = item.querySelector(".green-live-date")?.textContent?.trim() || "";
      const title = item.querySelector("strong")?.textContent?.trim() || "休業・特別営業のお知らせ";
      return {
        show: true,
        label: "SCHEDULE",
        title: [date, title].filter(Boolean).join(" "),
        detail: item.querySelector("p")?.textContent?.trim() || ""
      };
    }

    return { show: false, label: "", title: "", detail: "" };
  }

  function positionInformation() {
    if (!isHome()) return;

    const section = document.querySelector("[data-green-live-public-info]");
    const finalCta = document.querySelector("main .final-cta");
    if (!section || !finalCta) return;

    section.id = "store-information";
    section.classList.add("is-kasuya-bottom-info");

    if (section.nextElementSibling !== finalCta) {
      finalCta.insertAdjacentElement("beforebegin", section);
    }

    const data = noticeData(section);
    let alert = document.querySelector(`[${ALERT_ATTR}]`);

    if (!data.show) {
      alert?.remove();
      return;
    }

    if (!alert) {
      alert = document.createElement("aside");
      alert.setAttribute(ALERT_ATTR, "");
      alert.className = "kasuya-important-alert";
      alert.setAttribute("aria-label", "重要な店舗情報");

      const header = document.querySelector("[data-site-header], .site-head");
      if (header) header.insertAdjacentElement("afterend", alert);
      else document.body.prepend(alert);
    }

    alert.innerHTML = `
      <div class="wrap kasuya-important-alert__inner">
        <span class="kasuya-important-alert__label">${escapeHtml(data.label)}</span>
        <strong>${escapeHtml(data.title)}</strong>
        ${data.detail ? `<small>${escapeHtml(data.detail)}</small>` : ""}
        <a href="#store-information">詳しく見る →</a>
      </div>`;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      positionInformation();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule, { once: true });
  } else {
    schedule();
  }

  window.addEventListener("green:live-sync", schedule);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();