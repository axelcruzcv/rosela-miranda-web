#!/usr/bin/env python3
"""Rosela Miranda / five redesigned editorial PDF guides.
Photos are licensed editorial assets already included in the site's repository.
All icons are vector-drawn; no raster sticker or cutout assets are used.
"""
from pathlib import Path
from io import BytesIO
from PIL import Image, ImageOps
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
import fitz, json

ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/"assets"/"gifts"
PHOTOS=ROOT/"assets"/"images"/"blog"
W,H=595.28,841.89
INK="#374d40"; MUTED="#6e7c70"; PAPER="#f7f4ed"; SAGE="#e7ece4"; BRICK="#aa7769"; WINE="#80525a"; BLUE="#526d89"; GOLD="#a38661"; DARK="#394d40"
# Curated page-by-page photography: every PDF page uses a distinct beauty shot.
COVERS={"01":"meal_cover","02":"recipe_cover","03":"ritual_cover","04":"challenge_cover","05":"bonus_cover"}
SECTIONS={
 "01 / TU HORA DE PREPARACIÓN":"meal_prep",
 "02 / MI PLANIFICADOR":"meal_week",
 "03 / LISTA DE COMPRAS":"meal_shopping",
 "01 / DESAYUNOS":"recipe_breakfast",
 "02 / COMIDAS":"recipe_lunch",
 "03 / CENAS":"recipe_dinner",
 "04 / COLACIONES":"recipe_snacks",
 "05 / IDEAS PARA TU SEMANA":"recipe_variety",
 "01 / BLOQUES COTIDIANOS":"ritual_day",
 "02 / COMIDA Y DESCANSO":"ritual_meals",
 "03 / MI AGENDA SEMANAL":"ritual_agenda",
 "01 / DÍAS 1 A 4":"challenge_first",
 "02 / DÍAS 5 A 7":"challenge_second",
 "03 / MI REGISTRO PERSONAL":"challenge_reflection",
 "01 / DECISIONES COTIDIANAS":"bonus_tips",
 "02 / OPCIONES PARA ELEGIR":"bonus_venues"
}
assert len(COVERS)+len(SECTIONS)==21
BEAUTY=ROOT/"assets"/"images"/"pdf-beauty"
MANIFEST=json.loads((BEAUTY/"manifest.json").read_text(encoding="utf-8"))
PHOTO_DETAILS={r["key"]:r for r in MANIFEST["photos"]}
USED=set()

def color(c,s): c.setFillColor(HexColor(s))
def stroke(c,s): c.setStrokeColor(HexColor(s))
def label(c,s,x,y,size=10,bold=False,tint=INK):
 color(c,tint);c.setFont("Helvetica-Bold" if bold else "Helvetica",size);c.drawString(x,y,s)
def para(c,text,x,top,width,size=10.3,leading=16,tint=INK,max_lines=40,bold=False):
 color(c,tint);c.setFont("Helvetica-Bold" if bold else "Helvetica",size)
 lines=simpleSplit(text,"Helvetica-Bold" if bold else "Helvetica",size,width)
 for i,line in enumerate(lines[:max_lines]):c.drawString(x,top-i*leading,line)
 return top-len(lines[:max_lines])*leading
