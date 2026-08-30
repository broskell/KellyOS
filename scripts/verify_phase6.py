from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path("docs/handoffs/phase6-verify")
OUT.mkdir(parents=True, exist_ok=True)
BASE = __import__("os").environ.get("KELLOS_PREVIEW", "http://127.0.0.1:4173")


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
    ctx0.close()

    ctx = browser.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    page.goto(f"{BASE}/", wait_until="networkidle")
    skip = page.get_by_role("button", name="Skip")
    assert skip.count() == 1, "Skip missing on first frame"
    skip_op = skip.evaluate("el => getComputedStyle(el).opacity")
    boot_op = page.locator("[data-os-boot]").evaluate("el => getComputedStyle(el).opacity")
    assert float(skip_op) == 1, f"Skip not fully visible on first frame: opacity={skip_op}"
    assert float(boot_op) == 1, f"boot overlay faded in (Skip must be visible immediately): opacity={boot_op}"
    dur = page.evaluate(
        "() => getComputedStyle(document.documentElement).getPropertyValue('--kellos-duration-boot').trim()"
    )
    assert dur.endswith("ms") or dur.endswith("s"), f"boot duration token missing: {dur!r}"
    skip_boot(page)
    page.wait_for_selector("text=I develop AI-assisted")
    assert page.locator("footer.os-taskbar").count() == 1
    box = page.locator("footer.os-taskbar").bounding_box()
    assert box and box["y"] > 500, f"taskbar y={box}"

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
    assert_focus_ring(page.locator('[data-os-icons] .os-icon').first, "desktop icon")
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
    assert page.locator("footer.os-taskbar").count() == 1
    assert page.get_by_text("And the part I won't dress up").count()
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
    page.keyboard.press("Alt+Shift+F")
    focused_about = page.locator('[data-wm-id="app:about"] .os-titlebar').get_attribute("data-inactive")
    focused_proj = page.locator('[data-wm-id="app:projects"] .os-titlebar').get_attribute("data-inactive")
    assert focused_about in (None, "false") or focused_proj == "true"

    page.keyboard.press("Control+k")
    assert page.locator("[data-os-search]").count() == 0
    assert page.get_by_text("Command palette").count() == 0
    assert page.locator("footer.os-taskbar").count() == 1

    page.keyboard.press("Alt+r")
    page.wait_for_url("**/read/**")
    page.wait_for_selector("text=Back to desktop")
    page.locator("footer.os-taskbar").wait_for(state="detached")
    assert page.get_by_text("I develop AI-assisted").count()
    shot(page, "reader-alt-r.png")

    page.goto(f"{BASE}/now", wait_until="networkidle")
    page.wait_for_selector('[data-wm-id="app:now"]')
    assert page.get_by_text("I'm actually stuck on").count()
    page.goto(f"{BASE}/timeline", wait_until="networkidle")
    page.wait_for_selector('[data-wm-id="app:timeline"]')
    assert page.get_by_text("CGPA 9.44").count()
    ctx.close()

    ctx_rm = browser.new_context(
        viewport={"width": 1280, "height": 800},
        reduced_motion="reduce",
    )
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
    assert_focus_ring(page.get_by_role("link", name="Projects").first, "mobile icon")
    box = page.locator("footer.os-taskbar").bounding_box()
    assert box and box["y"] > 600, f"mobile taskbar y={box}"
    page.get_by_role("link", name="Projects").first.click()
    page.wait_for_selector('[data-wm-id="app:projects"]')
    pos = page.locator('[data-wm-id="app:projects"]').evaluate("el => getComputedStyle(el).position")
    assert pos != "absolute", f"mobile WM overlapping via absolute: {pos}"
    page.get_by_text("Landing a feature in LangChain", exact=False).first.click()
    page.wait_for_selector('[data-wm-id="doc:caseStudy:langchain-openrouter-provider"]')
    assert page.locator("footer.os-taskbar").count() == 1
    shot(page, "mobile-90s-path.png")
    ctxm.close()

    browser.close()

print("phase6 verify ok")
