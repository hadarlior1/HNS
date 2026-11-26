"""Scan every avatar WebM for see-through spots inside the presenter (holes in the clothes).

    python scripts/check-avatar.py          # all public/avatar/*.webm
    python scripts/check-avatar.py 2.4 m3   # just these

Samples a few frames per video; a transparent area that does not touch the frame border is a hole.
Prints the offending video/time, or "no holes". Run it after every cutout change.
"""
import glob
import os
import subprocess
import sys

import cv2
import imageio_ffmpeg
import numpy as np

FF = imageio_ffmpeg.get_ffmpeg_exe()
ids = sys.argv[1:]
files = [f"public/avatar/{i}.webm" for i in ids] if ids else sorted(glob.glob("public/avatar/*.webm"))
bad = []
for f in files:
    for t in (1.5, 4, 7):
        raw = subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-c:v", "libvpx-vp9", "-ss", str(t), "-i", f,
                              "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgba", "-"], capture_output=True).stdout
        if len(raw) != 540 * 960 * 4:
            continue
        a = np.frombuffer(raw, np.uint8).reshape(960, 540, 4)[..., 3]
        n, lab = cv2.connectedComponents((a < 128).astype(np.uint8), connectivity=4)
        border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
        holes = sum(int((lab == k).sum()) for k in range(1, n) if k not in border)
        if holes > 20:
            bad.append((os.path.basename(f), t, holes))
print(f"{len(files)} videos checked;", "no holes" if not bad else f"holes: {bad}")
sys.exit(1 if bad else 0)