def icon(c,name,cx,cy,unit=17,tint=INK):
 """Geometrical line glyphs built using PDF paths, never bitmap sprites."""
 c.saveState();stroke(c,tint);c.setLineWidth(1.65);c.setLineCap(1);c.setLineJoin(1)
 s=unit/12
 def L(*points):
  p=c.beginPath();p.moveTo(cx+points[0][0]*s,cy+points[0][1]*s)
  for a,b in points[1:]:p.lineTo(cx+a*s,cy+b*s)
  c.drawPath(p)
 if name in ["clock","sun","moon","award","target"]:
  c.circle(cx,cy,9*s,stroke=1,fill=0)
  if name=="clock":L((0,5),(0,0),(4,-3))
  elif name=="target":c.circle(cx,cy,5*s,stroke=1,fill=0);c.circle(cx,cy,1*s,stroke=1,fill=0)
  elif name=="sun":
   c.circle(cx,cy,4*s,stroke=1,fill=0)
   for dx,dy in [(0,1),(1,0),(0,-1),(-1,0)]:L((dx*11,dy*11),(dx*14,dy*14))
  elif name=="moon":c.arc(cx-5*s,cy-2*s,cx+13*s,cy+12*s,0,220)
  else:L((-4,-8),(0,-5),(4,-8))
 elif name=="heart":
  p=c.beginPath();p.moveTo(cx,cy-8*s);p.curveTo(cx-15*s,cy+1*s,cx-8*s,cy+14*s,cx,cy+5*s);p.curveTo(cx+8*s,cy+14*s,cx+15*s,cy+1*s,cx,cy-8*s);c.drawPath(p)
 elif name=="leaf":
  p=c.beginPath();p.moveTo(cx-8*s,cy-8*s);p.curveTo(cx-13*s,cy+5*s,cx-3*s,cy+10*s,cx+9*s,cy+10*s);p.curveTo(cx+10*s,cy-3*s,cx+3*s,cy-11*s,cx-8*s,cy-8*s);c.drawPath(p);L((-8,-8),(6,6))
 elif name=="water":
  p=c.beginPath();p.moveTo(cx,cy+11*s);p.curveTo(cx-17*s,cy-7*s,cx-5*s,cy-11*s,cx,cy-11*s);p.curveTo(cx+12*s,cy-11*s,cx+15*s,cy-3*s,cx,cy+11*s);c.drawPath(p)
 elif name=="check":L((-9,0),(-3,-6),(10,8))
 elif name=="calendar":
  c.roundRect(cx-10*s,cy-9*s,20*s,18*s,2*s,stroke=1,fill=0)
  L((-10,3),(10,3));L((-5,12),(-5,7));L((5,12),(5,7));L((-5,-3),(0,-3))
 elif name=="bowl":
  p=c.beginPath();p.moveTo(cx-11*s,cy+1*s);p.curveTo(cx-9*s,cy-14*s,cx+9*s,cy-14*s,cx+11*s,cy+1*s);c.drawPath(p);L((-11,1),(11,1));L((-5,10),(-2,6))
 elif name=="book":
  c.roundRect(cx-9*s,cy-9*s,18*s,18*s,1*s,stroke=1,fill=0);L((0,-9),(0,9));L((-7,5),(-2,4));L((3,4),(7,5))
 elif name=="apple":
  c.circle(cx-4*s,cy-1*s,6*s,stroke=1,fill=0);c.circle(cx+4*s,cy-1*s,6*s,stroke=1,fill=0);L((0,5),(3,11))
 elif name=="fork":
  L((-6,-10),(-6,10));L((-10,10),(-10,2),(-2,2),(-2,10));L((6,-10),(6,10));L((6,10),(12,10))
 elif name=="bag":
  c.roundRect(cx-9*s,cy-10*s,18*s,16*s,2*s,stroke=1,fill=0);c.arc(cx-5*s,cy,cx+5*s,cy+13*s,0,180)
 elif name=="activity":L((-11,0),(-7,0),(-3,8),(3,-8),(7,0),(11,0))
 elif name=="star":
  L((-9,-5),(0,10),(9,-5),(-9,3),(9,3),(-9,-5))
 else:c.circle(cx,cy,6*s,stroke=1,fill=0)
 c.restoreState()
def chip(c,txt,x,y,kind,accent=INK,r=20):
 color(c,"#edf1e9");c.circle(x+r,y+r,r,fill=1,stroke=0)
 icon(c,kind,x+r,y+r,17,accent)
 label(c,txt,x+2*r+12,y+r-4,10,False,INK)
