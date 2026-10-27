#!/usr/bin/env python3
"""Generate four genuinely animated, brand-monochrome question GIFs.
Each uses a three-tone color family, classic nutrition/wellness line art,
and a smooth 2.8s looping motion, with WebP static fallback for reduced motion.
Deterministic render. No AI photographs or PNG cutouts.
"""
from pathlib import Path
from math import pi, sin, cos
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"assets/images/quiz-gifs"
OUT.mkdir(parents=True,exist_ok=True)
S=320
themes={
 "plan":((215,222,211),(49,83,63),(103,134,108),(173,194,175)),
 "variety":((78,102,145),(234,241,253),(185,205,230),(130,160,196)),
 "rhythm":((123,74,83),(252,232,232),(220,182,188),(175,120,134)),
 "steady":((37,54,47),(230,239,220),(174,201,176),(109,145,119))
}
def L(d,pts,fill,width=5):
 d.line(pts,fill=fill,width=width,joint="curve")
def circle(d,center,r,outline,width=5,fill=None):
 x,y=center;d.ellipse((x-r,y-r,x+r,y+r),outline=outline,width=width,fill=fill)
def glyph(d,name,h,m,l,phase):
 # Each motif is made from geometric icon strokes; no extraneous objects.
 shift=int(4*sin(phase*2*pi))
 cx,cy=160,160+shift
 if name=="plan":
  # meal-planning calendar with a cutlery icon
  d.rounded_rectangle((95,102+shift,225,216+shift),radius=14,outline=h,width=7)
  L(d,[(95,137+shift),(225,137+shift)],h,6)
  L(d,[(126,93+shift),(126,118+shift)],h,6)
  L(d,[(195,93+shift),(195,118+shift)],h,6)
  for row in range(2):
   for col in range(3):
    px=124+col*36;py=164+row*29+shift
    circle(d,(px,py),5,h if row==0 else m,3)
  L(d,[(140,197+shift),(151,207+shift),(181,178+shift)],h,6)
 elif name=="variety":
  d.arc((80,120+shift,240,235+shift),start=0,end=180,fill=h,width=8)
  L(d,[(83,177+shift),(237,177+shift)],h,8)
  L(d,[(113,220+shift),(207,220+shift)],h,6)
  L(d,[(118,115+shift),(118,72+shift)],m,6)
  L(d,[(133,115+shift),(133,72+shift)],m,6)
  L(d,[(118,88+shift),(133,88+shift)],m,5)
  L(d,[(193,121+shift),(193,69+shift)],h,7)
  d.arc((159,65+shift,193,115+shift),start=270,end=90,fill=h,width=6)
  d.arc((140,104+shift,174,138+shift),start=5,end=140,fill=l,width=5)
 elif name=="rhythm":
  circle(d,(cx,cy),77,h,8)
  circle(d,(cx,cy),62,m,3)
  L(d,[(cx,cy),(cx,cy-41)],h,8)
  L(d,[(cx,cy),(cx+29,cy+17)],h,8)
  circle(d,(cx,cy),7,h,4)
  for k in range(12):
   a=(k/12)*2*pi
   x1=cx+cos(a)*64;y1=cy+sin(a)*64
   x2=cx+cos(a)*71;y2=cy+sin(a)*71
   L(d,[(x1,y1),(x2,y2)],m,3)
 elif name=="steady":
  # sprout with gently unfolding leaves
  L(d,[(160,232+shift),(160,116+shift)],h,8)
  d.ellipse((91,102+shift,166,166+shift),outline=h,width=7)
  d.ellipse((157,75+shift,226,145+shift),outline=h,width=7)
  L(d,[(160,150+shift),(121,130+shift)],m,5)
  L(d,[(160,123+shift),(194,109+shift)],m,5)
  d.arc((95,170+shift,225,258+shift),0,180,fill=l,width=6)
def generate(name, colors):
 bg,h,m,l=colors
 # fixed custom palette gives exactly the one background and three chromatic tones
 palette=[]
 for rgb in [bg,h,m,l]: palette.extend(rgb)
 palette.extend([0,0,0]*(256-4))
 pal=Image.new("P",(1,1));pal.putpalette(palette)
 frames=[]
 for i in range(32):
  phase=i/32
  img=Image.new("RGB",(S,S),bg)
  d=ImageDraw.Draw(img)
  cx,cy=160,160
  # rotating orbit and changing length convey frame-by-frame movement
  radius=125
  circle(d,(cx,cy),radius,l,2)
  progress=(40+int(270*(.5+.5*sin(phase*2*pi))))
  a=int(i*360/32)
  d.arc((cx-radius,cy-radius,cx+radius,cy+radius),a,a+progress,fill=m,width=4)
  glyph(d,name,h,m,l,phase)
  # four anchor points rotate slightly, all within tonal palette
  for j in range(4):
   angle=2*pi*(j/4+phase*.11)
   x=int(cx+radius*cos(angle));y=int(cy+radius*sin(angle))
   circle(d,(x,y),3,h,0,fill=h)
  indexed=img.quantize(palette=pal,dither=Image.Dither.NONE)
  frames.append(indexed)
 gif=OUT/(name+".gif")
 # Transparent GIF: background index 0 disappears; only chromatic line artwork remains.
 frames[0].save(gif,save_all=True,append_images=frames[1:],optimize=False,
                duration=85,loop=0,disposal=2,transparency=0)
 still=frames[0].convert("RGBA")
 px=still.load()
 for yy in range(S):
  for xx in range(S):
   if frames[0].getpixel((xx,yy))==0: px[xx,yy]=(0,0,0,0)
 still.save(OUT/(name+"-still.webp"),format="WEBP",quality=92,method=5)
 probe=Image.open(gif)
 assert probe.info.get("transparency")==0 and probe.n_frames==32
 assert Image.open(OUT/(name+"-still.webp")).convert("RGBA").getpixel((0,0))[3]==0
 print(name,"GIF",gif.stat().st_size,"bytes","frames",len(frames),"tones",len(set(frames[0].getdata())))
if __name__=="__main__":
 for n,c in themes.items():generate(n,c)
 assert len(list(OUT.glob("*.gif")))==4
