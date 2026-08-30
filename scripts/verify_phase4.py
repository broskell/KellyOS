from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path("docs/handoffs/phase4-verify")
OUT.mkdir(parents=True, exist_ok=True)
BASE = __import__("os").environ.get("KELLOS_PREVIEW", "http://127.0.0.1:4173")


def shot(page, name):
    page.screenshot(path=str(OUT / name), full_page=False)


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    ctx0 = browser.new_context(java_script_enabled=False, viewport={"width": 1280, "height": 800})
    page = ctx0.new_page()
    page.goto(f"{BASE}/", wait_until="domcontentloaded")
    html = page.content()
    assert "I develop AI-assisted" in html, "no-JS home missing disclosure"
    page.goto(f"{BASE}/now", wait_until="domcontentloaded")
    now_html = page.content()
    assert "I'm actually stuck on" in now_html, "no-JS /now missing Phase 0 Now copy"
    assert "August 2026" in now_html, "no-JS /now missing updated date"
    page.goto(f"{BASE}/timeline", wait_until="domcontentloaded")
    tl = page.content()
    assert "CGPA 9.44" in tl, "no-JS /timeline missing academic record"
    assert "KELL.OS 1.0" in tl, "no-JS /timeline missing 1.0 era"
    assert "Future Interns" not in tl, "timeline must not list Future Interns as a credential"
    page.goto(f"{BASE}/read/now", wait_until="domcontentloaded")
    assert "I'm actually stuck on" in page.content()
    page.goto(f"{BASE}/read/timeline", wait_until="domcontentloaded")
    assert "CGPA 9.44" in page.content()
    page.goto(f"{BASE}/recycle", wait_until="domcontentloaded")
    rec = page.content()
    assert "SnippetVault" in rec
    assert "Thin and true beats rich and false" in rec
    shot(page, "nojs-recycle.png")
    ctx0.close()

    ctx = browser.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    page.goto(f"{BASE}/", wait_until="networkidle")
    skip = page.get_by_role("button", name="Skip")
    if skip.count():
        skip.click()
    page.wait_for_selector("text=I develop AI-assisted")
    assert page.locator("footer.os-taskbar").count() == 1
    box = page.locator("footer.os-taskbar").bounding_box()
    assert box and box["y"] > 500, f"taskbar y={box}"

    page.get_by_role("button", name="Start").click()
    start = page.locator(".os-menu")
    assert start.get_by_text("Now", exact=True).count() == 1
    assert start.get_by_text("Timeline", exact=True).count() == 1
    assert start.get_by_text("Terminal", exact=True).count() == 0
    assert start.get_by_text("KELL.AI", exact=True).count() == 0
    start.get_by_text("Now", exact=True).click()
    page.wait_for_selector('[data-wm-id="app:now"]')
    assert page.get_by_text("I'm actually stuck on").count()
    shot(page, "desktop-now.png")

    page.get_by_role("button", name="Start").click()
    page.locator(".os-menu").get_by_text("Timeline", exact=True).click()
    page.wait_for_selector('[data-wm-id="app:timeline"]')
    assert page.locator('[data-wm-id="app:now"]').count() == 1
    assert page.locator('[data-wm-id="app:timeline"]').count() == 1
    shot(page, "desktop-now-timeline.png")

    page.goto(f"{BASE}/recycle", wait_until="networkidle")
    page.wait_for_selector('[data-wm-id="app:recycle"]')
    assert page.get_by_text("Not everything I built was meant to survive").count()
    shot(page, "desktop-recycle.png")

    page.goto(f"{BASE}/projects", wait_until="networkidle")
    page.wait_for_selector("text=Also shipped")
    assert page.get_by_role("heading", name="Gallery").count() == 0
    shot(page, "desktop-projects.png")

    page.goto(f"{BASE}/project/langchain-openrouter-provider", wait_until="networkidle")
    page.wait_for_selector("text=And the part I won't dress up")
    assert page.locator("footer.os-taskbar").count() == 1
    shot(page, "desktop-case-study.png")

    page.goto(f"{BASE}/read/now", wait_until="networkidle")
    assert page.locator(".os-taskbar").count() == 0
    assert page.get_by_text("I'm actually stuck on").count()
    shot(page, "reader-now.png")

    page.goto(f"{BASE}/read/timeline", wait_until="networkidle")
    assert page.locator(".os-taskbar").count() == 0
    shot(page, "reader-timeline.png")
    ctx.close()

    ctxm = browser.new_context(viewport={"width": 390, "height": 844})
    page = ctxm.new_page()
    page.goto(f"{BASE}/", wait_until="networkidle")
    skip = page.get_by_role("button", name="Skip")
    if skip.count():
        skip.click()
    page.wait_for_selector("text=I develop AI-assisted")
    assert page.get_by_text("Getting around").count() == 0
    assert page.get_by_text("Now", exact=True).count() >= 1
    assert page.get_by_text("Timeline", exact=True).count() >= 1
    box = page.locator("footer.os-taskbar").bounding_box()
    assert box and box["y"] > 600, f"mobile taskbar y={box}"
    page.get_by_role("link", name="Now").first.click()
    page.wait_for_selector('[data-wm-id="app:now"]')
    pos = page.locator('[data-wm-id="app:now"]').evaluate("el => getComputedStyle(el).position")
    assert pos != "absolute", f"mobile WM overlapping via absolute: {pos}"
    shot(page, "mobile-now.png")
    ctxm.close()

    browser.close()

print("phase4 verify ok")
