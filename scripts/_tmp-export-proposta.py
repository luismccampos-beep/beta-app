import psycopg2, os, re, csv
from dotenv import load_dotenv
from pathlib import Path

ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / '.env')
load_dotenv(ROOT / '.env.local', override=False)

url_db = os.environ.get('DATABASE_URL_UNPOOLED') or os.environ.get('DATABASE_URL')
conn = psycopg2.connect(url_db)
cur = conn.cursor()

cur.execute("SELECT id, nome, pais_code FROM wv_destinations")
dest_name_map = {}
for did, dname, dcode in cur.fetchall():
    dest_name_map[dname.lower().strip()] = (did, dname, dcode)

cur.execute("SELECT id, slug, pais_code FROM wv_destinations")
for did, slug, dcode in cur.fetchall():
    if slug:
        dest_name_map[slug.lower().strip()] = (did, slug, dcode)

import unicodedata
def norm(s):
    nfkd = unicodedata.normalize('NFKD', s)
    return nfkd.encode('ascii', 'ignore').decode().lower().strip()

country_names = {
    'usa': 'US', 'united states': 'US', 'uk': 'GB', 'united kingdom': 'GB',
    'england': 'GB', 'scotland': 'GB', 'france': 'FR', 'spain': 'ES',
    'italy': 'IT', 'germany': 'DE', 'australia': 'AU', 'canada': 'CA',
    'japan': 'JP', 'china': 'CN', 'india': 'IN', 'brazil': 'BR',
    'portugal': 'PT', 'netherlands': 'NL', 'switzerland': 'CH', 'sweden': 'SE',
    'norway': 'NO', 'denmark': 'DK', 'finland': 'FI', 'austria': 'AT',
    'turkey': 'TR', 'greece': 'GR', 'egypt': 'EG', 'south africa': 'ZA',
    'morocco': 'MA', 'thailand': 'TH', 'vietnam': 'VN', 'indonesia': 'ID',
    'mexico': 'MX', 'russia': 'RU', 'poland': 'PL', 'new zeland': 'NZ',
    'south korea': 'KR', 'philippines': 'PH', 'belgium': 'BE', 'hungary': 'HU',
    'czech': 'CZ', 'croatia': 'HR', 'romania': 'RO', 'ireland': 'IE',
    'singapore': 'SG', 'malaysia': 'MY', 'venezuela': 'VE',
}

cur.execute("""
    SELECT h.id, h.nome, h.destino_id
    FROM wv_hotels h
    LEFT JOIN wv_destinations d ON h.destino_id = d.id
    WHERE d.id IS NULL
    ORDER BY h.id
""")
orphans = cur.fetchall()

bracket_pat = re.compile(r'\[{2}([^\[\]]+)\]{2}')
rows = []
for hid, nome, old_did in orphans:
    code = None
    reason = ''
    
    # 1. [[bracket]] -> destination match
    brackets = bracket_pat.findall(nome)
    for b in brackets:
        b_clean = norm(b)
        if b_clean in dest_name_map:
            _, dest_name, code = dest_name_map[b_clean]
            reason = f'bracket'
            break
    
    # 2. Country name in text
    if not code:
        nome_lower = nome.lower()
        for cn, ccode in sorted(country_names.items(), key=lambda x: -len(x[0])):
            if cn in nome_lower:
                code = ccode
                reason = f'pais'
                break
    
    # 3. First word as city
    if not code:
        words = nome.split()
        if words:
            first_word = norm(words[0])
            if len(first_word) > 2 and first_word in dest_name_map:
                _, dest_name, code = dest_name_map[first_word]
                reason = f'cidade'
    
    rows.append([hid, nome.replace('\n', ' '), old_did, code or '', reason])

# Write CSV
out_path = ROOT / 'data/hotels/atribuicoes_propostas.csv'
with open(out_path, 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(['hotel_id', 'nome', 'old_destino_id', 'pais_code', 'razao'])
    w.writerows(rows)

com_code = sum(1 for r in rows if r[3])
sem_code = sum(1 for r in rows if not r[3])
print(f'Total: {len(rows)}')
print(f'Com pais atribuido: {com_code}')
print(f'Sem pais: {sem_code}')
print(f'Output: {out_path}')
