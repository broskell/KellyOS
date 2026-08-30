from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path("docs/handoffs/phase3-verify")
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
    page.goto(f"{BASE}/read/about", wait_until="domcontentloaded")
    assert "I develop AI-assisted" in page.content()
    page.goto(f"{BASE}/project/langchain-openrouter-provider", wait_until="domcontentloaded")
    assert "ChatOpenRouter" in page.content()
    shot(page, "nojs-case-study.png")
    ctx0.close()

    ctx = browser.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    page.goto(f"{BASE}/", wait_until="networkidle")
    skip = page.get_by_role("button", name="Skip")
    if skip.count():
        skip.click()
    page.wait_for_selector("text=I develop AI-assisted")
    assert page.get_by_text("Getting around").count()
    about = page.locator('[data-wm-id="app:about"]')
    tip = page.locator('[data-wm-id="tip:getting-around"]')
    assert about.count() == 1
    assert tip.count() == 1
    ab = about.bounding_box()
    tb = tip.bounding_box()
    assert ab and tb
    assert tb["x"] >= ab["x"] + ab["width"] - 8, f"tip not to the right: about={ab} tip={tb}"
    box = page.locator("footer.os-taskbar").bounding_box()
    assert box and box["y"] > 500, f"taskbar y={box}"
    shot(page, "desktop-about.png")

    before = about.bounding_box()
    title = about.locator(".os-titlebar").first
    tbox = title.bounding_box()
    assert before and tbox
    page.mouse.move(tbox["x"] + 40, tbox["y"] + 8)
    page.mouse.down()
    page.mouse.move(tbox["x"] + 140, tbox["y"] + 8)
    page.mouse.up()
    after = about.bounding_box()
    assert after and after["x"] > before["x"] + 20, f"drag did not move window {before} -> {after}"

    about.get_by_role("button", name="Maximize").click()
    assert about.get_attribute("data-wm-mode") == "maximized"
    about.get_by_role("button", name="Maximize").click()
    assert about.get_attribute("data-wm-mode") == "normal"

    page.get_by_role("link", name="Projects").first.click()
    page.wait_for_selector('[data-wm-id="app:projects"]')
    assert page.locator('[data-wm-id="app:about"]').count() == 1
    assert page.locator('[data-wm-id="app:projects"]').count() == 1
    shot(page, "desktop-two-windows.png")

    page.goto(f"{BASE}/project/langchain-openrouter-provider", wait_until="networkidle")
    page.wait_for_selector("text=And the part I won't dress up")
    assert page.locator(".os-window").count() >= 1
    assert page.locator("footer.os-taskbar").count() == 1
    shot(page, "desktop-case-study.png")

    page.goto(f"{BASE}/read/about", wait_until="networkidle")
    assert page.locator("text=Reader Mode").count()
    assert page.locator(".os-taskbar").count() == 0
    shot(page, "reader-about.png")

    page.goto(f"{BASE}/skills", wait_until="networkidle")
    page.wait_for_selector("text=Externally verified")
    shot(page, "desktop-skills.png")
    ctx.close()

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
    about = page.locator('[data-wm-id="app:about"]')
    pos = about.evaluate("el => getComputedStyle(el).position")
    assert pos != "absolute", f"mobile WM overlapping via absolute: {pos}"
    assert about.locator(".os-resize").count() == 0
    shot(page, "mobile-about.png")
    ctxm.close()

    browser.close()

print("phase3 verify ok")
