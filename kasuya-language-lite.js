/* DPRO GREEN KASUYA — FINAL LOCK ADDON / LANGUAGE LITE V1.0 / 2026-09-10
   User-side simple website translation only.
   No legacy Google Website Translator Widget, no SEO language pages, no hreflang changes. */
(()=>{
  'use strict';
  if(window.__DPRO_KASUYA_LANGUAGE_LITE)return;
  window.__DPRO_KASUYA_LANGUAGE_LITE=true;

  const VERSION='LANG-LITE-V1.0-20260910';
  const LANGS=[
    {code:'ja',label:'日本語',html:'ja'},
    {code:'en',label:'English',html:'en'},
    {code:'zh-CN',label:'中文',html:'zh-Hans'},
    {code:'ko',label:'한국어',html:'ko'}
  ];

  function addStyles(){
    if(document.querySelector('link[data-dpro-language-lite]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='kasuya-language-lite.css?v=LANG-LITE-V1.0-20260910';
    link.dataset.dproLanguageLite=VERSION;
    document.head.append(link);
  }

  function getCurrentLang(){
    const p=new URLSearchParams(location.search);
    const raw=p.get('_x_tr_tl')||p.get('tl')||'ja';
    if(/^zh/i.test(raw))return 'zh-CN';
    if(/^ko/i.test(raw))return 'ko';
    if(/^en/i.test(raw))return 'en';
    return 'ja';
  }

  function sourceUrl(){
    const canonical=document.querySelector('link[rel="canonical"]')?.href;
    if(canonical&&/^https?:/i.test(canonical)){const url=new URL(canonical);if(location.hash)url.hash=location.hash;return url.href;}
    const url=new URL(location.href);
    ['_x_tr_sl','_x_tr_tl','_x_tr_hl','_x_tr_pto'].forEach(k=>url.searchParams.delete(k));
    return url.href;
  }

  function go(code){
    const original=sourceUrl();
    if(code==='ja'){
      location.assign(original);
      return;
    }
    const target=`https://translate.google.com/translate?sl=ja&tl=${encodeURIComponent(code)}&u=${encodeURIComponent(original)}`;
    location.assign(target);
  }

  function optionButtons(className='dpro-lang__option'){
    const current=getCurrentLang();
    return LANGS.map(lang=>{
      const b=document.createElement('button');
      b.type='button';
      b.className=className;
      b.dataset.dproLang=lang.code;
      b.lang=lang.html;
      b.textContent=lang.label;
      b.setAttribute('aria-current',String(current===lang.code));
      b.addEventListener('click',()=>go(lang.code));
      return b;
    });
  }

  function makePopover(extraClass=''){
    const root=document.createElement('div');
    root.className=`dpro-lang ${extraClass}`.trim();
    root.dataset.dproLanguageSwitcher=VERSION;
    const button=document.createElement('button');
    button.type='button';
    button.className='dpro-lang__button';
    button.setAttribute('aria-haspopup','menu');
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-label','言語を選択 / Select language');
    button.innerHTML='<span class="dpro-lang__button-icon" aria-hidden="true">🌐</span><span>Language</span><span class="dpro-lang__chev" aria-hidden="true">▼</span>';
    const menu=document.createElement('div');
    menu.className='dpro-lang__menu';
    menu.hidden=true;
    menu.setAttribute('role','menu');
    optionButtons().forEach(b=>{b.setAttribute('role','menuitem');menu.append(b)});
    const close=()=>{root.classList.remove('is-open');menu.hidden=true;button.setAttribute('aria-expanded','false')};
    const open=()=>{document.querySelectorAll('.dpro-lang.is-open').forEach(el=>{if(el!==root)el.querySelector('.dpro-lang__button')?.click()});root.classList.add('is-open');menu.hidden=false;button.setAttribute('aria-expanded','true');menu.querySelector('button')?.focus()};
    button.addEventListener('click',e=>{e.stopPropagation();root.classList.contains('is-open')?close():open()});
    root.addEventListener('keydown',e=>{if(e.key==='Escape'){close();button.focus()}});
    document.addEventListener('click',e=>{if(!root.contains(e.target))close()},{passive:true});
    root.append(button,menu);
    return root;
  }

  function addDesktop(){
    if(document.querySelector('.dpro-lang--desktop'))return;
    const standard=document.querySelector('.head-actions');
    if(standard){
      standard.insertBefore(makePopover('dpro-lang--desktop'),standard.firstChild);
      return;
    }
    const shopNav=document.querySelector('.head .nav');
    if(shopNav){
      shopNav.insertBefore(makePopover('dpro-lang--desktop'),shopNav.querySelector('.cart-btn')||null);
    }
  }

  function addMobilePanel(){
    const panel=document.querySelector('[data-menu-panel]');
    if(!panel||panel.querySelector('.dpro-lang-mobile--panel'))return false;
    const block=document.createElement('section');
    block.className='dpro-lang-mobile dpro-lang-mobile--panel';
    block.setAttribute('aria-label','Language / 言語');
    const title=document.createElement('span');
    title.className='dpro-lang-mobile__title';
    title.textContent='Language / 言語';
    const options=document.createElement('div');
    options.className='dpro-lang-mobile__options';
    optionButtons('').forEach(b=>options.append(b));
    block.append(title,options);
    const actions=panel.querySelector('.menu-panel__actions');
    actions?panel.insertBefore(block,actions):panel.append(block);
    return true;
  }

  function addMobileFallback(hasPanel){
    if(hasPanel||document.querySelector('.dpro-lang--fallback-mobile'))return;
    const standard=document.querySelector('.head-actions');
    if(standard){standard.insertBefore(makePopover('dpro-lang--fallback-mobile'),standard.firstChild);return;}
    const shopNav=document.querySelector('.head .nav');
    if(shopNav){shopNav.insertBefore(makePopover('dpro-lang--fallback-mobile'),shopNav.querySelector('.cart-btn')||null);}
  }

  function init(){
    addStyles();
    addDesktop();
    const hasPanel=addMobilePanel();
    addMobileFallback(hasPanel);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
