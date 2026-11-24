"""Build public/screens/<id>.jpg from frames of a screen recording, with personal data blurred.

    python scripts/screens-from-video.py <recording.mp4> private/screens.json

screens.json (kept in private/, it describes the live system):
  { "masks": { "<name>": [[x, y, w, h], ...] },          # pixel rectangles in the 1902x1022 frame
    "screens": { "<step id>": { "t": 31.0, "mask": ["<name>", ...] } } }

Raw frames go to private/raw/<id>.jpg; the published JPG is 1280px wide, quality 80.
"""
import json
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg
from PIL import Image, ImageFilter

root = Path(__file__).resolve().parent.parent
video, spec_path = sys.argv[1], Path(sys.argv[2])
spec = json.loads(spec_path.read_text(encoding="utf-8"))
only = set(sys.argv[3].split(",")) if len(sys.argv) > 3 else None
ff = imageio_ffmpeg.get_ffmpeg_exe()
raw_dir = root / "private" / "raw"
raw_dir.mkdir(parents=True, exist_ok=True)
out_dir = root / "public" / "screens"
out_dir.mkdir(parents=True, exist_ok=True)

for sid, s in spec["screens"].items():
    if only and sid not in only:
        continue
    raw = raw_dir / f"{sid}.jpg"
    subprocess.run([ff, "-hide_banner", "-loglevel", "error", "-y", "-ss", str(s["t"]), "-i", video,
                    "-frames:v", "1", "-q:v", "2", str(raw)], check=True)
    im = Image.open(raw).convert("RGB")
    for name in s.get("mask", []):
        for x, y, w, h in spec["masks"][name]:
            box = (x, y, x + w, y + h)
            im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(7)), box)
    im = im.resize((1280, round(im.height * 1280 / im.width)), Image.LANCZOS)
    im.save(out_dir / f"{sid}.jpg", "JPEG", quality=80, optimize=True)
    print(sid, "ok")
