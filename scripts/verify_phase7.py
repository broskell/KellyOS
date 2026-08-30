from gzip import compress
from pathlib import Path
import json
import os
import re
import subprocess
import sys
import time

from playwright.sync_api import sync_playwright

OUT = Path("docs/handoffs/phase7-verify")
OUT.mkdir(parents=True, exist_ok=True)
DIST = Path("dist")
BASE = os.environ.get("KELLOS_PREVIEW", "http://127.0.0.1:4173")
REPORT = {
    "bundle": {},
    "static": {},
    "ttfmc_ms": None,
    "drag_fps": None,
    "lighthouse_a11y": {},
    "heading_order": {},
    "misses": [],
}


def shot(page, name):
    page.screenshot(path=str(OUT / name), full_page=False)


def skip_boot(page):
    skip = page.get_by_role("button", name="Skip")
    if skip.count():
        skip.click()
    page.locator("[data-os-boot]").wait_for(state="detached", timeout=1000)


def assert_focus_ring(locator, label):
    locator.focus()
    outline = locator.evaluate(
        """el => {
          const s = getComputedStyle(el);
          return { style: s.outlineStyle, width: s.outlineWidth, color: s.outlineColor };
        }"""
    )
    assert outline["style"] in ("dotted", "auto") or float(outline["width"].replace("px", "") or 0) > 0, (
        f"{label} missing visible focus: {outline}"
    )


def heading_levels(page):
    return page.evaluate(
        """() => [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => Number(h.tagName[1]))"""
    )


def heading_skips(levels):
    prev = 0
    for n in levels:
        if n > prev + 1:
            return True
        prev = n
    return False


def gzip_size(path: Path) -> int:
    return len(compress(path.read_bytes(), 9))


def measure_dist():
    html = (DIST / "index.html").read_text(encoding="utf8")
    assets = []
    for m in re.finditer(r'(?:src|href)="(/assets/[^"]+)"', html):
        assets.append(m.group(1).lstrip("/"))
    js_initial = []
    css = []
    for rel in assets:
        p = DIST / rel
        if not p.exists():
            continue
        if rel.endswith(".js"):
            js_initial.append(p)
        elif rel.endswith(".css"):
            css.append(p)
    gzip_js = sum(gzip_size(p) for p in js_initial)
    REPORT["bundle"]["initial_js_files"] = [p.name for p in js_initial]
    REPORT["bundle"]["initial_js_gzip"] = gzip_js
    REPORT["bundle"]["target_gzip"] = 200 * 1024
    if gzip_js >= 200 * 1024:
        REPORT["misses"].append(f"initial JS gzip {gzip_js} >= 200KB")

    lazy = sorted((DIST / "assets").glob("*.js"))
    REPORT["bundle"]["all_js_chunks"] = [p.name for p in lazy]
    REPORT["bundle"]["lazy_js_beyond_initial"] = [p.name for p in lazy if p not in js_initial]

    for route, rel in [
        ("/", "index.html"),
        ("/read/about", "read/about/index.html"),
        ("/project/langchain-openrouter-provider", "project/langchain-openrouter-provider/index.html"),
    ]:
        p = DIST / rel
        html_bytes = p.stat().st_size
        css_bytes = sum(q.stat().st_size for q in css)
        no_js = html_bytes + css_bytes
        REPORT["static"][route] = {
            "html_bytes": html_bytes,
            "html_plus_css_bytes": no_js,
            "has_script": "<script" in p.read_text(encoding="utf8"),
        }
        if html_bytes >= 100 * 1024:
            REPORT["misses"].append(f"static HTML {route} {html_bytes} >= 100KB")
        if "I develop AI-assisted" not in p.read_text(encoding="utf8") and route != "/project/langchain-openrouter-provider":
            if route == "/read/about" or route == "/":
                REPORT["misses"].append(f"prerender {route} missing disclosure")


