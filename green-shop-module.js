(() => {
  "use strict";
  const VERSION="GREEN-SHOP-PUBLIC-R1-20260831";
  const SETTINGS_KEY="dpro_green_shop_settings_v1";
  const PRODUCTS_KEY="dpro_green_shop_products_v1";
  const SHOP_PATH="shop.html";
  const defaults={enabled:true,onlineShop:true,delivery:true,pickup:true,gift:true,square:true};
  const defaultProducts=[
    {id:"desk-green",name:"デスクグリーン S",category:"観葉植物",price:3300,stock:8,image:"owner-office.webp",description:"受付・デスク周りに置きやすいコンパクトなグリーン。",lead:"発送目安 3〜5営業日",published:true},
    {id:"pot-set",name:"グリーン＆鉢カバーセット",category:"セット",price:4950,stock:6,image:"owner-store.webp",description:"小型グリーンとインテリアになじむ鉢カバーのセット。",lead:"発送目安 3〜5営業日",published:true},
    {id:"gift-medium",name:"グリーンギフト M",category:"ギフト",price:6600,stock:5,image:"owner-clinic-green.webp",description:"開店・移転・お祝いを想定したグリーンギフト。",lead:"発送目安 5〜7営業日",published:true},
    {id:"cover",name:"インテリア鉢カバー",category:"鉢・カバー",price:3850,stock:12,image:"owner-hero.webp",description:"オフィスや店舗空間に合わせやすい鉢カバー。",lead:"発送目安 3〜5営業日",published:true},
    {id:"care",name:"植物ケア スターターセット",category:"ケア用品",price:2200,stock:15,image:"owner-maintenance.webp",description:"ご自宅・オフィスでの簡単なお手入れを始める方向け。",lead:"発送目安 2〜4営業日",published:true},
    {id:"season",name:"季節のグリーンギフト",category:"ギフト",price:5500,stock:4,image:"owner-welfare-green.webp",description:"季節に合わせてセレクトする提案用ギフト商品。",lead:"発送目安 5〜7営業日",published:true}
  ];
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||"null")??fallback}catch{return fallback}}
  function settings(){const configDefault=window.GREEN_WEB_CONFIG?.featureFlags?.show_online_shop;return {...defaults,enabled:configDefault===false?false:true,...read(SETTINGS_KEY,{})};}
  function products(){const saved=read(PRODUCTS_KEY,null);if(Array.isArray(saved))return saved;localStorage.setItem(PRODUCTS_KEY,JSON.stringify(defaultProducts));return [...defaultProducts];}
  function css(){if($('link[data-green-shop-public]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href=`green-shop-module.css?v=${encodeURIComponent(VERSION)}`;l.dataset.greenShopPublic=VERSION;document.head.append(l);}
  function addLink(nav,label="ONLINE SHOP"){if(!nav||nav.querySelector('[data-green-shop-link]'))return;const a=document.createElement('a');a.href=SHOP_PATH;a.textContent=label;a.dataset.greenShopLink="1";nav.append(a);}
  function clear(){ $$('[data-green-shop-link]').forEach(x=>x.remove()); $$('[data-green-shop-entry]').forEach(x=>x.remove()); }
  function promo(){if(!document.body.matches('[data-page="home"]')&&!/\/index\.html$/.test(location.pathname)&&!location.pathname.endsWith('/dpro-green-website/'))return;if($('[data-green-shop-entry]'))return;const anchor=$('#services')||$('.present-services');if(!anchor)return;const sec=document.createElement('section');sec.className='green-shop-entry';sec.dataset.greenShopEntry='promo';sec.innerHTML=`<div class="container green-shop-entry__grid"><div><p class="green-shop-entry__eyebrow">RENTAL + ONLINE SHOP</p><h2>レンタルも、購入も。<br>植物のことをひとつの窓口で。</h2><p>観葉植物レンタルに加えて、植物・鉢・ギフトなどの販売にも対応できます。「レンタルしたい」は設置相談へ、「購入したい」はオンラインSHOPへ、迷ったときはLINEへ。店舗の事業に合わせて販売機能をON / OFFできます。</p><div class="green-shop-entry__actions"><a class="green-shop-entry__primary" href="shop.html">植物・商品を購入する →</a><a class="green-shop-entry__secondary" href="line.html">LINEで相談する</a></div><p class="green-shop-entry__note">BUSINESS DEMO：掲載商品・価格・決済は提案用表示です。本番では店舗の商品と店舗名義のSquare決済へ接続します。</p></div><div class="green-shop-entry__cards"><article><span>RENTAL</span><strong>レンタルで導入</strong><small>設置提案・定期メンテナンスへ</small></article><article><span>BUY</span><strong>商品を購入</strong><small>植物・鉢・ギフトをオンラインで</small></article><article><span>LINE</span><strong>迷ったら相談</strong><small>置き場所の写真から相談できます</small></article><article><span>DPRO</span><strong>管理はひとつ</strong><small>商品・注文・顧客・レンタルを連携</small></article></div></div>`;anchor.insertAdjacentElement('afterend',sec);const tri=document.createElement('section');tri.className='green-shop-rental-buy';tri.dataset.greenShopEntry='tri';tri.innerHTML=`<div class="container green-shop-rental-buy__inner"><article><small>01 / RENTAL</small><strong>植物をレンタルしたい</strong><p>空間に合わせた提案と、導入後の定期管理まで。</p></article><article><small>02 / ONLINE SHOP</small><strong>植物・鉢を購入したい</strong><p>商品を選び、カートからオンライン注文へ。</p></article><article><small>03 / OFFICIAL LINE</small><strong>どちらが合うか相談したい</strong><p>写真や用途を送って、購入前に相談できます。</p></article></div>`;sec.insertAdjacentElement('afterend',tri);}
  function apply(){css();clear();const s=settings();if(!s.enabled||!s.onlineShop)return;addLink($('.desktop-nav'),'SHOP');addLink($('.mobile-menu__nav'),'ONLINE SHOP');addLink($('.footer-nav'),'ONLINE SHOP');promo();}
  window.DPROGreenShop={version:VERSION,settings,products,apply,keys:{SETTINGS_KEY,PRODUCTS_KEY}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  window.addEventListener('storage',e=>{if([SETTINGS_KEY,PRODUCTS_KEY].includes(e.key))apply();});
})();
