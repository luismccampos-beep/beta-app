#!/usr/bin/env python3
"""
Scrape Google Hotels listings (name, price, rating, link) via Crawlbase JS API.

Usage:
  py -3 scripts/google-hotels/google_hotels_listings_scraper.py --location Lisboa
  py -3 scripts/google-hotels/google_hotels_listings_scraper.py --location "New York" --max-pages 3
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

# Allow `from lib import …` when run as a script
sys.path.insert(0, str(Path(__file__).resolve().parent))

from lib.crawlbase_client import NEXT_PAGE_SELECTOR, create_api, fetch_html
from lib.parsers import parse_hotel_listings
from lib.urls import build_hotels_search_url

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_OUT = ROOT / "data" / "google-hotels" / "google_hotels.json"


def dedupe_by_link(hotels: list[dict[str, str]]) -> list[dict[str, str]]:
    seen: set[str] = set()
    out: list[dict[str, str]] = []
    for h in hotels:
        link = h.get("link", "")
        if link in seen or link == "N/A":
            continue
        seen.add(link)
        out.append(h)
    return out


def scrape_listings(
    location: str,
    *,
    currency: str = "EUR",
    max_pages: int = 2,
) -> list[dict[str, str]]:
    api = create_api()
    url = build_hotels_search_url(location, currency)
    all_hotels: list[dict[str, str]] = []

    for page in range(max_pages):
        print(f"Page {page + 1}/{max_pages}…")
        if page == 0:
            html = fetch_html(api, url)
        else:
            html = fetch_html(api, url, css_click_selector=NEXT_PAGE_SELECTOR)

        if not html:
            print("No HTML returned; stopping pagination.")
            break

        batch = parse_hotel_listings(html)
        print(f"  Found {len(batch)} cards on this page.")
        all_hotels.extend(batch)

    return dedupe_by_link(all_hotels)


def main() -> None:
    parser = argparse.ArgumentParser(description="Google Hotels listings scraper (Crawlbase)")
    parser.add_argument("--location", "-l", default="Lisboa", help="City or area to search")
    parser.add_argument("--currency", "-c", default="EUR", help="Currency code (USD, EUR, …)")
    parser.add_argument("--max-pages", type=int, default=2, help="Pages to fetch (clicks Next)")
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        default=DEFAULT_OUT,
        help="Output JSON path",
    )
    args = parser.parse_args()

    hotels = scrape_listings(
        args.location,
        currency=args.currency,
        max_pages=max(1, args.max_pages),
    )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "location": args.location,
        "currency": args.currency,
        "count": len(hotels),
        "hotels": hotels,
    }
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {len(hotels)} hotels → {args.output}")


if __name__ == "__main__":
    main()