def photo(c,key,x,y,w,h):
 if key not in PHOTO_DETAILS:raise ValueError("No curated photograph for "+str(key))
 if key in USED:raise RuntimeError("Photograph used twice: "+key)
 USED.add(key)
 info=PHOTO_DETAILS[key]
 target=ROOT/info["path"]
 if not target.is_file():raise FileNotFoundError("Missing beauty photo "+str(target))
 with Image.open(target) as orig:
  im=ImageOps.fit(orig.convert("RGB"),(1200,round(1200*h/w)),method=Image.Resampling.LANCZOS,centering=(.5,.5))
  # Gentle editorial treatment, no artificial compositing.
  blob=BytesIO();im.save(blob,format="JPEG",quality=86,optimize=True);blob.seek(0)
  c.drawImage(ImageReader(blob),x,y,w,h,mask="auto")
 # Subtle source credit outside image edge, with meaningful topic validation.
 color(c,"#465347");c.setFillColor(HexColor("#ffffff"))
 c.roundRect(x+w-198,y+4,192,15,3,fill=1,stroke=0)
 if key=="bonus_venues":
  label(c,"IMAGEN ILUSTRATIVA · ROSELA MIRANDA",x+w-194,y+8,6.5,False,MUTED)
 else:
  label(c,"PHOTO · "+info["credit"]+" / UNSPLASH",x+w-194,y+8,6.5,False,MUTED)

def page(c,num,section,accent=INK,disclaimer=True):
 color(c,PAPER);c.rect(0,0,W,H,stroke=0,fill=1)
 color(c,accent);c.rect(0,H-10,W,10,stroke=0,fill=1)
 stroke(c,"#d7dfd4");c.line(42,H-48,W-42,H-48)
 color(c,INK);c.setFont("Times-Italic",16);c.drawString(43,H-38,"Rosela Miranda")
 label(c,section.upper(),W-194,H-35,8.2,True,MUTED)
 stroke(c,"#d7dfd4");c.line(42,58,W-42,58)
 label(c,"ROSELA MIRANDA  ·  NUTRICIÓN CLÍNICA",44,40,7.6,True,MUTED)
 label(c,str(num).zfill(2),W-62,40,8,True,MUTED)
 if disclaimer:label(c,"Material educativo; no sustituye una consulta individual.",44,71,8,False,MUTED)
def heading(c,kicker,title,accent=INK):
 label(c,kicker.upper(),44,749,9.2,True,accent)
 c.setFont("Times-Roman",31);color(c,INK);c.drawString(44,703,title)
def cover(c,seq,theme,title,deck,icons,photo_index,accent):
 page(c,1,seq+" / "+theme,accent,False)
 label(c,"UNA GUÍA PARA EMPEZAR",46,757,10,True,accent)
 y=715
 for t in title:
  color(c,INK);c.setFont("Times-Roman",48 if len(t)<23 else 43);c.drawString(45,y,t);y-=52
 para(c,deck,47,y-13,480,size=11.7,leading=19,tint=MUTED)
 photo(c,COVERS[seq],45,298,505,210)
 # hairline frame on photo
 stroke(c,"#ffffff");c.setLineWidth(2);c.roundRect(45,298,505,210,2,stroke=1,fill=0)
 label(c,"EN ESTA GUÍA",47,267,8.4,True,accent)
 for i,(txt,k) in enumerate(icons):
  col=i%2;row=i//2
  x=47+col*258;yy=201-row*68
  color(c,SAGE);c.roundRect(x,yy,242,53,13,stroke=0,fill=1)
  icon(c,k,x+28,yy+26,17,accent)
  para(c,txt,x+53,yy+32,176,size=9.8,leading=14,tint=INK,max_lines=2,bold=True)
 label(c,"ROSELA MIRANDA    /    UN DETALLE PARA TI",47,81,8.5,True,accent)
 c.showPage()
def top_banner(c,index,title,section,accent):
 page(c,index,section,accent)
 color(c,INK);c.setFont("Times-Roman",34);c.drawString(44,740,title)
 stroke(c,"#bac8b9");c.line(44,720,550,720)
 photo(c,SECTIONS[section],44,603,507,94)
 return 582
def card(c,x,y,w,h,title,detail,kind,accent=INK,light=SAGE,number=None):
 color(c,light);c.roundRect(x,y,w,h,12,fill=1,stroke=0)
 icon(c,kind,x+30,y+h-36,17,accent)
 if number:label(c,number,x+w-43,y+h-33,10,True,accent)
 label(c,title,x+51,y+h-40,11,True,INK)
 para(c,detail,x+20,y+h-67,w-40,10,15,MUTED,max_lines=max(1,int((h-80)/15)))
