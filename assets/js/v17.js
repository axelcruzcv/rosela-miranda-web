
/* Rosela Miranda / all-vector ornamental icon system */
const N='http://www.w3.org/2000/svg';
const paths={
heart:'<path d="M12 21C7.5 17 3.5 13 3.5 8.5a4.8 4.8 0 0 1 8.5-3 4.8 4.8 0 0 1 8.5 3C20.5 13 16.5 17 12 21Z"/>',
apple:'<path d="M12 7C7 4 3 7 4 13c1 5 4 8 8 7 4 1 7-2 8-7 1-6-3-9-8-6ZM12 7c0-3 2-5 4-5"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
book:'<path d="M12 6c-3-2-6-2-9-1v14c4-1 7-1 9 1 2-2 5-2 9-1V5c-3-1-6-1-9 1ZM12 6v14"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 15h4m3 0h3"/>',
bowl:'<path d="M3 12h18c0 6-4 9-9 9s-9-3-9-9ZM6 7c2-3 4-3 6 0m3-4c-1 2 0 3 2 5"/>',
utensils:'<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M18 21V3c-4 3-5 7-5 12h5"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2m0-14-2 2M7 17l-2 2"/>',
moon:'<path d="M20.5 15a8.5 8.5 0 0 1-11-11.5A9 9 0 1 0 20.5 15Z"/>',
water:'<path d="M12 2C8 8 5 11 5 15a7 7 0 0 0 14 0c0-4-3-7-7-13Z"/>',
leaf:'<path d="M21 3C11 2 4 6 4 14c0 4 3 7 7 6 7-1 10-7 10-17ZM4 20c3-7 8-11 13-13"/>',
flower:'<circle cx="12" cy="12" r="2"/><path d="M12 10c-5-8-9-1-3 2-8-3-8 5-1 3-4 7 3 8 4 2 4 6 9 1 4-3 7-4 2-9-2-5 0-8-8-8-2 1Z"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
activity:'<path d="M2 12h5l3-6 4 12 3-6h5"/>',
check:'<path d="m4 12 5 5L20 6"/>',
award:'<circle cx="12" cy="8" r="5"/><path d="m9 12-2 9 5-3 5 3-2-9"/>',
sprout:'<path d="M12 21v-9M12 16C5 16 4 11 4 6c6 0 8 4 8 8m0-4c0-5 3-8 8-8 0 5-2 9-8 9"/>',
shield:'<path d="M12 2 4 5v6c0 6 3.5 9 8 11 4.5-2 8-5 8-11V5l-8-3Zm-3 10 2 2 4-4"/>',
bag:'<path d="M4 8h16l-1 13H5L4 8ZM8 9V6a4 4 0 0 1 8 0v3"/>',
chat:'<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 10h8"/>',
foot:'<path d="M4 17c4-5 4-8 6-11 2-2 4 1 4 4 0 3 2 4 6 5 2 1 2 5-1 5H7c-2 0-3-1-3-3Z"/>',
down:'<path d="M12 3v15m-6-6 6 6 6-6M4 21h16"/>'
};
function ico(key){
 const svg=document.createElementNS(N,'svg');
 svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');
 svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.55');
 svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
 svg.setAttribute('aria-hidden','true');svg.classList.add('rm-icon');
 svg.innerHTML=paths[key]||paths.sprout;return svg;
}
const screen=document.getElementById('rm-quiz-screen');
const count=document.getElementById('rm-quiz-counter');
const steps=[['calendar','bowl','clock','target'],['bag','utensils','clock','heart'],['calendar','utensils','sun','sprout'],['bowl','flower','activity','award']];
const reward={plan:['calendar','bag','utensils','check'],variety:['bowl','apple','flower','utensils'],rhythm:['clock','sun','moon','activity'],steady:['target','sprout','heart','award']};
function enrich(){
 if(!screen)return;
 const gift=screen.querySelector('.rm-gift-card');
 if(gift){
  if(gift.dataset.iconv17)return;
  gift.dataset.iconv17='yes';
  const group=reward[gift.dataset.gift]||reward.plan;
  const cover=gift.querySelector('.rm-gift-cover');
  if(cover){
   cover.querySelectorAll('img').forEach(n=>n.remove());
   const doc=document.createElement('div');doc.className='rm-icon-document';doc.append(ico(group[0]));
   const lines=document.createElement('div');lines.className='rm-document-lines';
   for(let i=0;i<4;i++)lines.append(document.createElement('span'));
   doc.append(lines);cover.prepend(doc);
   const motifs=document.createElement('div');motifs.className='rm-icon-motifs';
   group.slice(1).forEach(k=>motifs.append(ico(k)));cover.append(motifs);
  }
  const bonus=screen.querySelector('.rm-bonus-strip');
  if(bonus){
   bonus.querySelectorAll('img,.rm-bonus-document-icon').forEach(n=>n.remove());
   const symbol=document.createElement('span');symbol.className='rm-bonus-icon';symbol.append(ico('utensils'));bonus.prepend(symbol);
  }
  const dl=gift.querySelector('.qa-download-icon');if(dl)dl.replaceChildren(ico('down'));
  return;
 }
 const choices=[...screen.querySelectorAll('.rm-choice')];
 if(choices.length===4){
  const n=Math.min(3,Math.max(0,(parseInt(count?.textContent,10)||1)-1));
  choices.forEach((el,i)=>{const mark=el.querySelector('.rm-choice-symbol');if(mark)mark.replaceChildren(ico(steps[n][i]));});
  const kicker=screen.querySelector('.qa-step-kicker');
  if(kicker&&!screen.querySelector('.rm-icon-question-band')){
    const band=document.createElement('div');band.className='rm-icon-question-band';
    [steps[n][0],steps[n][1],steps[n][2]].forEach(k=>{const s=document.createElement('span');s.append(ico(k));band.append(s);});
    kicker.after(band);
  }return;
 }
 if(screen.querySelector('.v10-quiz-start')&&!screen.querySelector('.rm-icon-intro-band')){
  screen.querySelector('.qa-intro-marks')?.remove();
  const desc=screen.querySelector('.rm-modal-desc');
  if(desc){const band=document.createElement('div');band.className='rm-icon-intro-band';
   ['sprout','bowl','moon','heart'].forEach(k=>{const s=document.createElement('span');s.append(ico(k));band.append(s);});desc.after(band);
  }
 }
}
if(screen){new MutationObserver(enrich).observe(screen,{childList:true});if(count)new MutationObserver(enrich).observe(count,{childList:true});enrich();}
document.querySelectorAll('.v10-specialty').forEach((c,i)=>{
 const span=c.querySelector('.v10-specialty-symbol');if(span)span.replaceChildren(ico(['heart','activity','shield','leaf','foot','target'][i]));
});
const lead=document.querySelector('.v10-approach-lead');
if(lead&&!lead.querySelector('.rm-icon-approach')){
 const el=document.createElement('div');el.className='rm-icon-approach';
 ['chat','book','heart'].forEach(k=>{const s=document.createElement('span');s.append(ico(k));el.append(s);});lead.append(el);
}
