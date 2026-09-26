(() => {
  "use strict";
  const VERSION="GREEN-SHOP-PUBLIC-PROD-R2.2-20260927";
  const API="https://dpro-cl-000001-green-shop.dpromstk2000.workers.dev";
  const CART_KEY="dpro_green_shop_cart_v2";
  let liveSettings={enabled:false,onlineShop:false,delivery:false,pickup:false,gift:false,orderingEnabled:false,squareEnabled:false};
  let liveProducts=[];
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

  // Keep existing lightweight language / HQ routing add-ons.
  if(!document.querySelector('script[data-kasuya-language-lite]')){const x=document.createElement('script');x.src='kasuya-language-lite.js?v=LANG-LITE-V1.1-20260910';x.defer=true;x.dataset.kasuyaLanguageLite='1';document.head.append(x);}
  if(!document.querySelector('script[data-kasuya-hq-local-routing]')){const x=document.createElement('script');x.src='kasuya-hq-local-routing.js?v=HQ-LOCAL-ROUTING-V1.0-20260910';x.defer=true;x.dataset.kasuyaHqLocalRouting='1';document.head.append(x);}

  function settings(){
    return {
      enabled:liveSettings.enabled,
      onlineShop:liveSettings.onlineShop,
      delivery:liveSettings.delivery,
      pickup:liveSettings.pickup,
      gift:liveSettings.gift,
      orderingEnabled:liveSettings.orderingEnabled,
      // Existing shop.html opens checkout when "square" is true.
      // Until Square is connected, this means "order reception enabled".
      square:liveSettings.orderingEnabled,
      squareReady:liveSettings.squareEnabled,
    };
  }
  function products(){return liveProducts.slice();}
  async function get(path){
    const res=await fetch(API+path,{cache:"no-store"});
    const data=await res.json().catch(()=>({}));
    if(!res.ok||data.ok===false)throw new Error(data.message||"SHOP情報を読み込めません。");
    return data.data;
  }
  async function post(path,json){
    const res=await fetch(API+path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(json)});
    const data=await res.json().catch(()=>({}));
    if(!res.ok||data.ok===false)throw new Error(data.message||"注文を受け付けできませんでした。");
    return data.data;
  }
  function addLink(nav,label){if(!nav||nav.querySelector('[data-green-shop-link]'))return;const a=document.createElement("a");a.href="shop.html";a.textContent=label;a.dataset.greenShopLink="1";nav.append(a);}
  function applyNav(){
    $$('[data-green-shop-link]').forEach(x=>x.remove());
    const s=settings();if(!s.enabled||!s.onlineShop)return;
    addLink($('.desktop-nav'),"SHOP");addLink($('.mobile-menu__nav'),"ONLINE SHOP");addLink($('.footer-nav'),"ONLINE SHOP");
  }
  function polish(){
    if(!document.querySelector('meta[name="dpro-green-shop-standalone"]'))return;
    const bar=$('.demo-bar');if(bar)bar.textContent='ONLINE SHOP｜商品・在庫は本番データと同期しています。現在は注文受付後に決済方法をご案内します。';
    const box=$('.square-box strong');if(box)box.textContent='注文受付（決済前）';
    const note=$('.square-box small');if(note)note.textContent='Square実決済は準備中です。送信後は注文受付として登録し、決済方法は店舗からご案内します。';
    const submit=$('#checkout-form button[type="submit"][data-shop-feature="square"]');if(submit)submit.textContent='この内容で注文を受け付ける';
    $$('[data-shop-feature="square"]').forEach(el=>{if(el.matches('.trust div')){const b=$('b',el),sp=$('span',el);if(b)b.textContent='注文受付';if(sp)sp.textContent='決済方法は後ほどご案内';}});
    const connected=$('.connected [data-shop-feature="square"]');if(connected){const h=$('h3',connected),p=$('p',connected);if(h)h.textContent='受付・決済案内';if(p)p.textContent='注文受付後、店舗から決済方法をご案内します。';}
  }
  function syntheticRefresh(){
    try{window.dispatchEvent(new StorageEvent("storage",{key:"dpro_green_shop_products_v1"}));}catch{}
    window.dispatchEvent(new Event("pageshow"));
  }
  async function load(){
    try{
      const [s,p]=await Promise.all([get("/api/public/settings"),get("/api/public/products")]);
      liveSettings=s||liveSettings;liveProducts=Array.isArray(p)?p:[];
    }catch(e){
      console.error(VERSION,e);liveSettings={...liveSettings,enabled:false,onlineShop:false};
    }
    applyNav();polish();syntheticRefresh();
  }
  function installCheckoutOverride(){
    setTimeout(()=>{
      const form=$("#checkout-form");if(!form)return;
      form.onsubmit=async e=>{
        e.preventDefault();
        try{
          const freshSettings=await get("/api/public/settings");
          liveSettings=freshSettings||liveSettings;
        }catch(err){
          alert("SHOP設定を確認できませんでした。時間をおいて再度お試しください。");
          return;
        }
        const s=settings();
        if(!s.orderingEnabled){alert("現在オンライン注文を受け付けていません。LINEからご相談ください。");return;}
        let cart=[];try{cart=JSON.parse(localStorage.getItem(CART_KEY)||"[]")}catch{}
        const items=cart.map(x=>({id:String(x.id||""),qty:Math.max(1,Number(x.qty)||1)})).filter(x=>x.id);
        if(!items.length){alert("カートが空です。");return;}
        const fd=new FormData(form);
        const button=form.querySelector('button[type="submit"]');if(button){button.disabled=true;button.textContent="送信中…";}
        try{
          const r=await post("/api/public/orders",{
            deliveryMethod:String(fd.get("deliveryMethod")||"配送"),
            customer:{name:String(fd.get("name")||""),phone:String(fd.get("phone")||""),email:String(fd.get("email")||""),address:String(fd.get("address")||""),contactMethod:String(fd.get("contactMethod")||"LINE")},
            note:String(fd.get("note")||""),
            items,
          });
          localStorage.setItem(CART_KEY,"[]");
          const card=$("#checkout-card");
          if(card)card.innerHTML=`<div class="complete"><div class="complete-icon">✓</div><div class="eyebrow">ORDER RECEIVED</div><h2>注文を受け付けました</h2><p>注文番号 <strong>${String(r.orderNumber||"")}</strong></p><p>現在は決済前です。店舗から決済方法・在庫確定についてご案内します。</p><div class="hero-actions" style="justify-content:center"><a class="btn primary" href="index.html">公式HPへ戻る</a><a class="btn line" href="line.html">LINEで相談</a></div></div>`;
          syntheticRefresh();
        }catch(err){alert(err.message||"注文を受け付けできませんでした。");if(button){button.disabled=false;button.textContent="この内容で注文を受け付ける";}}
      };
    },0);
  }
  window.DPROGreenShop={version:VERSION,settings,products,apply:()=>{applyNav();polish();},reload:load};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{load();installCheckoutOverride();},{once:true});else{load();installCheckoutOverride();}
})();
