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
