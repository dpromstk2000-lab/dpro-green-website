/* DPRO GREEN KASUYA — HQ ORIGINAL PHOTO CATALOG R2.0 / 2026-10-05 */
(() => {
  "use strict";
  const VERSION = "GREEN-ORIGINAL-MASTER-R2.0-PHOTO22-20261005";
  if (!/\/original\.html$/.test(location.pathname)) return;
  if (window.__DPRO_GREEN_ORIGINAL_PHOTO22__) return;
  window.__DPRO_GREEN_ORIGINAL_PHOTO22__ = VERSION;

  const PRODUCTS = [{"name":"グリーバ-DX","cat":"大型緑化","price":"14,300円〜64,350円／月","size":"S・M・L（W800〜3200mm）","desc":"設置スペースに合わせて構成できる大型の室内緑化システム。","url":"https://green-pocket.biz/catalog/greeva-dx","image":"https://green-pocket.biz/wp-content/uploads/2024/01/DSC08048.JPG__2-1100x733.jpg"},{"name":"コズミ・オアシス","cat":"大型緑化","price":"20,900円〜38,500円／月","size":"90×90・180×60・180×90cm","desc":"国産間伐ヒノキ材の枠で、大型のグリーンコーディネートをつくれる商品。","url":"https://green-pocket.biz/catalog/1760/","image":"https://green-pocket.biz/wp-content/uploads/2024/01/image-21-1100x733.jpg"},{"name":"フォリッジ","cat":"卓上・小型","price":"2,750円〜5,500円／月","size":"450・900サイズ","desc":"デスク中央などの細長いスペースを緑の場所へ変える横長プランター。","url":"https://green-pocket.biz/catalog/foridge","image":"https://green-pocket.biz/wp-content/uploads/2025/02/DSC02574-1100x733.jpg"},{"name":"ストーネア","cat":"プランター","price":"2,860円〜4,840円／月","size":"M φ320×H320mm・L φ410×H400mm","desc":"シンプルモダンなファイバーセメント製プランター。","url":"https://green-pocket.biz/catalog/stonea","image":"https://green-pocket.biz/wp-content/uploads/2025/02/cbf5b9f60da99bf791c0aa12a770f429-1100x732.png"},{"name":"ハニカムウォール","cat":"壁面","price":"2,200円／月","size":"W350×D105×H305mm","desc":"六角形を組み合わせて壁面に緑を広げられる壁掛けプランター。","url":"https://green-pocket.biz/catalog/885/","image":"https://green-pocket.biz/wp-content/uploads/2021/09/fc9c5ba75536e7da7f20f857c18cf771-1100x733.jpg"},{"name":"フォレストフレーム","cat":"壁面","price":"1,760円〜6,380円／月","size":"S・M・L","desc":"絵を飾るように、床面を使わず壁へ緑を取り入れられる商品。","url":"https://green-pocket.biz/catalog/870","image":"https://green-pocket.biz/wp-content/uploads/2021/09/forest-flame_1.jpg"},{"name":"カーシスパーテーション","cat":"間仕切り・家具","price":"13,750円〜21,450円／月","size":"M・L／パーテーション・雑誌ラック・本棚","desc":"国産ヒノキ材を使い、空間を緑でやさしく仕切れる木製パーティション。","url":"https://green-pocket.biz/catalog/985/","image":"https://green-pocket.biz/wp-content/uploads/2021/09/c_1-1100x683.jpg"},{"name":"白樺プランター","cat":"プランター","price":"4,950円／月","size":"H40×W43×D43cm","desc":"天然の白樺の表情を生かした、存在感のある鉢カバー。","url":"https://green-pocket.biz/catalog/1410/","image":"https://green-pocket.biz/wp-content/uploads/2022/02/IMG_7626-3-scaled-e1761129122792-1100x849.jpg"},{"name":"白樺スタンド＆ハンギング","cat":"間仕切り・家具","price":"2,750円〜8,800円／月","size":"3本枝・5本枝セット／M・Lハンギング","desc":"天然白樺のスタンドとハンギングで、空中にも緑を配置できる商品。","url":"https://green-pocket.biz/catalog/1342/","image":"https://green-pocket.biz/wp-content/uploads/2021/12/49d65fcf8f957558235e1a0051ffa3c6-1100x733.jpg"},{"name":"クレスト","cat":"プランター","price":"770円〜2,750円／月 *","size":"SS・S・S-WIDE","desc":"国産ヒノキ間伐材の木目を生かしたボックス型プランター。","url":"https://green-pocket.biz/catalog/916","note":"* 本部公式商品ページでは価格非掲載。足立店が2026年7月時点の本部カタログ料金として掲載する価格を参照。","image":"https://green-pocket.biz/wp-content/uploads/2021/09/1-3-e1783410987311.jpg"},{"name":"グリーンフープ","cat":"卓上・小型","price":"770円〜／月","size":"角・丸タイプ","desc":"パーティションへ取り付けて、デスク面を使わずグリーンを楽しめる商品。","url":"https://green-pocket.biz/catalog/941/","image":"https://green-pocket.biz/wp-content/uploads/2021/09/hoop1.jpg"},{"name":"グリーントーチ","cat":"卓上・小型","price":"1,100円〜／月","size":"角350・角500・丸350・丸500","desc":"デスク上にグリーンを浮かせるように配置するスタンド。","url":"https://green-pocket.biz/catalog/960/","image":"https://green-pocket.biz/wp-content/uploads/2021/09/torch1.jpg"},{"name":"グリーントーチ2","cat":"卓上・小型","price":"1,100円〜2,200円／月","size":"1鉢・2鉢・3鉢仕様","desc":"1本の支柱に複数の鉢を自由な位置と角度で配置できる商品。","url":"https://green-pocket.biz/catalog/949/","image":"https://green-pocket.biz/wp-content/uploads/2021/09/torch2_1.jpg"},{"name":"Kozimi（コズミ）","cat":"プランター","price":"2,970円〜9,900円／月","size":"M・L／1〜3段","desc":"国産ヒノキ間伐材のボックスを積み重ね、高さを変えられるプランター。","url":"https://green-pocket.biz/catalog/915/","image":"https://green-pocket.biz/wp-content/uploads/2021/09/2cb83a3a62423e4a948c7d064baa5f54-1100x775.png"},{"name":"Kozimi（コズミ）・オプション","cat":"プランター","price":"7,370円〜15,400円／月","size":"M-W60・L-W80・LH-W80・SF-W80","desc":"コズミを横方向にも展開し、さまざまな大型レイアウトをつくれるシリーズ。","url":"https://green-pocket.biz/catalog/905/","image":"https://green-pocket.biz/wp-content/uploads/2021/09/001-1100x733.jpg"},{"name":"コズミ・ベンチ","cat":"間仕切り・家具","price":"15,400円〜36,300円／月","size":"シングル・ダブル・トリプル","desc":"国産ヒノキ間伐材とグリーンを組み合わせた、ベンチ一体型の商品。","url":"https://green-pocket.biz/catalog/890/","image":"https://green-pocket.biz/wp-content/uploads/2021/09/kozumi-Bench_4-1100x733.jpg"},{"name":"グリーバ・ミニ","cat":"卓上・小型","price":"2,200円〜7,480円／月","size":"SS・S・M・L","desc":"設置場所に合わせて形を変えられる、国産ヒノキ間伐材の小型グリーン。","url":"https://green-pocket.biz/catalog/968/","image":"https://green-pocket.biz/wp-content/uploads/2021/09/6-1100x1122.jpg"},{"name":"ウーボ","cat":"プランター","price":"3,300円〜6,050円／月","size":"S・M・L","desc":"国産ヒノキ材を使った、デザイン性の高い寄せ植えプランター。","url":"https://green-pocket.biz/catalog/1014/","image":"https://green-pocket.biz/wp-content/uploads/2021/09/001-3.jpg"},{"name":"マルコ","cat":"プランター","price":"770円／月","size":"φ125×H140mm","desc":"マンゴの木の自然な形を生かした丸太くり抜きプランター。","url":"https://green-pocket.biz/catalog/933/","image":"https://green-pocket.biz/wp-content/uploads/2021/09/marco_1-1100x733.jpg"},{"name":"エアーグリーンミドル","cat":"環境機能","price":"9,900円／月","size":"W216×D63×H145mm（機器部）","desc":"グリーンと低濃度オゾン発生機を組み合わせた環境整備型の商品。","url":"https://green-pocket.biz/catalog/1386/","image":"https://green-pocket.biz/wp-content/uploads/2022/02/20220201150644-0001.jpg"},{"name":"エアーグリーンmini","cat":"環境機能","price":"2,200円〜3,300円／月","size":"ミニ・ダブル","desc":"デスクに置ける小型グリーンと低濃度オゾン発生機を組み合わせた商品。","url":"https://green-pocket.biz/catalog/999/","image":"https://green-pocket.biz/wp-content/uploads/2021/09/alvin-engler-bIhpiQA009k-unsplash-1100x733.jpg"},{"name":"トラース","cat":"卓上・小型","price":"1,210円〜2,860円／月","size":"M・L・2段","desc":"国産杉材を使い、空中へ植物を飾れるハンギングプランター。","url":"https://green-pocket.biz/catalog/1333/","image":"https://green-pocket.biz/wp-content/uploads/2021/12/508b37f195b91f7d901273d4cd2d87f0-1100x941.jpg"}];
  const CATS = ["すべて","大型緑化","間仕切り・家具","壁面","卓上・小型","プランター","環境機能"];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  function card(p) {
    const note = p.note ? `<small class="hq-photo-card__note">${esc(p.note)}</small>` : "";
    return `<article class="hq-photo-card" data-hq-card data-cat="${esc(p.cat)}" data-search="${esc([p.name,p.cat,p.size,p.desc].join(" ").toLowerCase())}">
      <a class="hq-photo-card__image" href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="${esc(p.name)}を本部公式で詳しく見る">
        <img src="${esc(p.image)}" alt="${esc(p.name)}の本部公式商品写真" loading="lazy" referrerpolicy="no-referrer"
          onerror="this.closest('.hq-photo-card__image').classList.add('is-error');this.hidden=true">
        <span class="hq-photo-card__fallback">${esc(p.name)}</span>
      </a>
      <div class="hq-photo-card__body">
        <div class="hq-photo-card__labels"><span>${esc(p.cat)}</span><b>本部共通商品</b></div>
        <h3>${esc(p.name)}</h3>
        <div class="hq-photo-card__price"><small>レンタル月額</small><strong>${esc(p.price)}</strong><span>税込</span></div>
        <p>${esc(p.desc)}</p>
        <div class="hq-photo-card__size"><span>サイズ</span><strong>${esc(p.size)}</strong></div>
        ${note}
        <div class="hq-photo-card__actions">
          <a href="${esc(p.url)}" target="_blank" rel="noopener">本部公式で詳細</a>
          <a href="line.html">LINEで相談</a>
        </div>
      </div>
    </article>`;
  }

  function install() {
    const grid = document.querySelector(".original-catalog-grid");
    if (!grid) return;

    const heroNote = document.querySelector(".original-hero__note");
    if (heroNote) heroNote.textContent = "本部共通22商品を写真・月額料金・サイズから比較できます";

    const count = document.querySelector(".original-catalog-count strong");
    if (count) count.textContent = "22";
    const countLabel = document.querySelector(".original-catalog-count span");
    if (countLabel) countLabel.textContent = "HQ ORIGINAL PRODUCTS";
    const countText = document.querySelector(".original-catalog-count p");
    if (countText) countText.textContent = "本部共通22商品をすべて写真付きで掲載。月額料金を見ながら、気になる商品をそのまま相談できます。";

    const heading = document.querySelector(".original-heading h2");
    if (heading) heading.innerHTML = "<span>写真と料金で、</span><span>22商品から選べる。</span>";
    const headingText = document.querySelector(".original-heading > p");
    if (headingText) headingText.textContent = "グリーン・ポケット本部共通のオリジナル商品を、公式商品写真・月額料金・サイズから比較できます。";

    const oldAll = document.querySelector(".all-lineup");
    if (oldAll) oldAll.hidden = true;
    const oldMaster = document.getElementById("hq-original-master");
    if (oldMaster) oldMaster.remove();

    let tools = document.getElementById("hq-photo-tools");
    if (!tools) {
      tools = document.createElement("div");
      tools.id = "hq-photo-tools";
      tools.className = "hq-photo-tools";
      tools.innerHTML = `
        <div class="hq-photo-source"><strong>本部共通商品</strong><span>写真・商品情報・価格はグリーン・ポケット本部公式商品カタログを基準にしています。価格・仕様は変更される場合があるため、正式なお見積りは福岡粕屋店からご案内します。</span></div>
        <div class="hq-photo-tools__row">
          <label class="hq-photo-search"><span>商品を検索</span><input id="hq-photo-search" type="search" placeholder="例：コズミ、壁面、デスク、ヒノキ"></label>
          <div class="hq-photo-filters" role="group" aria-label="商品カテゴリ">${CATS.map((c,i)=>`<button type="button" data-hq-filter="${esc(c)}" class="${i===0?"is-active":""}">${esc(c)}</button>`).join("")}</div>
        </div>
        <div class="hq-photo-result"><strong id="hq-photo-result-count">22</strong><span>商品を表示</span></div>`;
      grid.insertAdjacentElement("beforebegin", tools);
    }

    grid.classList.add("original-catalog-grid--photo22");
    grid.innerHTML = PRODUCTS.map(card).join("");

    let category = "すべて";
    const input = document.getElementById("hq-photo-search");
    const buttons = Array.from(tools.querySelectorAll("[data-hq-filter]"));
    const cards = Array.from(grid.querySelectorAll("[data-hq-card]"));
    const resultCount = document.getElementById("hq-photo-result-count");

    const apply = () => {
      const q = String(input?.value || "").trim().toLowerCase();
      let n = 0;
      cards.forEach((el) => {
        const okCat = category === "すべて" || el.dataset.cat === category;
        const okQ = !q || String(el.dataset.search || "").includes(q);
        const show = okCat && okQ;
        el.hidden = !show;
        if (show) n++;
      });
      if (resultCount) resultCount.textContent = String(n);
    };

    input?.addEventListener("input", apply);
    buttons.forEach((btn) => btn.addEventListener("click", () => {
      category = btn.dataset.hqFilter || "すべて";
      buttons.forEach(x => x.classList.toggle("is-active", x === btn));
      apply();
    }));

    document.documentElement.dataset.greenOriginalMaster = VERSION;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, {once:true});
  else install();
})();
