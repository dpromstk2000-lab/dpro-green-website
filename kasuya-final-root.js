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

/* DPRO JP LINE FIT R2 / 2026-09-10
   Existing <span> blocks are editorial line breaks. Keep each phrase on one line,
   and only reduce that heading enough to fit the available column width. */
(()=>{
  'use strict';
  if(window.__DPRO_JP_LINE_FIT_R2)return;
  window.__DPRO_JP_LINE_FIT_R2=true;

  let raf=0;
  const directLines=heading=>[...heading.children].filter(el=>el.tagName==='SPAN');

  function resetHeading(heading){
    heading.style.removeProperty('font-size');
    heading.style.removeProperty('word-break');
    heading.style.removeProperty('overflow-wrap');
    heading.style.removeProperty('text-wrap');
  }

  function fitHeading(heading){
    const lines=directLines(heading);
    resetHeading(heading);

    if(lines.length<2){
      heading.style.setProperty('word-break','auto-phrase');
      heading.style.setProperty('overflow-wrap','normal');
      heading.style.setProperty('text-wrap','balance');
      return;
    }

    lines.forEach(line=>{
      line.style.setProperty('display','block');
      line.style.setProperty('width','max-content');
      line.style.setProperty('max-width','none');
      line.style.setProperty('white-space','nowrap');
      line.style.setProperty('word-break','keep-all');
      line.style.setProperty('overflow-wrap','normal');
      line.style.setProperty('line-break','strict');
    });

    const base=parseFloat(getComputedStyle(heading).fontSize)||32;
    const available=Math.floor(heading.getBoundingClientRect().width);
    if(!available)return;
    const widest=Math.max(...lines.map(line=>line.scrollWidth),0);
    if(widest<=available)return;

    const fitted=Math.max(20,Math.floor(base*(available/widest)*0.975*10)/10);
    heading.style.setProperty('font-size',`${fitted}px`);
  }

  function run(){
    raf=0;
    document.querySelectorAll('h1,h2').forEach(fitHeading);
  }
  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(()=>requestAnimationFrame(run));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('orientationchange',schedule,{passive:true});
  document.fonts?.ready?.then(schedule).catch(()=>{});

  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>[...m.addedNodes].some(node=>node.nodeType===1&&(node.matches?.('h1,h2')||node.querySelector?.('h1,h2')))))schedule();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();
