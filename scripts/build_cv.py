#!/usr/bin/env python3
"""Create two downloadable one-page profile CVs from facts already published
on Rosela Miranda's professional web page. No credentials or contacts invented.
"""
from pathlib import Path
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase.pdfmetrics import stringWidth
import fitz
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"assets/cv";OUT.mkdir(parents=True,exist_ok=True)
W,H=595,842
DATA={
"ES":{
 "file":"Rosela_Miranda_CV_ES.pdf","role":"NUTRIÓLOGA CLÍNICA",
 "head":"Nutrición clínica con una mirada integral.",
 "intro":"Acompañamiento nutricional personalizado basado en historia clínica, estudios de laboratorio y estrategias realistas adaptadas a cada persona.",
 "s1":"EXPERIENCIA","jobs":[("2023 - ACTUALIDAD","Nutrióloga clínica · Medicalima, CDMX","Colaboración dentro de un equipo de salud integral. Enfoque en salud hormonal, metabólica, digestiva y tiroidea."),("2017 - ACTUALIDAD","Consulta privada","Atención nutricional personalizada, con estrategias de alimentación ajustadas a la historia y los objetivos individuales.")],
 "s2":"FORMACIÓN","degree":"Licenciatura en Nutrición","university":"Universidad Autónoma de Guadalajara",
 "s3":"FORMACIÓN CONTINUA","credentials":["Diplomado en Educador en Diabetes · Asociación Mexicana de Diabetes","Certificación en SOMP e Hipotiroidismo","Diplomado en Nutrición Bariátrica","Certificación ISAK Nivel I · Composición corporal"],
 "s4":"ÁREAS DE ACOMPAÑAMIENTO","specialties":"Salud hormonal femenina · Salud metabólica · Tiroides · Salud digestiva · Composición corporal · Nutrición bariátrica",
 "footer":"Resumen basado en la información profesional publicada en este sitio. Validación final de Rosela pendiente."
},
"EN":{
 "file":"Rosela_Miranda_CV_EN.pdf","role":"CLINICAL NUTRITIONIST",
 "head":"Clinical nutrition with a whole-person approach.",
 "intro":"Individualized nutrition support informed by health history, laboratory results, and practical strategies suited to each person's needs.",
 "s1":"EXPERIENCE","jobs":[("2023 - PRESENT","Clinical Nutritionist · Medicalima, Mexico City","Part of an integrated health care team, focusing on hormonal, metabolic, digestive, and thyroid-related nutrition."),("2017 - PRESENT","Private Nutrition Practice","Personalized nutrition guidance adapted to each patient's history, needs, and goals.")],
 "s2":"EDUCATION","degree":"Bachelor's Degree in Nutrition","university":"Universidad Autónoma de Guadalajara",
 "s3":"CONTINUING EDUCATION","credentials":["Diabetes Educator Diploma · Asociación Mexicana de Diabetes","Certification in PCOS and Hypothyroidism","Diploma in Bariatric Nutrition","ISAK Level I Certification · Body Composition"],
 "s4":"AREAS OF PRACTICE","specialties":"Women's hormonal health · Metabolic health · Thyroid conditions · Digestive health · Body composition · Bariatric nutrition",
 "footer":"Summary based on information published on this professional website. Final validation by Rosela pending."
}}
INK=HexColor("#34473d");ACC=HexColor("#a57668");SAGE=HexColor("#e7ebe2");GREY=HexColor("#657567")
def text(c,x,y,s,size=11,font="Helvetica",col=INK):
 # Fit long headings safely inside the page instead of exporting clipped text.
 max_width=W-x-48
 natural=stringWidth(s,font,size)
 size=min(size, size*max_width/max(natural,1))
 c.setFont(font,size);c.setFillColor(col);c.drawString(x,y,s)
def wrapped(c,x,y,s,width,size=10,lead=15,font="Helvetica",col=INK):
 lines=simpleSplit(s,font,size,width)
 for l in lines:text(c,x,y,l,size,font,col);y-=lead
 return y
def rule(c,y):
 c.setStrokeColor(HexColor("#cfd8cd"));c.setLineWidth(.8);c.line(48,y,547,y)
for lang,d in DATA.items():
 output=OUT/d["file"];c=Canvas(str(output),pagesize=(W,H))
 c.setTitle("Rosela Miranda | "+d["role"])
 c.setFillColor(HexColor("#f7f4ed"));c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(INK);c.rect(0,H-12,W,12,fill=1,stroke=0)
 text(c,46,775,"Rosela Miranda",34,"Times-Roman")
 text(c,48,745,d["role"],10,"Helvetica-Bold",ACC)
 text(c,47,707,d["head"],18,"Times-Roman")
 y=wrapped(c,47,674,d["intro"],490,10.3,16)
 rule(c,y-11)
 y-=44
 text(c,47,y,d["s1"],10,"Helvetica-Bold",ACC);y-=24
 for date,title,detail in d["jobs"]:
  text(c,47,y,date,8,"Helvetica-Bold",GREY)
  text(c,160,y,title,11,"Helvetica-Bold");y-=17
  y=wrapped(c,160,y,detail,380,9.4,13)-12
 rule(c,y+3);y-=28
 text(c,47,y,d["s2"],10,"Helvetica-Bold",ACC);y-=21
 text(c,47,y,d["degree"],12,"Times-Roman");y-=17
 text(c,47,y,d["university"],9.7,"Helvetica",GREY);y-=29
 text(c,47,y,d["s3"],10,"Helvetica-Bold",ACC);y-=20
 for cr in d["credentials"]:
  text(c,48,y,"·",10,"Helvetica-Bold",ACC)
  y=wrapped(c,65,y,cr,476,9.4,13)-6
 y-=7
 text(c,47,y,d["s4"],10,"Helvetica-Bold",ACC);y-=18
 y=wrapped(c,47,y,d["specialties"],493,9.4,14)
 rule(c,80)
 wrapped(c,47,63,d["footer"],500,7.5,11,col=GREY)
 c.save()
 doc=fitz.open(output)
 assert len(doc)==1
 page=doc[0];assert len(page.get_text())>450
 assert all(w[3]<=595 for w in page.get_text("words")),output.name
 print("CV",lang,output.name,output.stat().st_size,"bytes",len(page.get_text()),"chars")
