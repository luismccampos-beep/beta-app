import sys, time, os
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

print("1: importing...", flush=True)
import urllib.request, urllib.parse, urllib.error, json
import psycopg2, psycopg2.extras
from dotenv import load_dotenv
from pathlib import Path
import argparse

print("2: dotenv...", flush=True)
ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / ".env")
load_dotenv(ROOT / ".env.local", override=False)

print("3: connecting...", flush=True)
DATABASE_URL = os.environ.get("DATABASE_URL_UNPOOLED") or os.environ.get("DATABASE_URL")
conn = psycopg2.connect(DATABASE_URL)
print("4: connected", flush=True)

print("5: querying...", flush=True)
with conn.cursor() as cur:
    cur.execute("SELECT COUNT(*) FROM wv_hotels WHERE latitude IS NULL AND (fonte IS NULL OR fonte NOT IN ('rejected_geo', 'geo_not_found'))")
    r = cur.fetchone()[0]
    print(f"6: pending={r}", flush=True)

print("7: close", flush=True)
conn.close()
print("8: done", flush=True)
