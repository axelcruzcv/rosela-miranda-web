/**
 * Rosela Miranda / V3
 * Motion: transform-only, requestAnimationFrame, reduced-motion aware.
 * Journal: progressive enhancement, links stay valid without JS.
 * START: visuals and palettes react to the four already-implemented questions.
 */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.v3-first');
const heroText = document.querySelector('[data-parallax="heading"]');
const heroDescription = document.querySelector('[data-parallax="description"]');
const photo = document.querySelector('.v3-portrait img');
if (hero && heroText && heroDescription && photo && !reducedMotion.matches) {
  let ticking = false;
  const update = () => {
    const scroll = Math.min(Math.max(window.scrollY, 0), window.innerHeight * 1.2);
    heroText.style.transform = 'translate3d(0,' + (scroll * 0.13).toFixed(1) + 'px,0)';
    heroDescription.style.transform = 'translate3d(0,' + (-scroll * 0.05).toFixed(1) + 'px,0)';
    photo.style.transform = 'translate3d(0,' + (-scroll * 0.07).toFixed(1) + 'px,0) scale(1.025)';
    ticking = false;
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  update();
}
// Existing START modal is created by experience.js and uses data attributes
// to reflect which question / reward is currently displayed.
const quizModal = document.getElementById('rm-quiz-modal');
const quizCounter = document.getElementById('rm-quiz-counter');
if (quizModal && quizCounter) {
  const recolor = () => {
    const val = quizCounter.textContent.trim();
    let step = val === 'TU DETALLE' ? '4' : String(Math.max(0, (parseInt(val,10) || 1) - 1));
    quizModal.dataset.step = step;
    const symbol = quizModal.querySelector('.rm-modal-aside>span');
    if(symbol) symbol.textContent = step === '4' ? 'UN REGALO PARA TI · RM' : 'UNA PREGUNTA A LA VEZ · RM';
  };
  new MutationObserver(recolor).observe(quizCounter, {childList:true,characterData:true,subtree:true});
  recolor();
}
// Gallery dummy articles open inside one accessible modal with distinct large images.
// Page CMS publication links open in the same modal but retain regular href fallback.
if (document.querySelector('.v3-blog-gallery')) {
  const layer = document.createElement('div');
  layer.className = 'v3-article-layer';
  layer.hidden = true;
  layer.innerHTML = '<div class="v3-article-dialog" role="dialog" aria-modal="true" aria-label="Artículo del blog" tabindex="-1"><button class="v3-article-close" type="button" aria-label="Cerrar artículo">×</button><div class="v3-article-content"></div></div>';
  document.body.append(layer);
  const dialog = layer.querySelector('.v3-article-dialog');
  const content = layer.querySelector('.v3-article-content');
  const close = layer.querySelector('.v3-article-close');
  let returnFocus = null;
  let demoCache = null;
  const make = (tag,className,text) => {
    const element=document.createElement(tag);
    if(className)element.className=className;
    if(text !== undefined)element.textContent=text;
    return element;
  };
  const heroPicture = (src) => {
    const wrapper = make('div','v3-article-hero');
    const img=make('img');img.src=src;img.alt='Fotografía editorial de la nota';img.loading='lazy';
    wrapper.append(img);return wrapper;
  };
  function open(){
    returnFocus=document.activeElement;
    layer.hidden=false;
    document.body.classList.add('v3-article-open');
    dialog.scrollTop=0;
    close.focus({preventScroll:true});
  }
  function dismiss(){
    layer.hidden=true;
    content.replaceChildren();
    document.body.classList.remove('v3-article-open');
    returnFocus?.focus?.({preventScroll:true});
  }
  async function openDummy(id){
    content.replaceChildren(make('p','v3-article-loading','Abriendo nota…'));
    open();
    try {
      if(!demoCache) {
        const res=await fetch(new URL('./blog-demos.json', import.meta.url));
        if(!res.ok) throw new Error('No disponible');
        demoCache=await res.json();
      }
      const post=demoCache.find(entry=>entry.id===id);
      if(!post) throw new Error('No encontrada');
      const body=make('div','v3-article-text');
      body.append(make('p','v3-label',post.label),make('h2','',post.title),make('p','',post.one));
      const secondary=make('img','v3-article-second');secondary.src=post.second;secondary.loading='lazy';
      secondary.alt='Fotografía editorial complementaria';
      body.append(secondary,make('h3','','Una mirada personal'),make('p','',post.two),
        make('p','v3-modal-note','Nota de demostración: este contenido no ha sido escrito ni revisado por Rosela Miranda.'));
      if(!layer.hidden)content.replaceChildren(heroPicture(post.first),body);
    }catch{
      content.replaceChildren(make('p','v3-article-error','No se pudo abrir esta nota. Intenta de nuevo.'));
    }
  }
  async function openPublished(href){
    content.replaceChildren(make('p','v3-article-loading','Abriendo artículo…'));
    open();
    try {
      const url=new URL(href,location.href);
      if(url.origin!==location.origin)throw new Error('External location');
      const response=await fetch(url.toString(),{credentials:'same-origin'});
      if(!response.ok)throw new Error('Not available');
      const html=await response.text();
      const documentCopy=new DOMParser().parseFromString(html,'text/html');
      const article=documentCopy.querySelector('.rm-blog-article');
      if(!article)throw new Error('Missing article');
      article.classList.add('v3-article-text');
      // Treat the published article as a document, but remove its navigation link.
      article.querySelectorAll('script,iframe,form,.rm-inline-link').forEach(n=>n.remove());
      if(!layer.hidden)content.replaceChildren(document.importNode(article,true));
    } catch{
      content.replaceChildren(make('p','v3-article-error','No se pudo cargar el artículo. Puedes abrirlo desde su enlace.'));
    }
  }
  document.addEventListener('click',event=>{
    const dummy=event.target.closest('[data-demo-article]');
    if(dummy){event.preventDefault();openDummy(dummy.dataset.demoArticle);return;}
    const article=event.target.closest('.v3-cms-posts a.rm-post-card');
    if(article){event.preventDefault();openPublished(article.href);}
  });
  close.addEventListener('click',dismiss);
  layer.addEventListener('click',event=>{if(event.target===layer)dismiss();});
  document.addEventListener('keydown',event=>{
    if(layer.hidden)return;
    if(event.key==='Escape'){event.preventDefault();dismiss();return;}
    if(event.key!=='Tab')return;
    const focusables=[...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])')].filter(el=>el.getClientRects().length>0);
    if(!focusables.length)return;
    if(event.shiftKey && document.activeElement===focusables[0]){event.preventDefault();focusables.at(-1).focus();}
    else if(!event.shiftKey && document.activeElement===focusables.at(-1)){event.preventDefault();focusables[0].focus();}
  });
}
