"""Analyse TBO Hotels CSV structure"""
import csv
import itertools

f = "data/hotels/tbo-hotels.csv"
r = csv.reader(open(f, "r", encoding="utf-8", errors="replace", newline=""))
headers = next(r)
print(f"Columns: {len(headers)}")
for i, h in enumerate(headers):
    print(f"  [{i}] {h.strip()}")

print("\nSample rows:")
for i, row in enumerate(itertools.islice(r, 5)):
    hotel = row[4][:60] if len(row) > 4 else "?"
    city = row[3][:40] if len(row) > 3 else "?"
    rating = row[5][:10] if len(row) > 5 else "?"
    facilities = row[11][:100] if len(row) > 11 else "?"
    map_col = row[12][:80] if len(row) > 12 else "?"
    print(f"\nRow {i}:")
    print(f"  Hotel: {hotel}")
    print(f"  City: {city}")
    print(f"  Rating: {rating}")
    print(f"  Facilities: {facilities}")
    print(f"  Map: {map_col}")

# Count rows
f2 = "data/hotels/tbo-hotels.csv"
total = sum(1 for _ in open(f2, "rb")) - 1
print(f"\nTotal rows (excl header): ~{total:,}")
