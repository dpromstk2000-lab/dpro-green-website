(() => {
  "use strict";
  const VERSION="GREEN-BLOG-PUBLIC-R1.1-FINAL-20261006";
  if(window.__GREEN_BLOG_PUBLIC_R1__===VERSION)return;window.__GREEN_BLOG_PUBLIC_R1__=VERSION;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const cfg=()=>window.GREEN_WEB_CONFIG||{};
  const apiBase=()=>String(cfg().api?.baseUrl||'https://dpro-cl-000001-green-core.dpromstk2000.workers.dev').replace(/\/$/,'');
  async function api(path){const r=await fetch(apiBase()+path,{cache:'no-store'});const j=await r.json().catch(()=>({}));if(!r.ok||j.ok===false)throw new Error(j.message||'記事を読み込めませんでした。');return j;}
  const fmt=v=>{if(!v)return'';try{return new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'long',day:'numeric'}).format(new Date(v));}catch{return v;}};
  const resolveImage=u=>{if(!u)return'';try{return new URL(u,location.href).href;}catch{return u;}};
  function card(item,level=''){const href=`${level}blog-post.html?slug=${encodeURIComponent(item.slug)}`;const img=item.featuredImageUrl?`<a class="gb-card-media" href="${href}"><img src="${esc(resolveImage(item.featuredImageUrl))}" alt="${esc(item.featuredImageAlt||item.title)}" loading="lazy"></a>`:`<a class="gb-card-media" href="${href}" aria-label="${esc(item.title)}"></a>`;return `<article class="gb-card">${img}<div class="gb-card-body"><span class="gb-badge">${esc(item.category)}</span><h2><a class="gb-card-link" href="${href}">${esc(item.title)}</a></h2><p>${esc(item.excerpt||'')}</p><div class="gb-date">${esc(fmt(item.publishedAt))}</div></div></article>`;}
  function setRobots(){const allow=cfg().release?.allowIndexing===true;let m=$('meta[name="robots"]');if(!m){m=document.createElement('meta');m.name='robots';document.head.append(m);}m.content=allow?'index,follow,max-image-preview:large':'noindex,nofollow,noarchive';}
  function addNavLink(){if($('a.gb-nav-blog-link, a[href="blog.html"]'))return;const nav=$('header nav')||$('.site-nav')||$('nav');if(!nav)return;const a=document.createElement('a');a.href='blog.html';a.textContent='ブログ';a.className='gb-nav-blog-link';nav.append(a);}
  async function initHome(){const root=$('[data-green-blog-home]');if(!root)return;try{const r=await api('/api/public/blog?limit=3');const items=r.data?.items||[];if(!items.length){root.hidden=true;return;}root.innerHTML=`<div class="gb-home-inner"><div class="gb-home-head"><div><p class="gb-eyebrow">BLOG & COLUMN</p><h2>植物と空間づくりのブログ</h2></div><a class="gb-home-more" href="blog.html">ブログをすべて見る →</a></div><div class="gb-grid">${items.map(i=>card(i)).join('')}</div></div>`;}catch{root.hidden=true;}}
  async function initList(){
    const root=$('[data-blog-list]'); if(!root)return;
    const more=$('[data-blog-more]');
    const PAGE_SIZE=9;
    let activeCat='すべて';
    let visible=PAGE_SIZE;
    root.innerHTML='<div class="gb-empty">記事を読み込んでいます…</div>';
    try{
      const r=await api('/api/public/blog?limit=100');
      const items=r.data?.items||[];
      const cats=['すべて',...new Set(items.map(x=>x.category).filter(Boolean))];
      const filters=$('[data-blog-filters]');
      if(filters)filters.innerHTML=cats.map((c,i)=>`<button class="gb-filter${i===0?' is-active':''}" type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
      const draw=()=>{
        const filtered=activeCat==='すべて'?items:items.filter(x=>x.category===activeCat);
        const shown=filtered.slice(0,visible);
        root.innerHTML=shown.length?shown.map(i=>card(i)).join(''):'<div class="gb-empty">このカテゴリの記事はまだありません。</div>';
        if(more){
          const remain=Math.max(0,filtered.length-visible);
          more.hidden=remain===0;
          more.textContent=remain>0?`もっと見る（残り ${remain}件）`:'もっと見る';
        }
      };
      draw();
      if(more)more.onclick=()=>{visible+=PAGE_SIZE;draw();};
      filters?.addEventListener('click',e=>{
        const b=e.target.closest('[data-cat]'); if(!b)return;
        activeCat=b.dataset.cat||'すべて';
        visible=PAGE_SIZE;
        $$('[data-cat]',filters).forEach(x=>x.classList.toggle('is-active',x===b));
        draw();
      });
    }catch(e){
      root.innerHTML=`<div class="gb-empty">${esc(e.message)}</div>`;
      if(more)more.hidden=true;
    }
  }
  function renderBody(text){const lines=String(text||'').split(/\r?\n/);let out='',list=false;const close=()=>{if(list){out+='</ul>';list=false;}};for(const raw of lines){const line=raw.trim();if(!line){close();continue;}if(line.startsWith('## ')){close();out+=`<h2>${esc(line.slice(3))}</h2>`;}else if(line.startsWith('- ')){if(!list){out+='<ul>';list=true;}out+=`<li>${esc(line.slice(2))}</li>`;}else{close();out+=`<p>${esc(line)}</p>`;}}close();return out;}
  function setMeta(item){document.title=item.seoTitle||`${item.title}｜グリーン・ポケット福岡粕屋店`;let d=$('meta[name="description"]');if(!d){d=document.createElement('meta');d.name='description';document.head.append(d);}d.content=item.seoDescription||item.excerpt||'';const canonical=`${location.origin}${location.pathname}?slug=${encodeURIComponent(item.slug)}`;let c=$('link[rel="canonical"]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.append(c);}c.href=canonical;[['og:title',item.seoTitle||item.title],['og:description',item.seoDescription||item.excerpt||''],['og:url',canonical],['og:image',resolveImage(item.featuredImageUrl||cfg().seo?.defaultShareImage||'og-image.png')]].forEach(([p,v])=>{let m=$(`meta[property="${p}"]`);if(!m){m=document.createElement('meta');m.setAttribute('property',p);document.head.append(m);}m.content=v;});let ld=$('#green-blog-article-jsonld');if(!ld){ld=document.createElement('script');ld.type='application/ld+json';ld.id='green-blog-article-jsonld';document.head.append(ld);}ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting',headline:item.title,description:item.seoDescription||item.excerpt||'',image:item.featuredImageUrl?[resolveImage(item.featuredImageUrl)]:undefined,datePublished:item.publishedAt,dateModified:item.updatedAt,author:{'@type':'Organization',name:item.authorName||'グリーン・ポケット福岡粕屋店'},publisher:{'@type':'Organization',name:'グリーン・ポケット福岡粕屋店'},mainEntityOfPage:canonical});}
  async function initDetail(){
    const root=$('[data-blog-detail]'); if(!root)return;
    const slug=new URLSearchParams(location.search).get('slug');
    if(!slug){root.innerHTML='<div class="gb-empty">記事が指定されていません。</div>';return;}
    try{
      const r=await api(`/api/public/blog/${encodeURIComponent(slug)}`);
      const i=r.data.item;
      setMeta(i);
      root.innerHTML=`<article class="gb-article">
        <header class="gb-article-head">
          <span class="gb-badge">${esc(i.category)}</span>
          <h1>${esc(i.title)}</h1>
          <p class="gb-article-summary">${esc(i.excerpt||'')}</p>
          <div class="gb-article-meta"><span>${esc(fmt(i.publishedAt))}</span><span>${esc(i.authorName||'グリーン・ポケット福岡粕屋店')}</span></div>
        </header>
        ${i.featuredImageUrl?`<figure class="gb-featured"><img src="${esc(resolveImage(i.featuredImageUrl))}" alt="${esc(i.featuredImageAlt||i.title)}"></figure>`:''}
        <div class="gb-body">${renderBody(i.body)}</div>
        <section class="gb-article-cta" aria-label="無料相談・見積り">
          <div class="gb-article-cta-copy">
            <p class="gb-eyebrow">FREE CONSULTATION</p>
            <h2>この空間にも、緑を。</h2>
            <p>植物選びから設置、定期メンテナンスまでご相談いただけます。見積り・現地確認・写真相談・LINE相談は無料です。</p>
          </div>
          <div class="gb-article-cta-actions">
            <a class="gb-article-cta-primary" href="contact.html">無料相談・見積り</a>
            <a class="gb-article-cta-secondary" href="line.html">LINEで相談</a>
          </div>
        </section>
        <a class="gb-back" href="blog.html">← ブログ一覧へ戻る</a>
        <section class="gb-related"><h2>関連記事</h2><div class="gb-grid" data-related></div></section>
      </article>`;
      const list=await api('/api/public/blog?limit=100');
      const all=(list.data?.items||[]).filter(x=>x.slug!==i.slug);
      const same=all.filter(x=>x.category===i.category);
      const others=all.filter(x=>x.category!==i.category);
      const rel=[...same,...others].slice(0,3);
      const rr=$('[data-related]',root);
      if(rel.length)rr.innerHTML=rel.map(x=>card(x)).join('');
      else rr.closest('.gb-related').hidden=true;
    }catch(e){
      root.innerHTML=`<div class="gb-empty">${esc(e.message)}</div>`;
    }
  }
  function ensureHomeSlot(){const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();if(path!==''&&path!=='index.html')return;if($('[data-green-blog-home]'))return;const sec=document.createElement('section');sec.className='green-blog-home';sec.dataset.greenBlogHome='';const footer=$('footer');footer?.parentNode?.insertBefore(sec,footer);}
  function init(){setRobots();addNavLink();ensureHomeSlot();initHome();initList();initDetail();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
