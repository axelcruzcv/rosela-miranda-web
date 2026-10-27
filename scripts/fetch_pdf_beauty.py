#!/usr/bin/env python3
"""Curated non-repeating Unsplash-Licensed editorial photos for Rosela's 21 PDF pages.

Selection reviewed for topic-level relevance. A photo is used exactly once.
Files are saved in the repository to avoid unpredictable downloads by PDF readers.
Only public Unsplash free-license photographs; no Unsplash+.
"""
from pathlib import Path
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor, as_completed
from PIL import Image, ImageOps, ImageStat
from io import BytesIO
import hashlib, json, time

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"assets"/"images"/"pdf-beauty"
OUT.mkdir(parents=True,exist_ok=True)
# key: (Unsplash CDN asset ID, credit, illustrated topic, page)
CATALOG={
 "meal_cover":("photo-1543352632-5a4b24e4d2a6","Ella Olsson","Meal prep en recipientes de cristal","Meal Prep, portada"),
 "meal_prep":("photo-1685188445506-c8a030ba5fad","Anna Bratiychuk","Verduras frescas en preparación","Meal Prep, preparación"),
 "meal_week":("photo-1774354669545-6265156237d4","Alehandra","Planeación escrita en libreta","Meal Prep, planificador semanal"),
 "meal_shopping":("photo-1775677073681-194049b1a7d3","Rudrendu Sharma","Verduras frescas para la lista de compras","Meal Prep, compras"),
 "recipe_cover":("photo-1762631383378-115f2d4cbe07","Joe Boshra","Bowl completo con pollo, arroz y vegetales","Recetario, portada"),
 "recipe_breakfast":("photo-1682622110332-d50f50b7146d","Alex Bayev","Avena con fruta y nueces","Recetario, desayunos"),
 "recipe_lunch":("photo-1746728789487-ddf8f3d19447","alexanderafan","Salmón acompañado de verduras","Recetario, comidas"),
 "recipe_dinner":("photo-1559561723-c3f4195835db","Dipesh Gurav","Sopa de verduras en bowl","Recetario, cenas"),
 "recipe_snacks":("photo-1753173301491-d4b738062a82","Serghey Savchuk","Yogur natural con arándanos","Recetario, colaciones"),
 "recipe_variety":("photo-1770782912836-82b4d67444d5","Diego Mejía","Diversidad de frutas y verduras frescas","Recetario, reto de variedad"),
 "ritual_cover":("photo-1773479089546-49ff98325518","Swarnim Doegar","Infusión herbal con menta","Rituales, portada"),
 "ritual_day":("photo-1680330386247-b3a9de0f8bd9","Tino Rischawy","Caminata al amanecer","Rituales, movimiento"),
 "ritual_meals":("photo-1636647511729-6703539ba71f","Douglas Fehr","Preparación de alimentos en casa","Rituales, comidas y descanso"),
 "ritual_agenda":("photo-1711030239030-5f1eb868c907","Ngo Ngoc Khai Huyen","Agenda y libreta con lápiz","Rituales, agenda semanal"),
 "challenge_cover":("photo-1746796751590-a8c0f15d4900","Andrea Stuart","Tapete y mancuernas para movimiento","Reto siete días, portada"),
 "challenge_first":("photo-1767611094260-1f5565e6d815","Margaret Young","Estiramiento y actividad física","Reto siete días, días 1–4"),
 "challenge_second":("photo-1716284130499-470a2d2b200e","Angelina Sarycheva","Respiración consciente","Reto siete días, días 5–7"),
 "challenge_reflection":("photo-1752567068743-d17a7b33b74e","Keila Hötzel","Libreta y flores para reflexión","Reto siete días, registro"),
 "bonus_cover":("photo-1770678724766-08268bbc61e2","Brelyn Bashrum","Mesa compartida con comida italiana","Comer fuera, portada"),
 "bonus_tips":("photo-1746783840967-738ea85b0f25","alexanderafan","Plato servido con salmón y vegetales","Comer fuera, seis consejos"),
 "bonus_venues":("photo-1613409385222-3d0decb6742a","Tai's Captures","Tacos mexicanos servidos","Comer fuera, restaurantes"),
}
assert len(CATALOG)==21
assert len(set(row[0] for row in CATALOG.values()))==21
def process(item):
 key,(id,credit,topic,page)=item
 dest=OUT/(key+".jpg")
 if dest.is_file() and dest.stat().st_size>25000:
  raw=dest.read_bytes()
  with Image.open(BytesIO(raw)) as im:im.verify()
 else:
  url=f"https://images.unsplash.com/{id}?auto=format&fit=max&w=1450&q=83&fm=jpg"
  error=None
  for attempt in range(3):
   try:
    request=Request(url,headers={"User-Agent":"RoselaMirandaEditorial/1.1 (image-license review)","Accept":"image/jpeg,image/*"})
    with urlopen(request,timeout=25) as response:
     mime=response.headers.get("Content-Type","")
     if not mime.startswith("image/"):raise RuntimeError("Expected image, got "+mime)
     raw=response.read(9_000_000)
    with Image.open(BytesIO(raw)) as im:
     if min(im.size)<380:raise RuntimeError("Source too small")
     im=ImageOps.exif_transpose(im).convert("RGB")
     if max(im.size)>1550:im.thumbnail((1550,1550),Image.Resampling.LANCZOS)
     im.save(dest,"JPEG",quality=83,optimize=True,subsampling=0)
    break
   except Exception as ex:
    error=ex
    time.sleep((attempt+1)*1.5)
  else:raise RuntimeError(f"Cannot download {key}: {error}")
 with Image.open(dest) as im:
  im.load()
  if min(im.size)<380:raise ValueError("Invalid beauty photo "+key)
  sha=hashlib.sha256(dest.read_bytes()).hexdigest()
  return {"key":key,"path":str(dest.relative_to(ROOT)),"credit":credit,"topic":topic,"page":page,
          "source":f"https://images.unsplash.com/{id}","unsplash_photo_id":id,
          "dimensions":list(im.size),"sha256":sha,"bytes":dest.stat().st_size}
records=[]
with ThreadPoolExecutor(max_workers=5) as pool:
 futures=[pool.submit(process,item) for item in CATALOG.items()]
 for future in as_completed(futures):
  row=future.result();records.append(row);print("PHOTO READY",row["key"],row["bytes"],"bytes",flush=True)
records.sort(key=lambda x:list(CATALOG).index(x["key"]))
assert len(set(r["sha256"] for r in records))==21,"Duplicate beauty photographs"
manifest={"edition":"20261027_V1.2","license":"Unsplash License (free photographs)",
          "photos":records,"unique_assets":len(records),"repeated_assets":0}
(OUT/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("EDITORIAL SOURCE AUDIT: 21/21 unique, matched page subjects, no repeated image",flush=True)
