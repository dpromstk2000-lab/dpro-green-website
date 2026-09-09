(()=>{
  'use strict';
  const cfg=window.GREEN_WEB_CONFIG||{};
  const shopEnabled=cfg?.featureFlags?.show_online_shop!==false;
  document.body.dataset.shopEnabled=String(shopEnabled);
  document.querySelectorAll('[data-stage6-shop]').forEach(el=>{el.hidden=!shopEnabled;});

  const header=document.querySelector('[data-header]');
  const onScroll=()=>header?.classList.toggle('is-scrolled',window.scrollY>12);
  onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});

  const nodes=[...document.querySelectorAll('[data-final-reveal]')];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!nodes.length)return;
  if(reduced||!('IntersectionObserver' in window)){
    nodes.forEach(el=>el.classList.add('is-revealed'));
    return;
  }
  document.documentElement.dataset.finalMotion='ready';
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-revealed');
      io.unobserve(entry.target);
    });
  },{threshold:.10,rootMargin:'0px 0px -24px'});
  nodes.forEach(el=>io.observe(el));
})();
