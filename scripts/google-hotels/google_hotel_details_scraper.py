#!/usr/bin/env python3
"""
Scrape Google Hotels detail pages (address, contact, reviews, …) via Crawlbase.

Usage:
  py -3 scripts/google-hotels/google_hotel_details_scraper.py
  py -3 scripts/google-hotels/google_hotel_details_scraper.py --input data/google-hotels/google_hotels.json --limit 5
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from lib.crawlbase_client import create_api, fetch_html
from lib.parsers import parse_hotel_details

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_IN = ROOT / "data" / "google-hotels" / "google_hotels.json"
DEFAULT_OUT = ROOT / "data" / "google-hotels" / "google_hotel_details.json"


def load_links(path: Path, limit: int | None) -> list[str]:
    raw = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(raw, list):
        hotels = raw
    elif isinstance(raw, dict) and isinstance(raw.get("hotels"), list):
        hotels = raw["hotels"]
    else:
        raise ValueError(f"Unexpected JSON shape in {path}")

    links: list[str] = []
    for row in hotels:
        if not isinstance(row, dict):
            continue
        link = row.get("link")
        if isinstance(link, str) and link.startswith("http"):
            links.append(link)

    if limit is not None and limit > 0:
        return links[:limit]
    return links


def scrape_details(links: list[str], *, delay_sec: float = 1.0) -> list[dict[str, str]]:
    api = create_api()
    detailed: list[dict[str, str]] = []

    for i, url in enumerate(links, start=1):
        print(f"[{i}/{len(links)}] {url[:72]}…")
        html = fetch_html(api, url)
        if not html:
            continue
        row = parse_hotel_details(html, url)
        if row:
            detailed.append(row)
        if delay_sec > 0 and i < len(links):
            time.sleep(delay_sec)

    return detailed


def main() -> None:
    parser = argparse.ArgumentParser(description="Google Hotels detail scraper (Crawlbase)")
    parser.add_argument("--input", "-i", type=Path, default=DEFAULT_IN, help="Listings JSON")
    parser.add_argument("--output", "-o", type=Path, default=DEFAULT_OUT, help="Output JSON")
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Max hotels to scrape (0 = all links in input)",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.0,
        help="Seconds between detail requests",
    )
    args = parser.parse_args()

    if not args.input.is_file():
        print(f"Input not found: {args.input}")
        print("Run listings scraper first: npm run travel:google-hotels:listings")
        sys.exit(1)

    limit = args.limit if args.limit > 0 else None
    links = load_links(args.input, limit)
    if not links:
        print("No hotel links in input file.")
        sys.exit(1)

    detailed = scrape_details(links, delay_sec=args.delay)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    payload = {"count": len(detailed), "hotels": detailed}
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {len(detailed)} hotel details → {args.output}")


if __name__ == "__main__":
    main()
