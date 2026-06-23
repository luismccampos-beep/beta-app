import psycopg2, os, urllib.request, urllib.parse, json, time, csv, sys
from dotenv import load_dotenv
from pathlib import Path

ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / '.env')
load_dotenv(ROOT / '.env.local', override=False)

url_db = os.environ.get('DATABASE_URL_UNPOOLED') or os.environ.get('DATABASE_URL')
conn = psycopg2.connect(url_db)
cur = conn.cursor()

OFFSET = int(sys.argv[1]) if len(sys.argv) > 1 else 0
TOTAL_CALLS = int(sys.argv[2]) if len(sys.argv) > 2 else 9999

cur.execute("""
    SELECT h.id, h.nome, h.destino_id
    FROM wv_hotels h
    LEFT JOIN wv_destinations d ON h.destino_id = d.id
    WHERE d.id IS NULL
    ORDER BY h.id
""")
orphans = cur.fetchall()
print(f'Total: {len(orphans)}, offset={OFFSET}, max={TOTAL_CALLS}', flush=True)

end = min(OFFSET + TOTAL_CALLS, len(orphans))
batch = orphans[OFFSET:end]

# Load previous results if any
prev_path = ROOT / 'data/hotels/nominatim_full.csv'
prev_done = set()
if prev_path.exists():
    with open(prev_path, 'r', encoding='utf-8') as f:
        for line in f:
            prev_done.add(line.split(',')[0].strip())
    print(f'Anteriores: {len(prev_done)} hoteis', flush=True)

results = []
with open(prev_path, 'a', newline='', encoding='utf-8') as fout:
    w = csv.writer(fout)
    if not prev_done:
        w.writerow(['hotel_id', 'nome', 'old_destino_id', 'pais_code', 'pais_nome'])
    
    for i, (hid, nome, old_did) in enumerate(batch):
        if str(hid) in prev_done:
            continue
        
        q = urllib.parse.quote(nome[:100])
        u = f"https://nominatim.openstreetmap.org/search?q={q}&format=json&limit=1&addressdetails=1"
        code = None
        country = None
        try:
            req = urllib.request.Request(u, headers={'User-Agent': 'BetaApp/1.0'})
            resp = urllib.request.urlopen(req, timeout=8)
            data = json.loads(resp.read())
            if data and len(data) > 0:
                addr = data[0].get('address', {})
                code = addr.get('country_code', '').upper() or None
                country = addr.get('country', '')
        except Exception as e:
            pass
        
        w.writerow([hid, nome, old_did, code or '', country or ''])
        fout.flush()
        results.append((hid, code))
        
        if (i + 1) % 25 == 0:
            matched = sum(1 for _, c in results if c)
            print(f'  {OFFSET+i+1}/{len(orphans)} ({matched}/{len(results)} matches)', flush=True)
        time.sleep(1.0)

matched = sum(1 for _, c in results if c)
print(f'Concluido: {len(results)} processados, {matched} matches', flush=True)
