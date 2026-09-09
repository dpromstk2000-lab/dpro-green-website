(()=>{"use strict";
const cfg=window.GREEN_WEB_CONFIG||{};
const form=document.querySelector('#inquiry-form');
if(form){
 const budget=document.querySelector('#monthly-budget');
 form.addEventListener('submit',()=>{const t=form.elements.inquiryText;if(!t||!budget?.value)return;const marker='【月額予算目安】';const clean=t.value.replace(new RegExp('\\n?'+marker+'.*?(?=\\n【|$)','g'),'').trim();t.value=`${clean}\\n${marker}${budget.value}`.trim();},true);
 const button=document.querySelector('#submit-button');
 if(button){const normalize=()=>{if(!button.disabled&&button.textContent!=='この内容で相談を送る')button.textContent='この内容で相談を送る';};normalize();new MutationObserver(normalize).observe(button,{childList:true,subtree:true,characterData:true});}
}
const dialog=document.querySelector('#line-template-dialog');
const title=document.querySelector('#final-line-title');const note=document.querySelector('#final-line-note');const msg=document.querySelector('#final-line-message');
function openTemplate(key){const t=cfg?.line?.templates?.[key]||cfg?.line?.templates?.consultation||{};if(title)title.textContent=t.title||'相談文面';if(note)note.textContent=t.note||'分かる範囲で内容をお送りください。';if(msg)msg.value=t.message||cfg.lineFallbackMessage||'観葉植物レンタルについて相談したいです。';const lineOpen=document.querySelector('#final-line-open');const lineUrl=String(cfg?.links?.line||'');if(lineOpen){lineOpen.hidden=!(lineUrl&&cfg?.publication?.lineApproved===true);if(!lineOpen.hidden)lineOpen.href=lineUrl;}if(dialog?.showModal)dialog.showModal();else dialog?.setAttribute('open','');}
document.querySelectorAll('[data-final-line-template]').forEach(b=>b.addEventListener('click',()=>openTemplate(b.dataset.finalLineTemplate)));
document.querySelectorAll('[data-final-line-close]').forEach(b=>b.addEventListener('click',()=>dialog?.close?.()));
document.querySelector('#final-line-copy')?.addEventListener('click',async e=>{try{await navigator.clipboard.writeText(msg?.value||'');e.currentTarget.textContent='コピーしました';}catch{msg?.select();e.currentTarget.textContent='文面を選択しました';}setTimeout(()=>e.currentTarget.textContent='文面をコピー',1600);});
const portal=String(cfg?.links?.customerPortal||'');document.querySelectorAll('[data-final-customer-portal]').forEach(a=>{a.hidden=!portal;if(portal)a.href=portal;});
})();