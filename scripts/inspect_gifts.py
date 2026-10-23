from pathlib import Path
import json
import fitz

root = Path(__file__).resolve().parents[1]
data = []
for file in sorted((root / "assets" / "gifts").glob("*.pdf")):
    doc = fitz.open(file)
    data.append({"name":file.name,"pages":len(doc),"page_sizes":[[round(p.rect.width),round(p.rect.height)] for p in doc],"images":[len(p.get_images(full=True)) for p in doc],"text":[p.get_text(sort=True) for p in doc]})
dest=root/"scripts"/"_gift_audit.json"
dest.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")
print("PDF content inventory:",[(x["name"],x["pages"],x["images"]) for x in data])
