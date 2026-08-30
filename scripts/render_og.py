"""Rasterize public/og.svg to public/og.png (1200x630). Honest wordmark, not a product shot."""
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SVG = (ROOT / "public" / "og.svg").read_text(encoding="utf8")
OUT = ROOT / "public" / "og.png"

HTML = f"""<!doctype html><html><head><style>
html,body{{margin:0;padding:0;background:#008080}}
</style></head><body>{SVG}</body></html>"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1200, "height": 630})
    page.set_content(HTML, wait_until="domcontentloaded")
    page.screenshot(path=str(OUT), type="png")
    browser.close()

print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")