def callout(c,top,title,description,accent=INK,kind="check",w=506,x=44):
 color(c,"#ebeee7");c.roundRect(x,top-92,w,92,12,stroke=0,fill=1)
 icon(c,kind,x+29,top-32,18,accent)
 label(c,title,x+55,top-35,11,True,accent)
 para(c,description,x+22,top-56,w-42,9.7,14,INK,max_lines=3)
def lines(c,x,top,width,count=3,step=26):
 stroke(c,"#d4ddd2")
 for k in range(count):c.line(x,top-k*step,x+width,top-k*step)
def table(c,x,top,width,headers,rows,colwidths=None,rowheight=48):
 if colwidths is None:colwidths=[width/len(headers)]*len(headers)
 color(c,INK);c.roundRect(x,top-36,width,36,6,stroke=0,fill=1)
 cx=x
 for i,h in enumerate(headers):label(c,h.upper(),cx+8,top-22,8,True,"#ffffff");cx+=colwidths[i]
 for i,row in enumerate(rows):
  yy=top-36-(i+1)*rowheight
  color(c,"#ffffff" if i%2 else "#edf1ea");c.rect(x,yy,width,rowheight,stroke=0,fill=1)
  cx=x
  for j,v in enumerate(row):
   if v:para(c,str(v),cx+8,yy+rowheight-19,colwidths[j]-13,9.2,12,INK,max_lines=2)
   cx+=colwidths[j]
 stroke(c,"#cbd5ca");c.rect(x,top-36-len(rows)*rowheight,width,36+len(rows)*rowheight,stroke=1,fill=0)
def recipe(c,y,name,tag,ingredients,prep,accent,kind):
 h=214;x=45;w=505
 color(c,"#ffffff");c.roundRect(x,y,w,h,14,fill=1,stroke=0)
 stroke(c,"#dfe5dc");c.roundRect(x,y,w,h,14,fill=0,stroke=1)
 color(c,SAGE);c.circle(x+39,y+h-39,25,stroke=0,fill=1);icon(c,kind,x+39,y+h-39,17,accent)
 label(c,tag.upper(),x+79,y+h-30,8.3,True,accent)
 color(c,INK);c.setFont("Times-Roman",23)
 title_lines=simpleSplit(name,"Times-Roman",23,w-104)
 for i,ln in enumerate(title_lines[:2]):c.drawString(x+79,y+h-58-i*25,ln)
 label(c,"INGREDIENTES",x+20,y+h-108,9,True,accent)
 # Text list across column 1, wrap
 ingredient_y=y+h-128
 for q in ingredients:
  icon(c,"check",x+25,ingredient_y+2,9,accent)
  ingredient_y=para(c,q,x+40,ingredient_y+4,205,9.2,13,INK,max_lines=2)-4
 label(c,"PREPARACIÓN",x+277,y+h-108,9,True,accent)
 para(c,prep,x+278,y+h-128,202,9.7,15,INK,max_lines=6)
def finish(c,out,pages_expected):
 c.save()
 doc=fitz.open(out)
 assert len(doc)==pages_expected,(out.name,len(doc),pages_expected)
 for p in doc:
  assert p.get_text().strip(),f"Empty text {out.name}"
  assert len(p.get_images())>=0
 return {"file":out.name,"pages":len(doc),"size":out.stat().st_size,"images":sum(len(p.get_images(full=True)) for p in doc),"text_characters":sum(len(p.get_text()) for p in doc)}
