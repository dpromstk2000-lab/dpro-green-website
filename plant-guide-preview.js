
(() => {
  "use strict";
  const data = window.DPRO_GREEN_ATLAS_DATA || {plants:[],pots:[]};
  const state = {tab:"plants"};
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const labels = {
    indoorOutdoor:{indoor:"屋内",outdoor:"屋外",both:"屋内・屋外"},
    potType:{pot:"鉢",cover:"鉢カバー",planter:"プランター",stand:"スタンド",other:"その他"}
  };
  const esc = (v)=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  function filteredPlants(){
    const q=($("#atlas-plant-search")?.value||"").trim().toLowerCase();
    const cat=$("#atlas-plant-category")?.value||"";
    const io=$("#atlas-plant-indoor")?.value||"";
    const size=$("#atlas-plant-size")?.value||"";
    return data.plants.filter(x=>{
      const hay=[x.name,x.code,x.category,x.size].filter(Boolean).join(" ").toLowerCase();
      return (!q||hay.includes(q))&&(!cat||x.category===cat)&&(!io||x.indoorOutdoor===io)&&(!size||String(x.size).includes(size));
    });
  }
  function filteredPots(){
    const q=($("#atlas-pot-search")?.value||"").trim().toLowerCase();
    const type=$("#atlas-pot-type")?.value||"";
    const series=$("#atlas-pot-series")?.value||"";
    return data.pots.filter(x=>{
      const hay=[x.name,x.code,x.material,...(x.series||[])].filter(Boolean).join(" ").toLowerCase();
      return (!q||hay.includes(q))&&(!type||x.type===type)&&(!series||(x.series||[]).includes(series));
    });
  }
  function placeholder(kind){
    return `<div class="atlas-card__placeholder"><b>${kind==="plants"?"🌿":"◯"}</b><small>代表画像 準備中</small></div>`;
  }
  function card(item,kind){
    const plant=kind==="plants";
    const tags=plant
      ? [item.category,labels.indoorOutdoor[item.indoorOutdoor]||item.indoorOutdoor,`サイズ ${item.size}`]
      : [labels.potType[item.type]||item.type,item.material,...(item.series||[])];
    return `<article class="atlas-card" tabindex="0" role="button" data-code="${esc(item.code)}" data-kind="${kind}">
      <div class="atlas-card__media">${item.image?`<img src="${esc(item.image)}" alt="${esc(item.name)}の代表イメージ" loading="lazy">`:placeholder(kind)}</div>
      <div class="atlas-card__body"><span class="atlas-card__code">${esc(item.code)}</span><h3>${esc(item.name)}</h3>
      <div class="atlas-tags">${tags.filter(Boolean).slice(0,4).map((t,i)=>`<span class="atlas-tag${i===0?" atlas-tag--accent":""}">${esc(t)}</span>`).join("")}</div></div>
    </article>`;
  }
  function render(){
    const items=state.tab==="plants"?filteredPlants():filteredPots();
    const grid=$("#atlas-grid");
    grid.innerHTML=items.map(x=>card(x,state.tab)).join("");
    $("#atlas-empty").hidden=items.length>0;
    $("#atlas-result-count").textContent=`全${items.length}件`;
    $("#atlas-image-count").textContent=`代表画像 ${items.filter(x=>x.image).length}件`;
  }
  function setTab(tab){
    state.tab=tab;
    $$("[data-atlas-tab]").forEach(b=>b.classList.toggle("is-active",b.dataset.atlasTab===tab));
    $("[data-plant-tools]").hidden=tab!=="plants";
    $("[data-pot-tools]").hidden=tab!=="pots";
    render();
  }
  function clear(kind){
    if(kind==="plants"){
      ["#atlas-plant-search","#atlas-plant-category","#atlas-plant-indoor","#atlas-plant-size"].forEach(s=>{const e=$(s);if(e)e.value="";});
    } else {
      ["#atlas-pot-search","#atlas-pot-type","#atlas-pot-series"].forEach(s=>{const e=$(s);if(e)e.value="";});
    }
    render();
  }
  function openDetail(kind,code){
    const item=(kind==="plants"?data.plants:data.pots).find(x=>x.code===code);
    if(!item)return;
    const plant=kind==="plants";
    const media=item.image?`<img src="${esc(item.image)}" alt="${esc(item.name)}の代表イメージ">`:`<div class="atlas-detail__placeholder">${plant?"🌿":"◯"}</div>`;
    const meta=plant
      ? [["分類",item.category],["屋内外",labels.indoorOutdoor[item.indoorOutdoor]||item.indoorOutdoor],["対応サイズ",item.size],["マスターコード",item.code]]
      : [["種別",labels.potType[item.type]||item.type],["素材",item.material],["サイズ",item.size],["本社区分",(item.series||[]).join("・")||"未設定"]];
    $("#atlas-dialog-body").innerHTML=`<div class="atlas-detail"><div class="atlas-detail__media">${media}</div><div class="atlas-detail__body">
      <span class="atlas-card__code">${esc(item.code)}</span><h2>${esc(item.name)}</h2>
      <div class="atlas-detail__meta">${meta.map(([k,v])=>`<div><span>${esc(k)}</span><strong>${esc(v||"未設定")}</strong></div>`).join("")}</div>
      <p class="atlas-detail__notice">${item.image?"掲載画像は選びやすくするための代表イメージです。":"現在は代表画像を準備中です。"} 植物は樹形や葉ぶりに個体差があり、鉢は色味・質感・在庫状況が異なる場合があります。</p>
      <div class="atlas-detail__actions"><a class="btn btn--line" href="line.html">この${plant?"植物":"鉢"}をLINEで相談</a><a class="btn btn--primary" href="contact.html">設置を相談する</a></div>
    </div></div>`;
    const dlg=$("#atlas-dialog");
    if(typeof dlg.showModal==="function") dlg.showModal(); else dlg.setAttribute("open","");
  }
  document.addEventListener("click",e=>{
    const tab=e.target.closest("[data-atlas-tab]"); if(tab){setTab(tab.dataset.atlasTab);return;}
    const clearBtn=e.target.closest("[data-clear]"); if(clearBtn){clear(clearBtn.dataset.clear);return;}
    const cardEl=e.target.closest(".atlas-card"); if(cardEl){openDetail(cardEl.dataset.kind,cardEl.dataset.code);return;}
    if(e.target.closest("[data-dialog-close]")) $("#atlas-dialog")?.close();
  });
  document.addEventListener("keydown",e=>{
    const cardEl=e.target.closest?.(".atlas-card");
    if(cardEl&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openDetail(cardEl.dataset.kind,cardEl.dataset.code);}
  });
  ["#atlas-plant-search","#atlas-plant-category","#atlas-plant-indoor","#atlas-plant-size","#atlas-pot-search","#atlas-pot-type","#atlas-pot-series"].forEach(s=>{
    const e=$(s); if(!e)return; e.addEventListener(e.tagName==="INPUT"?"input":"change",render);
  });
  $("#atlas-dialog")?.addEventListener("click",e=>{if(e.target===$("#atlas-dialog")) $("#atlas-dialog").close();});
  setTab("plants");
})();
