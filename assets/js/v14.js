/* QA release: visual hierarchy without badly isolated sticker images.
   Existing answer scoring, PDF links, and privacy behavior remain in experience.js. */
const screen=document.getElementById('rm-quiz-screen');
const counter=document.getElementById('rm-quiz-counter');
function enhanceQuiz(){
  if(!screen || !counter)return;
  const card=screen.querySelector('.rm-gift-card');
  if(card){
    if(card.dataset.qaEnhanced==='true')return;
    card.dataset.qaEnhanced='true';
    const heading=screen.querySelector('#rm-quiz-title');
    if(heading)heading.textContent='Un comienzo hecho para ti.';
    const eyebrow=screen.querySelector('.eyebrow');
    if(eyebrow)eyebrow.textContent='TU TEST DE HÁBITOS · RESULTADO';
    const preview=card.querySelector('.rm-gift-cover>img');
    if(preview)preview.loading='eager';
    const action=screen.querySelector('.rm-gift-controls .rm-pdf-download');
    if(action){
      const text=action.textContent.replace(/\s*[↓↗]\s*$/u,'').trim();
      const footer=document.createElement('div');footer.className='qa-gift-action';
      const label=document.createElement('p');label.className='qa-download-label';label.textContent='TU OBSEQUIO · PDF PARA DESCARGAR';
      const icon=document.createElement('span');icon.className='qa-download-icon';icon.textContent='↓';icon.setAttribute('aria-hidden','true');
      const words=document.createElement('span');words.className='qa-download-text';words.textContent=text;
      const arrow=document.createElement('span');arrow.className='qa-download-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
      action.replaceChildren(icon,words,arrow);
      action.setAttribute('aria-label',text+' (PDF)');
      footer.append(label,action);card.append(footer);
    }
    const bonus=screen.querySelector('.rm-bonus-strip');
    if(bonus){
      const line=document.createElement('p');line.className='qa-bonus-heading';line.textContent='UN EXTRA PARA TODAS LAS PERSONAS';
      bonus.before(line);
    }
    return;
  }
  if(screen.querySelector('.rm-choice')){
    if(screen.querySelector('.qa-step-kicker'))return;
    const h=screen.querySelector('#rm-quiz-title');
    if(h){
      const label=document.createElement('p');label.className='qa-step-kicker';
      label.textContent='UNA PREGUNTA A LA VEZ';
      h.before(label);
    }
    return;
  }
  if(screen.querySelector('.v10-quiz-start')){
    if(screen.querySelector('.qa-intro-marks'))return;
    const desc=screen.querySelector('.rm-modal-desc');if(!desc)return;
    const group=document.createElement('div');group.className='qa-intro-marks';group.setAttribute('aria-hidden','true');
    for(const sign of ['◫','✿','◷','✦']){const span=document.createElement('span');span.textContent=sign;group.append(span);}
    desc.after(group);
  }
}
if(screen && counter){
  const observer=new MutationObserver(enhanceQuiz);
  observer.observe(screen,{childList:true});
  enhanceQuiz();
}