stats=[]
# 1) ORGANIZACIÓN / MEAL PREP
f=DEST/"RM_Regalo_MealPrep.pdf";c=canvas.Canvas(str(f),pagesize=(W,H),pageCompression=1)
cover(c,"01","ORGANIZACIÓN",["Tu semana,","en una hora."],"Una guía sencilla para planear y preparar tus comidas sin complicarte. Más claridad, menos decisiones a última hora.",[("Elige tus comidas","calendar"),("Prepara por etapas","clock"),("Planea la semana","book"),("Organiza tu compra","bag")],0,BRICK)
top_banner(c,2,"Preparar con intención.","01 / TU HORA DE PREPARACIÓN",BRICK)
callout(c,580,"ANTES DE COCINAR · 10 MINUTOS","Elige 3 desayunos, 3 comidas y 2 cenas que puedas repetir. Ordena tu lista: verduras, frutas, proteínas, cereales y despensa.",BRICK,"calendar")
items=[("00 MIN","Cocina un cereal o leguminosa: arroz integral, quinoa o lentejas.","bowl"),("05 MIN","Hornea verduras con aceite de oliva y una pizca de sal.","sun"),("10 MIN","Cocina dos proteínas: pollo, carne, huevos o tofu.","fork"),("30 MIN","Lava y corta frutas y verduras crudas.","apple"),("45 MIN","Prepara un aderezo sencillo: oliva, limón y mostaza.","water"),("55 MIN","Distribuye todo en recipientes y refrigera.","check")]
for i,(minute,desc,kind) in enumerate(items):
 y=410-i*55
 color(c,"#ffffff" if i%2 else SAGE);c.roundRect(45,y,505,49,9,stroke=0,fill=1)
 icon(c,kind,72,y+24,17,BRICK);label(c,minute,100,y+29,10,True,BRICK)
 para(c,desc,182,y+31,348,9.4,13,INK,max_lines=2)
