from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path("docs/handoffs/phase2-verify")
OUT.mkdir(parents=True, exist_ok=True)
BASE = "http://127.0.0.1:4173"

def shot(page, name):
    page.screenshot(path=str(OUT / name), full_page=False)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # No JS: crawler / recruiter fallback
    ctx0 = browser.new_context(java_script_enabled=False, viewport={"width": 1280, "height": 800})
    page = ctx0.new_page()
    page.goto(f"{BASE}/", wait_until="domcontentloaded")
    html = page.content()
    assert "I develop AI-assisted" in html, "no-JS home missing disclosure"
    page.goto(f"{BASE}/read/about", wait_until="domcontentloaded")
    html = page.content()
    assert "I develop AI-assisted" in html
    page.goto(f"{BASE}/project/langchain-openrouter-provider", wait_until="domcontentloaded")
    html = page.content()
    assert "ChatOpenRouter" in html
    shot(page, "nojs-case-study.png")
    ctx0.close()

    # Desktop with JS
    ctx = browser.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    page.goto(f"{BASE}/", wait_until="networkidle")
    skip = page.get_by_role("button", name="Skip")
    if skip.count():
        skip.click()
    page.wait_for_selector("text=I develop AI-assisted")
    # tip should exist on desktop
    assert page.get_by_text("Getting around").count()
    # taskbar at bottom: footer.os-taskbar y > window/2
    box = page.locator("footer.os-taskbar").bounding_box()
    assert box and box["y"] > 500, f"taskbar y={box}"
    shot(page, "desktop-about.png")

    page.goto(f"{BASE}/project/langchain-openrouter-provider", wait_until="networkidle")
    page.wait_for_selector("text=And the part I won't dress up")
    shot(page, "desktop-case-study.png")

    page.goto(f"{BASE}/read/about", wait_until="networkidle")
    assert page.locator("text=Reader Mode").count()
    assert page.locator(".os-taskbar").count() == 0
    shot(page, "reader-about.png")

    page.goto(f"{BASE}/skills", wait_until="networkidle")
    page.wait_for_selector("text=Externally verified")
    shot(page, "desktop-skills.png")
    ctx.close()

    # Mobile
    ctxm = browser.new_context(viewport={"width": 390, "height": 844})
    page = ctxm.new_page()
    page.goto(f"{BASE}/", wait_until="networkidle")
    skip = page.get_by_role("button", name="Skip")
    if skip.count():
        skip.click()
    page.wait_for_selector("text=I develop AI-assisted")
    assert page.get_by_text("Getting around").count() == 0
    box = page.locator("footer.os-taskbar").bounding_box()
    assert box and box["y"] > 600, f"mobile taskbar y={box}"
    shot(page, "mobile-about.png")
    ctxm.close()

    browser.close()

print("phase2 verify ok")
