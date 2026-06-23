import psycopg2, os
from dotenv import load_dotenv
from pathlib import Path

ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / '.env')
load_dotenv(ROOT / '.env.local', override=False)

url_db = os.environ.get('DATABASE_URL_UNPOOLED') or os.environ.get('DATABASE_URL')
conn = psycopg2.connect(url_db)
cur = conn.cursor()

# Check the geocode-wv-hotels.py --status equivalent
cur.execute("""
    SELECT
        COUNT(*) FILTER (WHERE h.latitude IS NOT NULL) as com_coords,
        COUNT(*) FILTER (WHERE h.latitude IS NULL AND (h.fonte IS NULL OR h.fonte NOT IN ('geo_not_found', 'rejected_geo'))) as pendentes,
        COUNT(*) FILTER (WHERE h.latitude IS NULL AND h.fonte = 'geo_not_found') as geo_not_found,
        COUNT(*) FILTER (WHERE h.latitude IS NULL AND h.fonte IS NULL) as sem_fonte
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE d.slug = 'outros'
""")
com_coords, pendentes, geo_not_found, sem_fonte = cur.fetchone()
print(f'Outros com coordenadas: {com_coords}')
print(f'Outros pendentes: {pendentes}')
print(f'Outros geo_not_found: {geo_not_found}')
print(f'Outros sem fonte: {sem_fonte}')

# Also check how many total pending hotels exist
cur.execute("""
    SELECT COUNT(*)
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL
    AND (h.fonte IS NULL OR h.fonte NOT IN ('geo_not_found', 'rejected_geo'))
""")
total_pending = cur.fetchone()[0]
print(f'\nTotal pendentes (toda a BD): {total_pending}')
