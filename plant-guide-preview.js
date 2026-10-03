(() => {
  "use strict";
  const data = window.DPRO_GREEN_ATLAS_DATA || {plants:[],pots:[]};
  const PAGE_SIZE = 24;
  const state = {tab:"plants",pages:{plants:1,pots:1}};
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const labels = {
    indoorOutdoor:{indoor:"屋内",outdoor:"屋外",both:"屋内・屋外"},
    potType:{pot:"鉢",cover:"鉢カバー",planter:"プランター",stand:"スタンド",other:"その他"}
  };
  const PILOT_DETAIL = Object.freeze({
    "SP-PACHIRA-001":{lead:"やわらかな葉姿と明るい印象で、オフィスや店舗の定番として合わせやすい観葉植物です。",places:["受付","オフィス","店舗","ご自宅"],moods:["明るい","親しみやすい","ナチュラル"],care:"比較的扱いやすい",pots:["丸型陶器鉢","特殊セメント鉢"]},
    "SP-GP-0066":{lead:"大きく切れ込んだ葉が印象的で、1鉢でも空間のアクセントになりやすい植物です。",places:["店舗","受付","待合室","オフィス"],moods:["存在感","リゾート感","やわらかい"],care:"標準",pots:["特殊セメント鉢","Kozimi(コズミ)"]},
    "SP-GP-0067":{lead:"シャープな葉姿で、すっきりした空間やモダンなインテリアに合わせやすい植物です。",places:["エントランス","オフィス","店舗"],moods:["シャープ","モダン","スタイリッシュ"],care:"比較的扱いやすい",pots:["特殊セメント鉢","丸型陶器鉢"]},
    "SP-GP-0034":{lead:"直線的な葉姿で省スペースにも置きやすく、すっきりした印象をつくりやすい植物です。",places:["受付","デスク周り","店舗","ご自宅"],moods:["シンプル","シャープ","省スペース"],care:"比較的扱いやすい",pots:["丸型陶器鉢","Kozimi(コズミ)"]},
    "SP-GP-0059":{lead:"つる性のやわらかな葉が特徴で、棚上やハンギングなど幅広い見せ方ができます。",places:["棚上","受付","オフィス","店舗"],moods:["やわらかい","親しみやすい","軽やか"],care:"比較的扱いやすい",pots:["シーグラスバスケット","トラース"]},
    "SP-GP-0056":{lead:"細かな葉が密に茂り、落ち着きと上品さを演出しやすい定番の観葉植物です。",places:["オフィス","応接室","店舗","受付"],moods:["上品","落ち着き","定番"],care:"標準",pots:["Kozimi(コズミ)","特殊セメント鉢"]},
    "SP-GP-0011":{lead:"大きなハート形の葉が特徴で、ナチュラルでやさしい雰囲気をつくりやすい植物です。",places:["受付","待合室","店舗","ご自宅"],moods:["やさしい","ナチュラル","存在感"],care:"標準",pots:["丸型陶器鉢","Kozimi(コズミ)"]},
    "SP-GP-0017":{lead:"大きな葉が上へ伸び、ホテルライクで開放感のある空間づくりに向く植物です。",places:["エントランス","店舗","広めのオフィス","待合室"],moods:["開放感","リゾート感","存在感"],care:"標準",pots:["特殊セメント鉢","Kozimi(コズミ)"]},
    "SP-GP-0008":{lead:"細長い葉が広がる軽やかな樹形で、空間を明るく柔らかく見せやすい植物です。",places:["オフィス","店舗","待合室","休憩スペース"],moods:["軽やか","爽やか","リラックス"],care:"標準",pots:["シーグラスバスケット","丸型陶器鉢"]},
    "SP-GP-0016":{lead:"シルバーがかった葉色と樹形が魅力で、屋外や明るい空間に自然なアクセントを加えます。",places:["屋外入口","テラス","店舗前","ご自宅"],moods:["ナチュラル","上品","地中海風"],care:"屋外向け",pots:["特殊セメント鉢","Kozimi(コズミ)"]},

    "CM-GP-0002":{lead:"素材感を活かした落ち着いた印象で、グリーンを引き締めて見せやすい鉢です。",moods:["モダン","重厚感","シンプル"],plants:["モンステラ","ユッカ","オーガスタ"]},
    "CM-GP-0005":{lead:"丸みのある陶器の形で、植物を選びにくく、やわらかな空間にも合わせやすい鉢です。",moods:["シンプル","やわらかい","上品"],plants:["パキラ","ウンベラータ","サンセベリア"]},
    "CM-GP-0011":{lead:"天然素材らしい表情があり、植物の緑をやさしくナチュラルに見せる鉢カバーです。",moods:["ナチュラル","あたたかい","軽やか"],plants:["ポトス","アレカヤシ"]},
    "CM-GP-0019":{lead:"木の質感を活かしたオリジナルプランターで、空間に温かみとデザイン性を加えます。",moods:["木質","デザイン","ナチュラル"],plants:["モンステラ","ベンジャミナ","オリーブ"]},
    "CM-GP-0022":{lead:"吊るして植物を楽しめるハンギングタイプで、床面を使わず立体的に緑を見せられます。",moods:["軽やか","立体感","ナチュラル"],plants:["ポトス","ライムポトス"]}
  });

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
  function currentFilteredItems(){return state.tab==="plants"?filteredPlants():filteredPots();}
  function resetCurrentPage(){state.pages[state.tab]=1;}
  function render(){
    const items=currentFilteredItems();
    const total=items.length;
    const pages=Math.max(1,Math.ceil(total/PAGE_SIZE));
    let page=state.pages[state.tab]||1;
    page=Math.max(1,Math.min(page,pages));
    state.pages[state.tab]=page;
    const start=(page-1)*PAGE_SIZE;
    const end=Math.min(start+PAGE_SIZE,total);
    const visible=items.slice(start,end);
    $("#atlas-grid").innerHTML=visible.map(x=>card(x,state.tab)).join("");
    $("#atlas-empty").hidden=total>0;
    $("#atlas-result-count").textContent=total?`全${total}件／${start+1}〜${end}件表示`:"該当0件";
    $("#atlas-image-count").textContent=`代表画像 ${items.filter(x=>x.image).length}件`;
    $("#atlas-pager").hidden=total<=PAGE_SIZE;
    $("#atlas-page-range").textContent=total?`${start+1}〜${end}件表示`:"0件";
    $("#atlas-page-status").textContent=`${page} / ${pages}ページ`;
    $("[data-page-prev]").disabled=page<=1;
    $("[data-page-next]").disabled=page>=pages;
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
    }else{
      ["#atlas-pot-search","#atlas-pot-type","#atlas-pot-series"].forEach(s=>{const e=$(s);if(e)e.value="";});
    }
    state.pages[kind]=1; render();
  }
  function changePage(delta){
    state.pages[state.tab]=(state.pages[state.tab]||1)+delta;
    render();
    $("#atlas-browser")?.scrollIntoView({behavior:"smooth",block:"start"});
  }
  const chips=(values)=>`<div class="atlas-detail__chips">${(values||[]).map(v=>`<span class="atlas-detail__chip">${esc(v)}</span>`).join("")}</div>`;
  function openDetail(kind,code){
    const item=(kind==="plants"?data.plants:data.pots).find(x=>x.code===code);
    if(!item)return;
    const plant=kind==="plants";
    const extra=PILOT_DETAIL[code]||{};
    const media=item.image?`<img src="${esc(item.image)}" alt="${esc(item.name)}の代表イメージ">`:`<div class="atlas-detail__placeholder">${plant?"🌿":"◯"}</div>`;
    const meta=plant
      ? [["分類",item.category],["屋内外",labels.indoorOutdoor[item.indoorOutdoor]||item.indoorOutdoor],["対応サイズ",item.size]]
      : [["種別",labels.potType[item.type]||item.type],["素材",item.material],["サイズ",item.size]];
    const lead=extra.lead || (plant
      ? "植物選びの参考用として、代表的な分類・設置条件・対応サイズを掲載しています。"
      : "鉢・プランター選びの参考用として、種別・素材・サイズ情報を掲載しています。");
    const sections = plant
      ? `<div class="atlas-detail__sections">
          <section class="atlas-detail__section"><h3>おすすめの設置場所</h3>${extra.places?chips(extra.places):"<p>詳細情報を準備中です。</p>"}</section>
          <section class="atlas-detail__section"><h3>雰囲気</h3>${extra.moods?chips(extra.moods):"<p>詳細情報を準備中です。</p>"}</section>
          <section class="atlas-detail__section"><h3>管理しやすさ</h3><p>${esc(extra.care||"詳細情報を準備中です。")}</p></section>
          <section class="atlas-detail__section"><h3>合わせやすい鉢</h3>${extra.pots?chips(extra.pots):"<p>組み合わせ情報を準備中です。</p>"}</section>
        </div>`
      : `<div class="atlas-detail__sections">
          <section class="atlas-detail__section"><h3>テイスト</h3>${extra.moods?chips(extra.moods):chips(item.series||[])}</section>
          <section class="atlas-detail__section"><h3>合わせやすい植物</h3>${extra.plants?chips(extra.plants):"<p>組み合わせ情報を準備中です。</p>"}</section>
        </div>`;
    $("#atlas-dialog-body").innerHTML=`<div class="atlas-detail">
      <div class="atlas-detail__media">${media}</div>
      <div class="atlas-detail__body">
        <h2>${esc(item.name)}</h2>
        <p class="atlas-detail__lead">${esc(lead)}</p>
        <div class="atlas-detail__meta">${meta.map(([k,v])=>`<div><span>${esc(k)}</span><strong>${esc(v||"未設定")}</strong></div>`).join("")}</div>
        ${sections}
        <p class="atlas-detail__notice">${item.image?"掲載画像は選びやすくするための代表イメージです。":"現在は代表画像を準備中です。"} 植物は樹形や葉ぶりに個体差があり、鉢は色味・質感・在庫状況が異なる場合があります。</p>
        <div class="atlas-detail__actions">
          <a class="btn btn--line" href="line.html">この${plant?"植物":"鉢"}をLINEで相談</a>
          ${plant?'<button class="btn btn--soft" type="button" data-show-pots>この植物に合う鉢を見る</button>':""}
          <a class="btn btn--primary" href="contact.html">設置を相談する</a>
        </div>
      </div>
    </div>`;
    const dlg=$("#atlas-dialog");
    if(typeof dlg?.showModal==="function")dlg.showModal();else dlg?.setAttribute("open","");
  }
  function showPotsFromDetail(){
    $("#atlas-dialog")?.close();
    setTab("pots");
    $("#atlas-browser")?.scrollIntoView({behavior:"smooth",block:"start"});
  }
  document.addEventListener("click",e=>{
    const tab=e.target.closest("[data-atlas-tab]");if(tab){setTab(tab.dataset.atlasTab);return;}
    const clearBtn=e.target.closest("[data-clear]");if(clearBtn){clear(clearBtn.dataset.clear);return;}
    if(e.target.closest("[data-page-prev]")){changePage(-1);return;}
    if(e.target.closest("[data-page-next]")){changePage(1);return;}
    if(e.target.closest("[data-show-pots]")){showPotsFromDetail();return;}
    const cardEl=e.target.closest(".atlas-card");if(cardEl){openDetail(cardEl.dataset.kind,cardEl.dataset.code);return;}
    if(e.target.closest("[data-dialog-close]"))$("#atlas-dialog")?.close();
  });
  document.addEventListener("keydown",e=>{
    const cardEl=e.target.closest?.(".atlas-card");
    if(cardEl&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openDetail(cardEl.dataset.kind,cardEl.dataset.code);}
  });
  ["#atlas-plant-search","#atlas-plant-category","#atlas-plant-indoor","#atlas-plant-size","#atlas-pot-search","#atlas-pot-type","#atlas-pot-series"].forEach(s=>{
    const e=$(s);if(!e)return;e.addEventListener(e.tagName==="INPUT"?"input":"change",()=>{resetCurrentPage();render();});
  });
  $("#atlas-dialog")?.addEventListener("click",e=>{if(e.target===$("#atlas-dialog"))$("#atlas-dialog").close();});
  setTab("plants");
})();
