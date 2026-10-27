/* ROSELA / 20261027_V1.1 — animation controllers.
   Original apple-heart sequence is scrolled frame-by-frame; four question
   illustrations are real looping monochrome GIFs generated at build-time. */
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
{
 const hero=document.querySelector('.v3-first[data-motion-v9]');
 const figure=hero?.querySelector('.rm-apple-heart img.rm-apple-morph');
 if(hero && figure){
  const frames=Array.from({length:6},(_,i)=>new URL(
   '../images/apple-heart/apple-heart-'+String(i+1).padStart(2,'0')+'.webp',import.meta.url).href);
  frames.slice(1).forEach(src=>{const image=new Image();image.decoding='async';image.src=src;});
  let current=-1,queued=false;
  const update=()=>{
   queued=false;
   const rect=hero.getBoundingClientRect();
   const travelled=Math.max(0,-rect.top);
   const length=Math.max(180,Math.min(500,hero.offsetHeight*.55));
   const progress=reduced.matches?0:Math.min(1,travelled/length);
   const eased=progress*progress*(3-2*progress);
   const index=Math.max(0,Math.min(5,Math.round(eased*5)));
   if(index!==current){current=index;figure.src=frames[index];}
   figure.style.transform=reduced.matches?'none':
    'translate3d(0,'+(-8*Math.sin(progress*Math.PI)).toFixed(2)+'px,0)';
  };
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  reduced.addEventListener?.('change',schedule);
  update();
 }
}
/* Four transparent GIFs are preloaded once; switching questions is synchronous.
   No colored squares are drawn into the GIF itself. */
{
 const overlay=document.getElementById('rm-quiz-modal');
 const aside=overlay?.querySelector('.rm-modal-aside');
 const counter=overlay?.querySelector('#rm-quiz-counter');
 const progress=overlay?.querySelector('.rm-modal-progress');
 if(overlay&&aside&&counter){
  const names=['plan','variety','rhythm','steady'];
  const createImage=(name)=>{
   const pic=document.createElement('img');
   pic.className='rm-v19-glyph';pic.dataset.question=name;pic.alt='';
   pic.setAttribute('aria-hidden','true');pic.decoding='async';
   pic.width=320;pic.height=320;pic.loading='eager';
   pic.src=new URL('../images/quiz-gifs/'+name+(reduced.matches?'-still.webp':'.gif'),import.meta.url).href;
   return pic;
  };
  const side=document.createElement('div');side.className='rm-v19-artboard';
  const small=document.createElement('div');small.className='rm-v19-mobile-artboard';
  for(const name of names){side.append(createImage(name));small.append(createImage(name));}
  aside.prepend(side);progress?.after(small);
  const result=document.createElement('div');result.className='rm-v19-result-emblem';
  result.setAttribute('aria-hidden','true');
  result.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21C8 17 3 13 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5-5 9-9 13Z"/><path d="M8 12h8M12 8v8"/></svg>';
  aside.append(result);
  function show(){
   const raw=counter.textContent.trim(),index=(parseInt(raw,10)||1)-1;
   const active=raw==='TU DETALLE'?'result':names[Math.min(3,Math.max(0,index))];
   overlay.dataset.activeQuestion=active;
   side.hidden=small.hidden=active==='result';
  }
  new MutationObserver(show).observe(counter,{childList:true,subtree:true,characterData:true});
  reduced.addEventListener?.('change',()=>{
   for(const im of [...side.querySelectorAll('img'),...small.querySelectorAll('img')])
    im.src=new URL('../images/quiz-gifs/'+im.dataset.question+(reduced.matches?'-still.webp':'.gif'),import.meta.url).href;
  });
  show();
 }
}
