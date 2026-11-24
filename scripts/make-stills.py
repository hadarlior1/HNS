"""Presenter image on a black background -> transparent avatar stills.

    python scripts/make-stills.py <image>

Writes public/avatar/fig-0/1/2.webp (540px wide, used while narrating) and
public/brand/presenter.webp (welcome screen). With a single still all three mouth frames are
the same image; replace them with frames from a HeyGen video for lip movement.
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


def alpha_mask(frame: np.ndarray) -> np.ndarray:
    """Background = near-black connected to the border, plus large pitch-black enclosed gaps.
    Stricter than the video cutout so dark clothing (navy trousers) is kept."""
    mx = frame.max(axis=2)
    dark = (mx < 18).astype(np.uint8)
    n, labels = cv2.connectedComponents(dark, connectivity=4)
    border = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    bg = np.isin(labels, border[border != 0])
    black = (mx < 5).astype(np.uint8)
    n2, lab2, stats, _ = cv2.connectedComponentsWithStats(black, connectivity=4)
    for k in range(1, n2):
        if stats[k, cv2.CC_STAT_AREA] > 3000:
            bg |= lab2 == k
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    return cv2.GaussianBlur(alpha, (3, 3), 0)

root = Path(__file__).resolve().parent.parent
src = Path(sys.argv[1])
bgr = cv2.imdecode(np.fromfile(str(src), dtype=np.uint8), cv2.IMREAD_COLOR)
alpha = alpha_mask(bgr)
rgba = np.dstack([cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB), alpha])

# crop to the figure with a small margin
ys, xs = np.where(alpha > 0)
pad = 12
y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, rgba.shape[0])
x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, rgba.shape[1])
img = Image.fromarray(rgba[y0:y1, x0:x1])

def save(im: Image.Image, width: int, out: Path) -> None:
    h = round(im.height * width / im.width)
    im.resize((width, h), Image.LANCZOS).save(out, "WEBP", quality=88, method=6)
    print(out.relative_to(root), f"{width}x{h}")

# avatar frames keep the original canvas proportions (figure centred, full height)
full = Image.fromarray(rgba)
for i in range(3):
    save(full, 540, root / "public" / "avatar" / f"fig-{i}.webp")
save(img, 404, root / "public" / "brand" / "presenter.webp")
