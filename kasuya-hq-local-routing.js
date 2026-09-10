/* DPRO GREEN KASUYA — HQ LOCAL ROUTING V1.0 / 2026-09-10
   Keeps public visitors inside the Kasuya website instead of sending product/brand clicks to HQ pages.
   Does not alter SEO metadata, LINE, SHOP, DPRO, inquiry API or source catalog data. */
(()=>{
  'use strict';
  if(window.__DPRO_KASUYA_HQ_LOCAL_ROUTING)return;
  window.__DPRO_KASUYA_HQ_LOCAL_ROUTING=true;
  const VERSION='HQ-LOCAL-ROUTING-V1.0-20260910';

  const isHQ=(url)=>{
    try{
      const u=new URL(url,location.href);
      return u.hostname==='green-pocket.biz'||u.hostname.endsWith('.green-pocket.biz');
    }catch{return false;}
  };

  const homeLike=()=>/\/(?:index\.html)?$/.test(location.pathname)||location.pathname.endsWith('/dpro-green-website/');
  const serviceLike=()=>/\/service\.html$/.test(location.pathname);

  function targetFor(anchor){
    let u;
    try{u=new URL(anchor.getAttribute('href')||'',location.href);}catch{return null;}
    if(!isHQ(u.href))return null;
    const p=u.pathname.replace(/\/+$/,'/');
    const ownText=(anchor.textContent||'').replace(/\s+/g,' ').trim();
    const contextText=(anchor.closest('article')?.textContent||ownText).replace(/\s+/g,' ').trim();
    const text=`${ownText} ${contextText}`.trim();

    if(/\/(?:shop_)?contact(?:\.html)?\/?/i.test(p))return {href:'contact.html',label:null};
    if(/\/shop_list\/fukuoka-kasuya\/?/i.test(p))return {href:'about.html',label:null};

    if(/\/catalog\/area\/l\/?/i.test(p)){
      return homeLike()?{href:'service.html#size-l',label:null}:{href:'contact.html',label:'Lサイズを相談する →'};
    }
    if(/\/catalog\/area\/m\/?/i.test(p)){
      return homeLike()?{href:'service.html#size-m',label:null}:{href:'contact.html',label:'Mサイズを相談する →'};
    }
    if(/\/catalog\/area\/s\/?/i.test(p)){
      return homeLike()?{href:'service.html#size-s',label:null}:{href:'contact.html',label:'Sサイズを相談する →'};
    }
    if(/\/catalog\/915\/?/i.test(p))return {href:'original-kozimi.html',label:null};
    if(/\/catalog\/greeva-dx\/?/i.test(p))return {href:'original-greeba-dx.html',label:null};
    if(/\/catalog\/1760\/?/i.test(p))return {href:'original-kozimi-oasis.html',label:null};
    if(/\/catalog\/foridge\/?/i.test(p))return {href:'original-foliage.html',label:null};
    if(/\/catalog\/885\/?/i.test(p))return {href:'original-honeycomb-wall.html',label:null};
    if(/\/catalog\/870\/?/i.test(p))return {href:'original-forest-frame.html',label:null};
    if(/\/catalog\/985\/?/i.test(p))return {href:'original-carsys.html',label:null};
    if(/\/catalog\/1014\/?/i.test(p))return {href:'original-woobo.html',label:null};
    if(/\/catalog\/941\/?/i.test(p))return {href:'original-green-hoop.html',label:null};
    if(/\/catalog\/1410\/?/i.test(p))return {href:'original-shirakaba.html',label:null};
    if(/\/catalog\/area\/original\/?/i.test(p)){
      if(/グリーバ|greeba/i.test(text))return {href:'original-greeba-dx.html',label:null};
      return {href:'original.html#original-products',label:null};
    }
    if(/\/catalog\/area\/items\/?/i.test(p)){
      if(/白樺/.test(text))return {href:'original-shirakaba.html',label:null};
      if(/クレスト|crest/i.test(text))return {href:'original.html#all-lineup',label:null};
      if(/鉢|カバー|POT/i.test(text))return serviceLike()?{href:'contact.html',label:'鉢・カバーを相談する →'}:{href:'original.html#original-products',label:null};
      return {href:'original.html#original-products',label:null};
    }
    if(/\/about_guide\.html\/?/i.test(p)){
      if(/GREEN MASTER|グリーンマスター|認定/i.test(text))return {href:'original.html#green-master',label:null};
      return {href:'original.html#network',label:null};
    }
    if(/\/topics\/1895\/?/i.test(p))return {href:'original.html#research',label:null};
    if(/\/about_csr\.html\/?/i.test(p))return {href:'original.html#csr',label:null};
    if(/\/catalog\//i.test(p))return {href:'original.html#original-products',label:null};
    return {href:'original.html#brand-info',label:null};
  }

  function addServiceAnchors(){
    if(!serviceLike())return;
    const cards=[...document.querySelectorAll('.price-reference .price-card')];
    const ids=['size-l','size-m','size-s'];
    cards.forEach((card,i)=>{if(ids[i]&&!card.id)card.id=ids[i];});
    const ref=document.querySelector('.price-reference');
    if(ref&&!ref.closest('section')?.id)ref.closest('section').id='price-guide';
  }

  function rewrite(anchor){
    if(!(anchor instanceof HTMLAnchorElement))return;
    const mapped=targetFor(anchor);
    if(!mapped)return;
    anchor.href=mapped.href;
    anchor.removeAttribute('target');
    anchor.removeAttribute('rel');
    anchor.dataset.dproHqLocalized=VERSION;
    if(mapped.label&&/本部|カタログ/.test(anchor.textContent||''))anchor.textContent=mapped.label;
    if(!anchor.getAttribute('aria-label')&&mapped.href.startsWith('original.html')){
      anchor.setAttribute('aria-label',`${(anchor.textContent||'商品情報').trim()}を粕屋店サイト内で見る`);
    }
  }

  function scan(root=document){
    if(root instanceof HTMLAnchorElement)rewrite(root);
    root.querySelectorAll?.('a[href]').forEach(rewrite);
  }

  function restoreHash(){
    if(!location.hash)return;
    requestAnimationFrame(()=>{
      const el=document.getElementById(location.hash.slice(1));
      if(el)el.scrollIntoView({block:'start'});
    });
  }

  function init(){
    addServiceAnchors();
    scan(document);
    restoreHash();
    const mo=new MutationObserver(ms=>ms.forEach(m=>{
      if(m.type==='attributes')rewrite(m.target);
      m.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n);});
    }));
    mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['href']});
    document.addEventListener('click',e=>{
      const a=e.target.closest?.('a[href]');
      if(!a||!isHQ(a.getAttribute('href')||''))return;
      const mapped=targetFor(a);
      if(!mapped)return;
      e.preventDefault();
      location.assign(mapped.href);
    },true);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
