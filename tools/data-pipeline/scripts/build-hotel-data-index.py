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

MAX_PER_KEY = 50
MAX_GEO_CELL = 30
MAX_NOME_KEY = 500  # byNome pode ter mais entradas (cada hotel tem nome único)

# Mapa de países europeus para filtragem do TBO (muitos dados mundiais)
TBO_INTERESTING_COUNTRIES = {
    'portugal', 'spain', 'france', 'italy', 'germany', 'united kingdom', 'uk',
    'netherlands', 'belgium', 'switzerland', 'austria', 'ireland', 'luxembourg',
    'denmark', 'sweden', 'norway', 'finland', 'iceland',
    'poland', 'czech republic', 'czechia', 'hungary', 'romania', 'bulgaria',
    'croatia', 'slovenia', 'slovakia', 'serbia', 'bosnia', 'montenegro',
    'albania', 'north macedonia', 'greece', 'turkey', 'cyprus', 'malta',
    'estonia', 'latvia', 'lithuania', 'ukraine', 'moldova',
    'morocco', 'egypt', 'tunisia', 'cabo verde', 'brazil', 'angola',
    'mozambique', 'united states', 'usa', 'canada', 'mexico',
    'japan', 'china', 'india', 'thailand', 'vietnam', 'indonesia', 'philippines',
    'australia', 'new zealand', 'south africa', 'uae', 'united arab emirates',
    'saudi arabia', 'qatar', 'israel', 'jordan',
}


def fold(s: str) -> str:
    s = unicodedata.normalize("NFD", s or "")
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def parse_pipe_latlong(raw: str) -> tuple[float, float] | None:
    """Parse 'lat|lon' format (TBO Hotels Map column)"""
    if not raw or "|" not in raw:
        return None
    parts = raw.split("|")
    if len(parts) != 2:
        return None
    try:
        lat = float(parts[0].strip())
        lon = float(parts[1].strip())
        return lat, lon
    except ValueError:
        return None


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


def add_nome(by_nome: dict[str, list], row: dict) -> None:
    """Indexa hotel por nome individual (fold do nome do hotel)."""
    nome = row.get("nome", "")
    key = fold(nome)
    if not key or len(key) < 2:
        return
    lst = by_nome.setdefault(key, [])
    if len(lst) >= MAX_NOME_KEY:
        return
    if any(x.get("nome") == nome for x in lst):
        return
    lst.append(row)


def load_turad(by_concelho: dict, by_localidade: dict, geo_grid: dict, by_nome: dict) -> int:
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
            add_nome(by_nome, item)
            add_geo(geo_grid, item)
            n += 1
    return n


def load_local(by_concelho: dict, by_localidade: dict, geo_grid: dict, by_nome: dict) -> int:
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
            add_nome(by_nome, item)
            add_geo(geo_grid, item)
            n += 1
    return n


def load_wikivoyage_sleep(by_article: dict, geo_grid: dict, by_nome: dict, csv_name: str = "wikivoyage-listings-en.csv", source_name: str = "wikivoyage-en") -> int:
    path = HOTELS_DIR / csv_name
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
                "source": source_name,
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
            add_nome(by_nome, item)
            add_geo(geo_grid, item)
            n += 1
    print(f"  {source_name}: {n} sleep listings loaded from {csv_name}")
    return n


def load_tbo_hotels(by_city: dict, geo_grid: dict, by_nome: dict) -> int:
    """Carrega TBO Hotels CSV (1M+ hotéis mundiais). Indexa por cidade + geo."""
    path = HOTELS_DIR / "tbo-hotels.csv"
    if not path.is_file():
        return 0
    n = 0
    skipped_no_coords = 0
    skipped_country = 0
    with path.open(encoding="utf-8", errors="replace", newline="") as f:
        reader = csv.DictReader(f)
        # Strip leading/trailing whitespace from fieldnames
        reader.fieldnames = [h.strip() for h in reader.fieldnames]
        for row in reader:
            nome = (row.get("HotelName") or "").strip()
            if len(nome) < 2:
                continue
            country = (row.get("countyName") or "").strip()
            city_name = (row.get("cityName") or "").strip()

            # Filtrar países de interesse para manter o índice leve
            country_fold = fold(country)
            if country_fold and country_fold not in TBO_INTERESTING_COUNTRIES:
                skipped_country += 1
                continue

            # Tentar extrair estrelas do HotelRating
            rating_raw = (row.get("HotelRating") or "").strip()
            stars = 3
            try:
                f_rating = float(rating_raw)
                if 1 <= f_rating <= 5:
                    stars = round(f_rating)
                elif f_rating > 5:
                    stars = min(5, round(f_rating / 10))
            except ValueError:
                stars = stars_from_text(f"{nome} {rating_raw}")

            # Parse facilities
            facilities_raw = (row.get("HotelFacilities") or "").strip()
            amenities = ["wifi"]
            if facilities_raw:
                parts = [p.strip() for p in facilities_raw.split(",")]
                amenity_keywords = {
                    "wifi": "wifi", "wi-fi": "wifi", "internet": "wifi",
                    "pool": "piscina", "piscina": "piscina", "swimming": "piscina",
                    "parking": "estacionamento", "garagem": "estacionamento",
                    "restaurant": "restaurante", "bar": "bar",
                    "gym": "ginásio", "fitness": "ginásio", "health club": "ginásio",
                    "spa": "spa", "sauna": "spa",
                    "breakfast": "pequeno-almoço", "café da manhã": "pequeno-almoço",
                    "air conditioning": "ar-condicionado", "ac": "ar-condicionado",
                    "tv": "tv", "television": "tv",
                    "airport": "transporte-aeroporto", "shuttle": "transporte-aeroporto",
                    "laundry": "lavandaria", "room service": "serviço-quartos",
                }
                amenities = []
                for p in parts:
                    pl = p.lower().strip()
                    for eng, pt in amenity_keywords.items():
                        if eng in pl or pt in pl:
                            amenities.append(pt)
                            break
                if not amenities:
                    amenities = ["wifi"]

            # Parse coordinates from Map column (lat|lon)
            latlon = parse_pipe_latlong(row.get("Map") or "")

            item = {
                "nome": nome,
                "estrelas": stars,
                "preco_por_noite": price_from_stars(stars),
                "comodidades": amenities,
                "source": "tbo",
                "pais": country,
                "cidade": city_name,
            }
            if latlon:
                item["latitude"], item["longitude"] = latlon
                add_geo(geo_grid, item)
            else:
                skipped_no_coords += 1
                continue

            # Index by city name for lookup
            if city_name:
                add(by_city, fold(city_name), item)
            add_nome(by_nome, item)
            n += 1

    print(f"  TBO Hotels: {n} loaded (países ignorados: {skipped_country}, sem coords: {skipped_no_coords})")
    return n


