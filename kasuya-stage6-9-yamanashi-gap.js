(() => {
  "use strict";
  const VERSION = "STAGE6.9-20260910";

  function loadStyle() {
    if (document.querySelector('link[data-stage69-yamanashi-gap]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `kasuya-stage6-9-yamanashi-gap.css?v=${encodeURIComponent(VERSION)}`;
    link.dataset.stage69YamanashiGap = VERSION;
    document.head.append(link);
  }

  function enhancePriceGuide() {
    const cards = [...document.querySelectorAll(".price-cards article")];
    if (!cards.length) return;
    const sizes = {
      "L SIZE": { height: "高さ 150〜180cm", href: "https://green-pocket.biz/catalog/area/l/" },
      "M SIZE": { height: "高さ 60〜100cm", href: "https://green-pocket.biz/catalog/area/m/" },
      "S SIZE": { height: "高さ 30〜50cm", href: "https://green-pocket.biz/catalog/area/s/" }
    };
    cards.forEach(card => {
      if (card.querySelector("[data-stage69-size-guide]")) return;
      const label = card.querySelector("span")?.textContent?.trim();
      const info = sizes[label];
      if (!info) return;
      const guide = document.createElement("a");
      guide.href = info.href;
      guide.target = "_blank";
      guide.rel = "noopener";
      guide.className = "price-size-guide";
      guide.dataset.stage69SizeGuide = "1";
      guide.innerHTML = `<b>${info.height}</b><small>本部カタログのサイズ目安 →</small>`;
      card.append(guide);
    });
    const priceSection = document.querySelector(".price");
    if (priceSection && !priceSection.querySelector("[data-stage69-price-note]")) {
      const grid = priceSection.querySelector(".price__grid");
      if (grid) {
        const note = document.createElement("p");
        note.className = "price-size-note";
        note.dataset.stage69PriceNote = "1";
        note.textContent = "※高さはグリーン・ポケット本部カタログのサイズ区分を参考にした目安です。植物の種類・樹形・鉢・在庫により実際のサイズは異なります。";
        grid.append(note);
      }
    }
  }

  function addBusinessValueSection() {
    if (document.querySelector("[data-stage69-business-value]")) return;
    const anchor = document.querySelector(".photo-consult") || document.querySelector(".dpro");
    if (!anchor) return;
    const section = document.createElement("section");
    section.className = "section business-value";
    section.dataset.stage69BusinessValue = "1";
    section.innerHTML = `
      <div class="wrap">
        <div class="section-head business-value__head">
          <div>
            <p class="eyebrow eyebrow--green">WORKPLACE &amp; SUSTAINABILITY</p>
            <h2><span>企業にとって、緑は</span><span>装飾だけではない。</span></h2>
          </div>
          <p>働く人が過ごす環境、来客時の印象、環境への取り組み。観葉植物を「置く」だけでなく、企業の空間づくりにどう活かすかまで考えます。</p>
        </div>
        <div class="business-value__grid">
          <a href="https://green-pocket.biz/about_health.html" target="_blank" rel="noopener">
            <span>01 / WORKPLACE</span>
            <strong>働く人のための空間づくり</strong>
            <p>グリーン・ポケット本部は、千葉大学との産学連携を含むオフィス緑化の研究を公開しています。粕屋店では、職場環境を考える選択肢の一つとして空間に合う緑をご提案します。</p>
            <small>本部「健康経営」情報を見る →</small>
          </a>
          <a href="https://green-pocket.biz/about_rental.html" target="_blank" rel="noopener">
            <span>02 / IMPRESSION</span>
            <strong>来客・働く人の目に入る場所へ</strong>
            <p>受付、エントランス、打ち合わせスペースなど、印象を左右する場所に合わせて植物・鉢・配置を選定。空間全体の見え方まで含めて整えます。</p>
            <small>本部レンタル活用情報を見る →</small>
          </a>
          <a href="https://green-pocket.biz/about_csr.html" target="_blank" rel="noopener">
            <span>03 / SUSTAINABILITY</span>
            <strong>緑から始める環境への取り組み</strong>
            <p>本部では国産間伐材を活用したオリジナルプランターなど、環境配慮型の提案を公開しています。企業のCSR・サステナビリティ活動とつながる選択肢も確認できます。</p>
            <small>本部CSR情報を見る →</small>
          </a>
        </div>
        <div class="business-value__note">
          <b>GREEN VALUE</b>
          <span>WORKPLACE</span><i>＋</i><span>SPACE DESIGN</span><i>＋</i><span>SUSTAINABILITY</span>
          <p>健康・心理面の効果を個別に保証するものではありません。本部が公開する研究・CSR情報を参考に、設置環境と目的に合うグリーン活用をご案内します。</p>
        </div>
      </div>`;
    anchor.insertAdjacentElement("beforebegin", section);
  }

  loadStyle();
  enhancePriceGuide();
  addBusinessValueSection();
})();
