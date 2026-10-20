/**
 * START — An educational reflection quiz, not a clinical instrument.
 * No health diagnosis, calories, body metrics, persistence, cookies or network calls.
 * All result copy needs Rosela's editorial approval before live launch.
 */
const questions = [
  {title:'¿Qué te gustaría hacer más sencillo?', help:'Piensa en tu día a día, no en hacerlo perfecto.', options:[
    {text:'Organizar mis comidas', kind:'plan'}, {text:'Comer con más variedad', kind:'variety'},
    {text:'Encontrar horarios cómodos',kind:'rhythm'}, {text:'Mantener pequeños cambios',kind:'steady'}]},
  {title:'¿Qué suele complicarte más?', help:'No hay respuestas buenas ni malas.',options:[
    {text:'La falta de tiempo',kind:'plan'}, {text:'Repetir siempre lo mismo',kind:'variety'},
    {text:'Que mis días cambian mucho',kind:'rhythm'}, {text:'La constancia',kind:'steady'}]},
  {title:'¿Cuándo te gustaría tener más claridad?', help:'Elige el momento que más te haga sentido.',options:[
    {text:'Al preparar la semana',kind:'plan'}, {text:'Al decidir qué comer',kind:'variety'},
    {text:'En los días ocupados',kind:'rhythm'}, {text:'Cuando vuelvo a comenzar',kind:'steady'}]},
  {title:'¿Qué primer paso suena más a ti?', help:'Tu punto de partida puede ser muy pequeño.',options:[
    {text:'Planear una cosa a la vez',kind:'plan'}, {text:'Explorar nuevas opciones',kind:'variety'},
    {text:'Buscar una rutina flexible',kind:'rhythm'}, {text:'Elegir una acción sostenible',kind:'steady'}]}
];
const results = {
  plan:{title:'Organización <em>sin rigidez.</em>',description:'Tus respuestas sugieren que te interesa dar un poco más de estructura a tus comidas sin complicar tus días.',tip:'Prueba elegir una sola comida de la próxima semana que te gustaría dejar planificada.'},
  variety:{title:'Curiosidad por <em>explorar.</em>',description:'Parece que te gustaría descubrir opciones diferentes y sentir mayor variedad en tu alimentación cotidiana.',tip:'Haz una lista de dos preparaciones que tengas curiosidad por conocer o probar.'},
  rhythm:{title:'Un ritmo <em>más tuyo.</em>',description:'Por tus respuestas, tu rutina diaria es un punto importante para reflexionar sobre tus hábitos.',tip:'Observa durante algunos días qué momentos se acomodan mejor a tus horarios reales.'},
  steady:{title:'Constancia <em>realista.</em>',description:'Te interesa construir cambios pequeños que tengan espacio en tu vida tal como es hoy.',tip:'Piensa en una sola acción fácil de repetir que no dependa de tener un día perfecto.'}
};
let step = -1;
let answers = Array(questions.length).fill(null);
const $ = id => document.getElementById(id);
const intro=$('quiz-intro'), question=$('quiz-question-screen'), result=$('quiz-result-screen');
const next=$('quiz-next'), previous=$('quiz-back');
if (intro && question && result) {
  $('quiz-start').addEventListener('click',()=>render(0));
  next.addEventListener('click',()=>{if(answers[step] !== null) render(step+1)});
  previous.addEventListener('click',()=>render(step-1));
  $('quiz-restart').addEventListener('click',()=>{answers=Array(questions.length).fill(null);render(-1)});
}
function render(targetStep){
  step=targetStep;
  intro.hidden=step!==-1;
  question.hidden=step<0||step>=questions.length;
  result.hidden=step!==questions.length;
  const progress=Math.max(0,Math.min(step,questions.length));
  $('quiz-progress-bar').style.width=`${Math.round(progress/questions.length*100)}%`;
  document.querySelector('.quiz-progress').setAttribute('aria-valuenow',String(progress));
  $('quiz-step-counter').textContent=`START / ${String(progress).padStart(2,'0')}`;
  if(step===-1){$('quiz-title').focus?.({preventScroll:true});return;}
  if(step===questions.length){displayResult();return;}
  const data=questions[step];
  $('quiz-question-label').textContent=`PREGUNTA ${String(step+1).padStart(2,'0')} / 04`;
  $('quiz-question-title').textContent=data.title;
  $('quiz-question-help').textContent=data.help;
  const list=$('quiz-options');list.replaceChildren();
  for(const choice of data.options){
    const button=document.createElement('button');button.type='button';button.className='quiz-option';
    button.setAttribute('aria-pressed',String(answers[step]===choice.kind));
    const dot=document.createElement('span');dot.className='quiz-option-dot';dot.setAttribute('aria-hidden','true');
    const label=document.createElement('span');label.textContent=choice.text;
    button.append(dot,label);
    button.addEventListener('click',()=>{
      answers[step]=choice.kind;
      list.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));
      button.setAttribute('aria-pressed','true');next.disabled=false;
    });
    list.append(button);
  }
  next.disabled=answers[step]===null;
  next.innerHTML=step===questions.length-1?'Ver mi resultado <span aria-hidden="true">↗</span>':'Siguiente <span aria-hidden="true">↗</span>';
  $('quiz-question-title').focus({preventScroll:true});
}
function displayResult(){
  const scores={plan:0,variety:0,rhythm:0,steady:0};
  for(const a of answers){if(a in scores)scores[a]+=1;}
  // In ties, the first question's answer determines the most relevant topic.
  const best=Object.keys(scores).sort((a,b)=>scores[b]-scores[a]||(a===answers[0]?-1:b===answers[0]?1:0))[0];
  const data=results[best];
  $('quiz-result-title').innerHTML=data.title; // Only static, developer-authored strings.
  $('quiz-result-description').textContent=data.description;
  $('quiz-result-tip').textContent=data.tip;
  $('quiz-result-title').focus({preventScroll:true});
}
