"""Crawlbase Crawling API helpers for Google Hotels."""

from __future__ import annotations

from crawlbase import CrawlingAPI

from .env import get_crawlbase_js_token

NEXT_PAGE_SELECTOR = 'button[jsname="OCpkoe"]'


def create_api() -> CrawlingAPI:
    return CrawlingAPI({"token": get_crawlbase_js_token()})


def fetch_html(
    api: CrawlingAPI,
    url: str,
    *,
    css_click_selector: str | None = None,
) -> str | None:
    try:
        options: dict[str, str] = {}
        if css_click_selector:
            options["css_click_selector"] = css_click_selector
            options["ajax_wait"] = "true"

        response = api.get(url, options or None)
        headers = response.get("headers") or {}
        status = str(headers.get("pc_status", ""))
        if status != "200":
            print(f"Crawlbase pc_status={status} for {url[:80]}…")
            return None

        body = response.get("body")
        if body is None:
            return None
        if isinstance(body, bytes):
            return body.decode("utf-8", errors="replace")
        return str(body)
    except Exception as exc:
        print(f"Crawlbase request failed: {exc}")
        return None
