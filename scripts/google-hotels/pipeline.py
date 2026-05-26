#!/usr/bin/env python3
"""Listings → details pipeline for Google Hotels."""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent


def run(cmd: list[str]) -> None:
    print("$", " ".join(cmd))
    subprocess.run(cmd, check=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Google Hotels full scrape pipeline")
    parser.add_argument("--location", "-l", default="Lisboa")
    parser.add_argument("--currency", "-c", default="EUR")
    parser.add_argument("--max-pages", type=int, default=2)
    parser.add_argument("--details-limit", type=int, default=10, help="Max detail pages (cost control)")
    args = parser.parse_args()

    py = sys.executable
    listings = SCRIPTS / "google_hotels_listings_scraper.py"
    details = SCRIPTS / "google_hotel_details_scraper.py"

    run(
        [
            py,
            str(listings),
            "--location",
            args.location,
            "--currency",
            args.currency,
            "--max-pages",
            str(args.max_pages),
        ]
    )

    detail_cmd = [py, str(details)]
    if args.details_limit > 0:
        detail_cmd.extend(["--limit", str(args.details_limit)])

    run(detail_cmd)


if __name__ == "__main__":
    main()
