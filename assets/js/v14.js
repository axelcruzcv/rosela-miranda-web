/* ROSELA — Visual Reward System v14.
   Progressive, decorative enhancements only. The approved quiz logic and answers remain unchanged.
   Every image is a transparent, locally hosted illustration; no external image requests. */
const imageRoot = new URL('../images/illustrations/', import.meta.url);
const imgURL = name => new URL(name + '.webp', imageRoot).href;
const screen = document.getElementById('rm-quiz-screen');
const counter = document.getElementById('rm-quiz-counter');
const decorative = (name, className = '', eager = false) => {
  const im = document.createElement('img');
  im.className = className;
  im.src = imgURL(name);
  im.alt = '';
  im.setAttribute('aria-hidden','true');
  im.decoding = 'async';
  im.loading = eager ? 'eager' : 'lazy';
  im.width = 220;
  im.height = 220;
  return im;
};
const choiceArt = [
 {plan:'prep-planner',variety:'recipes-foodbowl',rhythm:'rituals-alarm',steady:'challenge-calendar'},
 {plan:'prep-clock',variety:'recipes-soup',rhythm:'rituals-tea',steady:'challenge-heart'},
 {plan:'prep-clipboard',variety:'recipes-notebook',rhythm:'rituals-journal',steady:'challenge-seven'},
 {plan:'prep-containers',variety:'recipes-berries',rhythm:'rituals-yoga',steady:'challenge-trophy'}
];
const stepScenes = [
 ['prep-containers','prep-waterbottle','recipes-foodbowl'],
 ['recipes-soup','rituals-tea','prep-clock'],
 ['rituals-alarm','rituals-journal','rituals-yoga'],
 ['challenge-seven','challenge-apple','challenge-medal']
];
const rewardScenes = {
 plan:{tag:'ORGANIZACIÓN · TU REGALO PERSONAL', note:'Tus respuestas muestran interés en organizar mejor tus comidas. Esta herramienta te ayudará a planear y preparar tu semana.',photos:['prep-mealbox','prep-planner','prep-containers']},
 variety:{tag:'VARIEDAD · TU REGALO PERSONAL', note:'Tus respuestas se relacionan con comer más variado. Seleccionamos un recetario con ideas para disfrutar tu alimentación.',photos:['recipes-foodbowl','recipes-soup','recipes-berries']},
 rhythm:{tag:'RITMO · TU REGALO PERSONAL', note:'Tus respuestas ponen el foco en encontrar tiempo para ti. Estos rituales son una herramienta para construir pausas realistas.',photos:['rituals-yoga','rituals-alarm','rituals-tea']},
 steady:{tag:'CONSTANCIA · TU REGALO PERSONAL', note:'Tus respuestas resaltan la importancia de sostener pequeños hábitos. El reto de siete días te propone acciones que puedes marcar.',photos:['challenge-trophy','challenge-seven','challenge-apple']}
};
function introDecor(){
 if(screen.querySelector('.v14-intro-art'))return;
 const p=screen.querySelector('.rm-modal-desc');if(!p)return;
 const group=document.createElement('div');group.className='v14-intro-art';group.setAttribute('aria-hidden','true');
 group.append(decorative('rewards-gift','v14-intro-gift',true),decorative('rewards-badge','v14-intro-medal',true),decorative('rewards-book','v14-intro-book',true));
 p.after(group);
}
function questionDecor(){
 const label=counter.textContent.trim();
 const n=Number.parseInt(label,10)-1;
 if(!Number.isInteger(n)||n<0||n>3)return;
 const scene=stepScenes[n];
 const paragraph=screen.querySelector('.rm-modal-desc');
 if(paragraph && !screen.querySelector('.v14-step-art')){
   const group=document.createElement('figure');group.className='v14-step-art';group.setAttribute('aria-hidden','true');
   for(const [i,k] of scene.entries())group.append(decorative(k,'v14-step-image v14-step-'+i,true));
   paragraph.after(group);
 }
 const buttons=screen.querySelectorAll('.rm-choice');
 if(buttons.length===4)buttons.forEach((button,i)=>{
   const existing=button.querySelector('.rm-choice-symbol');
   if(existing && !existing.querySelector('img')){
     const key=['plan','variety','rhythm','steady'][i];
     existing.textContent='';
     existing.append(decorative(choiceArt[n][key],'v14-choice-image',true));
   }
 });
}
function resultDecor(){
 const card=screen.querySelector('.rm-gift-card');
 if(!card || card.dataset.v14Enhanced)return;
 const kind=card.dataset.gift;
 const selected=rewardScenes[kind];
 if(!selected)return;
 card.dataset.v14Enhanced='true';
 screen.dataset.gift=kind;
 const heading=screen.querySelector('#rm-quiz-title');
 if(heading) heading.textContent='Este regalo es para ti.';
 const eyebrow=screen.querySelector('.eyebrow');
 if(eyebrow)eyebrow.textContent='TU TEST DE HÁBITOS · RESULTADO PERSONAL';
 const intro=document.createElement('div');intro.className='v14-reward-intro';
 intro.append(decorative('rewards-badge','v14-reward-medal',true));
 const info=document.createElement('div');
 const caption=document.createElement('p');caption.className='v14-reward-kicker';caption.textContent=selected.tag;
 const why=document.createElement('p');why.className='v14-reward-why';why.textContent=selected.note;
 info.append(caption,why);intro.append(info);
 card.before(intro);
 const panel=card.querySelector('.rm-gift-cover');
 if(panel){
   const cutouts=document.createElement('div');cutouts.className='v14-reward-stickers';cutouts.setAttribute('aria-hidden','true');
   selected.photos.forEach((photo,i)=>cutouts.append(decorative(photo,'v14-reward-art v14-reward-art-'+i,true)));
   panel.append(cutouts);
 }
 const primary=screen.querySelector('.rm-pdf-download');
 const cardCopy=card.querySelector('.rm-gift-copy');
 if(primary && cardCopy){
   const lead=document.createElement('p');lead.className='v14-download-label';lead.textContent='TU OBSEQUIO · PDF PERSONALIZADO';
   const icon=decorative('rewards-download','v14-download-icon',true);
   const text=document.createElement('span');text.textContent=primary.textContent.replace(/\s*↓\s*$/,'');
   const arrow=document.createElement('span');arrow.className='v14-download-arrow';arrow.textContent='↓';
   primary.textContent='';primary.append(icon,text,arrow);
   primary.setAttribute('aria-label',text.textContent+' (PDF)');
   primary.before(lead);
   cardCopy.append(lead,primary);
 }
 const bonus=screen.querySelector('.rm-bonus-strip');
 const controls=screen.querySelector('.rm-gift-controls');
 if(bonus && controls){
   const divider=document.createElement('p');divider.className='v14-bonus-kicker';divider.textContent='UN EXTRA PARA TODAS LAS PERSONAS';
   bonus.before(divider);
   controls.after(divider,bonus);
   const bonusArt=document.createElement('div');bonusArt.className='v14-bonus-art';bonusArt.setAttribute('aria-hidden','true');
   bonusArt.append(decorative('outdoors-restaurant','v14-bonus-restaurant'),decorative('outdoors-menu','v14-bonus-menu'));
   bonus.append(bonusArt);
 }
}
function enhance(){
 if(!screen || screen.closest('[hidden]'))return;
 if(screen.querySelector('.rm-gift-card')) {resultDecor();return;}
 if(screen.querySelector('.rm-choice')) {questionDecor();return;}
 if(screen.querySelector('.v10-quiz-start'))introDecor();
}
if(screen && counter){
 const observer=new MutationObserver(enhance);
 observer.observe(screen,{childList:true,subtree:true});
 observer.observe(counter,{childList:true,characterData:true,subtree:true});
 enhance();
}
// Professional page: recognizable visual motifs, never clinical diagrams.
const specialtyArt=['rituals-heart','recipes-foodbowl','rewards-book','rituals-tea','challenge-sneakers','prep-clipboard'];
document.querySelectorAll('.v10-specialty').forEach((card,i)=>{
 const symbol=card.querySelector('.v10-specialty-symbol');
 if(symbol && specialtyArt[i]){symbol.textContent='';symbol.append(decorative(specialtyArt[i],'v14-specialty-image'));}
});
const approach=document.querySelector('.v10-approach-lead');
if(approach){
 const art=document.createElement('div');art.className='v14-approach-art';art.setAttribute('aria-hidden','true');
 art.append(decorative('prep-waterbottle',''),decorative('rituals-journal',''));
 approach.append(art);
}