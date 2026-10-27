/**
 * ROSELA / EXPERIENCES — Progressive enhancement for GitHub Pages.
 * START is a non-clinical, in-memory reflective exercise. No answers leave the browser.
 */

const root = document.createElement('div');
root.innerHTML = 
  '<div class="rm-overlay rm-overlay-quiz" id="rm-quiz-modal" hidden>' +
    '<div class="rm-modal" role="dialog" aria-modal="true" aria-labelledby="rm-quiz-title" tabindex="-1">' +
      '<button class="rm-modal-close" type="button" data-close-modal aria-label="Cerrar test">×</button>' +
      '<div class="rm-modal-aside" aria-hidden="true"><span>UN DETALLE PARA TI · RM</span></div>' +
      '<div class="rm-modal-content"><div class="rm-modal-top"><span>START / BY ROSELA MIRANDA</span><span id="rm-quiz-counter">01 / 04</span></div>' +
        '<div class="rm-modal-progress"><span id="rm-quiz-progress"></span></div><div id="rm-quiz-screen" aria-live="polite"></div>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div class="rm-overlay rm-overlay-contact" id="rm-contact-modal" hidden>' +
    '<div class="rm-modal rm-modal-contact" role="dialog" aria-modal="true" aria-labelledby="rm-contact-title" tabindex="-1">' +
      '<button class="rm-modal-close" type="button" data-close-modal aria-label="Cerrar contacto">×</button>' +
      '<div class="rm-modal-content"><p class="eyebrow">UN MENSAJE PARA ROSELA</p><h2 id="rm-contact-title">Empecemos a <em>conversar.</em></h2><p class="rm-modal-desc">Déjame tus datos de contacto y tu pregunta. Este canal se encuentra en preparación y todavía no envía mensajes.</p>' +
        '<form data-contact-form novalidate><input type="hidden" name="source" value="modal">' +
        '<div class="form-row"><label for="rm-contact-name">Tu nombre</label><input id="rm-contact-name" type="text" name="name" autocomplete="name" maxlength="100" required placeholder="¿Cómo te llamas?"></div>' +
        '<div class="form-row"><label for="rm-contact-email">Tu correo</label><input id="rm-contact-email" type="email" name="email" autocomplete="email" maxlength="160" required placeholder="hola@ejemplo.com"></div>' +
        '<div class="form-row"><label for="rm-contact-message">Tu mensaje</label><textarea id="rm-contact-message" name="message" required minlength="10" maxlength="1200" rows="3" placeholder="Me gustaría conocer las modalidades de consulta..."></textarea></div>' +
        '<p class="rm-modal-legal">No incluyas información clínica. El envío se habilitará después de verificar el correo receptor y aprobar el aviso de privacidad.</p>' +
        '<button type="submit" class="button button-primary">Enviar mensaje <span class="button-icon" aria-hidden="true">↗</span></button><p data-form-status class="form-status" role="status"></p></form>' +
      '</div>' +
    '</div>' +
  '</div>';
