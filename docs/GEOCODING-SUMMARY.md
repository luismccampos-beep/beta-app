# Geocoding Summary

## Final State
| Metric | Value |
|--------|-------|
| Total destinations | 28,475 |
| Non-XX destinations with coords | 23,553 (82.7%) |
| Non-XX destinations without coords | ~~1,186~~ → ~164 real towns left |
| Total hotels | 415,052 |
| Hotels with coordinates | **395,646 (95.3%)** |
| Hotels without coords | 19,406 (4.7%) |
| — in dests WITH coords | 0 |
| — in dests WITHOUT coords | 935 |
| — of which in topics/activities | ~355 (should stay NULL) |
| — of which in real towns needing coords | ~580 |

## What Was Done

### Phase 1 — Destination Geocoding
- **GeoNames cache** (69k cities ≥5k pop): matched city names to coordinates
- **Manual web search**: geocoded hard-to-find places (Tioman, Tirana, Nanortalik, Yaxchilan, etc.)
- **LocationIQ batch**: hit daily rate limit (5k/day) — 0 successful
- **Nominatim batch**: 2/213 succeeded — too slow/rate-limited
- **Total**: ~1,000+ destinations geocoded

### Phase 2 — paisCode Audit
- Scanned all 24,270 non-XX dests using 1° spatial grid + GeoNames
- 2,426 mismatches found
- 2,284 auto-fixed (<50km from nearest city in different country)
- 104 fixed in review pass (PT/GB defaults, <100km)
- 134 skipped (border zone, 50-200km, need human review)
- 897 NULLed (garbage coords)
- 576 KEEP (name matches nearest city)
- 140 confirmed real via GeoNames
- 624 KEEP via heuristics (small towns <5k pop)
- 32 REVERT (border towns)
- 123 NULL (topics with garbage coords)
- 6 manual corrections

### Phase 3 — Destination Classification
- Built keyword filter: 411 topics, 127 regions/areas, 649 real towns
- Exported `data/export_towns_for_geocode.csv` (649 town candidates)
- Of those, **251 found in GeoNames** and batch-geocoded

### Phase 4 — Hotel Geocoding
- **Fase A** (hotel-index.json match): negligible matches (~12)
- **Fase A.5** (dest→hotel copy): +359 hotels
- **Geocode via Photon**: unreachable (komoot.io timeout)
- **Geocode via Nominatim**: rate-limited (429)
- **Geocode via LocationIQ**: rate-limited (429, daily quota)

## Blockers
- **Photon** (komoot.io): server not responding from this network
- **Nominatim**: rate-limited (1 req/s, 429)
- **LocationIQ**: daily quota exhausted (5k/day)
- No external geocoding API is currently accessible

## Remaining Work
- ~164 real towns (from original 649) still need coords
- ~355 topic/activity dests should stay NULL (no coords needed)
- ~580 hotels in those towns = ~95 hotels per town avg → low impact per town
- All 3 APIs need to reset/come back online for bulk geocoding
- Manual web search is the only viable fallback for small towns not in GeoNames

## Key Files
| File | Description |
|------|-------------|
| `data/export_towns_for_geocode.csv` | 649 town candidates |
| `data/export_dests_sem_coords.csv` | All 1,186 non-XX dests without coords |
| `data/export_paiscode_mismatches.csv` | 2,426 paisCode mismatches |
| `data/geonames-cache/cities5000-cities.json` | 69k GeoNames cities |
| `scripts/geocode-hotels-combined.mjs` | Pipeline: local index → dest copy → Photon |
| `scripts/geocode-wv-hotels-parallel.mjs` | Parallel Photon/Nominatim geocoder |
| `scripts/_copy-dest-coords-to-hotels.mjs` | Copy dest coords to hotels (0 API calls) |