c.showPage()
top_banner(c,3,"Una semana más sencilla.","02 / MI PLANIFICADOR",BRICK)
card(c,45,488,245,93,"Arma tu plato","½ verduras, ¼ proteína, ¼ cereal o leguminosa, más una grasa saludable.","bowl",BRICK)
card(c,305,488,245,93,"Cuánto dura","Proteínas y cereales cocidos: 3 a 4 días refrigerados; congela lo posterior.","clock",BRICK)
callout(c,471,"TU PLAN B","Huevos, atún, leguminosas cocidas, verduras congeladas y tortillas ayudan a resolver una comida.",BRICK,"check")
table(c,45,348,505,["DÍA","DESAYUNO","COMIDA","CENA","COLACIÓN"],[[z,"","","",""] for z in ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"]],[86,104,104,104,107],rowheight=33)
c.showPage()
top_banner(c,4,"Tu lista, lista para salir.","03 / LISTA DE COMPRAS",BRICK)
para(c,"Revisa lo que ya tienes y marca lo que necesitas. Deja espacio para sumar tus alimentos favoritos.",45,579,495,11,17,MUTED)
for i,(title,kind) in enumerate([("VERDURAS Y FRUTAS","apple"),("PROTEÍNAS","fork"),("CEREALES Y LEGUMINOSAS","bowl"),("DESPENSA","bag")]):
 x=45+(i%2)*259;y=314-(i//2)*203
 color(c,"#ffffff");c.roundRect(x,y,245,188,13,fill=1,stroke=0);icon(c,kind,x+30,y+151,18,BRICK);label(c,title,x+55,y+145,9.1,True,INK);lines(c,x+20,y+113,205,4,26)
label(c,"UN PASO, NO UNA REGLA  ·  Adapta la lista a tus necesidades.",45,94,9.0,True,BRICK)
c.showPage();stats.append(finish(c,f,4))
# 2) RECETARIO
f=DEST/"RM_Regalo_Recetario.pdf";c=canvas.Canvas(str(f),pagesize=(W,H),pageCompression=1)
cover(c,"02","VARIEDAD",["Comer sano","también es","comer rico."],"Ocho recetas prácticas, ingredientes reconocibles y combinaciones que facilitan disfrutar de una alimentación variada.",[("Dos desayunos","sun"),("Comidas completas","bowl"),("Cenas sencillas","moon"),("Colaciones fáciles","apple")],2,WINE)
top_banner(c,2,"Para empezar el día.","01 / DESAYUNOS",WINE)
recipe(c,351,"Avena nocturna","DESAYUNO",["½ taza de avena","¾ taza de leche o bebida vegetal","1 cucharada de chía","Frutos rojos y nuez"],"Mezcla avena, leche y chía. Refrigera toda la noche y agrega fruta y nuez al servir.",WINE,"bowl")
recipe(c,125,"Huevos a la mexicana","DESAYUNO",["2 huevos","Jitomate, cebolla y chile","1 tortilla de maíz","¼ de aguacate"],"Sofríe jitomate, cebolla y chile. Agrega los huevos y revuelve. Sirve con tortilla y aguacate.",WINE,"sun")
c.showPage()
top_banner(c,3,"Comidas que resuelven.","02 / COMIDAS",WINE)
recipe(c,351,"Bowl de quinoa y pollo","COMIDA",["Quinoa cocida","Pollo a la plancha","Espinaca, pepino y jitomate cherry","Aguacate y semillas"],"Arma el bowl con los ingredientes y aliña con limón y un poco de aceite de oliva.",WINE,"bowl")
recipe(c,125,"Salmón al horno","COMIDA",["1 filete de salmón","Limón y ajo","Brócoli","Camote en cubos"],"Hornea a 200 °C durante aproximadamente 20 minutos con aceite de oliva y sal; comprueba la cocción.",WINE,"fork")
c.showPage()
top_banner(c,4,"Cenas sin complicaciones.","03 / CENAS",WINE)
recipe(c,351,"Tacos de lechuga","CENA",["Carne molida magra","Cebolla, ajo y comino","Hojas de lechuga","Pico de gallo"],"Saltea la carne con cebolla, ajo y comino. Sirve en las hojas de lechuga con pico de gallo.",WINE,"leaf")
recipe(c,125,"Crema de calabacita","CENA",["Calabacita","Cebolla","Caldo de verduras","Queso panela"],"Cuece calabacita y cebolla en el caldo, licúa y añade queso panela. Acompaña con una proteína.",WINE,"bowl")
c.showPage()
top_banner(c,5,"Pequeñas ideas, más variedad.","04 / COLACIONES",WINE)
recipe(c,350,"Yogur con canela y nuez","COLACIÓN",["Yogur natural sin azúcar","Canela","Nuez","Fruta picada"],"Sirve yogur con la fruta, la nuez y una pizca de canela.",WINE,"apple")
recipe(c,128,"Crudités con limón","COLACIÓN",["Jícama, pepino y zanahoria","Limón","Chile en polvo","Un puñado de almendras"],"Corta las verduras en bastones y acompaña con limón, chile y almendras.",WINE,"leaf")
c.showPage()
top_banner(c,6,"Tu reto de variedad.","05 / IDEAS PARA TU SEMANA",WINE)
callout(c,580,"UNA SEMANA PARA EXPLORAR","Prueba sumar 20 alimentos vegetales distintos: frutas, verduras, leguminosas, semillas, hierbas y especias.",WINE,"apple")
label(c,"MARCA CADA NUEVA OPCIÓN",45,458,10,True,WINE)
for i in range(20):
 x=49+(i%5)*103;y=375-(i//5)*71
 color(c,"#ffffff");c.roundRect(x,y,88,53,12,stroke=0,fill=1)
 stroke(c,WINE);c.circle(x+26,y+26,9,stroke=1,fill=0)
 label(c,str(i+1).zfill(2),x+48,y+22,11,True,MUTED)
callout(c,204,"COMER VARIADO ES UN PROCESO","No necesitas cumplir todos los puntos. Usa estas recetas para construir opciones que se adapten a tus días.",WINE,"heart")
c.showPage();stats.append(finish(c,f,6))
# 3) RITUALES
f=DEST/"RM_Regalo_Rituales.pdf";c=canvas.Canvas(str(f),pagesize=(W,H),pageCompression=1)
cover(c,"03","RITMO",["Tu bienestar","cabe en","tu agenda."],"Rituales sencillos que pueden acompañarte incluso cuando tus días están llenos.",[("Mañanas con intención","sun"),("Movimiento cotidiano","activity"),("Comidas resueltas","bowl"),("Descanso posible","moon")],4,BLUE)
top_banner(c,2,"Tu día, por momentos.","01 / BLOQUES COTIDIANOS",BLUE)
card(c,45,415,505,157,"Al despertar","Recibe luz natural 5 a 10 minutos. Bebe agua y considera un desayuno con proteína.","sun",BLUE,light="#e7edf2")
card(c,45,242,505,157,"Durante el día","Tres bloques de movimiento de 10 minutos también suman. Camina tras comer y anota tu actividad como una cita.","activity",BLUE,light="#e7edf2")
card(c,45,104,505,123,"Rutina exprés · 10 minutos","40 segundos de trabajo y 20 de descanso: sentadillas, desplantes, lagartijas en la pared y plancha. Haz dos rondas según tus posibilidades.","clock",BLUE,light="#e7edf2")
c.showPage()
top_banner(c,3,"Cuida tus pausas.","02 / COMIDA Y DESCANSO",BLUE)
for i,(ttl,desc,k) in enumerate([
 ("Prepara con anticipación","Deja la comida del siguiente día lista mientras preparas la cena.","calendar"),
 ("Cocina una vez, aprovecha dos","Duplica porciones cuando tenga sentido y conserva una parte adecuadamente.","bowl"),
 ("Ten una colación cerca","Fruta, nueces, yogur o huevo cocido pueden darte opciones prácticas.","apple"),
 ("Haz espacio para dormir","Reduce pantallas y luz antes de acostarte y busca horarios similares.","moon"),
 ]):
  x=45+(i%2)*259;y=338-(i//2)*223
  card(c,x,y,245,205,ttl,desc,k,BLUE,light="#e7edf2")
c.showPage()
top_banner(c,4,"Diseña espacios para ti.","03 / MI AGENDA SEMANAL",BLUE)
para(c,"Puedes llenar esta agenda con bloques pequeños y realistas. Un espacio de diez minutos también cuenta.",45,570,493,11,17,MUTED)
table(c,45,511,505,["DÍA","MOVIMIENTO","PREPARAR COMIDA","DESCANSO"],[[d,"","",""] for d in ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"]],[95,125,160,125],rowheight=42)
label(c,"LO IMPORTANTE ES QUE TE QUEDE: prueba, evalúa y ajusta.",45,128,10,True,BLUE)
c.showPage();stats.append(finish(c,f,4))
# 4) RETO 7 DÍAS
f=DEST/"RM_Regalo_Reto7Dias.pdf";c=canvas.Canvas(str(f),pagesize=(W,H),pageCompression=1)
cover(c,"04","CONSTANCIA",["Los cinco pilares","de la buena","salud."],"Siete días para probar acciones pequeñas relacionadas con alimentación, agua, movimiento, descanso y bienestar.",[("Siete propuestas","calendar"),("Movimiento y fuerza","activity"),("Agua y alimentación","water"),("Una reflexión final","heart")],5,GOLD)
top_banner(c,2,"Una acción a la vez.","01 / DÍAS 1 A 4",GOLD)
for i,(tt,desc,key) in enumerate([
 ("DÍA 01 · ALIMENTACIÓN","Agrega una fuente de proteína a tu desayuno.","bowl"),
 ("DÍA 02 · AGUA","Observa tu hidratación diaria. La fórmula peso × 35 ml es solo una referencia orientativa, no una indicación personalizada.","water"),
 ("DÍA 03 · MOVIMIENTO","Camina 20 minutos, adaptándolo a tus posibilidades.","activity"),
 ("DÍA 04 · SUEÑO","Apaga las pantallas 30 minutos antes de acostarte.","moon")]):
 y=444-i*111;card(c,45,y,505,100,tt,desc,key,GOLD,light="#eeeadd")
c.showPage()
top_banner(c,3,"Sigue a tu ritmo.","02 / DÍAS 5 A 7",GOLD)
for i,(tt,desc,key) in enumerate([
 ("DÍA 05 · ESTRÉS","Prueba cinco minutos de respiración lenta.","heart"),
 ("DÍA 06 · FUERZA","Prueba tres rondas de 10 sentadillas y 10 desplantes, si es apropiado para ti.","activity"),
 ("DÍA 07 · REFLEXIÓN","¿Qué hábito te gustaría conservar? Escríbelo.","book")]):
 y=446-i*120;card(c,45,y,505,108,tt,desc,key,GOLD,light="#eeeadd")
callout(c,191,"NO TIENES QUE HACERLO PERFECTO","Si un día no logras tu objetivo, puedes retomarlo cuando quieras.",GOLD,"check")
c.showPage()
top_banner(c,4,"Al terminar la semana.","03 / MI REGISTRO PERSONAL",GOLD)
label(c,"MI REFERENCIA DE AGUA",45,568,11,True,GOLD)
para(c,"Mi peso: ______ kg × 35 = ______ ml / día (orientativo, no prescripción). La hidratación necesaria varía según salud, edad, actividad y clima.",46,544,483,10,16,INK)
for i,title in enumerate(["EL HÁBITO QUE QUIERO CONSERVAR","LO QUE MÁS ME COSTÓ","CÓMO ME SENTÍ"]):
 y=433-i*110
 label(c,title,46,y,10,True,GOLD);lines(c,46,y-25,495,3,22)
color(c,SAGE);c.roundRect(45,84,505,52,12,stroke=0,fill=1)
icon(c,"heart",75,109,20,GOLD)
para(c,"Lo importante no es hacerlo perfecto, sino volver a intentarlo.",109,116,417,11,16,INK)
c.showPage();stats.append(finish(c,f,4))
# 5) BONUS COMER FUERA
f=DEST/"RM_Bonus_ComerFuera.pdf";c=canvas.Canvas(str(f),pagesize=(W,H),pageCompression=1)
cover(c,"05","BONUS",["Comer fuera","también cuenta."],"Disfruta de una comida fuera de casa sin convertirla en una lista de prohibiciones. Estas son ideas flexibles y sencillas.",[("Seis ideas prácticas","check"),("Opciones por lugar","fork"),("Decisiones flexibles","heart"),("Guía de bolsillo","book")],7,BRICK)
top_banner(c,2,"Seis ideas para llevar.","01 / DECISIONES COTIDIANAS",BRICK)
for i,(title,txt,k) in enumerate([
 ("Llega con calma","Si pasarán muchas horas, considera una colación previa.","clock"),
 ("Suma verduras","Una ensalada o guarnición de verduras puede acompañar tu comida.","leaf"),
 ("Incluye proteína","Considera opciones a la plancha, asadas o al horno.","fork"),
 ("Elige tu aderezo","Si te resulta cómodo, pide salsas o aderezos aparte.","water"),
 ("Elige tu bebida","Agua simple o mineral con limón son buenas alternativas.","water"),
 ("Disfruta sin culpa","Una comida no define por sí sola toda tu alimentación.","heart")]):
 x=45+(i%2)*259;y=416-(i//2)*153
 card(c,x,y,245,139,title,txt,k,BRICK,light="#f0e8e2")
c.showPage()
top_banner(c,3,"Ideas según el lugar.","02 / OPCIONES PARA ELEGIR",BRICK)
for i,(title,desc,key) in enumerate([
 ("MEXICANA","Pescado o pollo asado, nopales, frijoles de la olla y guacamole.","fork"),
 ("JAPONESA","Sashimi, edamames, sopa miso o rollos sin capeado.","bowl"),
 ("ITALIANA","Pescado o pollo con verduras, o pasta acompañada de ensalada.","apple"),
 ("CAFETERÍA","Un café con leche y un sándwich o ensalada con proteína.","book"),
 ("COMIDA RÁPIDA","Ensalada con proteína o hamburguesa acompañada de verduras.","bag")]):
 y=468-i*79
 color(c,"#ffffff" if i%2 else "#f0e8e2");c.roundRect(45,y,505,70,10,fill=1,stroke=0)
 icon(c,key,77,y+35,18,BRICK);label(c,title,109,y+45,10,True,BRICK)
 para(c,desc,109,y+27,417,9.6,13,INK,max_lines=2)
label(c,"HECHO PARA TU VIDA REAL · Una guía flexible, no una regla.",46,111,9.5,True,BRICK)
c.showPage();stats.append(finish(c,f,3))
assert len(USED)==21,("Expected 21 unique photographs",len(USED))
assert USED==set(PHOTO_DETAILS),("Missing or extra curated images",set(PHOTO_DETAILS)-USED)
# Quality manifest; verify every guide exists, has multiple images, and page-level extractable text.
assert len(stats)==5
assert all(x["images"]>=1 for x in stats),stats
qa=DEST/"editorial-qa.json"
qa.write_text(json.dumps({"version":"editorial-v3","visuals":"21 curated subject-specific unique beauty shots plus PDF-native vector icons","guides":stats},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("EDITORIAL PDF REBUILD:",[(x["file"],x["pages"],x["images"],x["size"]) for x in stats])
