"""Compile Rosela's Pages CMS JSON journal into static HTML for GitHub Pages."""
from pathlib import Path
from datetime import date
from html import escape
import json, re
import markdown, bleach

root=Path(__file__).resolve().parent.parent
blog=root/'blog'
entries=json.loads((blog/'posts.json').read_text(encoding='utf8'))
valid=[]
for p in entries:
    if not isinstance(p,dict) or p.get('published') is not True: continue
    slug=str(p.get('slug','')).lower()
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',slug): continue
    try: d=date.fromisoformat(str(p.get('date'))[:10])
    except ValueError: continue
    if d>date.today() or not p.get('title') or not p.get('description'): continue
    valid.append((d,p))
valid.sort(key=lambda entry:entry[0],reverse=True)
esc=lambda s:escape(str(s or ''),quote=True)
def picture(p):
    path=str(p.get('cover') or '')
    if not (path.startswith('/rosela-miranda-web/assets/images/blog/') or path.startswith('https://')):return ''
    return f'<img class="rm-post-cover" src="{esc(path)}" alt="" loading="lazy">'
def make_article(d,p):
    clean=bleach.clean(markdown.markdown(str(p.get('body','')),extensions=['extra']),
        tags=['p','br','h2','h3','h4','ul','ol','li','blockquote','strong','em','a','img','hr','code','pre'],
        attributes={'a':['href','title'],'img':['src','alt','title']},
        protocols=['http','https','mailto'],strip=True)
    title=esc(p['title']);desc=esc(p['description']);day=d.strftime('%d / %m / %Y')
    return f'''<!doctype html><html lang="es-MX"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#e5e6e2">
<meta name="description" content="{desc}">
<link rel="icon" href="../../assets/images/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../assets/styles.css"><link rel="stylesheet" href="../../assets/v3.css"><link rel="stylesheet" href="../../assets/v4.css">
<script type="module" src="../../assets/js/site.js"></script><script type="module" src="../../assets/js/v3.js"></script><script type="module" src="../../assets/js/v4.js"></script>
<title>{title} | Rosela Miranda</title></head><body>
<a class="skip-link" href="#contenido">Saltar al contenido</a>
<header class="site-header" data-header><a class="brand" href="../../" aria-label="Rosela Miranda, inicio"><img src="../../assets/images/rosela-monogram.png" width="57" height="54" alt=""><span class="brand-wordmark">ROSELA <span>MIRANDA</span></span></a>
<button type="button" class="menu-toggle" data-menu-button aria-expanded="false" aria-controls="primary-nav" aria-label="Abrir menú"><span></span><span></span></button>
<nav class="nav" id="primary-nav" data-menu aria-label="Navegación principal"><a class="nav-link" href="../../">Inicio</a><a class="nav-link" href="../../cv/">Perfil profesional</a><a class="nav-link" href="../../start/">Test de hábitos ↗</a><a class="nav-link active" href="../">Blog</a><a class="nav-cta" href="../../#contacto">Hablemos ↗</a></nav></header>
<main class="rm-blog" id="contenido"><article class="rm-blog-article">
<p class="eyebrow">ROSELA MIRANDA / {day}</p><h1>{title}</h1>
<p class="rm-modal-desc">{desc}</p>{picture(p)}
<div class="rm-blog-body">{clean}</div>
<a class="rm-inline-link" href="../">← Volver al blog</a>
</article></main>
<footer class="footer"><div><a class="footer-name" href="../../">ROSELA MIRANDA</a><p>Una visión más clara de tu nutrición.</p></div><div class="footer-links"><a href="../../cv/">Perfil profesional</a><a href="../../start/">Test de hábitos</a><a href="../">Blog</a><a href="../../privacidad/">Privacidad</a></div><div class="footer-bottom"><span>© <span data-year>2026</span> Rosela Miranda</span><a href="../../">Volver al inicio ↑</a></div></footer></body></html>'''
template=(blog/'index.html').read_text(encoding='utf8')
marker='<!-- BLOG_ARTICLES -->'
if marker not in template: raise RuntimeError('Blog marker missing')
if valid:
    cards=[]
    for d,p in valid:
        cards.append(f'<a class="rm-post-card" href="{esc(p["slug"])}/">{picture(p)}'
            f'<span>{d.strftime("%d / %m / %Y")}</span>'
            f'<h3>{esc(p["title"])}</h3><p>{esc(p["description"])}</p></a>')
        path=blog / str(p['slug'])
        path.mkdir(parents=True,exist_ok=True)
        (path/'index.html').write_text(make_article(d,p),encoding='utf8')
    template=template.replace('<section class="v3-cms-posts"','<section class="v3-cms-posts has-posts"')
    template=template.replace(marker,'<div class="rm-post-grid">'+'\n'.join(cards)+'</div>')
else: template=template.replace(marker,'')
(blog/'index.html').write_text(template,encoding='utf8')
print(f'Journal generated: {len(valid)} published article(s)')