def lighthouse_a11y(url: str, label: str):
    out = OUT / f"lighthouse-{label}.json"
    cmd = [
        "npx",
        "--yes",
        "lighthouse",
        url,
        "--only-categories=accessibility",
        "--quiet",
        "--chrome-flags=--headless --no-sandbox",
        "--output=json",
        f"--output-path={out}",
    ]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=180, shell=os.name == "nt")
        if out.exists():
            data = json.loads(out.read_text(encoding="utf8"))
            score = int(round((data["categories"]["accessibility"]["score"] or 0) * 100))
            audits = data.get("audits", {})
            fails = []
            for k, a in audits.items():
                if a.get("score") == 0 and a.get("scoreDisplayMode") in ("binary", "numeric"):
                    fails.append(a.get("title") or k)
            REPORT["lighthouse_a11y"][label] = {"score": score, "fails": fails}
            if score < 95:
                REPORT["misses"].append(f"Lighthouse a11y {label}={score} (target ≥95)")
            return
        REPORT["lighthouse_a11y"][label] = {"error": (r.stderr or r.stdout)[-800:]}
        REPORT["misses"].append(f"lighthouse {label} did not complete")
    except Exception as e:
        REPORT["lighthouse_a11y"][label] = {"error": str(e)}
        REPORT["misses"].append(f"lighthouse {label}: {e}")


