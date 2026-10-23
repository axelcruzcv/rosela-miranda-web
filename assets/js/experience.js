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
// The official gift and bonus PDFs must be uploaded before offering their downloads.
// Until then the photo-rich on-screen tip can be saved honestly as an illustrative PNG.
let step = 0, selected = [], gift = null, giftId = 'plan', introDone = false;
const screen = document.getElementById('rm-quiz-screen');
const progress = document.getElementById('rm-quiz-progress');
const counter = document.getElementById('rm-quiz-counter');
function resetQuiz(){step=0;selected=[];gift=null;introDone=false;renderQuiz();}
function renderQuizIntro(){
  progress.style.width='0%';
  counter.textContent='START';
  screen.replaceChildren();
  const kicker=document.createElement('p');kicker.className='eyebrow';kicker.textContent='START / BY ROSELA MIRANDA';
  const h=document.createElement('h2');h.id='rm-quiz-title';h.textContent='Cuatro preguntas para empezar a tu ritmo.';
  const description=document.createElement('p');description.className='rm-modal-desc';
  description.textContent='Responde con lo primero que pienses y recibe un regalo con ideas prácticas para comer mejor y cuidarte en tu día a día.';
  const btn=document.createElement('button');btn.type='button';btn.className='button button-primary v10-quiz-start';btn.textContent='Comenzar ↗';
  btn.addEventListener('click',()=>{introDone=true;renderQuiz()});
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
}
function renderGift(){
  const counts={plan:0,variety:0,rhythm:0,steady:0};
  selected.forEach(x=>{counts[x]++;});
  const max=Math.max(...Object.values(counts));
  const tied=Object.keys(counts).filter(key=>counts[key]===max);
  // Approved rule: among tied icons, question four breaks the tie.
  const code=tied.includes(selected[3])?selected[3]:tied[0];
  gift=gifts[code];giftId=code;
  const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent='UN DETALLE DE ROSELA PARA TI';
  const heading=document.createElement('h2');heading.id='rm-quiz-title';heading.textContent='Tu tip.';
  const giftSubtitle=document.createElement('h3');giftSubtitle.className='rm-gift-subtitle';giftSubtitle.textContent=gift.title;
  const wrap=document.createElement('div');wrap.className='rm-gift-card';
  const emblem=document.createElement('span');emblem.className='rm-gift-symbol';emblem.textContent=({plan:'◫',variety:'✿',rhythm:'◷',steady:'✦'})[giftId];wrap.dataset.gift=giftId;
  const desc=document.createElement('p');desc.textContent=gift.description;
  const label=document.createElement('strong');label.textContent='UNA IDEA PARA EMPEZAR';
  const tip=document.createElement('p');tip.textContent=gift.tip;
  
  const copy=document.createElement('div');copy.className='rm-gift-copy';
  copy.append(emblem,giftSubtitle,desc,label,tip);
  const preview=document.createElement('figure');preview.className='rm-gift-cover';
  const previewImg=document.createElement('img');
  previewImg.src=new URL('../images/gifts/'+gift.file.replace('.pdf','.webp'),import.meta.url).href;
  previewImg.alt='Vista previa de '+gift.reward;previewImg.width=410;previewImg.height=580;previewImg.loading='lazy';previewImg.decoding='async';
  const caption=document.createElement('figcaption');caption.textContent='TU GUÍA PERSONALIZADA';
  preview.append(previewImg,caption);
  wrap.append(copy,preview);
  const note=document.createElement('p');note.className='rm-modal-legal';note.textContent='Este regalo es educativo y no evalúa tu salud ni sustituye una consulta.';
  

  const controls=document.createElement('div');controls.className='rm-gift-controls';
  
  const save=document.createElement('a');save.className='button button-primary rm-pdf-download';
  save.href=new URL('../gifts/'+gift.file,import.meta.url).href;save.download=gift.file;
  save.textContent=({plan:'Descargar mi guía de meal prep',variety:'Descargar mi recetario',rhythm:'Descargar mis rituales',steady:'Descargar mi reto de 7 días'})[giftId]+' ↓';
  const again=document.createElement('button');again.type='button';again.className='rm-quiet';again.textContent='Volver a empezar';again.addEventListener('click',resetQuiz);
  const contact=document.createElement('button');contact.type='button';contact.className='rm-quiet';contact.textContent='Escribirle a Rosela ↗';
  contact.addEventListener('click',()=>openModal(contactModal));
  
  const bonus=document.createElement('aside');bonus.className='rm-bonus-strip';
  const bonusThumb=document.createElement('img');bonusThumb.src=new URL('../images/gifts/RM_Bonus_ComerFuera.webp',import.meta.url).href;bonusThumb.alt='Vista previa del bonus: Comer saludable fuera de casa';bonusThumb.loading='lazy';bonusThumb.width=88;bonusThumb.height=120;
  const bonusCopy=document.createElement('div');
  const bonusLabel=document.createElement('strong');bonusLabel.textContent='Y además, un bonus para ti.';
  const bonusText=document.createElement('p');bonusText.textContent='Comer saludable fuera de casa: una guía práctica para llevar contigo.';
  const bonusLink=document.createElement('a');bonusLink.className='rm-bonus-link';bonusLink.textContent='Descargar bonus PDF ↗';bonusLink.href=new URL('../gifts/'+bonusFile,import.meta.url).href;bonusLink.download=bonusFile;
  bonusCopy.append(bonusLabel,bonusText,bonusLink);bonus.append(bonusThumb,bonusCopy);
  controls.append(save,again,contact);screen.append(eyebrow,heading,wrap,bonus,note,controls);
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
  ctx.fillText('UNA IDEA PARA EMPEZAR',145,y+78);
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
