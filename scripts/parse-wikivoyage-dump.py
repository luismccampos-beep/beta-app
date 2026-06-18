#!/usr/bin/env py -3
"""
Extrai artigos do dump Wikivoyage (.xml.bz2) para JSONL.

Uso:
  py -3 scripts/parse-wikivoyage-dump.py --lang pt
  py -3 scripts/parse-wikivoyage-dump.py --lang en
  py -3 scripts/parse-wikivoyage-dump.py --lang both
  py -3 scripts/parse-wikivoyage-dump.py --lang pt --max-pages 50   # teste rápido

Requisitos: pip install -r scripts/requirements-wikivoyage.txt

Licença dos dados: CC BY-SA 3.0 — https://creativecommons.org/licenses/by-sa/3.0/
Atribua o Wikivoyage e partilhe alterações sob a mesma licença.
"""
from __future__ import annotations

import argparse
import bz2
import json
import re
import sys
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

# lxml é muito mais rápido em dumps grandes
try:
    from lxml import etree as lxml_etree

    USE_LXML = True
except ImportError:
    USE_LXML = False

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
OUT_DIR = DATA_DIR / "wikivoyage" / "out"

DUMP_FILES = {
    "pt": DATA_DIR / "ptwikivoyage-latest-pages-articles.xml.bz2",
    "en": DATA_DIR / "enwikivoyage-latest-pages-articles.xml.bz2",
}

MEDIAWIKI_NS = "http://www.mediawiki.org/xml/export-0.11/"
PAGE_TAG = f"{{{MEDIAWIKI_NS}}}page"

# EN + PT Wikivoyage listing templates
LISTING_TYPES = (
    "see",
    "do",
    "buy",
    "eat",
    "drink",
    "sleep",
    "go",
    "listing",
    # Português (pt.wikivoyage)
    "ver",
    "fazer",
    "comprar",
    "comer",
    "beber",
    "dormir",
    "durma",
    "ir",
)
LISTING_RE = re.compile(
    r"\{\{(?:" + "|".join(LISTING_TYPES) + r"|Listing)\b([^}]*)\}\}",
    re.IGNORECASE | re.DOTALL,
)
FIELD_RE = re.compile(r"\|\s*([a-zA-Z_]+)\s*=\s*([^|{}]+)", re.DOTALL)
REDIRECT_RE = re.compile(r"#redirect\s*\[\[", re.IGNORECASE)

# Secções de dicas práticas (PT + EN) para extração estruturada
ADVANCED_SECTION_MAP = {
    "seguranca": [
        re.compile(r"mantenha[- ]se seguro", re.IGNORECASE),
        re.compile(r"fique seguro", re.IGNORECASE),
        re.compile(r"seguran[cç]a", re.IGNORECASE),
        re.compile(r"stay safe", re.IGNORECASE),
        re.compile(r"safety", re.IGNORECASE),
    ],
    "respeite": [
        re.compile(r"respeite", re.IGNORECASE),
        re.compile(r"respect", re.IGNORECASE),
        re.compile(r"etiquette", re.IGNORECASE),
        re.compile(r"costumes?", re.IGNORECASE),
    ],
    "comunique": [
        re.compile(r"comunique", re.IGNORECASE),
        re.compile(r"^fale$", re.IGNORECASE),
        re.compile(r"^talk$", re.IGNORECASE),
        re.compile(r"idioma", re.IGNORECASE),
        re.compile(r"communicate", re.IGNORECASE),
        re.compile(r"phrasebook", re.IGNORECASE),
    ],
    "dinheiro": [
        re.compile(r"dinheiro", re.IGNORECASE),
        re.compile(r"^money$", re.IGNORECASE),
        re.compile(r"custo de vida", re.IGNORECASE),
        re.compile(r"cost of living", re.IGNORECASE),
        re.compile(r"budget", re.IGNORECASE),
    ],
    "saude": [
        re.compile(r"sa[uú]de", re.IGNORECASE),
        re.compile(r"mantenha[- ]se saud[aá]vel", re.IGNORECASE),
        re.compile(r"stay healthy", re.IGNORECASE),
        re.compile(r"^health$", re.IGNORECASE),
    ],
    "transporte": [
        re.compile(r"^chegue$", re.IGNORECASE),
        re.compile(r"^chegar$", re.IGNORECASE),
        re.compile(r"get in", re.IGNORECASE),
        re.compile(r"^circule$", re.IGNORECASE),
        re.compile(r"get around", re.IGNORECASE),
        re.compile(r"transporte", re.IGNORECASE),
        re.compile(r"transport", re.IGNORECASE),
    ],
    "horarios": [
        re.compile(r"hor[aá]rios", re.IGNORECASE),
        re.compile(r"^hours$", re.IGNORECASE),
        re.compile(r"when to go", re.IGNORECASE),
        re.compile(r"quando ir", re.IGNORECASE),
        re.compile(r"opening hours", re.IGNORECASE),
    ],
    "compre": [
        re.compile(r"^compre$", re.IGNORECASE),
        re.compile(r"^buy$", re.IGNORECASE),
        re.compile(r"comprar", re.IGNORECASE),
        re.compile(r"shopping", re.IGNORECASE),
    ],
    "clima": [
        re.compile(r"^clima$", re.IGNORECASE),
        re.compile(r"^climate$", re.IGNORECASE),
        re.compile(r"weather", re.IGNORECASE),
        re.compile(r"temperatura", re.IGNORECASE),
    ],
}


