import psycopg2, os, re
from dotenv import load_dotenv
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / '.env')
load_dotenv(ROOT / '.env.local', override=False)

url_db = os.environ.get('DATABASE_URL_UNPOOLED') or os.environ.get('DATABASE_URL')
conn = psycopg2.connect(url_db)
cur = conn.cursor()

# Get remaining orphans
cur.execute("""
    SELECT h.id, h.nome, h.destino_id
    FROM wv_hotels h
    LEFT JOIN wv_destinations d ON h.destino_id = d.id
    WHERE d.id IS NULL
    ORDER BY h.id
""")
orphans = cur.fetchall()
print(f'Orfaos restantes: {len(orphans)}')

# Build destination name index
cur.execute("SELECT id, nome, pais_code FROM wv_destinations")
dest_name_map = {}
for did, dname, dcode in cur.fetchall():
    key = dname.lower().strip()
    dest_name_map[key] = (did, dname, dcode)

import unicodedata
def norm(s):
    nfkd = unicodedata.normalize('NFKD', s)
    return nfkd.encode('ascii', 'ignore').decode().lower().strip()

# Also index by slug
cur.execute("SELECT id, slug, pais_code FROM wv_destinations")
for did, slug, dcode in cur.fetchall():
    if slug:
        dest_name_map[slug.lower().strip()] = (did, slug, dcode)

# Country names map
country_names = {
    'usa': 'US', 'united states': 'US', 'united states of america': 'US',
    'uk': 'GB', 'united kingdom': 'GB', 'england': 'GB', 'scotland': 'GB',
    'france': 'FR', 'spain': 'ES', 'italy': 'IT', 'germany': 'DE',
    'australia': 'AU', 'canada': 'CA', 'japan': 'JP', 'china': 'CN',
    'india': 'IN', 'brazil': 'BR', 'portugal': 'PT', 'netherlands': 'NL',
    'switzerland': 'CH', 'sweden': 'SE', 'norway': 'NO', 'denmark': 'DK',
    'finland': 'FI', 'austria': 'AT', 'turkey': 'TR', 'greece': 'GR',
    'egypt': 'EG', 'south africa': 'ZA', 'morocco': 'MA', 'thailand': 'TH',
    'vietnam': 'VN', 'indonesia': 'ID', 'mexico': 'MX', 'argentina': 'AR',
    'chile': 'CL', 'peru': 'PE', 'colombia': 'CO', 'russia': 'RU',
    'poland': 'PL', 'hungary': 'HU', 'czech republic': 'CZ', 'croatia': 'HR',
    'romania': 'RO', 'bulgaria': 'BG', 'serbia': 'RS', 'ireland': 'IE',
    'new zealand': 'NZ', 'south korea': 'KR', 'philippines': 'PH',
}

bracket_pat = re.compile(r'\[{2}([^\[\]]+)\]{2}')

assigned = 0
by_country = Counter()

# Process each orphan
for hid, nome, old_did in orphans:
    code = None
    
    # 1. Try [[bracket]] match to destinations
    brackets = bracket_pat.findall(nome)
    for b in brackets:
        b_clean = norm(b)
        if b_clean in dest_name_map:
            _, _, code = dest_name_map[b_clean]
            break
    
    # 2. Try country name at end (e.g. ", USA")
    if not code:
        nome_lower = nome.lower()
        for cn, ccode in sorted(country_names.items(), key=lambda x: -len(x[0])):
            if cn in nome_lower:
                code = ccode
                break
    
    # 3. Try first word as city name matching destination
    if not code:
        words = nome.split()
        if words:
            first_word = norm(words[0])
            if first_word in dest_name_map:
                _, _, code = dest_name_map[first_word]
    
    if code:
        assigned += 1
        by_country[code] += 1

print(f'\nPadroes encontrados: {assigned}')
print(f'Sem padrao: {len(orphans) - assigned}')
print()
print('--- Atribuicoes por pais ---')
for code, cnt in by_country.most_common(30):
    print(f'  {code}: {cnt}')
