import requests
import urllib.parse
import csv
import time
import sys
import os
import glob
import re
import json
from pathlib import Path
from tqdm import tqdm  # pip install tqdm

if sys.stdout.encoding and sys.stdout.encoding.lower() not in ("utf-8", "utf8"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# ==================== CONFIGURAÇÕES ====================
LANGUAGES = {
    "es": "es.wikivoyage.org",
    "fr": "fr.wikivoyage.org",
    "de": "de.wikivoyage.org",
    "it": "it.wikivoyage.org",
    "en": "en.wikivoyage.org",
    "pt": "pt.wikivoyage.org",
    "nl": "nl.wikivoyage.org",
    "ru": "ru.wikivoyage.org",
    "ja": "ja.wikivoyage.org",
    "zh": "zh.wikivoyage.org",
    "ar": "ar.wikivoyage.org",
    "pl": "pl.wikivoyage.org",
    "sv": "sv.wikivoyage.org",
    "he": "he.wikivoyage.org",
    "el": "el.wikivoyage.org",
    "ro": "ro.wikivoyage.org",
    "tr": "tr.wikivoyage.org",
    "id": "id.wikivoyage.org",
    "vi": "vi.wikivoyage.org",
    "th": "th.wikivoyage.org",
    "ko": "ko.wikivoyage.org",
    "cs": "cs.wikivoyage.org",
    "da": "da.wikivoyage.org",
    "no": "no.wikivoyage.org",
    "fi": "fi.wikivoyage.org",
    "hu": "hu.wikivoyage.org",
    "uk": "uk.wikivoyage.org",
    "fa": "fa.wikivoyage.org",
    "bn": "bn.wikivoyage.org",
    "hi": "hi.wikivoyage.org",
}

CACHE_FILE = "wikivoyage_cache.json"

# Mapeamento de nomes problemáticos (OSM → Wikidata)
NAME_MAPPINGS = {
    "great-britain": "United Kingdom",
    "ireland-and-northern-ireland": "Ireland",
    "malaysia-singapore-brunei": "Malaysia",
    "gcc-states": "Saudi Arabia",
    "us": "United States",
    "czech-republic": "Czech Republic",
    "cape-verde": "Cabo Verde",
    "ivory-coast": "Ivory Coast",
    "democratic-republic-of-the-congo": "Democratic Republic of the Congo",
    "republic-of-the-congo": "Republic of the Congo",
    "north-korea": "North Korea",
    "south-korea": "South Korea",
    # Adicione mais conforme necessário
}

# Nomes alternativos para territórios/regiões especiais que podem não ser países
TERRITORY_ALIASES = {
    "canary islands": "Canary Islands",
    "islas canarias": "Canary Islands",
    "french polynesia": "French Polynesia",
    "polynésie française": "French Polynesia",
    "réunion": "Réunion",
    "reunion": "Réunion",
    "new caledonia": "New Caledonia",
    "nouvelle-calédonie": "New Caledonia",
    "guadeloupe": "Guadeloupe",
    "martinique": "Martinique",
    "french guiana": "French Guiana",
    "guyane française": "French Guiana",
    "aruba": "Aruba",
    "curacao": "Curaçao",
    "sint maarten": "Sint Maarten",
    "bonaire": "Bonaire",
    "saba": "Saba",
    "sint eustatius": "Sint Eustatius",
    "greenland": "Greenland",
    "kalaallit nunaat": "Greenland",
    "faroe islands": "Faroe Islands",
    "færøerne": "Faroe Islands",
    "isle of man": "Isle of Man",
    "channel islands": "Channel Islands",
    "jersey": "Jersey",
    "guernsey": "Guernsey",
    "akrotiri and dhekelia": "Akrotiri and Dhekelia",
    "ceuta": "Ceuta",
    "melilla": "Melilla",
    "mayotte": "Mayotte",
    "wallis and futuna": "Wallis and Futuna",
    "saint pierre and miquelon": "Saint Pierre and Miquelon",
    "saint helena": "Saint Helena",
    "tristan da cunha": "Tristan da Cunha",
    "ascension island": "Ascension Island",
    "falkland islands": "Falkland Islands",
    "south georgia": "South Georgia and the South Sandwich Islands",
    "south sandwich islands": "South Georgia and the South Sandwich Islands",
    "british virgin islands": "British Virgin Islands",
    "us virgin islands": "United States Virgin Islands",
    "puerto rico": "Puerto Rico",
    "american samoa": "American Samoa",
    "guam": "Guam",
    "northern mariana islands": "Northern Mariana Islands",
    "cook islands": "Cook Islands",
    "niue": "Niue",
    "tokelau": "Tokelau",
    "tuvalu": "Tuvalu",
    "nauru": "Nauru",
    "palau": "Palau",
    "marshall islands": "Marshall Islands",
    "micronesia": "Micronesia",
    "kiribati": "Kiribati",
    "samoa": "Samoa",
    "tonga": "Tonga",
    "vanuatu": "Vanuatu",
    "solomon islands": "Solomon Islands",
    "new caledonia": "New Caledonia",
    "papua new guinea": "Papua New Guinea",
    "timor-leste": "Timor-Leste",
    "east timor": "Timor-Leste",
    "sri lanka": "Sri Lanka",
    "ceylon": "Sri Lanka",
    "myanmar": "Myanmar",
    "burma": "Myanmar",
    "cabo verde": "Cabo Verde",
    "cape verde": "Cabo Verde",
    "eSwatini": "Eswatini",
    "swaziland": "Eswatini",
    "czechia": "Czech Republic",
    "north macedonia": "North Macedonia",
    "republic of kosovo": "Kosovo",
    "kosovo": "Kosovo",
    "transnistria": "Transnistria",
    "abkhazia": "Abkhazia",
    "south ossetia": "South Ossetia",
    "artsakh": "Artsakh",
    "northern cyprus": "Northern Cyprus",
    "somaliland": "Somaliland",
    "western sahara": "Western Sahara",
    "sahrawi arab democratic republic": "Western Sahara",
    "taiwan": "Taiwan",
    "hong kong": "Hong Kong",
    "macau": "Macau",
    "macao": "Macau",
    "palestine": "Palestine",
    "state of palestine": "Palestine",
    "vatican": "Vatican City",
    "vatican city": "Vatican City",
    "holy see": "Vatican City",
    "andorra": "Andorra",
    "monaco": "Monaco",
    "liechtenstein": "Liechtenstein",
    "san marino": "San Marino",
    "malta": "Malta",
    "cyprus": "Cyprus",
    "iceland": "Iceland",
    "estonia": "Estonia",
    "latvia": "Latvia",
    "lithuania": "Lithuania",
    "slovenia": "Slovenia",
    "slovakia": "Slovakia",
    "croatia": "Croatia",
    "bosnia and herzegovina": "Bosnia and Herzegovina",
    "serbia": "Serbia",
    "montenegro": "Montenegro",
    "albania": "Albania",
    "bulgaria": "Bulgaria",
    "romania": "Romania",
    "moldova": "Moldova",
    "ukraine": "Ukraine",
    "belarus": "Belarus",
    "georgia": "Georgia",
    "armenia": "Armenia",
    "azerbaijan": "Azerbaijan",
    "kazakhstan": "Kazakhstan",
    "uzbekistan": "Uzbekistan",
    "turkmenistan": "Turkmenistan",
    "tajikistan": "Tajikistan",
    "kyrgyzstan": "Kyrgyzstan",
    "mongolia": "Mongolia",
    "afghanistan": "Afghanistan",
    "bangladesh": "Bangladesh",
    "bhutan": "Bhutan",
    "nepal": "Nepal",
    "maldives": "Maldives",
    "seychelles": "Seychelles",
    "mauritius": "Mauritius",
    "comoros": "Comoros",
    "madagascar": "Madagascar",
    "malawi": "Malawi",
    "zambia": "Zambia",
    "zimbabwe": "Zimbabwe",
    "botswana": "Botswana",
    "namibia": "Namibia",
    "lesotho": "Lesotho",
    "swaziland": "Eswatini",
    "mozambique": "Mozambique",
    "angola": "Angola",
    "congo": "Republic of the Congo",
    "drc": "Democratic Republic of the Congo",
    "south sudan": "South Sudan",
    "sudan": "Sudan",
    "eritrea": "Eritrea",
    "djibouti": "Djibouti",
    "somalia": "Somalia",
    "ethiopia": "Ethiopia",
    "kenya": "Kenya",
    "uganda": "Uganda",
    "tanzania": "Tanzania",
    "rwanda": "Rwanda",
    "burundi": "Burundi",
    "congo-brazzaville": "Republic of the Congo",
    "congo-kinshasa": "Democratic Republic of the Congo",
    "isle of man": "Isle of Man",
    "wales": "Wales",
    "scotland": "Scotland",
    "england": "England",
    "northern ireland": "Northern Ireland",
    "catalonia": "Catalonia",
    "basque country": "Basque Country",
    "galicia": "Galicia",
    "flanders": "Flanders",
    "wallonia": "Wallonia",
    "brussels": "Brussels",
    "sicily": "Sicily",
    "sardinia": "Sardinia",
    "corsica": "Corsica",
    "bavaria": "Bavaria",
    "baden-württemberg": "Baden-Württemberg",
    "bali": "Bali",
    "sumatra": "Sumatra",
    "java": "Java",
    "borneo": "Borneo",
    "tibet": "Tibet",
    "xinjiang": "Xinjiang",
    "inner mongolia": "Inner Mongolia",
    "hong kong": "Hong Kong",
    "macao": "Macau",
    "taiwan": "Taiwan",
    "sakha": "Sakha Republic",
    "siberia": "Siberia",
    "crimea": "Crimea",
    "svalbard": "Svalbard",
    "jan mayen": "Jan Mayen",
    "spitsbergen": "Svalbard",
}

HEADERS = {
    "User-Agent": "Wikivoyage-Link-Generator/1.0 (https://github.com/SEUUSUARIO; seuemail@example.com)"
}

session = requests.Session()
session.headers.update(HEADERS)

# ==================== CACHE ====================
def load_cache():
    if Path(CACHE_FILE).exists():
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_cache(cache):
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

# ==================== FUNÇÕES ====================
def normalize_country_name(name: str) -> str:
    name = name.strip()
    key = name.lower().replace(" ", "-")
    if key in NAME_MAPPINGS:
        return NAME_MAPPINGS[key]
    if key in TERRITORY_ALIASES:
        return TERRITORY_ALIASES[key]
    return name

def get_wikivoyage_links(country_en: str, cache: dict):
    normalized = normalize_country_name(country_en)
    
    if normalized in cache:
        return cache[normalized]

    # 1. Busca no Wikidata
    search_url = "https://www.wikidata.org/w/api.php"
    params = {
        "action": "wbsearchentities",
        "search": normalized,
        "language": "en",
        "format": "json",
        "limit": 3  # mais resultados para tentar
    }

    try:
        r = session.get(search_url, params=params, timeout=15)
        r.raise_for_status()
        data = r.json()
        
        if not data.get("search"):
            # Tenta sem "Republic of", etc.
            alt_search = re.sub(r"^(Republic of |Democratic Republic of |Kingdom of )", "", normalized)
            if alt_search != normalized:
                params["search"] = alt_search
                r = session.get(search_url, params=params, timeout=15)
                data = r.json()

        if not data.get("search"):
            result = {"en_name": country_en, "error": "Not found in Wikidata"}
            cache[normalized] = result
            return result

        entity_id = data["search"][0]["id"]

    except Exception as e:
        result = {"en_name": country_en, "error": f"Search failed: {e}"}
        cache[normalized] = result
        return result

    # 2. Pega sitelinks
    try:
        url = f"https://www.wikidata.org/wiki/Special:EntityData/{entity_id}.json"
        r = session.get(url, timeout=15)
        r.raise_for_status()
        entity = r.json()["entities"][entity_id]
        sitelinks = entity.get("sitelinks", {})
    except Exception as e:
        result = {"en_name": country_en, "error": f"Sitelinks failed: {e}"}
        cache[normalized] = result
        return result

    links = {
        "en_name": country_en,
        "wikidata_id": entity_id,
        "wikidata_label": entity.get("labels", {}).get("en", {}).get("value", country_en)
    }

    for lang, domain in LANGUAGES.items():
        sitekey = f"{lang}wikivoyage"
        if sitekey in sitelinks:
            title = sitelinks[sitekey]["title"]
            encoded = urllib.parse.quote(title.replace(" ", "_"), safe=":/")
            links[lang] = f"https://{domain}/wiki/{encoded}"
        else:
            links[lang] = ""

    cache[normalized] = links
    return links


def extract_country_name(filename: str) -> str:
    basename = os.path.basename(filename)
    name = re.sub(r'(-latest)?(-\d{6})?(-free)?\.(osm\.pbf|shp|gpkg)(\.zip)?$', '', basename)
    name = name.replace('-', ' ').title().strip()
    return normalize_country_name(name)


def get_osm_files(directory="data/osm"):
    patterns = ["*.osm.pbf", "*-free.shp.zip", "*-free.gpkg.zip"]
    files = []
    for pattern in patterns:
        files.extend(glob.glob(os.path.join(directory, pattern)))

    countries = {}
    for f in sorted(files, reverse=True):  # mais recentes primeiro
        country = extract_country_name(f)
        if country not in countries:
            countries[country] = f

    return countries


# ==================== EXPORTS ====================
def export_markdown(rows, path="wikivoyage_links.md"):
    langs = [lang for lang in LANGUAGES.keys() if lang != "en"] + ["en"]
    header = ["# Wikivoyage Links\n", f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"]
    lines = header + ["| # | Name | Wikidata | " + " | ".join(langs) + " | Found |", "|---|------|----------|" + "|".join(["------" for _ in langs]) + "|------|"]
    for idx, row in enumerate(rows, start=1):
        found = sum(1 for lang in LANGUAGES.keys() if row.get(lang))
        links = []
        for lang in langs:
            url = row.get(lang, "")
            if url:
                links.append(f"[{lang}]({url})")
            else:
                links.append("-")
        lines.append(f"| {idx} | {row['en_name']} | [{row.get('wikidata_id','')}](https://www.wikidata.org/wiki/{row.get('wikidata_id','')}) | " + " | ".join(links) + f" | {found}/{len(LANGUAGES)} |")
    lines.append("")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

def export_html(rows, path="wikivoyage_links.html"):
    langs = [lang for lang in LANGUAGES.keys() if lang != "en"] + ["en"]
    html = [
        "<!doctype html><html lang='en'><head><meta charset='utf-8'>",
        "<meta name='viewport' content='width=device-width, initial-scale=1'>",
        "<title>Wikivoyage Links</title>",
        "<style>",
        "body{font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:24px;color:#222;}",
        "table{border-collapse:collapse;width:100%;max-width:1400px;margin:0 auto;}",
        "th,td{border:1px solid #d8dee4;padding:10px 12px;text-align:left;vertical-align:top;}",
        "th{background:#0f172a;color:#fff;position:sticky;top:0;}",
        "tr:nth-child(even){background:#f6f8fa;}",
        "a{color:#1f6feb;text-decoration:none;}a:hover{text-decoration:underline;}",
        ".badge{display:inline-block;padding:2px 8px;border-radius:999px;background:#dafbe1;color:#1a7f37;font-weight:600;font-size:12px;}",
        "td:nth-child(1){width:40px;} td:nth-child(2){min-width:180px;} td:nth-child(3){width:120px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}",
        ".cell-links{display:flex;flex-wrap:wrap;gap:6px;} .chip{background:#eef2ff;border:1px solid #c7d2fe;padding:2px 8px;border-radius:6px;font-size:12px;font-weight:600;}",
        "h1{text-align:center;} p{text-align:center;color:#555;}",
        "</style></head><body>",
        "<h1>🌍 Wikivoyage Links</h1>",
        f"<p>Generated: {time.strftime('%Y-%m-%d %H:%M:%S')} · Total: {len(rows)}</p>",
        "<table><thead><tr><th>#</th><th>Name</th><th>Wikidata</th>" + "".join(f"<th>{lang}</th>" for lang in langs) + "<th>Found</th></tr></thead><tbody>",
    ]
    for idx, row in enumerate(rows, start=1):
        found = sum(1 for lang in LANGUAGES.keys() if row.get(lang))
        chips = []
        for lang in langs:
            url = row.get(lang, "")
            if url:
                chips.append(f"<span class='chip'><a href='{url}' target='_blank' rel='noopener'>{lang}</a></span>")
            else:
                chips.append("<span class='chip' style='color:#999'>-</span>")
        html.append(
            f"<tr><td>{idx}</td><td>{row['en_name']}</td>"
            f"<td><a href='https://www.wikidata.org/wiki/{row.get('wikidata_id','')}' target='_blank' rel='noopener'>{row.get('wikidata_id','')}</a></td>"
            f"<td><div class='cell-links'>{''.join(chips)}</div></td>"
            f"<td align='center'><span class='badge'>{found}/{len(LANGUAGES)}</span></td></tr>"
        )
    html.append("</tbody></table></body></html>")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(html))

def export_json(rows, path="wikivoyage_links.json"):
    payload = []
    for row in rows:
        item = {
            "en_name": row.get("en_name"),
            "wikidata_id": row.get("wikidata_id"),
            "wikidata_label": row.get("wikidata_label"),
            "links": {lang: row.get(lang, "") or None for lang in LANGUAGES.keys()},
            "found_count": sum(1 for lang in LANGUAGES.keys() if row.get(lang)),
            "total_languages": len(LANGUAGES),
        }
        if row.get("filename"):
            item["filename"] = row.get("filename")
        payload.append(item)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    # ==================== MAIN ====================
def main():
    print("== Gerador de Links Wikivoyage + OSM\n")
    
    cache = load_cache()
    
    # Escolhe fonte de países
    osm_dir = "data/osm"
    if os.path.exists(osm_dir) and glob.glob(os.path.join(osm_dir, "*.*")):
        print(f"[OK] Usando ficheiros OSM da pasta '{osm_dir}'")
    else:
        print("[!] Pasta data/osm nao encontrada. Usando lista completa de paises da ONU.")
        # Lista de países membros da ONU
        UN_COUNTRIES = [
            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
            "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
            "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
            "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
            "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
            "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo",
            "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Czechia", "Democratic Republic of the Congo",
            "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
            "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
            "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
            "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
            "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
            "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea",
            "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
            "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
            "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
            "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
            "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
            "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
            "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
            "Portugal", "Qatar", "Republic of the Congo", "Romania", "Russia", "Rwanda",
            "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
            "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
            "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
            "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden",
            "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste",
            "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
            "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
            "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
            "Zambia", "Zimbabwe"
        ]
        countries_files = {c: None for c in UN_COUNTRIES}
        use_osm = False

    output_csv = "wikivoyage_links.csv"
    output_md = "wikivoyage_links.md"
    output_html = "wikivoyage_links.html"
    output_json = "wikivoyage_links.json"

    lang_columns = list(LANGUAGES.keys())
    fieldnames = ["en_name", "wikidata_id", "filename"] + lang_columns

    all_rows = []

    with open(output_csv, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames, delimiter=";")
        writer.writeheader()

        for i, (country, filename) in enumerate(tqdm(countries_files.items(), desc="Processando")):
            result = get_wikivoyage_links(country, cache)
            row = {
                "en_name": result.get("en_name", country),
                "wikidata_id": result.get("wikidata_id", ""),
                "filename": os.path.basename(filename) if filename else "",
            }

            if "error" in result:
                print(f"  ❌ {country}: {result['error']}")
                for lang in lang_columns:
                    row[lang] = "ERROR"
            else:
                for lang in lang_columns:
                    row[lang] = result.get(lang, "")
                count = sum(1 for lang in lang_columns if row[lang])

            writer.writerow(row)
            all_rows.append(row)

            if i % 10 == 0:
                save_cache(cache)

            time.sleep(0.25)

    save_cache(cache)

    export_markdown(all_rows, output_md)
    export_html(all_rows, output_html)
    export_json(all_rows, output_json)

    print(f"\n✅ Concluído!")
    print(f"   CSV:  {output_csv}")
    print(f"   MD:   {output_md}")
    print(f"   HTML: {output_html}")
    print(f"   JSON: {output_json}")
    print(f"   Total processado: {len(countries_files)} destinos")
    print(f"   Idiomas: {', '.join(LANGUAGES.keys())}")

if __name__ == "__main__":
    main()