def detect_namespace_from_file(path: Path) -> str:
    with bz2.open(path, "rb") as f:
        head = f.read(4000)
    m = re.search(rb'xmlns="([^"]+)"', head)
    if m:
        return m.group(1).decode("utf-8")
    return MEDIAWIKI_NS


def qname(ns: str, local: str) -> str:
    return f"{{{ns}}}{local}"


def parse_sections(wiki_text: str) -> dict[str, str]:
    """Extrai secções de nível 2 do texto Wikivoyage. Mapeia títulos PT/EN para chaves canónicas."""
    sections: dict[str, str] = {}
    if not wiki_text:
        return sections

    header_re = re.compile(r"^={2,}\s*([^=\n]+?)\s*={2,}\s*$", re.MULTILINE)
    headers = [
        (m.group(1).strip(), m.start(), m.end())
        for m in header_re.finditer(wiki_text)
    ]

    for i, (title, _, body_start) in enumerate(headers):
        body_end = headers[i + 1][1] if i + 1 < len(headers) else len(wiki_text)
        body = wiki_text[body_start:body_end]

        # Mapear para chaves canónicas de dicas práticas
        for key, patterns in ADVANCED_SECTION_MAP.items():
            if any(p.search(title) for p in patterns):
                sections[key] = (sections.get(key, "") + "\n" + body).strip()
                break

    return sections
    listings: list[dict[str, str]] = []
    for block in LISTING_RE.findall(wiki_text or ""):
        fields: dict[str, str] = {}
        for key, val in FIELD_RE.findall(block):
            fields[key.strip().lower()] = val.strip()
        if fields:
            listings.append(fields)
    return listings


def article_record(
    *,
    lang: str,
    page_id: str | None,
    title: str,
    text: str,
    extract_listings: bool,
) -> dict[str, Any]:
    base_url = "https://pt.wikivoyage.org" if lang == "pt" else "https://en.wikivoyage.org"
    slug = title.replace(" ", "_")
    rec: dict[str, Any] = {
        "lang": lang,
        "id": page_id,
        "title": title,
        "text": text,
        "url": f"{base_url}/wiki/{slug}",
        "license": "CC BY-SA 3.0",
        "attribution": f"Wikivoyage contributors — {base_url}/wiki/{slug}",
        "char_count": len(text),
    }
    if extract_listings:
        rec["listings"] = parse_listings(text)
        rec["sections"] = parse_sections(text)
    return rec


def iter_pages_lxml(path: Path, ns: str):
    tag_page = qname(ns, "page")
    with bz2.open(path, "rb") as f:
        for _event, elem in lxml_etree.iterparse(f, events=("end",), tag=tag_page):
            title = elem.findtext(qname(ns, "title"))
            ns_val = elem.findtext(qname(ns, "ns"))
            page_id = elem.findtext(qname(ns, "id"))
            revision = elem.find(qname(ns, "revision"))
            text = revision.findtext(qname(ns, "text")) if revision is not None else None
            yield title, ns_val, page_id, text
            elem.clear()
            while elem.getprevious() is not None:
                del elem.getparent()[0]


