from pathlib import Path
import os
import sys

from playwright.sync_api import sync_playwright

OUT = Path("docs/handoffs/phase9-verify")
OUT.mkdir(parents=True, exist_ok=True)
BASE = os.environ.get("KELLOS_PREVIEW", "http://127.0.0.1:4173")


def shot(page, name):
    page.screenshot(path=str(OUT / name), full_page=False)


def skip_boot(page):
    skip = page.get_by_role("button", name="Skip")
    if skip.count():
        skip.click()
    page.locator("[data-os-boot]").wait_for(state="detached", timeout=1000)


UNVERIFIED_PR = "https://github.com/langchain-ai/langchain/pull/39301"
UNVERIFIED_ISSUE = "https://github.com/langchain-ai/langchain/issues/39298"


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    ctx0 = browser.new_context(java_script_enabled=False, viewport={"width": 1280, "height": 800})
    page = ctx0.new_page()
    page.goto(f"{BASE}/", wait_until="domcontentloaded")
    assert "I develop AI-assisted" in page.content(), "no-JS home missing disclosure"
    page.goto(f"{BASE}/now", wait_until="domcontentloaded")
    assert "I'm actually stuck on" in page.content()
    assert "August 2026" in page.content()
    page.goto(f"{BASE}/timeline", wait_until="domcontentloaded")
    assert "CGPA 9.44" in page.content()
    page.goto(f"{BASE}/project/langchain-openrouter-provider", wait_until="domcontentloaded")
    html = page.content()
    assert "And the part I won't dress up" in html
    assert UNVERIFIED_PR not in html, "unverified PR URL shipped on no-JS case study"
    assert UNVERIFIED_ISSUE not in html, "unverified issue URL shipped on no-JS case study"
    assert "Outbound links are not published until they have been verified." in html
    page.goto(f"{BASE}/projects", wait_until="domcontentloaded")
    html = page.content()
    assert "Roast My Project" in html
    assert "PawSethu" in html
    assert "not a completed gallery" in html.lower() or "Named rows only" in html
    ctx0.close()

    ctx = browser.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    page.goto(f"{BASE}/", wait_until="networkidle")
    skip = page.get_by_role("button", name="Skip")
    assert skip.count() == 1
    assert float(skip.evaluate("el => getComputedStyle(el).opacity")) == 1
    skip_boot(page)
    page.wait_for_selector("text=I develop AI-assisted")
    assert page.locator("footer.os-taskbar").count() == 1
    box = page.locator("footer.os-taskbar").bounding_box()
    assert box and box["y"] > 500

    page.get_by_role("button", name="Start").click()
    start = page.locator(".os-menu")
    assert start.get_by_text("Reader Mode", exact=True).count() == 1
    for dead in ("Terminal", "KELL.AI", "Search", "Settings", "OS Update"):
        assert start.get_by_text(dead, exact=True).count() == 0, f"Start lists {dead}"
    page.keyboard.press("Escape")
    assert page.locator(".os-menu").count() == 0

    page.keyboard.press("Control+k")
    page.locator("[data-os-search]").wait_for()
    page.get_by_label("Find an app").fill("about")
    page.keyboard.press("Enter")
    page.locator("[data-os-search]").wait_for(state="detached")
    page.wait_for_selector('[data-wm-id="app:about"]')
    page.wait_for_selector("text=I develop AI-assisted")

    page.locator('[data-wm-id="app:about"]').get_by_role("link", name="Projects").click()
    page.wait_for_selector('[data-wm-id="app:projects"]')
    page.wait_for_selector("[data-os-gallery]")
    gallery = page.locator("[data-os-gallery]")
    assert gallery.count() == 1
    assert gallery.get_by_text("Roast My Project").count() == 1
    assert gallery.get_by_text("PawSethu").count() == 1
    assert gallery.get_by_text("Not case studies").count() >= 1
    assert gallery.locator('a[href*="langchain"]').count() == 0
    shot(page, "desktop-gallery.png")

    page.get_by_text("Landing a feature in LangChain", exact=False).first.click()
    page.wait_for_selector('[data-wm-id="doc:caseStudy:langchain-openrouter-provider"]')
    page.wait_for_selector("text=And the part I won't dress up")
    body = page.locator('[data-wm-id="doc:caseStudy:langchain-openrouter-provider"]')
    assert body.locator(f'a[href="{UNVERIFIED_PR}"]').count() == 0
    assert body.get_by_text("Outbound links are not published until they have been verified.").count() == 1
    shot(page, "desktop-90s-path.png")

    page.keyboard.press("Alt+r")
    page.wait_for_url("**/read/**")
    page.wait_for_selector("text=Back to desktop")
    page.locator("footer.os-taskbar").wait_for(state="detached")
    assert page.locator(f'a[href="{UNVERIFIED_PR}"]').count() == 0
    shot(page, "reader-alt-r.png")
    ctx.close()

    ctxm = browser.new_context(viewport={"width": 390, "height": 844})
    page = ctxm.new_page()
    page.goto(f"{BASE}/", wait_until="networkidle")
    skip_boot(page)
    page.wait_for_selector("text=I develop AI-assisted")
    assert page.get_by_text("Getting around").count() == 0
    page.get_by_role("link", name="Projects").first.click()
    page.wait_for_selector('[data-wm-id="app:projects"]')
    page.wait_for_selector("[data-os-gallery]")
    pos = page.locator('[data-wm-id="app:projects"]').evaluate("el => getComputedStyle(el).position")
    assert pos != "absolute", f"mobile WM overlapping via absolute: {pos}"
    assert page.locator("[data-os-gallery]").count() == 1
    shot(page, "mobile-gallery.png")
    page.keyboard.press("Control+k")
    page.locator("[data-os-search]").wait_for()
    page.get_by_label("Find an app").fill("settings")
    page.keyboard.press("Enter")
    page.wait_for_selector('[data-wm-id="app:settings"]')
    page.wait_for_selector("text=Reduced motion is an OS/browser setting")
    shot(page, "mobile-90s-path.png")
    ctxm.close()

    browser.close()

(OUT / "report.json").write_text('{"ok": true}\n', encoding="utf8")
print("phase9 verify ok")
sys.exit(0)
