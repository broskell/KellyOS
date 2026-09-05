#!/usr/bin/env python
"""
Clean the hero portrait for the 26' site:
  1. Remove the small light "sparkle" watermark in the bottom-right corner
     (it sits on the near-black background, so it fills seamlessly to black).
  2. Save an optimized JPEG to public/content-assets/portrait.jpg — the exact
     path the hero (<ImageWithFallback src="/content-assets/portrait.jpg">) reads.

Usage:
  python scripts/clean-portrait.py <path-to-your-photo>
  # e.g. python scripts/clean-portrait.py public/content-assets/portrait-raw.jpg

Safe to re-run. Only the extreme bottom-right corner is touched; the rest of the
image is copied through untouched.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

OUT = Path("public/content-assets/portrait.jpg")


def clean(src: Path) -> None:
    img = Image.open(src).convert("RGB")
    w, h = img.size
    arr = np.asarray(img).astype(np.int16)

    # Bottom-right corner box where the sparkle lives (~22% of each side).
    bw = max(48, int(w * 0.22))
    bh = max(48, int(h * 0.22))
    y0, x0 = h - bh, w - bw
    box = arr[y0:h, x0:w]

    lum = box @ np.array([0.299, 0.587, 0.114])
    # Local background = dark base of the corner (robust to the bright mark).
    bg_lum = np.percentile(lum, 15)
    bg_rgb = np.array(
        [np.percentile(box[..., c], 15) for c in range(3)], dtype=np.int16
    )

    # Watermark = pixels clearly brighter than the dark background.
    thresh = bg_lum + 22
    mask = (lum > thresh).astype(np.uint8) * 255

    covered = int((mask > 0).sum())
    if covered == 0:
        print("! No bright mark found in the bottom-right corner.")
        print("  The corner is already clean, or the watermark is elsewhere —")
        print("  saving the image as-is. Tell me if a mark remains.")
    else:
        # Grow the mask a little to swallow the anti-aliased edge.
        m = Image.fromarray(mask, "L").filter(ImageFilter.MaxFilter(5))
        m = np.asarray(m) > 0
        for c in range(3):
            ch = box[..., c]
            ch[m] = bg_rgb[c]
        arr[y0:h, x0:w] = box
        pct = 100 * covered / (bw * bh)
        print(f"✓ Cleaned watermark: {covered} px ({pct:.2f}% of corner box).")

    out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    out.save(OUT, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"✓ Saved {OUT}  ({out.size[0]}x{out.size[1]})")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: python scripts/clean-portrait.py <path-to-your-photo>")
    src = Path(sys.argv[1])
    if not src.exists():
        sys.exit(f"not found: {src}")
    clean(src)
