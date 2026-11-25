"""Build high-quality step screenshots from the system screenshots in private/hq/.

    python scripts/screens-from-images.py private/hq-screens.json

hq-screens.json (kept in private/, it describes the live system):
  { "bases": { "<name>": { "src": "private/hq/x.jpg", "mask": [[x, y, w, h], ...],
                            "place": "top-left" | "center", "bg": "#ffffff" } },
    "steps": { "<step id>": "<base name>" } }

Every base is placed on a canvas with the same aspect ratio (1.86:1, like the screen recording),
so the image never jumps between steps; highlights are % of that canvas. Masks are pixel
rectangles in the source image and are blurred. Output: public/screens/<id>.jpg at full size.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageFilter

ASPECT = 1902 / 1022
root = Path(__file__).resolve().parent.parent
spec = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
out = root / "public" / "screens"
built = {}
for name, b in spec["bases"].items():
    im = Image.open(root / b["src"]).convert("RGB")
    for x, y, w, h in b.get("mask", []):
        box = (x, y, x + w, y + h)
        im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(8)), box)
    W = max(im.width, round(im.height * ASPECT))
    H = max(im.height, round(W / ASPECT))
    canvas = Image.new("RGB", (W, H), b.get("bg", "#ffffff"))
    if b.get("place") == "center":
        canvas.paste(im, ((W - im.width) // 2, (H - im.height) // 2))
    else:
        canvas.paste(im, (0, 0))
    built[name] = canvas
    print(name, f"{im.size} -> {canvas.size}")
for sid, name in spec["steps"].items():
    built[name].save(out / f"{sid}.jpg", "JPEG", quality=90, optimize=True, subsampling=0)
print(len(spec["steps"]), "screens")
