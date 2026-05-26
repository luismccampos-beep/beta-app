"""Run: py -3 scripts/google-hotels/test_parsers.py"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from lib.parsers import parse_hotel_details, parse_hotel_listings

LISTING_HTML = """
<div class="BcKagd">
  <h2 class="BgYkof">Hotel Teste</h2>
  <span class="qQOQpe prxS3d">120 €</span>
  <span class="KFi5wf lA0BZ">4.2</span>
  <a class="PVOOXe" href="/travel/hotels/entity/abc">Ver</a>
</div>
"""

DETAIL_HTML = """
<h1 class="FNkAEc">Hotel Teste</h1>
<span class="qQOQpe prxS3d">120 €</span>
<span class="KFi5wf lA0BZ">4.2</span>
<span class="jdzyld XLC8M">(99)</span>
<span class="CFH2De">4-star hotel</span>
<div class="K4nuhf">
  <span>Rua A, Lisboa</span><span></span><span>+351 210000000</span>
</div>
"""


def test_listings() -> None:
    rows = parse_hotel_listings(LISTING_HTML)
    assert len(rows) == 1
    assert rows[0]["name"] == "Hotel Teste"
    assert rows[0]["price"] == "120 €"
    assert rows[0]["link"] == "https://www.google.com/travel/hotels/entity/abc"


def test_details() -> None:
    row = parse_hotel_details(DETAIL_HTML, "https://example.com/hotel")
    assert row is not None
    assert row["address"] == "Rua A, Lisboa"
    assert row["contact"] == "+351 210000000"


if __name__ == "__main__":
    test_listings()
    test_details()
    print("OK")
