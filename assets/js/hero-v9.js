/* Subtle motion, SVG only */
(()=>{const hero=document.querySelector('.v3-first[data-motion-v9]');if(!hero)return;
const title=hero.querySelector('[data-parallax="heading"]');const pic=hero.querySelector('.v3-portrait img');const glyph=hero.querySelector('.rm-apple-heart svg');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');const wide=matchMedia('(min-width:781px)');
let queued=false;function move(){queued=false;const y=Math.max(0,scrollY-hero.offsetTop);if(reduced.matches)return;
if(wide.matches){if(title)title.style.transform='translateY('+Math.min(12,y*.022)+'px)';if(pic)pic.style.transform='translateY('+(-Math.min(13,y*.021))+'px)';}
if(glyph)glyph.style.transform='translateY('+(-4*Math.sin(Math.min(1,y/260)*Math.PI))+'px)';}
function run(){if(!queued){queued=true;requestAnimationFrame(move);}}
addEventListener('scroll',run,{passive:true});addEventListener('resize',run,{passive:true});run();})();
