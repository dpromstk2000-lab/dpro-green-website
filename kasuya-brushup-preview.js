(()=>{
  'use strict';
  const cfg=window.GREEN_WEB_CONFIG||{};
  const shopEnabled=cfg?.featureFlags?.show_online_shop!==false;
  document.body.dataset.shopEnabled=String(shopEnabled);
  document.querySelectorAll('[data-stage6-shop]').forEach(el=>{if(!shopEnabled)el.hidden=true;});

  const header=document.querySelector('[data-header]');
  const onScroll=()=>header?.classList.toggle('is-scrolled',window.scrollY>12);
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  const btn=document.querySelector('[data-menu-button]');
  const panel=document.querySelector('[data-menu-panel]');
  const closeMenu=()=>{panel?.classList.remove('is-open');panel?.setAttribute('aria-hidden','true');btn?.setAttribute('aria-expanded','false');};
  btn?.addEventListener('click',()=>{const open=!panel.classList.contains('is-open');panel.classList.toggle('is-open',open);panel.setAttribute('aria-hidden',String(!open));btn.setAttribute('aria-expanded',String(open));});
  panel?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('click',e=>{if(panel?.classList.contains('is-open')&&!panel.contains(e.target)&&!btn?.contains(e.target))closeMenu();});

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frames=[...document.querySelectorAll('.hero__frame')];
  const progress=document.querySelector('[data-hero-progress]');
  let idx=0,timer=null;
  const restartProgress=()=>{if(!progress||reduced)return;progress.classList.remove('is-running');void progress.offsetWidth;progress.classList.add('is-running');};
  const next=()=>{if(frames.length<2)return;frames[idx].classList.remove('is-active');idx=(idx+1)%frames.length;frames[idx].classList.add('is-active');restartProgress();};
  if(frames.length>1&&!reduced){restartProgress();timer=setInterval(next,6000);document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInterval(timer);timer=null;}else if(!timer){timer=setInterval(next,6000);restartProgress();}});}

  const reveal=[...document.querySelectorAll('[data-reveal]')];
  if(reduced||!('IntersectionObserver'in window)){reveal.forEach(el=>el.classList.add('is-revealed'));}
  else{const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');io.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -30px'});reveal.forEach(el=>io.observe(el));}

  const dpro=[...document.querySelectorAll('[data-dpro-flow] article')];
  if(dpro.length&&!reduced){let d=0;setInterval(()=>{dpro.forEach(x=>x.classList.remove('is-hot'));dpro[d].classList.add('is-hot');d=(d+1)%dpro.length;},1800);}
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
