import psycopg2, os
from dotenv import load_dotenv
from pathlib import Path
ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / '.env')
load_dotenv(ROOT / '.env.local', override=False)
url = os.environ.get('DATABASE_URL_UNPOOLED') or os.environ.get('DATABASE_URL')
conn = psycopg2.connect(url)
cur = conn.cursor()
cur.execute("SELECT column_default FROM information_schema.columns WHERE table_name = 'wv_destinations' AND column_name = 'id'")
print('default:', cur.fetchone()[0])
try:
    cur.execute("SELECT nextval('wv_destinations_id_seq'::regclass)")
    print('nextval:', cur.fetchone()[0])
except Exception as e:
    print('sequence error:', e)
