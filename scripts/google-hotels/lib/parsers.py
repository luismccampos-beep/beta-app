"""Parse Google Hotels HTML (selectors from Crawlbase tutorial — may change over time)."""

from __future__ import annotations

from bs4 import BeautifulSoup
from bs4.element import Tag


def _text(el: Tag | None) -> str:
    if el is None:
        return "N/A"
    t = el.get_text(strip=True)
    return t if t else "N/A"


def parse_hotel_listings(html: str) -> list[dict[str, str]]:
    soup = BeautifulSoup(html, "html.parser")
    out: list[dict[str, str]] = []

    for hotel in soup.find_all("div", class_="BcKagd"):
        name_el = hotel.find("h2", class_="BgYkof")
        price_el = hotel.find("span", class_="qQOQpe prxS3d")
        rating_el = hotel.find("span", class_="KFi5wf lA0BZ")
        link_el = hotel.find("a", class_="PVOOXe")

        href = link_el.get("href") if link_el else None
        if isinstance(href, str) and href.startswith("/"):
            link = "https://www.google.com" + href
        elif isinstance(href, str) and href.startswith("http"):
            link = href
        else:
            link = "N/A"

        out.append(
            {
                "name": _text(name_el),
                "price": _text(price_el),
                "rating": _text(rating_el),
                "link": link,
            }
        )

    return out


def parse_hotel_details(html: str, hotel_url: str) -> dict[str, str] | None:
    soup = BeautifulSoup(html, "html.parser")

    name = soup.find("h1", class_="FNkAEc")
    price = soup.find("span", class_="qQOQpe prxS3d")
    rating = soup.find("span", class_="KFi5wf lA0BZ")
    reviews = soup.find("span", class_="jdzyld XLC8M")
    hotel_type = soup.find("span", class_="CFH2De")

    address = "N/A"
    contact = "N/A"
    location_sections = soup.find_all("div", class_="K4nuhf")
    if location_sections:
        spans = location_sections[0].find_all("span")
        if len(spans) >= 1:
            address = spans[0].get_text(strip=True) or "N/A"
        if len(spans) >= 3:
            contact = spans[2].get_text(strip=True) or "N/A"

    return {
        "name": _text(name),
        "price": _text(price),
        "rating": _text(rating),
        "no_of_reviews": _text(reviews),
        "hotel_type": _text(hotel_type),
        "address": address,
        "contact": contact,
        "link": hotel_url,
    }