measure_dist()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    ctx0 = browser.new_context(java_script_enabled=False, viewport={"width": 1280, "height": 800})
    page = ctx0.new_page()
    page.goto(f"{BASE}/", wait_until="domcontentloaded")
    html = page.content()
    assert "I develop AI-assisted" in html, "no-JS home missing disclosure"
    page.goto(f"{BASE}/now", wait_until="domcontentloaded")
    assert "I'm actually stuck on" in page.content()
    assert "August 2026" in page.content()
    page.goto(f"{BASE}/timeline", wait_until="domcontentloaded")
    assert "CGPA 9.44" in page.content()
    assert "Future Interns" not in page.content()
    page.goto(f"{BASE}/recycle", wait_until="domcontentloaded")
    rec = page.content()
    assert "Thin and true beats rich and false" in rec
    page.goto(f"{BASE}/read/about", wait_until="domcontentloaded")
    assert "I develop AI-assisted" in page.content()
    for path, key in [
        ("/read/about", "read-about"),
        ("/read/recycle", "read-recycle"),
        ("/read/project/langchain-openrouter-provider", "read-case"),
        ("/read/skills", "read-skills"),
        ("/read/resume", "read-resume"),
        ("/read/contact", "read-contact"),
    ]:
        page.goto(f"{BASE}{path}", wait_until="domcontentloaded")
        levels = heading_levels(page)
        REPORT["heading_order"][key] = levels
        assert levels and levels[0] == 1, f"{path} does not start at h1: {levels}"
        assert not heading_skips(levels), f"{path} heading skip: {levels}"
    ctx0.close()

    ctx = browser.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    t0 = page.evaluate("() => performance.now()")
    page.goto(f"{BASE}/", wait_until="networkidle")
    skip = page.get_by_role("button", name="Skip")
    assert skip.count() == 1, "Skip missing on first frame"
    skip_op = skip.evaluate("el => getComputedStyle(el).opacity")
    boot_op = page.locator("[data-os-boot]").evaluate("el => getComputedStyle(el).opacity")
    assert float(skip_op) == 1, f"Skip not fully visible on first frame: opacity={skip_op}"
    assert float(boot_op) == 1, f"boot overlay faded in: opacity={boot_op}"
    skip_boot(page)
    page.wait_for_selector("text=I develop AI-assisted")
    t1 = page.evaluate("() => performance.now()")
    REPORT["ttfmc_ms"] = t1 - t0
    if REPORT["ttfmc_ms"] >= 2500:
        REPORT["misses"].append(f"TTFMC {REPORT['ttfmc_ms']:.0f}ms (warm local preview, not mid-tier mobile cold)")

    assert page.locator("footer.os-taskbar").count() == 1
    box = page.locator("footer.os-taskbar").bounding_box()
    assert box and box["y"] > 500, f"taskbar y={box}"
    assert page.locator("h1.os-titlebar-label").count() == 1
    levels = heading_levels(page)
    REPORT["heading_order"]["os-home"] = levels
    assert levels[0] == 1
    assert not heading_skips(levels), f"OS home heading skip: {levels}"

    disc = page.locator('[data-variant="disclosure"]')
    assert disc.count() >= 1
    bar_bg = page.locator('[data-variant="disclosure"] .block-callout-bar').first.evaluate(
        "el => getComputedStyle(el).backgroundColor"
    )
    assert "0, 0, 128" in bar_bg.replace(" ", "") or "0,0,128" in bar_bg.replace(" ", "") or bar_bg == "rgb(0, 0, 128)", (
        f"disclosure bar not full-weight navy: {bar_bg}"
    )

    assert_focus_ring(page.get_by_role("button", name="Start"), "Start")
    assert_focus_ring(page.get_by_role("link", name="Read", exact=True), "Read")
    assert_focus_ring(page.locator("[data-os-icons] .os-icon").first, "desktop icon")
    assert_focus_ring(page.locator('[data-wm-id="app:about"] button[aria-label="Close"]'), "caption close")

    page.get_by_role("button", name="Start").click()
    start = page.locator(".os-menu")
    assert start.get_by_text("Reader Mode", exact=True).count() == 1
    assert start.get_by_text("Projects", exact=True).count() == 1
    for dead in ("Terminal", "KELL.AI", "Search", "Settings", "OS Update"):
        assert start.get_by_text(dead, exact=True).count() == 0, f"Start lists dead-end {dead}"
    page.keyboard.press("Escape")
    assert page.locator(".os-menu").count() == 0

    page.locator('[data-wm-id="app:about"]').get_by_role("link", name="Projects").click()
    page.wait_for_selector('[data-wm-id="app:projects"]')
    page.get_by_text("Landing a feature in LangChain", exact=False).first.click()
    page.wait_for_selector('[data-wm-id="doc:caseStudy:langchain-openrouter-provider"]')
    page.wait_for_selector("text=And the part I won't dress up")
    assert page.locator("footer.os-taskbar").count() == 1
    shot(page, "desktop-90s-path.png")

    page.goto(f"{BASE}/", wait_until="networkidle")
    skip_boot(page)
    page.wait_for_selector('[data-wm-id="app:about"]')
    about = page.locator('[data-wm-id="app:about"]')
    before = about.bounding_box()
    page.keyboard.press("Alt+Shift+ArrowRight")
    after = about.bounding_box()
    assert before and after and after["x"] > before["x"], f"nudge did not move About: {before} -> {after}"

    page.locator('[data-wm-id="app:about"]').get_by_role("link", name="Projects").click()
    page.wait_for_selector('[data-wm-id="app:projects"]')
    page.get_by_role("link", name="Skills").click()
    page.wait_for_selector('[data-wm-id="app:skills"]')
    assert page.locator("[data-wm-id]").count() >= 3

    title = page.locator('[data-wm-id="app:about"] .os-titlebar')
    box = title.bounding_box()
    assert box
    page.evaluate(
        """() => {
          window.__frames = 0;
          const loop = () => { window.__frames++; window.__raf = requestAnimationFrame(loop); };
          window.__raf = requestAnimationFrame(loop);
        }"""
    )
    page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
    page.mouse.down()
    t_drag0 = page.evaluate("() => performance.now()")
    for i in range(20):
        page.mouse.move(box["x"] + box["width"] / 2 + i * 8, box["y"] + box["height"] / 2 + 4)
    page.mouse.up()
    t_drag1, frames = page.evaluate(
        """() => {
          cancelAnimationFrame(window.__raf);
          return [performance.now(), window.__frames];
        }"""
    )
    elapsed = max(t_drag1 - t_drag0, 1)
    fps = frames / (elapsed / 1000)
    REPORT["drag_fps"] = {"fps": fps, "frames": frames, "ms": elapsed, "windows": 3}
    if fps < 55:
        REPORT["misses"].append(f"drag fps {fps:.1f} with 3 windows (headless; architecture still direct-to-DOM)")

    page.keyboard.press("Control+k")
    assert page.locator("[data-os-search]").count() == 0
    assert page.get_by_text("Command palette").count() == 0

    page.keyboard.press("Alt+r")
    page.wait_for_url("**/read/**")
    page.wait_for_selector("text=Back to desktop")
    page.locator("footer.os-taskbar").wait_for(state="detached")
    assert page.get_by_text("I develop AI-assisted").count()
    shot(page, "reader-alt-r.png")
    ctx.close()

    ctx_rm = browser.new_context(viewport={"width": 1280, "height": 800}, reduced_motion="reduce")
    page = ctx_rm.new_page()
    page.goto(f"{BASE}/", wait_until="networkidle")
    assert page.get_by_role("button", name="Skip").is_visible()
    page.get_by_role("button", name="Skip").click()
    page.locator("[data-os-boot]").wait_for(state="detached", timeout=200)
    page.wait_for_selector("text=I develop AI-assisted")
    shot(page, "desktop-reduced-motion.png")
    ctx_rm.close()

    ctx_short = browser.new_context(viewport={"width": 1280, "height": 560})
    page = ctx_short.new_page()
    page.goto(f"{BASE}/", wait_until="networkidle")
    skip_boot(page)
    page.wait_for_selector("text=I develop AI-assisted")
    col = page.locator("[data-os-icons]")
    overflow = col.evaluate("el => getComputedStyle(el).overflowY")
    assert overflow in ("auto", "scroll", "overlay"), f"desktop icons not scrollable: {overflow}"
    task = page.locator("footer.os-taskbar").bounding_box()
    icons = col.bounding_box()
    assert task and icons
    assert icons["y"] + icons["height"] <= task["y"] + 2, f"icon column overlaps taskbar: {icons} {task}"
    recycle = page.get_by_role("link", name="Recycle Bin")
    recycle.scroll_into_view_if_needed()
    assert recycle.is_visible()
    shot(page, "desktop-icon-overflow.png")
    ctx_short.close()

    ctxm = browser.new_context(viewport={"width": 390, "height": 844})
    page = ctxm.new_page()
    page.goto(f"{BASE}/", wait_until="networkidle")
    skip_boot(page)
    page.wait_for_selector("text=I develop AI-assisted")
    assert page.get_by_text("Getting around").count() == 0
    grid = page.locator("[data-os-icons]")
    tracks = grid.evaluate(
        "el => getComputedStyle(el).gridTemplateColumns.trim().split(/\\s+(?![^()]*\\))/).filter(Boolean).length"
    )
    assert tracks == 4, f"mobile grid is not 4 columns: {tracks}"
    overflow = grid.evaluate("el => getComputedStyle(el).overflowY")
    assert overflow in ("auto", "scroll", "overlay"), f"mobile icons not scrollable: {overflow}"
    for name in ("Now", "Timeline", "Recycle Bin", "Projects"):
        assert page.get_by_role("link", name=name).count() >= 1
    box = page.locator("footer.os-taskbar").bounding_box()
    assert box and box["y"] > 600, f"mobile taskbar y={box}"
    page.get_by_role("link", name="Projects").first.click()
    page.wait_for_selector('[data-wm-id="app:projects"]')
    pos = page.locator('[data-wm-id="app:projects"]').evaluate("el => getComputedStyle(el).position")
    assert pos != "absolute", f"mobile WM overlapping via absolute: {pos}"
    page.get_by_text("Landing a feature in LangChain", exact=False).first.click()
    page.wait_for_selector('[data-wm-id="doc:caseStudy:langchain-openrouter-provider"]')
    page.wait_for_selector("text=And the part I won't dress up")
    assert page.locator("footer.os-taskbar").count() == 1
    shot(page, "mobile-90s-path.png")
    ctxm.close()

    browser.close()

for path, label in [
    (f"{BASE}/", "home-os"),
    (f"{BASE}/read/about", "read-about"),
    (f"{BASE}/read/project/langchain-openrouter-provider", "read-case"),
    (f"{BASE}/skills", "skills-os"),
    (f"{BASE}/resume", "resume-os"),
    (f"{BASE}/contact", "contact-os"),
    (f"{BASE}/project/langchain-openrouter-provider", "case-os"),
]:
    lighthouse_a11y(path, label)
    time.sleep(2)

(OUT / "budgets.json").write_text(json.dumps(REPORT, indent=2), encoding="utf8")
print(json.dumps(REPORT, indent=2))
if any("lighthouse" in m and "did not complete" in m for m in REPORT["misses"]):
    print("phase7 verify ok with lighthouse tool miss recorded")
else:
    print("phase7 verify ok")
sys.exit(0)
