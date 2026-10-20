#!/usr/bin/env python3
"""Compose /assets/productivity/release-wall.webp: every release cover, in publication order.
MIT generator; the wall is a mosaic of the site's own CC0 cover art. Needs rsvg-convert and Pillow:
  uv run --with pillow python3 tools/make-release-wall.py
Columns are chosen to make the grid as square as possible; the last row may be partial."""
import json, math, os, subprocess, tempfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
papers = []
for d in sorted((ROOT / 'papers').iterdir()):
    meta = d / 'meta.json'
    if d.name.startswith('_') or not meta.exists():
        continue
    m = json.loads(meta.read_text())
    if (ROOT / 'assets' / 'art' / f"{m['slug']}.svg").exists():
        papers.append((m.get('datePublished', ''), m['slug']))
papers.sort()
W, H, G = 300, 100, 6
cols = max(1, round(math.sqrt(len(papers))))
rows = math.ceil(len(papers) / cols)
wall = Image.new('RGB', (cols * W + (cols + 1) * G, rows * H + (rows + 1) * G), (15, 26, 34))
with tempfile.TemporaryDirectory() as tmp:
    for i, (_, slug) in enumerate(papers):
        png = os.path.join(tmp, f'{i}.png')
        subprocess.run(['rsvg-convert', '-w', str(W), '-h', str(H), str(ROOT / 'assets' / 'art' / f'{slug}.svg'), '-o', png], check=True)
        r, c = divmod(i, cols)
        wall.paste(Image.open(png).convert('RGB'), (G + c * (W + G), G + r * (H + G)))
out = ROOT / 'assets' / 'productivity' / 'release-wall.webp'
wall.resize((2400, round(wall.height * 2400 / wall.width)), Image.LANCZOS).save(out, 'WEBP', quality=82, method=6)
print(f'{len(papers)} covers, {cols}x{rows} grid -> {out.relative_to(ROOT)} ({out.stat().st_size // 1024} kB)')
