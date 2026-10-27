from pathlib import Path
from PIL import Image
import numpy as np
p=Path(__file__).resolve().parents[1]/"assets/images/favicon.png"
a=np.array(Image.open(p).convert("RGBA"))
bg=np.array([37,69,54],dtype=float)
corner=np.median(a[:8,:8].reshape(-1,4),axis=0)
if np.max(abs(corner[:3]-bg))>4:
 difference=np.max(abs(a[:,:,:3].astype(float)-corner[:3]),axis=2)
 mask=np.clip((difference-4)/37,0,1)
 if corner[3]<100:mask=a[:,:,3].astype(float)/255
 count=int((mask>.5).sum())
 if not 25<count<a.shape[0]*a.shape[1]*.7:raise ValueError("Unexpected original logo coverage")
 tint=np.array([246,223,208],dtype=float)
 rgb=np.uint8(bg*(1-mask[:,:,None])+tint*mask[:,:,None])
 output=np.dstack((rgb,np.full(mask.shape,255,dtype=np.uint8)))
 Image.fromarray(output,"RGBA").save(p,optimize=True)
 print("Favicon dark green background, original artwork preserved:",count)
else:print("Favicon already converted")
