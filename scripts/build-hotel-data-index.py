#!/usr/bin/env python3
"""
Build a compact hotel lookup index from data/hotels CSVs.

  py -3 scripts/build-hotel-data-index.py
  → data/hotels/hotel-index.json
"""

from __future__ import annotations

import csv
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOTELS_DIR = ROOT / "data" / "hotels"
OUT = HOTELS_DIR / "hotel-index.json"

MAX_PER_KEY = 12
MAX_GEO_CELL = 15


def fold(s: str) -> str:
    s = unicodedata.normalize("NFD", s or "")
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def parse_pt_latlong(raw: str) -> tuple[float, float] | None:
    if not raw or ";" not in raw:
        return None
    parts = raw.replace('"', "").split(";")
    if len(parts) != 2:
        return None
    try:
        lat = float(parts[0].strip().replace(",", "."))
        lon = float(parts[1].strip().replace(",", "."))
        return lat, lon
    except ValueError:
        return None


def stars_from_category(raw: str) -> int:
    try:
        n = int(float(raw or 0))
        return max(1, min(5, n)) if n else 3
    except ValueError:
        return 3


def stars_from_text(blob: str) -> int:
    b = blob.lower()
    if re.search(r"5\s*estrela|luxury|palace|grand hotel", b):
        return 5
    if re.search(r"4\s*estrela|boutique", b):
        return 4
    if re.search(r"hostel|albergue|budget|campismo", b):
        return 2
    return 3


def price_from_stars(stars: int) -> int:
    base = {2: 45, 3: 85, 4: 140, 5: 260}.get(stars, 90)
    return base


def geo_cell(lat: float, lon: float) -> str:
    return f"{int(lat * 4)}_{int(lon * 4)}"


def add(bucket: dict[str, list], key: str, row: dict) -> None:
    if not key:
        return
    lst = bucket.setdefault(key, [])
    if len(lst) >= MAX_PER_KEY:
        return
    if any(x.get("nome") == row["nome"] for x in lst):
        return
    lst.append(row)


def add_geo(geo_grid: dict[str, list], row: dict) -> None:
    lat = row.get("latitude")
    lon = row.get("longitude")
    if lat is None or lon is None:
        return
    cell = geo_cell(float(lat), float(lon))
    lst = geo_grid.setdefault(cell, [])
    if len(lst) >= MAX_GEO_CELL:
        return
    if any(x.get("nome") == row["nome"] for x in lst):
        return
    lst.append(row)


def load_turad(by_concelho: dict, by_localidade: dict, geo_grid: dict) -> int:
    path = HOTELS_DIR / "Empreendimentos_TurADsticos_Existentes.csv"
    if not path.is_file():
        return 0
    n = 0
    with path.open(encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            nome = (row.get("Denominacao") or "").strip()
            if len(nome) < 2:
                continue
            stars = stars_from_category(row.get("Categoria") or "")
            latlon = parse_pt_latlong(row.get("LatLong") or "")
            item = {
                "nome": nome,
                "estrelas": stars,
                "preco_por_noite": price_from_stars(stars),
                "comodidades": ["wifi"],
                "source": "turad",
                "concelho": (row.get("Concelho") or "").strip(),
                "localidade": (row.get("LocalidadeCP") or "").strip(),
            }
            if latlon:
                item["latitude"], item["longitude"] = latlon
            add(by_concelho, fold(row.get("Concelho") or ""), item)
            add(by_localidade, fold(row.get("LocalidadeCP") or ""), item)
            add_geo(geo_grid, item)
            n += 1
    return n


def load_local(by_concelho: dict, by_localidade: dict, geo_grid: dict) -> int:
    path = HOTELS_DIR / "Estabelecimentos_de_Alojamento_Local.csv"
    if not path.is_file():
        return 0
    n = 0
    with path.open(encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            nome = (row.get("Denominacao") or "").strip()
            if len(nome) < 2:
                continue
            modalidade = (row.get("Modalidade") or "").strip()
            stars = stars_from_text(modalidade)
            latlon = parse_pt_latlong(row.get("LatLong") or "")
            item = {
                "nome": nome,
                "estrelas": stars,
                "preco_por_noite": price_from_stars(stars),
                "comodidades": ["wifi"],
                "source": "local",
                "concelho": (row.get("Concelho") or "").strip(),
                "localidade": (row.get("LOCALIDADE") or "").strip(),
            }
            if latlon:
                item["latitude"], item["longitude"] = latlon
            add(by_concelho, fold(row.get("Concelho") or ""), item)
            add(by_localidade, fold(row.get("LOCALIDADE") or ""), item)
            add_geo(geo_grid, item)
            n += 1
    return n


def load_wikivoyage_sleep(by_article: dict, geo_grid: dict) -> int:
    path = HOTELS_DIR / "wikivoyage-listings-en.csv"
    if not path.is_file():
        return 0
    n = 0
    with path.open(encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            if (row.get("type") or "").lower() != "sleep":
                continue
            article = (row.get("article") or "").strip()
            title = (row.get("title") or row.get("alt") or "").strip()
            if len(title) < 2:
                continue
            stars = stars_from_text(f"{title} {row.get('price') or ''}")
            item = {
                "nome": title,
                "estrelas": stars,
                "preco_por_noite": price_from_stars(stars),
                "comodidades": ["wifi"],
                "source": "wikivoyage-en",
                "article": article,
            }
            lat = row.get("latitude")
            lon = row.get("longitude")
            try:
                if lat and lon:
                    item["latitude"] = float(lat)
                    item["longitude"] = float(lon)
            except ValueError:
                pass
            add(by_article, fold(article), item)
            add_geo(geo_grid, item)
            n += 1
    return n


def main() -> None:
    by_concelho: dict[str, list] = defaultdict(list)
    by_localidade: dict[str, list] = defaultdict(list)
    by_article: dict[str, list] = defaultdict(list)
    geo_grid: dict[str, list] = defaultdict(list)

    turad = load_turad(by_concelho, by_localidade, geo_grid)
    local = load_local(by_concelho, by_localidade, geo_grid)
    wv = load_wikivoyage_sleep(by_article, geo_grid)

    payload = {
        "meta": {
            "sources": {
                "turad": turad,
                "local": local,
                "wikivoyage_en_sleep": wv,
            },
            "keys": {
                "concelho": len(by_concelho),
                "localidade": len(by_localidade),
                "article": len(by_article),
                "geoCells": len(geo_grid),
            },
        },
        "byConcelho": dict(by_concelho),
        "byLocalidade": dict(by_localidade),
        "byArticle": dict(by_article),
        "geoGrid": dict(geo_grid),
        "articleKeys": sorted(by_article.keys()),
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size // 1024} KB)")
    print("Sources:", payload["meta"]["sources"])
    print("Keys:", payload["meta"]["keys"])


if __name__ == "__main__":
    main()
