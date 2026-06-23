import psycopg2, os, csv
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict

ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / '.env')
load_dotenv(ROOT / '.env.local', override=False)

url_db = os.environ.get('DATABASE_URL_UNPOOLED') or os.environ.get('DATABASE_URL')
conn = psycopg2.connect(url_db)
cur = conn.cursor()

with open(ROOT / 'data/hotels/atribuicoes_propostas.csv', 'r', encoding='utf-8') as f:
    proposals = list(csv.DictReader(f))

by_code = defaultdict(list)
no_code = []
for p in proposals:
    if p['pais_code']:
        by_code[p['pais_code']].append(int(p['hotel_id']))
    else:
        no_code.append(int(p['hotel_id']))

print(f'Com pais: {sum(len(v) for v in by_code.values())}')
print(f'Sem pais: {len(no_code)}')

for code in sorted(by_code.keys()):
    hotel_ids = by_code[code]
    cur.execute("SELECT id FROM wv_destinations WHERE pais_code = %s ORDER BY hotel_count DESC LIMIT 1", (code,))
    dest = cur.fetchone()
    if dest:
        dest_id = dest[0]
        cur.execute("UPDATE wv_hotels SET destino_id = %s WHERE id = ANY(%s)", (dest_id, hotel_ids))
        print(f'  {code}: {len(hotel_ids)} hoteis -> destino #{dest_id}')
    else:
        print(f'  {code}: {len(hotel_ids)} hoteis -> SEM DESTINO (ignorado)')

if no_code:
    cur.execute("SELECT id FROM wv_destinations WHERE slug = 'outros'")
    outros = cur.fetchone()
    if not outros:
        cur.execute("SELECT COALESCE(MAX(id), 0) + 1 FROM wv_destinations")
        new_id = cur.fetchone()[0]
        now = datetime.now(timezone.utc)
        cur.execute(
            "INSERT INTO wv_destinations (id, slug, lang, nome, pais, pais_code, tipo, hotel_count, created_at, updated_at) VALUES (%s, 'outros', 'pt', 'Outros', '', '', 'other', 0, %s, %s)",
            (new_id, now, now)
        )
        outros_id = new_id
        print(f'\n  Outros: CRIADO id={new_id}')
    else:
        outros_id = outros[0]
    cur.execute("UPDATE wv_hotels SET destino_id = %s WHERE id = ANY(%s)", (outros_id, no_code))
    print(f'  Outros: {len(no_code)} hoteis -> destino #{outros_id}')

conn.commit()
print('\nOK')