document.body.append(...root.children);
const quizModal = document.getElementById('rm-quiz-modal');
const contactModal = document.getElementById('rm-contact-modal');
let active = null, opener = null;
const focusable = 'button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
function openModal(modal) {
  const returnFocus = active ? opener : document.activeElement;
  if (active) closeModal(false);
  opener = returnFocus;
  active = modal;
  modal.hidden = false;
  document.body.classList.add('rm-modal-open');
  requestAnimationFrame(() => {
    modal.classList.add('is-open');
    modal.querySelector('.rm-modal-close')?.focus({preventScroll:true});
  });
}
function closeModal(restore = true) {
  if (!active) return;
  const was = active;
  was.classList.remove('is-open');
  was.hidden = true;
  active = null;
  document.body.classList.remove('rm-modal-open');
  if (restore) opener?.focus?.({preventScroll:true});
}
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-open-quiz],[data-open-contact],a[href="start/"],a[href$="/start/"],a[href$="#contacto"]');
  if (trigger) {
    event.preventDefault();
    if (trigger.matches('[data-open-contact],a[href$="#contacto"]')) openModal(contactModal);
    else { resetQuiz(); openModal(quizModal); }
  }
  if (event.target.matches('[data-close-modal]') || event.target.classList.contains('rm-overlay')) closeModal();
});
document.addEventListener('keydown', event => {
  if (!active) return;
  if (event.key === 'Escape') { event.preventDefault(); closeModal(); return; }
  if (event.key !== 'Tab') return;
  const list = [...active.querySelectorAll(focusable)].filter(el => el.getClientRects().length);
  if (!list.length) return;
  if (event.shiftKey && document.activeElement === list[0]) { event.preventDefault(); list.at(-1).focus(); }
  else if (!event.shiftKey && document.activeElement === list.at(-1)) { event.preventDefault(); list[0].focus(); }
});
const options = [
 {title:'¿Qué te gustaría hacer más sencillo?',choices:[['Organizar mis comidas de la semana','plan','◫'],['Comer más rico y más variado','variety','✿'],['Encontrar tiempo para cuidarme','rhythm','◷'],['Mantener los cambios que empiezo','steady','✦']]},
 {title:'¿Qué te cuesta más trabajo?',choices:[['No saber qué voy a comer','plan','◫'],['Repetir siempre lo mismo','variety','✿'],['Mis horarios cambiantes o comer fuera de casa','rhythm','◷'],['Ser constante','steady','✦']]},
 {title:'¿Cuándo buscas más claridad?',choices:[['Al preparar la semana','plan','◫'],['Al decidir qué cocinar','variety','✿'],['En los días ocupados','rhythm','◷'],['Cuando vuelvo a empezar','steady','✦']]},
 {title:'¿Cuál sería un buen comienzo para ti?',choices:[['Preparar mis comidas con anticipación','plan','◫'],['Probar recetas nuevas y sencillas','variety','✿'],['Hacer espacio para moverme y descansar','rhythm','◷'],['Elegir un hábito pequeño y repetirlo','steady','✦']]}
];
const gifts = {
 plan:{title:'Planear también es cuidarte',description:'Cuando tu semana tiene una base, comer bien deja de depender de la fuerza de voluntad. Una hora de preparación puede resolverte varios días.',tip:'Elige un día fijo para planear tus comidas y hacer tu lista de compras.',reward:'Meal prep: organiza tu semana en una hora',file:'RM_Regalo_MealPrep.pdf'},
 variety:{title:'Comer sano también es comer rico',description:'Una alimentación saludable no tiene que ser aburrida ni complicada. Con pocos ingredientes y combinaciones sencillas puedes comer variado, nutritivo y delicioso.',tip:'Esta semana prueba una receta nueva y agrega un alimento que no hayas comido en el último mes.',reward:'Recetario saludable y sencillo',file:'RM_Regalo_Recetario.pdf'},
 rhythm:{title:'Tu bienestar también cabe en tu agenda',description:'No necesitas horas libres para cuidarte. Pequeños bloques de tiempo y rituales sencillos pueden sostener tu energía incluso en los días más ocupados.',tip:'Agenda 10 minutos de movimiento como si fuera una cita contigo.',reward:'Encuentra tu tiempo: rituales para días ocupados',file:'RM_Regalo_Rituales.pdf'},
 steady:{title:'A tu propio ritmo',description:'No todos los cambios necesitan ser grandes para que valga la pena intentarlos. La constancia se construye con acciones pequeñas que puedes repetir.',tip:'Elige una acción tan sencilla que puedas repetirla incluso en un día ocupado.',reward:'Reto de 7 días: los 5 pilares de la buena salud',file:'RM_Regalo_Reto7Dias.pdf'}
};
const bonusFile='RM_Bonus_ComerFuera.pdf';
// All five downloadable PDFs are now published; quiz answers stay in memory.
let step = 0, selected = [], gift = null, giftId = 'plan', introDone = false;
const screen = document.getElementById('rm-quiz-screen');
const progress = document.getElementById('rm-quiz-progress');
const counter = document.getElementById('rm-quiz-counter');
function resetQuiz(){step=0;selected=[];gift=null;introDone=false;renderQuiz();}
function focusQuizHeading(){
  const pane=quizModal.querySelector('.rm-modal');
  if(pane)pane.scrollTop=0;
  const heading=screen.querySelector('#rm-quiz-title');
  if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
}
function renderQuizIntro(){
  progress.style.width='0%';
  counter.textContent='TEST DE HÁBITOS';
  screen.replaceChildren();
  const kicker=document.createElement('p');kicker.className='eyebrow';kicker.textContent='TEST DE HÁBITOS / ROSELA MIRANDA';
  const h=document.createElement('h2');h.id='rm-quiz-title';h.textContent='Cuatro preguntas para empezar a tu ritmo.';
  const description=document.createElement('p');description.className='rm-modal-desc';
  description.textContent='Responde con lo primero que pienses y recibe un regalo con ideas prácticas para comer mejor y cuidarte en tu día a día.';
  const btn=document.createElement('button');btn.type='button';btn.className='button button-primary v10-quiz-start';btn.textContent='Comenzar ↗';
  btn.addEventListener('click',()=>{introDone=true;renderQuiz();});
  screen.append(kicker,h,description,btn);
}
function renderQuiz(){
  if(!introDone){renderQuizIntro();return;}
  progress.style.width = Math.round((step/options.length)*100)+'%';
  counter.textContent = step<options.length?String(step+1).padStart(2,'0')+' / 04':'TU DETALLE';
  screen.replaceChildren();
  if(step === options.length){renderGift();return;}
  const question = options[step];
  const heading=document.createElement('h2');
  heading.id='rm-quiz-title'; heading.textContent=question.title;
  const intro=document.createElement('p');
  intro.className='rm-modal-desc';intro.textContent='No hay respuestas buenas o malas. Elige lo que más se parezca a ti.';
  const grid=document.createElement('div');grid.className='rm-choices';
  question.choices.forEach(([text,kind,icon])=>{
    const btn=document.createElement('button');btn.type='button';btn.className='rm-choice';
    btn.setAttribute('aria-pressed',String(selected[step]===kind));
    const mark=document.createElement('span');mark.className='rm-choice-symbol';mark.textContent=icon;
    const label=document.createElement('span');label.textContent=text;
    btn.append(mark,label);
    btn.addEventListener('click',()=>{
      selected[step]=kind;
      grid.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));
      btn.setAttribute('aria-pressed','true');
      next.disabled=false;
    });
    grid.append(btn);
  });
  const controls=document.createElement('div');controls.className='rm-quiz-controls';
  const back=document.createElement('button');back.type='button';back.className='rm-quiet';back.textContent=step?'← Anterior':'Cerrar';
  back.addEventListener('click',()=>{if(!step)closeModal();else{step--;renderQuiz();}});
  const next=document.createElement('button');next.type='button';next.className='button button-primary';next.disabled=!selected[step];
  next.textContent=step===options.length-1?'Recibir mi regalo ↗':'Continuar ↗';
  next.addEventListener('click',()=>{if(!selected[step])return;step++;renderQuiz();});
  controls.append(back,next);screen.append(heading,intro,grid,controls);
  focusQuizHeading();
}
function renderGift(){
  const counts={plan:0,variety:0,rhythm:0,steady:0};
  selected.forEach(x=>{counts[x]++;});
  const max=Math.max(...Object.values(counts));
  const tied=Object.keys(counts).filter(key=>counts[key]===max);
  // Approved rule: among tied icons, question four breaks the tie.
  const code=tied.includes(selected[3])?selected[3]:tied[0];
  gift=gifts[code];giftId=code;
  const eyebrow=document.createElement('p');eyebrow.className='eyebrow rm-reward-kicker';eyebrow.textContent='COMPLETASTE TU TEST DE HÁBITOS';
  const heading=document.createElement('h2');heading.id='rm-quiz-title';heading.textContent='¡Tu regalo está listo!';
  const welcome=document.createElement('p');welcome.className='rm-reward-intro';welcome.textContent='Un detalle de Rosela, elegido para que empieces a cuidarte a tu ritmo.';
  const giftSubtitle=document.createElement('h3');giftSubtitle.className='rm-gift-subtitle';giftSubtitle.textContent=gift.title;
  const wrap=document.createElement('div');wrap.className='rm-gift-card';
  const emblem=document.createElement('span');emblem.className='rm-gift-symbol';emblem.textContent=({plan:'◫',variety:'✿',rhythm:'◷',steady:'✦'})[giftId];wrap.dataset.gift=giftId;
  const desc=document.createElement('p');desc.textContent=gift.description;
  const label=document.createElement('strong');label.textContent='UNA IDEA PARA EMPEZAR';
  const tip=document.createElement('p');tip.textContent=gift.tip;
  
  const copy=document.createElement('div');copy.className='rm-gift-copy';
  copy.append(emblem,giftSubtitle,desc,label,tip);
  const preview=document.createElement('figure');preview.className='rm-gift-cover';
  const previewImg=document.createElement('div');previewImg.className='rm-gift-document-icon';previewImg.setAttribute('aria-hidden','true');
  const caption=document.createElement('figcaption');caption.textContent='TU GUÍA PERSONALIZADA';
  preview.append(previewImg,caption);
  wrap.append(copy,preview);
  const note=document.createElement('p');note.className='rm-modal-legal';note.textContent='Este recurso es educativo y no evalúa tu salud ni sustituye una consulta.';
  

  const controls=document.createElement('div');controls.className='rm-gift-controls';
  
  // Single download per reward, always inside the card — no optional script relocation.
  const save=document.createElement('a');save.className='button button-primary rm-pdf-download rm-reward-cta';
  save.href=new URL('../gifts/'+gift.file,import.meta.url).href;save.download=gift.file;
  const rewardName=({plan:'Descargar mi guía de meal prep',variety:'Descargar mi recetario saludable',rhythm:'Descargar mis rituales de bienestar',steady:'Descargar mi reto de 7 días'})[giftId];
  const rewardPages=({plan:4,variety:6,rhythm:4,steady:4})[giftId];
  save.setAttribute('aria-label',rewardName+', PDF gratuito de '+rewardPages+' páginas');
  const saveIcon=document.createElement('span');saveIcon.className='rm-reward-cta-icon';saveIcon.setAttribute('aria-hidden','true');
  saveIcon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/></svg>';
  const saveCopy=document.createElement('span');saveCopy.className='rm-reward-cta-copy';
  const saveTitle=document.createElement('span');saveTitle.className='rm-reward-cta-title';saveTitle.textContent=rewardName;
  const saveMeta=document.createElement('small');saveMeta.className='rm-reward-cta-meta';saveMeta.textContent='Tu PDF de regalo · '+rewardPages+' páginas · gratis';
  saveCopy.append(saveTitle,saveMeta);
  const saveArrow=document.createElement('span');saveArrow.className='rm-reward-cta-arrow';saveArrow.setAttribute('aria-hidden','true');saveArrow.textContent='↗';
  save.append(saveIcon,saveCopy,saveArrow);
  const download=document.createElement('div');download.className='rm-reward-download qa-gift-action';
  const actionTitle=document.createElement('p');actionTitle.className='rm-reward-download-label';actionTitle.textContent='TU OBSEQUIO PERSONALIZADO';
  const reassurance=document.createElement('p');reassurance.className='rm-reward-reassurance';reassurance.textContent='Es tuyo. Sin registro ni correo, para que lo tengas a mano.';
  download.append(actionTitle,save,reassurance);
  wrap.append(download);
  const again=document.createElement('button');again.type='button';again.className='rm-quiet';again.textContent='Volver a empezar';again.addEventListener('click',resetQuiz);
  const contact=document.createElement('button');contact.type='button';contact.className='rm-quiet';contact.textContent='Escribirle a Rosela ↗';
  contact.addEventListener('click',()=>openModal(contactModal));
  
  const bonus=document.createElement('aside');bonus.className='rm-bonus-strip';
  const bonusThumb=document.createElement('span');bonusThumb.className='rm-bonus-document-icon';bonusThumb.setAttribute('aria-hidden','true');
  const bonusCopy=document.createElement('div');
  const bonusLabel=document.createElement('strong');bonusLabel.textContent='Y además, un bonus para ti.';
  const bonusText=document.createElement('p');bonusText.textContent='Comer saludable fuera de casa: una guía práctica para llevar contigo.';
  const bonusLink=document.createElement('a');bonusLink.className='rm-bonus-link';bonusLink.textContent='Descargar bonus PDF ↗';bonusLink.href=new URL('../gifts/'+bonusFile,import.meta.url).href;bonusLink.download=bonusFile;
  bonusCopy.append(bonusLabel,bonusText,bonusLink);bonus.append(bonusThumb,bonusCopy);
  controls.append(again,contact);screen.append(eyebrow,heading,welcome,wrap,bonus,note,controls);
  focusQuizHeading();
}
// All takeaways are provided as editorial PDF files; legacy PNG export removed.
const params = new URLSearchParams(location.search);
if(params.get('test')==='open') {
  resetQuiz();openModal(quizModal);
  history.replaceState(null,'',location.pathname+location.hash);
}
