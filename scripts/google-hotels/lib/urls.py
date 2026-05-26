from __future__ import annotations

from urllib.parse import quote_plus


def build_hotels_search_url(location: str, currency: str = "EUR") -> str:
    """Google Travel hotel search URL."""
    loc = location.strip()
    slug = quote_plus(loc.replace(" ", "-"))
    q = quote_plus(f"hotels in {loc}")
    cur = quote_plus(currency.strip().upper() or "EUR")
    return f"https://www.google.com/travel/hotels/{slug}?q={q}&currency={cur}"
