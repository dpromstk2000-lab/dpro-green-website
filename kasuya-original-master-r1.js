/* DPRO GREEN KASUYA — HQ ORIGINAL MASTER R1.0 / 2026-10-05 */
(() => {
  "use strict";
  const VERSION = "GREEN-ORIGINAL-MASTER-R1.0-20261005";
  if (!/\/original\.html$/.test(location.pathname)) return;
  if (window.__DPRO_GREEN_ORIGINAL_MASTER_R1__) return;
  window.__DPRO_GREEN_ORIGINAL_MASTER_R1__ = VERSION;

  const PRODUCTS = [{"name":"グリーバ-DX","cat":"大型緑化","price":"14,300円〜64,350円／月","size":"S・M・L（W800〜3200mm）","desc":"設置スペースに合わせて構成できる大型の室内緑化システム。","url":"https://green-pocket.biz/catalog/greeva-dx"},{"name":"コズミ・オアシス","cat":"大型緑化","price":"20,900円〜38,500円／月","size":"90×90・180×60・180×90cm","desc":"国産間伐ヒノキ材の枠で、大型のグリーンコーディネートをつくれる商品。","url":"https://green-pocket.biz/catalog/1760/"},{"name":"フォリッジ","cat":"卓上・小型","price":"2,750円〜5,500円／月","size":"450・900サイズ","desc":"デスク中央などの細長いスペースを緑の場所へ変える横長プランター。","url":"https://green-pocket.biz/catalog/foridge"},{"name":"ストーネア","cat":"プランター","price":"2,860円〜4,840円／月","size":"M φ320×H320mm・L φ410×H400mm","desc":"シンプルモダンなファイバーセメント製プランター。","url":"https://green-pocket.biz/catalog/stonea"},{"name":"ハニカムウォール","cat":"壁面","price":"2,200円／月","size":"W350×D105×H305mm","desc":"六角形を組み合わせて壁面に緑を広げられる壁掛けプランター。","url":"https://green-pocket.biz/catalog/885/"},{"name":"フォレストフレーム","cat":"壁面","price":"1,760円〜6,380円／月","size":"S・M・L","desc":"絵を飾るように、床面を使わず壁へ緑を取り入れられる商品。","url":"https://green-pocket.biz/catalog/870"},{"name":"カーシスパーテーション","cat":"間仕切り・家具","price":"13,750円〜21,450円／月","size":"M・L／パーテーション・雑誌ラック・本棚","desc":"国産ヒノキ材を使い、空間を緑でやさしく仕切れる木製パーティション。","url":"https://green-pocket.biz/catalog/985/"},{"name":"白樺プランター","cat":"プランター","price":"4,950円／月","size":"H40×W43×D43cm","desc":"天然の白樺の表情を生かした、存在感のある鉢カバー。","url":"https://green-pocket.biz/catalog/1410/"},{"name":"白樺スタンド＆ハンギング","cat":"間仕切り・家具","price":"2,750円〜8,800円／月","size":"3本枝・5本枝セット／M・Lハンギング","desc":"天然白樺のスタンドとハンギングで、空中にも緑を配置できる商品。","url":"https://green-pocket.biz/catalog/1342/"},{"name":"クレスト","cat":"プランター","price":"770円〜2,750円／月 *","size":"SS・S・S-WIDE","desc":"国産ヒノキ間伐材の木目を生かしたボックス型プランター。","url":"https://green-pocket.biz/catalog/916","note":"* 本部公式商品ページでは価格非掲載。足立店が2026年7月時点の本部カタログ料金として掲載する価格を参照。"},{"name":"グリーンフープ","cat":"卓上・小型","price":"770円〜／月","size":"角・丸タイプ","desc":"パーティションへ取り付けて、デスク面を使わずグリーンを楽しめる商品。","url":"https://green-pocket.biz/catalog/941/"},{"name":"グリーントーチ","cat":"卓上・小型","price":"1,100円〜／月","size":"角350・角500・丸350・丸500","desc":"デスク上にグリーンを浮かせるように配置するスタンド。","url":"https://green-pocket.biz/catalog/960/"},{"name":"グリーントーチ2","cat":"卓上・小型","price":"1,100円〜2,200円／月","size":"1鉢・2鉢・3鉢仕様","desc":"1本の支柱に複数の鉢を自由な位置と角度で配置できる商品。","url":"https://green-pocket.biz/catalog/949/"},{"name":"Kozimi（コズミ）","cat":"プランター","price":"2,970円〜9,900円／月","size":"M・L／1〜3段","desc":"国産ヒノキ間伐材のボックスを積み重ね、高さを変えられるプランター。","url":"https://green-pocket.biz/catalog/915/"},{"name":"Kozimi（コズミ）・オプション","cat":"プランター","price":"7,370円〜15,400円／月","size":"M-W60・L-W80・LH-W80・SF-W80","desc":"コズミを横方向にも展開し、さまざまな大型レイアウトをつくれるシリーズ。","url":"https://green-pocket.biz/catalog/905/"},{"name":"コズミ・ベンチ","cat":"間仕切り・家具","price":"15,400円〜36,300円／月","size":"シングル・ダブル・トリプル","desc":"国産ヒノキ間伐材とグリーンを組み合わせた、ベンチ一体型の商品。","url":"https://green-pocket.biz/catalog/890/"},{"name":"グリーバ・ミニ","cat":"卓上・小型","price":"2,200円〜7,480円／月","size":"SS・S・M・L","desc":"設置場所に合わせて形を変えられる、国産ヒノキ間伐材の小型グリーン。","url":"https://green-pocket.biz/catalog/968/"},{"name":"ウーボ","cat":"プランター","price":"3,300円〜6,050円／月","size":"S・M・L","desc":"国産ヒノキ材を使った、デザイン性の高い寄せ植えプランター。","url":"https://green-pocket.biz/catalog/1014/"},{"name":"マルコ","cat":"プランター","price":"770円／月","size":"φ125×H140mm","desc":"マンゴの木の自然な形を生かした丸太くり抜きプランター。","url":"https://green-pocket.biz/catalog/933/"},{"name":"エアーグリーンミドル","cat":"環境機能","price":"9,900円／月","size":"W216×D63×H145mm（機器部）","desc":"グリーンと低濃度オゾン発生機を組み合わせた環境整備型の商品。","url":"https://green-pocket.biz/catalog/1386/"},{"name":"エアーグリーンmini","cat":"環境機能","price":"2,200円〜3,300円／月","size":"ミニ・ダブル","desc":"デスクに置ける小型グリーンと低濃度オゾン発生機を組み合わせた商品。","url":"https://green-pocket.biz/catalog/999/"},{"name":"トラース","cat":"卓上・小型","price":"1,210円〜2,860円／月","size":"M・L・2段","desc":"国産杉材を使い、空中へ植物を飾れるハンギングプランター。","url":"https://green-pocket.biz/catalog/1333/"}];
  const CATS = ["すべて","大型緑化","間仕切り・家具","壁面","卓上・小型","プランター","環境機能"];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  function card(p) {
    const note = p.note ? `<small class="hq-product-card__note">${esc(p.note)}</small>` : "";
    return `<article class="hq-product-card" data-hq-card data-cat="${esc(p.cat)}" data-search="${esc([p.name,p.cat,p.size,p.desc].join(' ').toLowerCase())}">
      <div class="hq-product-card__top"><span>${esc(p.cat)}</span><b>本部共通商品</b></div>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.desc)}</p>
      <dl><div><dt>月額</dt><dd>${esc(p.price)}<small>税込</small></dd></div><div><dt>サイズ</dt><dd>${esc(p.size)}</dd></div></dl>
      ${note}
      <div class="hq-product-card__actions"><a href="${esc(p.url)}" target="_blank" rel="noopener">本部公式で詳細を見る</a><a href="line.html">LINEで相談</a></div>
    </article>`;
  }

  function install() {
    const grid = document.querySelector('.original-catalog-grid');
    if (!grid || document.getElementById('hq-original-master')) return;

    const heroNote = document.querySelector('.original-hero__note');
    if (heroNote) heroNote.textContent = '本部共通22商品｜代表10商品は写真付き・全商品を価格とサイズで比較';
    const count = document.querySelector('.original-catalog-count strong');
    if (count) count.textContent = '22';
    const countLabel = document.querySelector('.original-catalog-count span');
    if (countLabel) countLabel.textContent = 'HQ ORIGINAL PRODUCTS';
    const countText = document.querySelector('.original-catalog-count p');
    if (countText) countText.textContent = 'グリーン・ポケット本部共通の22商品を、現行価格・サイズ・特徴から比較できます。';
    const headingText = document.querySelector('.original-heading > p');
    if (headingText) headingText.textContent = '上段では代表10商品を写真付きで紹介し、その下で本部共通22商品すべてを価格・サイズ・用途から比較できます。';

    const old = document.querySelector('.all-lineup');
    if (old) old.hidden = true;

    const section = document.createElement('section');
    section.id = 'hq-original-master';
    section.className = 'hq-original-master';
    section.innerHTML = `
      <div class="hq-original-master__head">
        <div><p class="eyebrow eyebrow--green">HEADQUARTERS ORIGINAL 22</p><h2>本部共通オリジナル商品、22種類。</h2><p>大型緑化、木製パーティション、壁面、デスク、寄せ植えまで。商品名・料金・サイズを見比べ、気になる商品は福岡粕屋店へそのまま相談できます。</p></div>
        <div class="hq-original-master__summary"><strong>22</strong><span>ORIGINAL PRODUCTS</span><small>2026年10月5日確認</small></div>
      </div>
      <div class="hq-original-master__source"><strong>価格について</strong><span>本部公式カタログの現行掲載価格を基準にしています。仕様・価格は改定される場合があるため、正式なお見積りは福岡粕屋店からご案内します。</span></div>
      <div class="hq-original-tools">
        <label class="hq-original-search"><span>商品を検索</span><input type="search" id="hq-original-search" placeholder="例：コズミ、壁面、デスク、ヒノキ"></label>
        <div class="hq-original-filters" role="group" aria-label="商品カテゴリ">${CATS.map((c,i)=>`<button type="button" data-hq-filter="${esc(c)}" class="${i===0?'is-active':''}">${esc(c)}</button>`).join('')}</div>
      </div>
      <div class="hq-original-result"><strong id="hq-original-result-count">22</strong><span>商品を表示</span></div>
      <div class="hq-original-grid" id="hq-original-grid">${PRODUCTS.map(card).join('')}</div>
      <div class="hq-original-footnote">* クレストのみ、本部公式商品ページに価格記載がないため、足立店が「2026年7月時点の本部カタログ料金」として掲載する価格を参照しています。</div>
      <div class="hq-original-cta"><div><span>FUKUOKA KASUYA</span><strong>商品名が分かれば、写真がなくても相談できます。</strong><p>設置場所・ご予算・気になる商品名をお知らせください。空間に合う組み合わせをご提案します。</p></div><div><a class="btn btn--lime" href="line.html">LINEで商品相談</a><a class="btn btn--outline-light" href="contact.html">WEBで相談する</a></div></div>`;
    grid.insertAdjacentElement('afterend', section);

    let category = 'すべて';
    const input = document.getElementById('hq-original-search');
    const buttons = Array.from(section.querySelectorAll('[data-hq-filter]'));
    const cards = Array.from(section.querySelectorAll('[data-hq-card]'));
    const resultCount = document.getElementById('hq-original-result-count');
    const apply = () => {
      const q = String(input?.value || '').trim().toLowerCase();
      let n=0;
      cards.forEach(el => {
        const okCat = category === 'すべて' || el.dataset.cat === category;
        const okQ = !q || String(el.dataset.search||'').includes(q);
        const show = okCat && okQ;
        el.hidden = !show;
        if (show) n++;
      });
      if (resultCount) resultCount.textContent = String(n);
    };
    input?.addEventListener('input', apply);
    buttons.forEach(btn => btn.addEventListener('click', () => {
      category = btn.dataset.hqFilter || 'すべて';
      buttons.forEach(x => x.classList.toggle('is-active', x===btn));
      apply();
    }));

    document.documentElement.dataset.greenOriginalMaster = VERSION;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true}); else install();
})();
