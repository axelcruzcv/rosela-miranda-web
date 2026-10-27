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
{
 const overlay=document.getElementById('rm-quiz-modal');
 const aside=overlay?.querySelector('.rm-modal-aside');
 const counter=overlay?.querySelector('#rm-quiz-counter');
 if(overlay && aside && counter){
  const pic=document.createElement('img');
  pic.className='rm-v18-gif';pic.alt='';pic.setAttribute('aria-hidden','true');
  pic.decoding='async';pic.loading='eager';pic.width=320;pic.height=320;
  const seal=document.createElement('span');
  seal.className='rm-v18-result-mark';
  seal.setAttribute('aria-hidden','true');
  seal.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21C8 17 3 13 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5-5 9-9 13Z"/><path d="M8 12h8M12 8v8"/></svg>';
  aside.prepend(pic,seal);
  // On phones the left panel collapses: retain a compact animated preview.
  const mobile=document.createElement('img');
  mobile.className='rm-v18-gif-mobile';
  mobile.alt='';mobile.setAttribute('aria-hidden','true');
  mobile.decoding='async';mobile.loading='eager';mobile.width=320;mobile.height=320;
  overlay.querySelector('.rm-modal-progress')?.after(mobile);
  const sequence=['plan','variety','rhythm','steady'];
  let visibleName='',visibleFormat='';
  const show=()=>{
   const raw=counter.textContent.trim();
   const position=raw==='TU DETALLE'?4:
    Math.max(0,Math.min(3,(Number.parseInt(raw,10)||1)-1));
   const name=sequence[Math.min(3,position)];
   const format=reduced.matches?'webp':'gif';
   if(visibleName!==name || visibleFormat!==format){
    visibleName=name;visibleFormat=format;
    const filename=name+(format==='webp'?'-still.webp':'.gif');
    const source=new URL('../images/quiz-gifs/'+filename,import.meta.url).href;
    pic.src=source;mobile.src=source;
   }
   mobile.dataset.question=name;
   pic.hidden=position===4;
   mobile.hidden=position===4;
  };
  new MutationObserver(show).observe(counter,{childList:true,subtree:true,characterData:true});
  reduced.addEventListener?.('change',show);
  show();
 }
}
