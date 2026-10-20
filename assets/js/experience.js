/**
 * ROSELA / EXPERIENCES — Progressive enhancement for GitHub Pages.
 * START is a non-clinical, in-memory reflective exercise. No answers leave the browser.
 */
const leaf = new URL('../images/leaf-02.webp', import.meta.url).href;
const root = document.createElement('div');
root.innerHTML = 
  '<div class="rm-overlay rm-overlay-quiz" id="rm-quiz-modal" hidden>' +
    '<div class="rm-modal" role="dialog" aria-modal="true" aria-labelledby="rm-quiz-title" tabindex="-1">' +
      '<button class="rm-modal-close" type="button" data-close-modal aria-label="Cerrar test">×</button>' +
      '<div class="rm-modal-aside" aria-hidden="true"><img src="'+leaf+'" alt="" width="420" height="500"><span>UN DETALLE PARA TI · RM</span></div>' +
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
  if (active) closeModal(false);
  opener = document.activeElement;
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
  {title:'¿Qué te gustaría hacer más sencillo?',choices:[['Organizar mis comidas','plan','◫'],['Comer con más variedad','variety','✿'],['Encontrar un ritmo propio','rhythm','◷'],['Mantener pequeños cambios','steady','✧']]},
  {title:'¿Qué te cuesta más trabajo?',choices:[['La falta de tiempo','plan','◫'],['Repetir siempre lo mismo','variety','✿'],['Los horarios cambiantes','rhythm','◷'],['Ser constante','steady','✧']]},
  {title:'¿Cuándo buscas más claridad?',choices:[['Al preparar la semana','plan','◫'],['Al decidir qué comer','variety','✿'],['En los días ocupados','rhythm','◷'],['Cuando vuelvo a empezar','steady','✧']]},
  {title:'¿Cuál sería un buen comienzo?',choices:[['Planificar algo pequeño','plan','◫'],['Explorar otra opción','variety','✿'],['Observar mi rutina','rhythm','◷'],['Elegir una acción posible','steady','✧']]}
];
const gifts = {
  plan: {title:'Organización sin rigidez',description:'Un punto de partida puede ser hacer espacio para planear sin buscar la perfección.',tip:'Elige una sola comida de la semana que quieras dejar pensada con anticipación.'},
  variety: {title:'Curiosidad por explorar',description:'Tal vez lo que necesitas es volver a sentir curiosidad por tus opciones cotidianas.',tip:'Anota dos preparaciones que te gustaría descubrir, sin obligación de probarlas hoy.'},
  rhythm: {title:'Un ritmo más tuyo',description:'Tus horarios reales merecen ser considerados cuando piensas en tus hábitos.',tip:'Observa durante dos días qué momentos te resultan más cómodos para comer.'},
  steady: {title:'Constancia realista',description:'No todos los cambios necesitan ser grandes para que valga la pena intentarlos.',tip:'Elige una acción tan sencilla que puedas repetirla incluso en un día ocupado.'}
};
let step = 0, selected = [], gift = null;
const screen = document.getElementById('rm-quiz-screen');
const progress = document.getElementById('rm-quiz-progress');
const counter = document.getElementById('rm-quiz-counter');
function resetQuiz(){step=0;selected=[];gift=null;renderQuiz();}
function renderQuiz(){
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
  next.textContent=step===options.length-1?'Recibir mi detalle ↗':'Continuar ↗';
  next.addEventListener('click',()=>{if(!selected[step])return;step++;renderQuiz();});
  controls.append(back,next);screen.append(heading,intro,grid,controls);
}
function renderGift(){
  const counts={plan:0,variety:0,rhythm:0,steady:0};
  selected.forEach(x=>{counts[x]++;});
  const code=Object.keys(counts).sort((a,b)=>counts[b]-counts[a]||(a===selected[0]?-1:b===selected[0]?1:0))[0];
  gift=gifts[code];
  const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent='UN DETALLE DE ROSELA PARA TI';
  const heading=document.createElement('h2');heading.id='rm-quiz-title';heading.textContent=gift.title;
  const wrap=document.createElement('div');wrap.className='rm-gift-card';
  const emblem=document.createElement('span');emblem.className='rm-gift-symbol';emblem.textContent='✿';
  const desc=document.createElement('p');desc.textContent=gift.description;
  const label=document.createElement('strong');label.textContent='UNA IDEA PARA EMPEZAR';
  const tip=document.createElement('p');tip.textContent=gift.tip;
  wrap.append(emblem,desc,label,tip);
  const note=document.createElement('p');note.className='rm-modal-legal';note.textContent='Este regalo es educativo y no evalúa tu salud ni sustituye una consulta.';
  const controls=document.createElement('div');controls.className='rm-gift-controls';
  const save=document.createElement('button');save.type='button';save.className='button button-primary';save.textContent='Guardar mi detalle ↓';save.addEventListener('click',saveGift);
  const again=document.createElement('button');again.type='button';again.className='rm-quiet';again.textContent='Volver a empezar';again.addEventListener('click',resetQuiz);
  const contact=document.createElement('button');contact.type='button';contact.className='rm-quiet';contact.textContent='Escribirle a Rosela ↗';
  contact.addEventListener('click',()=>openModal(contactModal));
  controls.append(save,again,contact);screen.append(eyebrow,heading,wrap,note,controls);
}
async function saveGift(){
  if(!gift)return;
  try{await document.fonts.ready;}catch{}
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  ctx.fillStyle='#f4f2ec';ctx.fillRect(0,0,1080,1350);
  ctx.strokeStyle='#cbd2c6';ctx.lineWidth=3;ctx.strokeRect(52,52,976,1246);
  ctx.fillStyle='#d4a084';ctx.font='110px Georgia,serif';ctx.fillText('✿',95,240);
  ctx.fillStyle='#6b776b';ctx.font='600 27px Arial,sans-serif';ctx.fillText('UN DETALLE PARA TI',105,340);
  ctx.fillStyle='#435143';ctx.font='76px Georgia,serif';
  function lines(text,x,y,maxWidth,lineHeight,maxLines){const words=text.split(' ');let line='',printed=0;for(const w of words){const test=line?line+' '+w:w;if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,y);y+=lineHeight;printed++;if(printed>=maxLines)return y;line=w;}else line=test;}if(line){ctx.fillText(line,x,y);y+=lineHeight;}return y;}
  let y=lines(gift.title,105,470,850,88,3);
  ctx.fillStyle='#687768';ctx.font='33px Arial,sans-serif';y=lines(gift.description,105,y+65,850,49,4);
  ctx.strokeStyle='#d6c3b7';ctx.beginPath();ctx.moveTo(105,y+65);ctx.lineTo(975,y+65);ctx.stroke();
  ctx.fillStyle='#bb8066';ctx.font='600 26px Arial,sans-serif';ctx.fillText('UNA IDEA PARA EMPEZAR',105,y+140);
  ctx.fillStyle='#4b5a4b';ctx.font='35px Arial,sans-serif';lines(gift.tip,105,y+220,850,52,5);
  ctx.fillStyle='#788278';ctx.font='25px Arial,sans-serif';ctx.fillText('ROSELA MIRANDA  /  START',105,1195);
  ctx.font='19px Arial,sans-serif';ctx.fillText('Reflexión educativa · No es una evaluación clínica',105,1243);
  canvas.toBlob(blob=>{
    if(!blob)return;
    const url=URL.createObjectURL(blob);const link=document.createElement('a');
    link.href=url;link.download='mi-detalle-rosela-miranda.png';document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),3000);
  },'image/png');
}
const params = new URLSearchParams(location.search);
if(params.get('test')==='open') {
  resetQuiz();openModal(quizModal);
  history.replaceState(null,'',location.pathname+location.hash);
}