def load_osm_hotels(by_city: dict, geo_grid: dict, by_nome: dict) -> int:
    """Carrega hotéis do OpenStreetMap (descarregados via Overpass API)."""
    path = HOTELS_DIR / "osm-hotels.csv"
    if not path.is_file():
        return 0
    n = 0
    with path.open(encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            nome = (row.get("name") or "").strip()
            if len(nome) < 2:
                continue
            city = (row.get("city") or "").strip()
            country_code = (row.get("country_code") or "").strip()

            star_raw = (row.get("stars") or "").strip()
            try:
                stars = max(1, min(5, int(float(star_raw)))) if star_raw else 3
            except ValueError:
                stars = 3

            lat_raw = row.get("latitude") or ""
            lon_raw = row.get("longitude") or ""
            latlon = None
            try:
                if lat_raw and lon_raw:
                    latlon = (float(lat_raw), float(lon_raw))
            except ValueError:
                pass

            website = (row.get("website") or "").strip()
            wikidata = (row.get("wikidata_id") or "").strip()

            item = {
                "nome": nome,
                "estrelas": stars,
                "preco_por_noite": price_from_stars(stars),
                "comodidades": ["wifi"],
                "source": "osm",
                "cidade": city,
                "pais_code": country_code,
                "website": website,
                "wikidata": wikidata,
            }
            if latlon:
                item["latitude"], item["longitude"] = latlon
                add_geo(geo_grid, item)

            if city:
                add(by_city, fold(city), item)
            add_nome(by_nome, item)
            n += 1
    print(f"  OSM Hotels: {n} loaded")
    return n


def load_french_hotels(by_city: dict, geo_grid: dict, by_nome: dict) -> int:
    """Carrega hotéis classificados de França (Atout France, data.gouv.fr).
    Ficheiro CSV com separador ; e encoding utf-8-sig.
    Colunas: NOM COMMERCIAL, CLASSEMENT, COMMUNE, etc.

    Usa france-communes-geocoded.json para injetar coordenadas de cada commune.
    """
    path = HOTELS_DIR / "france-hebergements-classes.csv"
    if not path.is_file():
        return 0

    # Carregar coordenadas das communes francesas (geocodificadas via Nominatim)
    communes_path = HOTELS_DIR / "france-communes-geocoded.json"
    commune_coords: dict[str, dict] = {}
    if communes_path.is_file():
        with communes_path.open(encoding="utf-8") as f:
            raw = json.load(f)
            # Valor pode ser dict com lat/lon ou None (não encontrado)
            for commune_name, coord in raw.items():
                if coord and coord.get("lat") is not None and coord.get("lon") is not None:
                    commune_coords[fold(commune_name)] = (
                        float(coord["lat"]),
                        float(coord["lon"]),
                    )
        print(f"  Commune coords loaded: {len(commune_coords)} communes in cache")

    n = 0
    geocoded = 0
    with path.open(encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f, delimiter=";"):
            nome = (row.get("NOM COMMERCIAL") or "").strip()
            if len(nome) < 2:
                continue
            commune = (row.get("COMMUNE") or "").strip()
            website = (row.get("SITE INTERNET") or "").strip()
            classement = (row.get("CLASSEMENT") or "").strip()

            # Parse star rating from French text: "5 étoiles", "4 étoiles", etc.
            stars = 3
            if classement:
                try:
                    s = int(classement[0])
                    stars = max(1, min(5, s))
                except ValueError:
                    m = re.search(r"(\d+)\s*[eé]toiles?", classement.lower())
                    if m:
                        stars = max(1, min(5, int(m.group(1))))

            item = {
                "nome": nome,
                "estrelas": stars,
                "preco_por_noite": price_from_stars(stars),
                "comodidades": ["wifi"],
                "source": "france-classified",
                "cidade": commune,
                "pais_code": "FR",
                "website": website,
            }

            # Inject commune coordinates into the hotel item
            commune_fold = fold(commune)
            if commune_fold in commune_coords:
                lat, lon = commune_coords[commune_fold]
                item["latitude"] = lat
                item["longitude"] = lon
                geocoded += 1

            if commune:
                add(by_city, fold(commune), item)
            add_nome(by_nome, item)
            if item.get("latitude") is not None:
                add_geo(geo_grid, item)
            n += 1
    print(f"  France Classified Hotels: {n} loaded ({geocoded} with commune coords)")
    return n


def load_global_hotels_2026(by_city: dict, geo_grid: dict, by_nome: dict) -> int:
    """Carrega Global Hotels 2026 (972 hotéis, 17 cidades)."""
    path = HOTELS_DIR / "global-hotels-2026.csv"
    if not path.is_file():
        return 0
    n = 0
    with path.open(encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            nome = (row.get("name") or "").strip()
            if len(nome) < 2:
                continue
            city = (row.get("city") or "").strip()
            country_code = (row.get("countryCode") or "").strip()

            star_raw = (row.get("starLevel") or "").strip()
            try:
                stars = max(1, min(5, int(float(star_raw)))) if star_raw else 3
            except ValueError:
                stars = 3

            lat_raw = row.get("latitude") or ""
            lon_raw = row.get("longitude") or ""
            latlon = None
            try:
                if lat_raw and lon_raw:
                    latlon = (float(lat_raw), float(lon_raw))
            except ValueError:
                pass

            overall = (row.get("overallScore") or "").strip()
            description = (row.get("description") or "").strip()
            desc_short = description[:200] if description else ""

            item = {
                "nome": nome,
                "estrelas": stars,
                "preco_por_noite": price_from_stars(stars),
                "comodidades": ["wifi"],
                "source": "global-hotels-2026",
                "cidade": city,
                "pais_code": country_code,
                "overall_score": overall,
                "descricao": desc_short,
            }
            if latlon:
                item["latitude"], item["longitude"] = latlon
                add_geo(geo_grid, item)

            if city:
                add(by_city, fold(city), item)
            add_nome(by_nome, item)
            n += 1
    print(f"  Global Hotels 2026: {n} loaded")
    return n


def main() -> None:
    by_concelho: dict[str, list] = defaultdict(list)
    by_localidade: dict[str, list] = defaultdict(list)
    by_article: dict[str, list] = defaultdict(list)
    by_city: dict[str, list] = defaultdict(list)  # TBO + Global Hotels index
    by_nome: dict[str, list] = defaultdict(list)  # Index por nome individual
    geo_grid: dict[str, list] = defaultdict(list)

    turad = load_turad(by_concelho, by_localidade, geo_grid, by_nome)
    local = load_local(by_concelho, by_localidade, geo_grid, by_nome)
    wv_en = load_wikivoyage_sleep(by_article, geo_grid, by_nome)
    wv_pt = load_wikivoyage_sleep(
        by_article, geo_grid, by_nome,
        csv_name="wikivoyage-listings-pt.csv",
        source_name="wikivoyage-pt",
    )
    tbo = load_tbo_hotels(by_city, geo_grid, by_nome)
    osm = load_osm_hotels(by_city, geo_grid, by_nome)
    fr = load_french_hotels(by_city, geo_grid, by_nome)
    global_hotels = load_global_hotels_2026(by_city, geo_grid, by_nome)

    payload = {
        "meta": {
            "sources": {
                "turad": turad,
                "local": local,
                "wikivoyage_en_sleep": wv_en,
                "wikivoyage_pt_sleep": wv_pt,
                "tbo": tbo,
                "osm": osm,
                "france_classified": fr,
                "global_hotels_2026": global_hotels,
            },
            "keys": {
                "concelho": len(by_concelho),
                "localidade": len(by_localidade),
                "article": len(by_article),
                "city": len(by_city),
                "nome": len(by_nome),
                "geoCells": len(geo_grid),
            },
        },
        "byConcelho": dict(by_concelho),
        "byLocalidade": dict(by_localidade),
        "byArticle": dict(by_article),
        "byCity": dict(by_city),
        "byNome": dict(by_nome),
        "geoGrid": dict(geo_grid),
        "articleKeys": sorted(by_article.keys()),
        "cityKeys": sorted(by_city.keys()),
        "nomeKeys": sorted(by_nome.keys()),
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size // 1024} KB)")
    print("Sources:", payload["meta"]["sources"])
    print("Keys:", payload["meta"]["keys"])


if __name__ == "__main__":
    main()
