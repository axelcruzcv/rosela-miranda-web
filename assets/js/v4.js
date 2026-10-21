/* Rosela / V4 — evolving illustrations and collectible editorial tips.
   The quiz remains non-diagnostic, local to the browser and without user accounts. */
const rmQuiz = document.getElementById('rm-quiz-modal');
const rmCounter = document.getElementById('rm-quiz-counter');
const mediaByResult = {
  plan: [
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=680&q=78',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=680&q=78'
  ],
  variety: [
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=680&q=78',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=680&q=78'
  ],
  rhythm: [
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=680&q=78',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=680&q=78'
  ],
  steady: [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=680&q=78',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=680&q=78'
  ]
};
const artisticSymbols = [
  // Budding leaves, apple, broccoli, sectioned citrus, result medal.
  '<path d="M130 235V111M130 180C78 178 53 144 48 108c49-7 79 13 82 72Zm0-34c4-59 35-82 86-76-4 36-29 71-86 76Z"/><path d="M130 111c4-29 17-44 37-52"/>',
  '<path d="M132 94c2-18 10-30 24-40"/><path d="M134 83c-35-39-64-22-70-20 9 34 35 42 70 20Z"/><path d="M130 109c-32-25-80-24-93 19-14 49 37 121 83 131 13 3 21-1 31-1 42 8 91-71 76-121-11-34-56-52-97-28Z"/>',
  '<path d="M119 188v71m29-69v69"/><path d="M123 194c-58 17-87-12-73-45-25-28-3-66 35-63 10-37 66-45 91-9 40-9 66 30 48 60 28 40-15 75-55 53-13 20-33 24-46 4Z"/>',
  '<circle cx="132" cy="150" r="96"/><circle cx="132" cy="150" r="77"/><circle cx="132" cy="150" r="13"/><path d="M132 137V73m10 69 45-46m-42 58 63 20m-77-10 4 62m-18-74-54 22m60-35-46-44"/>',
  '<circle cx="132" cy="150" r="97"/><path d="M132 57v186M39 150h186M67 85l130 130M197 85 67 215"/><circle cx="132" cy="150" r="45"/>'
];
function svgSymbol(step){
  const palettes=['#648365','#e8f0ff','#fff5ed','#e8c8ad','#f4ecdb'];
  const path=artisticSymbols[Math.min(step,4)];
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 264 300" fill="none" stroke="'+palettes[step]+'" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round" role="img">'+path+'</svg>';
}
function updateVisual(){
  if(!rmQuiz||!rmCounter)return;
  const step=Math.min(4,Math.max(0,parseInt(rmCounter.textContent,10)?parseInt(rmCounter.textContent,10)-1:4));
  const aside=rmQuiz.querySelector('.rm-modal-aside');
  if(aside){
    const original=aside.querySelector('img:not(.v4-quiz-symbol)');
    if(original)original.style.display='none';
    let icon=aside.querySelector('.v4-quiz-symbol');
    if(!icon){icon=document.createElement('img');icon.className='v4-quiz-symbol';icon.alt='';icon.width=264;icon.height=300;aside.prepend(icon);}
    icon.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgSymbol(step));
    icon.style.transform='rotate('+([-4,7,-8,10,-3][step])+'deg)';
  }
  // On phones the decorative desktop sidebar is hidden: keep a dedicated
  // illustration directly above the question so every step remains identifiable.
  const content = rmQuiz.querySelector('.rm-modal-content');
  const progress = rmQuiz.querySelector('.rm-modal-progress');
  if(content && progress){
    let mobile = content.querySelector('.v6-mobile-symbol');
    if(!mobile){
      mobile=document.createElement('div');mobile.className='v6-mobile-symbol';
      mobile.setAttribute('aria-hidden','true');
      const picture=document.createElement('img');picture.alt='';picture.width=80;picture.height=72;
      mobile.append(picture);progress.insertAdjacentElement('afterend',mobile);
    }
    const picture=mobile.querySelector('img');
    if(picture){
      picture.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgSymbol(step));
      picture.style.transform='rotate('+([-4,7,-8,10,-3][step])+'deg)';
    }
    mobile.hidden=step===4;
  }
  if(step!==4)return;
  const card=rmQuiz.querySelector('.rm-gift-card');
  if(!card||card.querySelector('.v4-gift-images'))return;
  const code=card.dataset.gift||'plan';
  const pictures=mediaByResult[code]||mediaByResult.plan;
  const group=document.createElement('div');group.className='v4-gift-images';
  for(const src of pictures){
    const img=document.createElement('img');img.src=src;img.alt='Imagen editorial de bienestar';img.loading='lazy';img.decoding='async';group.append(img);
  }
  card.prepend(group);
}
if(rmCounter&&rmQuiz){
  new MutationObserver(updateVisual).observe(rmCounter,{childList:true,characterData:true,subtree:true});
  updateVisual();
}
// Keep the downloadable keepsake faithful to its on-screen image collage.
async function fetchImage(url){
  const image=new Image();
  image.crossOrigin='anonymous';
  image.src=url;
  try{await Promise.race([image.decode(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('media timeout')),8000))]);return image;}
  catch{return null;}
}
async function downloadTip(result){
  const theme={
    plan:['#f6f1e9','#516b56','#b78b76'],
    variety:['#e5edf3','#4e6691','#9dacbf'],
    rhythm:['#f0e6e7','#7b4a53','#c7a3aa'],
    steady:['#27382f','#ecede0','#c9a88f']
  }[result]||['#f6f1e9','#516b56','#b78b76'];
  const card=rmQuiz.querySelector('.rm-gift-card');
  if(!card)return;
  const title=card.querySelector('.rm-gift-subtitle')?.textContent||'Una idea para ti';
  const paragraphs=card.querySelectorAll('p');
  const description=paragraphs[0]?.textContent||'Tu punto de partida';
  const tip=paragraphs[1]?.textContent||'Un pequeño gesto para empezar.';
  const canvas=document.createElement('canvas');
  canvas.width=1080;canvas.height=1350;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const [background,ink,accent]=theme;
  ctx.fillStyle=background;ctx.fillRect(0,0,1080,1350);
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.strokeRect(58,58,964,1234);
  ctx.fillStyle=ink;ctx.textAlign='left';
  ctx.font='600 20px Arial,sans-serif';ctx.fillText('ROSELA MIRANDA / START',110,122);
  ctx.font='400 110px Georgia,serif';ctx.fillText('Tu tip.',110,255);
  ctx.fillStyle=accent;ctx.font='400 50px Georgia,serif';ctx.fillText(title,110,325,850);
  const pics=mediaByResult[result]||mediaByResult.plan;
  const imgs=await Promise.all(pics.map(fetchImage));
  ctx.fillStyle=accent;ctx.fillRect(110,377,420,350);ctx.fillRect(550,377,420,350);
  imgs.forEach((im,i)=>{
    if(!im)return;
    const x=110+i*440,y=377,w=420,h=350;
    const scale=Math.max(w/im.width,h/im.height);
    const sw=w/scale,sh=h/scale,sx=(im.width-sw)/2,sy=(im.height-sh)/2;
    try{ctx.drawImage(im,sx,sy,sw,sh,x,y,w,h);}catch{}
  });
  ctx.strokeStyle=accent;ctx.beginPath();ctx.moveTo(110,771);ctx.lineTo(970,771);ctx.stroke();
  ctx.fillStyle=ink;ctx.font='29px Arial,sans-serif';
  const writeWrapped=(text,x,y,width,lineHeight,maxLines)=>{
    const words=text.split(/\s+/);let line='',n=0;
    for(const word of words){
      const test=line?line+' '+word:word;
      if(ctx.measureText(test).width>width && line){
        ctx.fillText(line,x,y);y+=lineHeight;n++;if(n>=maxLines)return y;line=word;
      }else line=test;
    }
    if(line){ctx.fillText(line,x,y);y+=lineHeight;}
    return y;
  };
  let y=writeWrapped(description,112,842,850,47,3);
  ctx.font='700 22px Arial,sans-serif';ctx.fillStyle=accent;ctx.fillText('UNA IDEA PARA HOY',112,y+35);
  ctx.font='29px Arial,sans-serif';ctx.fillStyle=ink;
  writeWrapped(tip,112,y+92,850,44,4);
  ctx.font='18px Arial,sans-serif';ctx.fillStyle=ink;
  ctx.fillText('Una reflexión educativa; no sustituye una consulta.',112,1245);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!blob)return;
  const url=URL.createObjectURL(blob);const a=document.createElement('a');
  a.href=url;a.download='rosela-miranda-tu-tip-'+result+'.png';document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}
document.addEventListener('click',event=>{
  const button=event.target.closest('#rm-quiz-modal .rm-gift-controls button');
  if(!button||!button.textContent.includes('Descargar'))return;
  event.preventDefault();event.stopImmediatePropagation();
  const result=rmQuiz.querySelector('.rm-gift-card')?.dataset.gift||'plan';
  button.disabled=true;const previous=button.textContent;button.textContent='Preparando tu regalo…';
  downloadTip(result).finally(()=>{button.disabled=false;button.textContent=previous;});
},true);
