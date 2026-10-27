#!/usr/bin/env python3
"""Build Rosela's image-first blog from the sole Pages CMS JSON editorial source.
Posts and sorting are editable through Pages CMS; no runtime database is needed.
"""
from pathlib import Path
from datetime import date
from urllib.parse import urlsplit
from html import escape
import json
import re
import markdown
import bleach

ROOT = Path(__file__).resolve().parent.parent
BLOG = ROOT / "blog"
POSTS = BLOG / "posts.json"
TEMPLATE = BLOG / "index.html"
MARKER = "<!-- BLOG_CARDS -->"
URL_BASE = "/rosela-miranda-web/assets/images/blog/"

def esc(value):
    return escape(str(value if value is not None else ""), quote=True)

def safe_image(value):
    """Allow URL-based editorial photos or uploaded files in the blog media folder."""
    value = str(value or "").strip()
    if not value or any(ch in value for ch in '"\'\\\n\r\t()<>'):
        return ""
    if value.startswith(URL_BASE):
        return value
    parsed = urlsplit(value)
    if parsed.scheme == "https" and parsed.netloc and not parsed.username:
        return value
    return ""

def to_article(p, day):
    title, subtitle, slug = esc(p["title"]), esc(p["description"]), esc(p["slug"])
    # Date is sufficient in the article header; categories remain editable as card metadata.
    content = markdown.markdown(str(p.get("body") or ""), extensions=["extra", "sane_lists"])
    content = bleach.clean(
        content,
        tags=["p","br","h2","h3","h4","ul","ol","li","blockquote","strong","em","a","img","hr","code","pre"],
        attributes={"a":["href","title"],"img":["src","alt","title"]},
        protocols=["https","http","mailto"],
        strip=True,
    )
    cover = safe_image(p.get("cover"))
    detail = safe_image(p.get("image2"))
    cover_html = f'<img class="v3-article-second" src="{esc(cover)}" alt="" decoding="async">' if cover else ""
    detail_html = f'<img class="v3-article-second" src="{esc(detail)}" alt="" loading="lazy" decoding="async">' if detail else ""
    return f'''<!doctype html><html lang="es-MX"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#e5e6e2">
<meta name="description" content="{subtitle}">
<link rel="icon" href="../../assets/images/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../assets/styles.css"><link rel="stylesheet" href="../../assets/v3.css"><link rel="stylesheet" href="../../assets/v4.css?v=mobile6">
<script type="module" src="../../assets/js/site.js?v=gifts13"></script><script type="module" src="../../assets/js/v3.js?v=mobile6"></script>
<link rel="stylesheet" href="../../assets/v17.css?v=17"><script type="module" src="../../assets/js/v17.js?v=17"></script><link rel="stylesheet" href="../../assets/v18.css?v=20261027v11"><script type="module" src="../../assets/js/v18.js?v=20261027v11"></script><title>{title} | Rosela Miranda</title></head><body class="v3-site">
<a class="skip-link" href="#contenido">Saltar al contenido</a>
<header class="v3-header" data-header>
<a class="v3-brand" href="../../" aria-label="Rosela Miranda, inicio"><img class="rm-original-logo" src="../../assets/images/rosela-monogram.png" width="48" height="62" decoding="async" alt=""><span class="v3-wordmark"><span>Rosela</span> Miranda</span></a>
<button type="button" class="menu-toggle v3-mobile-menu" aria-label="Abrir menú" data-menu-button aria-controls="primary-nav" aria-expanded="false"><span></span><span></span></button>
<nav class="v3-nav" id="primary-nav" data-menu aria-label="Navegación principal"><a href="../../">Inicio</a><a href="../../cv/#acompanamiento">A quién acompaño</a><a href="../../cv/#enfoque">Mi enfoque</a><a href="../../cv/#perfil-profesional">Perfil Profesional</a><button type="button" data-open-quiz>Test de hábitos</button><a href="../../blog/">Blog</a></nav></header>
<main id="contenido" class="v3-blog-gallery"><article class="rm-blog-article" data-post="{slug}">
<p class="v3-label"><time datetime="{day.isoformat()}">{day.strftime("%d · %m · %Y")}</time></p>
<h1>{title}</h1><p class="rm-modal-desc">{subtitle}</p>
{cover_html}<div class="rm-blog-body">{content}</div>{detail_html}
<a class="rm-inline-link" href="../">← Volver al blog</a></article></main>
<footer class="v3-footer"><a href="../../" aria-label="Rosela Miranda inicio"><img class="rm-original-logo" src="../../assets/images/rosela-monogram.png" width="48" height="62" decoding="async" alt=""></a>
<span>© <span data-year>2026</span> Rosela Miranda</span><div><a href="../../cv/">Perfil</a><a href="../">Blog</a><a href="../../privacidad/">Privacidad</a><button type="button" data-open-contact>Contacto</button></div></footer>
</body></html>'''

raw = json.loads(POSTS.read_text(encoding="utf-8"))
if not isinstance(raw, list):
    raise ValueError("blog/posts.json must contain a list of articles")
today = date.today()
published = []
slugs = set()
for item in raw:
    if not isinstance(item, dict) or item.get("published") is not True:
        continue
    slug = str(item.get("slug") or "").strip()
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        print(f"Skip invalid slug: {slug!r}")
        continue
    if slug in slugs:
        raise ValueError(f"Duplicated blog slug: {slug}")
    try:
        day = date.fromisoformat(str(item.get("date") or "")[:10])
    except ValueError:
        print(f"Skip article with invalid date: {slug}")
        continue
    if day > today or not item.get("title") or not item.get("description"):
        continue
    try:
        position = int(item.get("position", 100))
    except (ValueError, TypeError):
        position = 100
    slugs.add(slug)
    published.append((position, -day.toordinal(), slug, item, day))
published.sort(key=lambda row: (row[0], row[1], row[2]))

html = TEMPLATE.read_text(encoding="utf-8")
if MARKER not in html:
    raise ValueError("Missing blog build marker")
cards = []
for index, (_, _, slug, item, day) in enumerate(published, start=1):
    hero = safe_image(item.get("cover"))
    styles = f' style="--cover:url(&quot;{esc(hero)}&quot;)"' if hero else ""
    label = esc(item.get("label") or "ROSELA MIRANDA · JOURNAL")
    cards.append(
        f'<a class="v3-blog-card v3-blog-card-{index}" href="{esc(slug)}/" data-article="{esc(slug)}"{styles}>'
        f'<span class="v3-card-kicker">{label}</span>'
        '<div class="v3-card-copy">'
        f'<h2>{esc(item["title"])}</h2><p>{esc(item["description"])}</p>'
        '<span class="v3-card-arrow" aria-hidden="true">↗</span></div></a>'
    )
    directory = BLOG / slug
    directory.mkdir(parents=True, exist_ok=True)
    (directory / "index.html").write_text(to_article(item, day), encoding="utf-8")
if cards:
    html = html.replace(MARKER, "\n".join(cards))
else:
    html = html.replace(MARKER, '<div class="v3-blog-no-posts" aria-live="polite"></div>')
TEMPLATE.write_text(html, encoding="utf-8")
print(f"Blog: {len(cards)} published articles built and sorted by position.")
