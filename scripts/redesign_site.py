#!/usr/bin/env python3
"""Rebuild Rosela with restrained SVG icons; eliminate decorative bitmap sticker art."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
A=ROOT/'assets'
JS=r"""
/* Rosela Miranda / all-vector ornamental icon system */
const N='http://www.w3.org/2000/svg';
const paths={
heart:'<path d="M12 21C7.5 17 3.5 13 3.5 8.5a4.8 4.8 0 0 1 8.5-3 4.8 4.8 0 0 1 8.5 3C20.5 13 16.5 17 12 21Z"/>',
apple:'<path d="M12 7C7 4 3 7 4 13c1 5 4 8 8 7 4 1 7-2 8-7 1-6-3-9-8-6ZM12 7c0-3 2-5 4-5"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
book:'<path d="M12 6c-3-2-6-2-9-1v14c4-1 7-1 9 1 2-2 5-2 9-1V5c-3-1-6-1-9 1ZM12 6v14"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 15h4m3 0h3"/>',
bowl:'<path d="M3 12h18c0 6-4 9-9 9s-9-3-9-9ZM6 7c2-3 4-3 6 0m3-4c-1 2 0 3 2 5"/>',
utensils:'<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M18 21V3c-4 3-5 7-5 12h5"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2m0-14-2 2M7 17l-2 2"/>',
moon:'<path d="M20.5 15a8.5 8.5 0 0 1-11-11.5A9 9 0 1 0 20.5 15Z"/>',
water:'<path d="M12 2C8 8 5 11 5 15a7 7 0 0 0 14 0c0-4-3-7-7-13Z"/>',
leaf:'<path d="M21 3C11 2 4 6 4 14c0 4 3 7 7 6 7-1 10-7 10-17ZM4 20c3-7 8-11 13-13"/>',
flower:'<circle cx="12" cy="12" r="2"/><path d="M12 10c-5-8-9-1-3 2-8-3-8 5-1 3-4 7 3 8 4 2 4 6 9 1 4-3 7-4 2-9-2-5 0-8-8-8-2 1Z"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
activity:'<path d="M2 12h5l3-6 4 12 3-6h5"/>',
check:'<path d="m4 12 5 5L20 6"/>',
award:'<circle cx="12" cy="8" r="5"/><path d="m9 12-2 9 5-3 5 3-2-9"/>',
sprout:'<path d="M12 21v-9M12 16C5 16 4 11 4 6c6 0 8 4 8 8m0-4c0-5 3-8 8-8 0 5-2 9-8 9"/>',
shield:'<path d="M12 2 4 5v6c0 6 3.5 9 8 11 4.5-2 8-5 8-11V5l-8-3Zm-3 10 2 2 4-4"/>',
bag:'<path d="M4 8h16l-1 13H5L4 8ZM8 9V6a4 4 0 0 1 8 0v3"/>',
chat:'<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 10h8"/>',
foot:'<path d="M4 17c4-5 4-8 6-11 2-2 4 1 4 4 0 3 2 4 6 5 2 1 2 5-1 5H7c-2 0-3-1-3-3Z"/>',
down:'<path d="M12 3v15m-6-6 6 6 6-6M4 21h16"/>'
};
function ico(key){
 const svg=document.createElementNS(N,'svg');
 svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');
 svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.55');
 svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
 svg.setAttribute('aria-hidden','true');svg.classList.add('rm-icon');
 svg.innerHTML=paths[key]||paths.sprout;return svg;
}
const screen=document.getElementById('rm-quiz-screen');
const count=document.getElementById('rm-quiz-counter');
const steps=[['calendar','bowl','clock','target'],['bag','utensils','clock','heart'],['calendar','utensils','sun','sprout'],['bowl','flower','activity','award']];
const reward={plan:['calendar','bag','utensils','check'],variety:['bowl','apple','flower','utensils'],rhythm:['clock','sun','moon','activity'],steady:['target','sprout','heart','award']};
function enrich(){
 if(!screen)return;
 const gift=screen.querySelector('.rm-gift-card');
 if(gift){
  if(gift.dataset.iconv17)return;
  gift.dataset.iconv17='yes';
  const group=reward[gift.dataset.gift]||reward.plan;
  const cover=gift.querySelector('.rm-gift-cover');
  if(cover){
   cover.querySelectorAll('img').forEach(n=>n.remove());
   const doc=document.createElement('div');doc.className='rm-icon-document';doc.append(ico(group[0]));
   const lines=document.createElement('div');lines.className='rm-document-lines';
   for(let i=0;i<4;i++)lines.append(document.createElement('span'));
   doc.append(lines);cover.prepend(doc);
   const motifs=document.createElement('div');motifs.className='rm-icon-motifs';
   group.slice(1).forEach(k=>motifs.append(ico(k)));cover.append(motifs);
  }
  const bonus=screen.querySelector('.rm-bonus-strip');
  if(bonus){
   bonus.querySelectorAll('img').forEach(n=>n.remove());
   const symbol=document.createElement('span');symbol.className='rm-bonus-icon';symbol.append(ico('utensils'));bonus.prepend(symbol);
  }
  const dl=gift.querySelector('.qa-download-icon');if(dl)dl.replaceChildren(ico('down'));
  return;
 }
 const choices=[...screen.querySelectorAll('.rm-choice')];
 if(choices.length===4){
  const n=Math.min(3,Math.max(0,(parseInt(count?.textContent,10)||1)-1));
  choices.forEach((el,i)=>{const mark=el.querySelector('.rm-choice-symbol');if(mark)mark.replaceChildren(ico(steps[n][i]));});
  const kicker=screen.querySelector('.qa-step-kicker');
  if(kicker&&!screen.querySelector('.rm-icon-question-band')){
    const band=document.createElement('div');band.className='rm-icon-question-band';
    [steps[n][0],steps[n][1],steps[n][2]].forEach(k=>{const s=document.createElement('span');s.append(ico(k));band.append(s);});
    kicker.after(band);
  }return;
 }
 if(screen.querySelector('.v10-quiz-start')&&!screen.querySelector('.rm-icon-intro-band')){
  screen.querySelector('.qa-intro-marks')?.remove();
  const desc=screen.querySelector('.rm-modal-desc');
  if(desc){const band=document.createElement('div');band.className='rm-icon-intro-band';
   ['sprout','bowl','moon','heart'].forEach(k=>{const s=document.createElement('span');s.append(ico(k));band.append(s);});desc.after(band);
  }
 }
}
if(screen){new MutationObserver(enrich).observe(screen,{childList:true});if(count)new MutationObserver(enrich).observe(count,{childList:true});enrich();}
document.querySelectorAll('.v10-specialty').forEach((c,i)=>{
 const span=c.querySelector('.v10-specialty-symbol');if(span)span.replaceChildren(ico(['heart','activity','shield','leaf','foot','target'][i]));
});
const lead=document.querySelector('.v10-approach-lead');
if(lead&&!lead.querySelector('.rm-icon-approach')){
 const el=document.createElement('div');el.className='rm-icon-approach';
 ['chat','book','heart'].forEach(k=>{const s=document.createElement('span');s.append(ico(k));el.append(s);});lead.append(el);
}
"""
CSS=r"""
/* V17: site-wide refined line icons, no decorative raster stickers */
.rm-icon{width:100%;height:100%;display:block}
.rm-monogram{font:italic 400 26px/1 'Instrument Serif',Georgia,serif;letter-spacing:-.15em;display:grid;place-items:center;width:48px;height:51px;color:#566b56;flex:none}
.v3-footer .rm-monogram,.footer .rm-monogram{width:33px;height:38px;font-size:19px}
#rm-quiz-modal .rm-modal-aside>img{display:none!important}
#rm-quiz-modal .rm-gift-cover>img,#rm-quiz-modal .rm-bonus-strip>img{display:none!important}
#rm-quiz-modal .rm-icon-intro-band{display:flex;gap:12px;margin:24px 0 27px}
#rm-quiz-modal .rm-icon-intro-band span{width:67px;height:67px;display:grid;place-items:center;padding:18px;border:1px solid #cdd8c9;background:#edf1e9;border-radius:16px;color:#617b64}
#rm-quiz-modal .rm-icon-intro-band span:nth-child(2){background:#f1e4e0;color:#9d716b;border-color:#e1d0c9}
#rm-quiz-modal .rm-icon-intro-band span:nth-child(3){background:#e7eaf0;color:#61768a;border-color:#cfd8e2}
#rm-quiz-modal .rm-icon-intro-band span:nth-child(4){background:#ece9dd;color:#8e7c59;border-color:#dbd6c4}
#rm-quiz-modal .rm-icon-question-band{display:flex;gap:9px;margin:10px 0 4px}
#rm-quiz-modal .rm-icon-question-band span{width:33px;height:33px;display:grid;place-items:center;border:1px solid #b4c1b0;border-radius:50%;padding:8px;color:#80917e}
#rm-quiz-modal .rm-choice .rm-choice-symbol{width:47px;height:47px;min-width:47px;border-radius:12px;padding:10px;color:#627965}
#rm-quiz-modal .rm-choice[aria-pressed=true] .rm-choice-symbol{color:#a5745f}
#rm-quiz-modal .rm-gift-cover{align-self:center!important;min-width:0}
#rm-quiz-modal .rm-icon-document{box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:23px;width:min(95%,206px);aspect-ratio:4/5;max-width:100%;margin:auto;padding:24px;background:linear-gradient(150deg,#fffffb,#eff2eb);border:1px solid #bbcbbc;border-radius:6px;box-shadow:10px 11px 0 #c7d0c3,10px 15px 26px #36463420;color:#647c69}
#rm-quiz-modal .rm-icon-document>svg{width:78px;height:78px}
#rm-quiz-modal .rm-document-lines{width:100%;display:grid;gap:10px}
#rm-quiz-modal .rm-document-lines span{height:2px;background:#d0d9ce;width:100%}
#rm-quiz-modal .rm-document-lines span:nth-child(2){width:88%}
#rm-quiz-modal .rm-document-lines span:nth-child(3){width:95%}
#rm-quiz-modal .rm-document-lines span:nth-child(4){width:67%}
#rm-quiz-modal .rm-icon-motifs{display:flex;gap:12px;justify-content:center;width:100%;color:#6b836d}
#rm-quiz-modal .rm-icon-motifs svg{width:34px;height:34px;max-width:25%;padding:7px;border:1px solid currentColor;border-radius:50%}
#rm-quiz-modal .rm-gift-card[data-gift=variety] .rm-icon-document{color:#946b73}
#rm-quiz-modal .rm-gift-card[data-gift=rhythm] .rm-icon-document{color:#617b97}
#rm-quiz-modal .rm-gift-card[data-gift=steady] .rm-icon-document{background:#f3f5ee;box-shadow:10px 11px 0 #647d6f;color:#617866}
#rm-quiz-modal .rm-gift-card[data-gift=steady] .rm-icon-motifs{color:#d4e3d2}
#rm-quiz-modal .rm-bonus-strip{grid-template-columns:56px minmax(0,1fr)!important;gap:13px}
#rm-quiz-modal .rm-bonus-icon{display:grid;place-items:center;width:55px;height:62px;padding:15px;background:#fdf9f4;color:#906c55;border:1px solid #e2ccc6;border-radius:9px}
#rm-quiz-modal .qa-download-icon svg{width:22px;height:22px}
.v10-specialty .v10-specialty-symbol{display:grid;place-items:center;width:62px;height:62px;padding:12px;border:1px solid #cbd6cb;border-radius:50%;color:#af856c;margin-bottom:18px}
.rm-icon-approach{display:flex;gap:13px;margin-top:26px}
.rm-icon-approach span{display:grid;place-items:center;width:62px;height:62px;border:1px solid #9aa99b;color:#d0decf;border-radius:50%;padding:17px}
.v3-first .rm-apple-heart svg{width:77%;height:77%;display:block;color:#78917a;stroke-width:1.3}
@media(max-width:620px){
 #rm-quiz-modal .rm-icon-intro-band{gap:8px;margin:15px 0}
 #rm-quiz-modal .rm-icon-intro-band span{width:53px;height:53px;padding:15px}
 #rm-quiz-modal .rm-icon-document{width:155px;aspect-ratio:1;gap:13px;padding:17px}
 #rm-quiz-modal .rm-icon-document>svg{width:53px;height:53px}
 #rm-quiz-modal .rm-icon-motifs svg{width:30px;height:30px}
 #rm-quiz-modal .rm-choice .rm-choice-symbol{width:42px;height:42px;min-width:42px}
 .v10-specialty .v10-specialty-symbol{width:52px;height:52px}
}
"""
(A/'js'/'v17.js').write_text(JS,encoding='utf-8')
(A/'v17.css').write_text(CSS,encoding='utf-8')
(A/'images'/'favicon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#e6eae3"/><text x="11" y="44" fill="#526951" font-size="37" font-family="Georgia" font-style="italic">R</text></svg>',encoding='utf-8')
for location in ['index.html','cv/index.html','blog/index.html','privacidad/index.html']:
 path=ROOT/location
 s=path.read_text(encoding='utf-8')
 s=s.replace('favicon.png','favicon.svg')
 s=re.sub(r'<img\b[^>]*src="[^"]*rosela-monogram\.png"[^>]*>', '<span class="rm-monogram" aria-hidden="true">RM</span>',s)
 s=re.sub(r'<script type="module" src="[^"]*assets/js/v16\.js\?v=16"></script>','',s)
 s=re.sub(r'<link rel="stylesheet" href="[^"]*assets/v16\.css\?v=16">','',s)
 if location=='index.html':
  s=re.sub(r'<div class="rm-apple-heart"[^>]*><img[^>]*></div>','<div class="rm-apple-heart" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21C8 16 4 11 4 7a4 4 0 0 1 8-1.5A4 4 0 0 1 20 7c0 4-4 9-8 14Z"/><path d="M12 18c0-5 2-9 5-10"/></svg></div>',s)
 if 'v17.js' not in s:
  prefix='assets/' if location=='index.html' else '../assets/'
  s=s.replace('</head>',f'<link rel="stylesheet" href="{prefix}v17.css?v=17"><script type="module" src="{prefix}js/v17.js?v=17"></script></head>')
 path.write_text(s,encoding='utf-8')
# Modal. Remove decorative cutouts before the page ever loads them.
p=A/'js'/'experience.js';s=p.read_text(encoding='utf-8')
s=s.replace("const leaf = new URL('../images/leaf-02.webp', import.meta.url).href;",'')
s=s.replace('<img src="\'+leaf+\'" alt="" width="420" height="500">','')
s=re.sub(r"  const previewImg=document\.createElement\('img'\);.*?previewImg\.decoding='async';",
 "  const previewImg=document.createElement('div');previewImg.className='rm-gift-document-icon';previewImg.setAttribute('aria-hidden','true');",s,flags=re.S)
s=re.sub(r"  const bonusThumb=document\.createElement\('img'\);.*?bonusThumb\.height=120;",
 "  const bonusThumb=document.createElement('span');bonusThumb.className='rm-bonus-document-icon';bonusThumb.setAttribute('aria-hidden','true');",s,flags=re.S)
p.write_text(s,encoding='utf-8')
# Preserve motion but remove Apple-Heart frame animation.
p=A/'js'/'hero-v9.js'
p.write_text("""/* Subtle motion, SVG only */
(()=>{const hero=document.querySelector('.v3-first[data-motion-v9]');if(!hero)return;
const title=hero.querySelector('[data-parallax="heading"]');const pic=hero.querySelector('.v3-portrait img');const glyph=hero.querySelector('.rm-apple-heart svg');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');const wide=matchMedia('(min-width:781px)');
let queued=false;function move(){queued=false;const y=Math.max(0,scrollY-hero.offsetTop);if(reduced.matches)return;
if(wide.matches){if(title)title.style.transform='translateY('+Math.min(12,y*.022)+'px)';if(pic)pic.style.transform='translateY('+(-Math.min(13,y*.021))+'px)';}
if(glyph)glyph.style.transform='translateY('+(-4*Math.sin(Math.min(1,y/260)*Math.PI))+'px)';}
function run(){if(!queued){queued=true;requestAnimationFrame(move);}}
addEventListener('scroll',run,{passive:true});addEventListener('resize',run,{passive:true});run();})();
""",encoding='utf-8')
# Blog templater must not regenerate raster-logo pages.
p=ROOT/'scripts'/'build_blog.py';s=p.read_text(encoding='utf-8')
s=s.replace('favicon.png','favicon.svg')
s=re.sub(r'<img src="\.\./\.\./assets/images/rosela-monogram\.png"[^>]*>', '<span class="rm-monogram" aria-hidden="true">RM</span>',s)
if 'v17.css' not in s:
 s=s.replace('<title>{title} | Rosela Miranda</title></head>', '<link rel="stylesheet" href="../../assets/v17.css?v=17"><script type="module" src="../../assets/js/v17.js?v=17"></script><title>{title} | Rosela Miranda</title></head>')
p.write_text(s,encoding='utf-8')
for path in ['index.html','cv/index.html','blog/index.html','privacidad/index.html']:
 s=(ROOT/path).read_text()
 assert 'v16.js?v=16' not in s and 'rosela-monogram.png' not in s, path
print('Site icon redesign: 4 pages + dynamic blog template + quiz + hero; decorative PNG sticker modules removed')