def iter_pages_stdlib(path: Path, ns: str):
    """Fallback mais lento se lxml não estiver instalado."""
    tag_page = qname(ns, "page")
    with bz2.open(path, "rt", encoding="utf-8") as f:
        for _event, elem in ET.iterparse(f, events=("end",)):
            if elem.tag != tag_page:
                continue
            title = elem.findtext(qname(ns, "title"))
            ns_val = elem.findtext(qname(ns, "ns"))
            page_id = elem.findtext(qname(ns, "id"))
            revision = elem.find(qname(ns, "revision"))
            text = revision.findtext(qname(ns, "text")) if revision is not None else None
            yield title, ns_val, page_id, text
            elem.clear()


def parse_dump(
    *,
    lang: str,
    dump_path: Path,
    out_jsonl: Path,
    min_text_length: int,
    max_pages: int | None,
    extract_listings: bool,
    skip_redirects: bool,
) -> dict[str, int]:
    if not dump_path.is_file():
        raise FileNotFoundError(f"Dump não encontrado: {dump_path}")

    ns = detect_namespace_from_file(dump_path)
    out_jsonl.parent.mkdir(parents=True, exist_ok=True)

    stats = {"written": 0, "skipped_ns": 0, "skipped_short": 0, "skipped_redirect": 0, "scanned": 0}

    page_iter = iter_pages_lxml(dump_path, ns) if USE_LXML else iter_pages_stdlib(dump_path, ns)

    with out_jsonl.open("w", encoding="utf-8") as out:
        for title, ns_val, page_id, text in page_iter:
            stats["scanned"] += 1
            if max_pages is not None and stats["written"] >= max_pages:
                break

            if ns_val != "0":
                stats["skipped_ns"] += 1
                continue
            if not title or not text:
                stats["skipped_short"] += 1
                continue
            if skip_redirects and REDIRECT_RE.search(text[:200]):
                stats["skipped_redirect"] += 1
                continue
            if len(text.strip()) < min_text_length:
                stats["skipped_short"] += 1
                continue

            rec = article_record(
                lang=lang,
                page_id=page_id,
                title=title,
                text=text,
                extract_listings=extract_listings,
            )
            out.write(json.dumps(rec, ensure_ascii=False) + "\n")
            stats["written"] += 1

            if stats["written"] % 500 == 0:
                print(f"  [{lang}] {stats['written']} artigos...", flush=True)

    return stats


def main() -> int:
    parser = argparse.ArgumentParser(description="Extrair artigos Wikivoyage XML.bz2 → JSONL")
    parser.add_argument(
        "--lang",
        choices=("pt", "en", "both"),
        default="both",
        help="Idioma do dump (default: both)",
    )
    parser.add_argument("--max-pages", type=int, default=None, help="Limite para testes")
    parser.add_argument("--min-text-length", type=int, default=80, help="Ignorar artigos muito curtos")
    parser.add_argument("--listings", action="store_true", help="Extrair blocos {{sleep}}, {{see}}, etc.")
    parser.add_argument("--keep-redirects", action="store_true", help="Não filtrar redireccionamentos")
    parser.add_argument("--out-dir", type=Path, default=OUT_DIR)
    args = parser.parse_args()

    if not USE_LXML:
        print("Aviso: instale lxml para dumps grandes (pip install lxml). A usar xml.etree (mais lento).", file=sys.stderr)

    langs = ["pt", "en"] if args.lang == "both" else [args.lang]
    summary: dict[str, Any] = {"langs": {}, "out_dir": str(args.out_dir)}

    for lang in langs:
        dump = DUMP_FILES[lang]
        out_path = args.out_dir / f"{lang}-articles.jsonl"
        print(f"\n>> A processar {dump.name} ...")
        stats = parse_dump(
            lang=lang,
            dump_path=dump,
            out_jsonl=out_path,
            min_text_length=args.min_text_length,
            max_pages=args.max_pages,
            extract_listings=args.listings,
            skip_redirects=not args.keep_redirects,
        )
        summary["langs"][lang] = {**stats, "output": str(out_path)}
        print(
            f"OK {lang.upper()}: {stats['written']} artigos -> {out_path.name} "
            f"(ignorados: ns={stats['skipped_ns']}, curtos={stats['skipped_short']}, "
            f"redirect={stats['skipped_redirect']})"
        )

    index_path = args.out_dir / "index.json"
    index_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nÍndice: {index_path}")
    print("\nLicença: CC BY-SA 3.0 — credite Wikivoyage e link para o artigo original.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
