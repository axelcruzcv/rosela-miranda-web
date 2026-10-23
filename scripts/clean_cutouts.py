#!/usr/bin/env python3
"""Build production-ready transparent PNG cutouts from editorial illustration WebPs.

Remove disconnected source-sheet debris; retain all substantive foreground objects,
preserve high-resolution RGBA edges and crop to visible subject bounds.
Deterministic build: suitable for versioning through GitHub Actions.
"""
from __future__ import annotations
import json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/images/illustrations"
DEST = ROOT / "assets/images/illustrations-clean"
STRUCTURE = np.ones((3, 3), dtype=np.uint8)
DEST.mkdir(parents=True, exist_ok=True)
report = []
for path in sorted(SOURCE.glob("*.webp")):
    # Sheets contain intentionally distinct sticker assets and are not standalone cutouts.
    if path.stem.endswith("-sheet"):
        continue
    with Image.open(path) as im:
        rgba = np.asarray(im.convert("RGBA")).copy()
    h, w = rgba.shape[:2]
    alpha = rgba[:, :, 3]
    solid = alpha >= 45
    labels, component_count = ndimage.label(solid, structure=STRUCTURE)
    sizes = np.bincount(labels.ravel())
    sizes[0] = 0
    max_area = int(sizes.max()) if len(sizes) > 1 else 0
    if max_area < 60:
        raise RuntimeError(f"Cannot identify foreground of {path.name}")
    minimum_area = max(35, int(max_area * 0.14))
    keep_ids = np.flatnonzero(sizes >= minimum_area)
    keep_ids = keep_ids[keep_ids != 0]
    if not len(keep_ids):
        raise RuntimeError(f"No retained objects in {path.name}")
    mask = np.isin(labels, keep_ids)
    # Retain original anti-aliased edge pixels immediately around the silhouette.
    # Never leave disconnected semi-transparent source debris outside it.
    clean_region = ndimage.binary_dilation(mask, iterations=2)
    rgba[:, :, 3] = np.where(clean_region, alpha, 0).astype(np.uint8)
    ys, xs = np.where(rgba[:, :, 3] >= 4)
    if not len(xs):
        raise RuntimeError(f"Empty clipped PNG: {path.name}")
    pad = 7
    x0, x1 = max(0, int(xs.min())-pad), min(w, int(xs.max())+pad+1)
    y0, y1 = max(0, int(ys.min())-pad), min(h, int(ys.max())+pad+1)
    out = Image.fromarray(rgba[y0:y1, x0:x1, :], "RGBA")
    destination = DEST / (path.stem + ".png")
    out.save(destination, format="PNG", optimize=True, compress_level=9)
    entry = {
        "name": path.stem, "original": [w,h], "clean": [out.width,out.height],
        "components_detected": int(component_count),
        "components_kept": int(len(keep_ids)),
        "fragments_removed": int(component_count-len(keep_ids)),
        "alpha_transparency": round(float(np.mean(alpha < 250)),4),
        "bytes": destination.stat().st_size
    }
    report.append(entry)
    print(f"{path.stem:24s} {w}x{h} -> {out.width}x{out.height}; "
          f"removed {entry['fragments_removed']} disconnected fragments; "
          f"kept {entry['components_kept']}")
manifest = {"version":2, "method":"connected foreground components + RGBA trim",
            "component_min_fraction":0.14, "artworks":report}
(DEST / "manifest.json").write_text(
    json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(f"SUCCESS: {len(report)} cleaned, transparent PNG illustrations")
