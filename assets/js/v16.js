/* Rosela / production illustration integration.
   All artwork is generated into real, RGBA-trimmed PNG assets during CI.
   Decorations never overlap copy, CTA buttons, or PDF content. */
const root = new URL('../images/illustrations-clean/', import.meta.url);
const url = key => new URL(key + '.png', root).href;
const screen = document.getElementById('rm-quiz-screen');
const counter = document.getElementById('rm-quiz-counter');
const art = (key, cls='') => {
  const im = document.createElement('img');
  im.src = url(key);
  im.className=cls;
  im.alt='';
  im.setAttribute('aria-hidden','true');
  im.loading='eager';
  im.decoding='async';
  // A missing generated file must never produce a broken-image icon.
  im.addEventListener('error', () => im.remove(), {once:true});
  return im;
};
const choiceScenes = [
  ['prep-planner','recipes-foodbowl','rituals-journal','challenge-calendar'],
  ['prep-clock','recipes-soup','rituals-tea','challenge-trophy'],
  ['prep-clipboard','recipes-notebook','rituals-journal','challenge-seven'],
  ['prep-containers','recipes-soup','rituals-yoga','challenge-trophy']
];
const stepScenes = [
  ['prep-clock','prep-planner','prep-containers'],
  ['recipes-foodbowl','recipes-soup','recipes-notebook'],
  ['prep-clock','rituals-tea','rituals-yoga'],
  ['challenge-medal','challenge-apple','challenge-trophy']
];
const giftScenes = {
  plan: ['prep-mealbox','prep-planner','prep-containers'],
  variety: ['recipes-foodbowl','recipes-soup','recipes-notebook'],
  rhythm: ['rituals-tea','rituals-yoga','rituals-journal'],
  steady: ['challenge-apple','challenge-medal','challenge-trophy']
};
function illustrations(){
  if(!screen || !counter) return;
  const gift=screen.querySelector('.rm-gift-card');
  if(gift){
    if(gift.querySelector('.v16-reward-gallery'))return;
    const files=giftScenes[gift.dataset.gift] || giftScenes.plan;
    const figure=gift.querySelector('.rm-gift-cover');
    if(figure){
      const gallery=document.createElement('div');
      gallery.className='v16-reward-gallery';
      gallery.setAttribute('aria-hidden','true');
      files.forEach((key,i)=>gallery.append(art(key,'v16-reward-cutout v16-reward-cutout-'+i)));
      figure.append(gallery);
    }
    const bonus=screen.querySelector('.rm-bonus-strip');
    if(bonus && !bonus.querySelector('.v16-bonus-visual')){
      const bonusVisual=document.createElement('div');
      bonusVisual.className='v16-bonus-visual';
      bonusVisual.setAttribute('aria-hidden','true');
      bonusVisual.append(art('outdoors-coffee','v16-bonus-cutout'));
      bonus.append(bonusVisual);
    }
    return;
  }
  if(screen.querySelector('.rm-choice')){
    if(screen.querySelector('.v16-step-gallery'))return;
    const step=Math.max(0,Math.min(3,(Number.parseInt(counter.textContent,10)||1)-1));
    const desc=screen.querySelector('.rm-modal-desc');
    if(desc){
      const gallery=document.createElement('div');
      gallery.className='v16-step-gallery';
      gallery.setAttribute('aria-hidden','true');
      stepScenes[step].forEach((key,i)=>gallery.append(art(key,'v16-step-cutout v16-step-cutout-'+i)));
      desc.after(gallery);
    }
    screen.querySelectorAll('.rm-choice').forEach((button,i)=>{
      const icon=button.querySelector('.rm-choice-symbol');
      if(icon){icon.replaceChildren(art(choiceScenes[step][i],'v16-choice-cutout'));}
    });
    return;
  }
  if(screen.querySelector('.v10-quiz-start')&&!screen.querySelector('.v16-intro-gallery')){
    const marks=screen.querySelector('.qa-intro-marks');
    if(marks)marks.remove();
    const desc=screen.querySelector('.rm-modal-desc');
    if(desc){
      const gallery=document.createElement('div');
      gallery.className='v16-intro-gallery';
      gallery.setAttribute('aria-hidden','true');
      ['rituals-tea','recipes-foodbowl','prep-planner'].forEach((key,i)=>gallery.append(art(key,'v16-intro-cutout v16-intro-cutout-'+i)));
      desc.after(gallery);
    }
  }
}
if(screen && counter){
  new MutationObserver(illustrations).observe(screen,{childList:true});
  new MutationObserver(illustrations).observe(counter,{childList:true,subtree:true,characterData:true});
  illustrations();
}
// Nutrición clínica: illustrative visual cues, not medical diagrams.
const specialtyArt=['rewards-appleheart','recipes-foodbowl','rewards-book','rituals-tea','rituals-yoga','prep-clipboard'];
document.querySelectorAll('.v10-specialty').forEach((card,i)=>{
  const span=card.querySelector('.v10-specialty-symbol');
  if(span && specialtyArt[i])span.replaceChildren(art(specialtyArt[i],'v16-specialty-cutout'));
});
const approach=document.querySelector('.v10-approach-lead');
if(approach && !approach.querySelector('.v16-approach-gallery')){
  const gallery=document.createElement('div');gallery.className='v16-approach-gallery';gallery.setAttribute('aria-hidden','true');
  gallery.append(art('prep-waterbottle'),art('rituals-journal'));
  approach.append(gallery);
}
