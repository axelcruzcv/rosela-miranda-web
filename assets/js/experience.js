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
  steady: {title:'A tu propio ritmo',description:'No todos los cambios necesitan ser grandes para que valga la pena intentarlos.',tip:'Elige una acción tan sencilla que puedas repetirla incluso en un día ocupado.'}
};
let step = 0, selected = [], gift = null, giftId = 'plan';
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
  gift=gifts[code];giftId=code;
  const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent='UN DETALLE DE ROSELA PARA TI';
  const heading=document.createElement('h2');heading.id='rm-quiz-title';heading.textContent='Tu tip.';
  const giftSubtitle=document.createElement('h3');giftSubtitle.className='rm-gift-subtitle';giftSubtitle.textContent=gift.title;
  const wrap=document.createElement('div');wrap.className='rm-gift-card';
  const emblem=document.createElement('span');emblem.className='rm-gift-symbol';emblem.textContent=({plan:'◫',variety:'❀',rhythm:'◌',steady:'✧'})[giftId];wrap.dataset.gift=giftId;
  const desc=document.createElement('p');desc.textContent=gift.description;
  const label=document.createElement('strong');label.textContent='UNA IDEA PARA EMPEZAR';
  const tip=document.createElement('p');tip.textContent=gift.tip;
  wrap.append(emblem,giftSubtitle,desc,label,tip);
  const note=document.createElement('p');note.className='rm-modal-legal';note.textContent='Este regalo es educativo y no evalúa tu salud ni sustituye una consulta.';
  const controls=document.createElement('div');controls.className='rm-gift-controls';
  const save=document.createElement('button');save.type='button';save.className='button button-primary';save.textContent='Descargar mi regalo ↓';save.addEventListener('click',saveGift);
  const again=document.createElement('button');again.type='button';again.className='rm-quiet';again.textContent='Volver a empezar';again.addEventListener('click',resetQuiz);
  const contact=document.createElement('button');contact.type='button';contact.className='rm-quiet';contact.textContent='Escribirle a Rosela ↗';
  contact.addEventListener('click',()=>openModal(contactModal));
  controls.append(save,again,contact);screen.append(eyebrow,heading,wrap,note,controls);
}
async function saveGift() {
  if (!gift) return;
  try { await document.fonts.ready; } catch {}
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const themes = {
    plan: {background:'#f6f1e9',ink:'#344839',accent:'#c39176',rule:'#d1c6b8',caption:'#737c6d'},
    variety: {background:'#e5edf2',ink:'#324c71',accent:'#4e6691',rule:'#b9c9d8',caption:'#637c97'},
    rhythm: {background:'#eee1e0',ink:'#663c47',accent:'#7b4a53',rule:'#d5c0c4',caption:'#865c66'},
    steady: {background:'#293a32',ink:'#edf0e8',accent:'#d3ab92',rule:'#6d8071',caption:'#bec8ba'}
  };
  const theme = themes[giftId] || themes.plan;
  ctx.fillStyle=theme.background;
  ctx.fillRect(0,0,1080,1350);
  ctx.strokeStyle=theme.rule;
  ctx.lineWidth=2;
  ctx.strokeRect(55,55,970,1240);
  ctx.save();
  ctx.translate(540,302);
  // Four distinct generative illustrations, one per result.
  if (giftId==='plan') {
    for(let i=0;i<7;i++){
      ctx.beginPath();ctx.lineWidth=5-i*.3;
      ctx.strokeStyle=i%2?theme.accent:theme.rule;
      ctx.arc(0,0,95+i*20,Math.PI*1.08,Math.PI*1.92);
      ctx.stroke();
    }
    for(let i=-2;i<3;i++)for(let j=-1;j<2;j++){
      ctx.beginPath();ctx.fillStyle=theme.accent;
      ctx.arc(i*45,j*45+90,4+(i+j+4)%4,0,Math.PI*2);ctx.fill();
    }
  } else if (giftId==='variety'){
    for(let i=0;i<9;i++){
      ctx.save();ctx.rotate(i*Math.PI*2/9);
      ctx.fillStyle=i%2?theme.accent:'#a9bacf';
      ctx.beginPath();ctx.ellipse(0,-94,42,108,0,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle=theme.background;ctx.beginPath();ctx.arc(0,0,43,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=theme.ink;ctx.beginPath();ctx.arc(0,0,38,0,Math.PI*2);ctx.stroke();
  } else if (giftId==='rhythm') {
    for(let i=0;i<7;i++){
      ctx.beginPath();ctx.strokeStyle=i%2?theme.accent:'#b18c95';ctx.lineWidth=5;
      const y=(i-3)*35;
      ctx.moveTo(-220,y);
      ctx.bezierCurveTo(-100,y-68,15,y+68,230,y);
      ctx.stroke();
    }
    ctx.beginPath();ctx.fillStyle=theme.ink;ctx.arc(155,-120,18,0,Math.PI*2);ctx.fill();
  } else {
    ctx.strokeStyle=theme.accent;ctx.lineWidth=7;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(-130,160);ctx.bezierCurveTo(0,100,65,-70,145,-165);ctx.stroke();
    for(let i=0;i<5;i++){
      const x=-112+i*55;const y=154-i*63;
      for(const side of [-1,1]){
        ctx.save();ctx.translate(x,y);ctx.rotate(side*.75);
        ctx.fillStyle=side>0?'#a8b6a4':'#d5bea7';
        ctx.beginPath();ctx.ellipse(0,-40,19,50,0,0,Math.PI*2);ctx.fill();ctx.restore();
      }
    }
  }
  ctx.restore();
  ctx.fillStyle=theme.caption;
  ctx.font='600 22px Arial,sans-serif';
  ctx.textAlign='center';
  ctx.fillText('ROSELA MIRANDA  /  START',540,108);
  ctx.fillStyle=theme.ink;
  ctx.font='400 95px Georgia,serif';
  ctx.fillText('Tu tip.',540,590);
  ctx.font='400 48px Georgia,serif';
  ctx.fillStyle=theme.accent;
  ctx.fillText(gift.title,540,660,930);
  ctx.textAlign='left';
  const wrap=(text,x,y,width,height,limit=8)=>{
    let line='',count=0;
    for(const word of String(text).split(/\s+/)){
      const trial=line?line+' '+word:word;
      if(ctx.measureText(trial).width>width && line){
        ctx.fillText(line,x,y);y+=height;count++;
        if(count>=limit)return y;
        line=word;
      }else line=trial;
    }
    if(line){ctx.fillText(line,x,y);y+=height;}
    return y;
  };
  ctx.font='29px Arial,sans-serif';
  ctx.fillStyle=theme.caption;
  let y=wrap(gift.description,145,760,790,48,4);
  ctx.strokeStyle=theme.rule;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(145,y+24);ctx.lineTo(935,y+24);ctx.stroke();
  ctx.fillStyle=theme.accent;ctx.font='600 20px Arial,sans-serif';
  ctx.fillText('UNA IDEA PARA HOY',145,y+78);
  ctx.fillStyle=theme.ink;ctx.font='31px Arial,sans-serif';
  wrap(gift.tip,145,y+130,790,49,4);
  ctx.fillStyle=theme.caption;
  ctx.font='18px Arial,sans-serif';
  ctx.fillText('Una reflexión educativa. No es un diagnóstico ni una consulta.',145,1225);
  ctx.fillText('UN DETALLE, SOLO PARA TI.',145,1262);
  canvas.toBlob(blob=>{
    if(!blob)return;
    const blobUrl=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=blobUrl;a.download='rosela-miranda-tu-tip-'+giftId+'.png';
    document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(blobUrl),3000);
  },'image/png');
}
const params = new URLSearchParams(location.search);
if(params.get('test')==='open') {
  resetQuiz();openModal(quizModal);
  history.replaceState(null,'',location.pathname+location.hash);
}
