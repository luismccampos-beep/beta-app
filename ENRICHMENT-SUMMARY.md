# Enrichment Summary — AKMLEVA Travel Bundle

**Bundle file:** `src/data/travel-mock/bundle-wikivoyage.json` (gitignored)
**Destinations:** 28,474

---

## Wikidata Cultural POIs

**Script:** `scripts/enrich-bundle-wikidata-pois.mjs`
**npm script:** `travel:demo:enrich-wikidata-pois`

- **324 destinations enriched** across 29 countries
- **2,628 cultural POIs** matched (museums, monuments, religious sites, nature, historic places)
- **141 destinations** now have at least one Wikidata POI
- Uses SPARQL country-batched queries (~50× faster than per-destination OSM)
- 23 POI types in 4 groups: `cultural_historic`, `cultural_religious`, `cultural_museum`, `nature`
- Caches results in `wikidata-country-cache.json` for resume support
- Large countries (>10° span) split into 10° tiles based on actual destination locations
- XX (international) destinations marked enriched without querying

### How to re-run
```bash
npm run travel:demo:enrich-wikidata-pois
```

---

## Hospitals & Police (Services)

### Country-scoped batch (attempted)
**Script:** `scripts/enrich-bundle-overpass-country.mjs`
**npm script:** `travel:demo:enrich-overpass-country`

Uses tile-based Overpass queries per country. Limited by Overpass API rate limits on dense areas. Includes:
- 10° tile size with configurable max-tile cap (default 30)
- 60s delay between queries
- Sane coordinate sanity checks
- Falls back gracefully — marks countries with excessive tiles as enriched (skipped)

### Per-destination (working)
**Script:** `scripts/enrich-bundle-hospitals-police.mjs`
**npm script:** `travel:demo:enrich-hospitals-police`

- **5 destinations enriched**, 106 service POIs
- Processes ~6 destinations per run before Overpass rate limit
- Supports `--resume` flag for checkpoint continuation
- Supports `--limit=N`, `--radius=N`, `--hospitals-only`, `--police-only`, `--bizdata-only`
- Saves checkpoint after each batch

### How to continue
```bash
npm run travel:demo:enrich-hospitals-police -- --resume --limit=15
```

---

## Rental Cars

**Script:** `scripts/enrich-bundle-rental-cars.mjs`
**npm script:** `travel:demo:enrich-rental-cars`

- **701 rental cars** generated across 52 countries
- 18 rental car companies
- 46 vehicle models with real Unsplash images (45/46 have photos)
- Prices calculated by country multiplier + company variation
- Stored in `aluguerCarros` array in `bundle-wikivoyage.json`

---

## Coordinate Fixes

Several destinations had incorrect coordinates that caused massive bounding boxes and wasted queries:

| Country | Destination | Wrong | Correct |
|---------|-----------|-------|---------|
| AU | Adelaide | 41.94, 12.47 (near Rome) | -34.93, 138.60 |
| AU | Brisbane | 51.76, -2.28 (near Oxford) | -27.47, 153.03 |
| BR | Belém | 43.10, 1.40 (Bay of Biscay) | -1.46, -48.50 |

The Overpass country script now has a 30-tile cap to skip countries with suspicious bounding boxes.

---

## GetYourGuide Scraper

**Feasible** via Playwright/Puppeteer — would scrape activity listings (tours, tickets, excursions) per destination. Not yet implemented. Would require a new script following the enrich-bundle pattern.

---

## Blocked

- **Budget enrichment** (`travel:demo:enrich-budget`) — needs `data/cost-of-living/*.csv` which doesn't exist

---

## Background Process Note

`scripts/enrich-images-wikimedia.mjs` runs continuously and reads/writes the same bundle file. When it saves (every 10 destinations), it can overwrite changes made by enrichment scripts. **Kill all node processes before running enrichment scripts** to avoid conflicts:

```powershell
Get-Process -Name "node" | Stop-Process -Force
```

---

## Pipeline Scripts

All enrichment scripts registered in `package.json`:

| Script | Command |
|--------|---------|
| Wikidata POIs | `travel:demo:enrich-wikidata-pois` |
| Overpass (country) | `travel:demo:enrich-overpass-country` |
| Hospitals/police (per-dest) | `travel:demo:enrich-hospitals-police` |
| Rental cars | `travel:demo:enrich-rental-cars` |
| Cultural POIs (legacy OSM) | `travel:demo:enrich-cultural-pois` |
| Pipeline (all) | `travel:demo:enrich-pipeline` |
| Pipeline resume | `travel:demo:enrich-pipeline:resume` |

---

## Key Files

| File | Purpose |
|------|---------|
| `scripts/enrich-bundle-wikidata-pois.mjs` | Wikidata SPARQL enrichment |
| `scripts/enrich-bundle-overpass-country.mjs` | Country-scoped Overpass batch |
| `scripts/enrich-bundle-hospitals-police.mjs` | Per-destination hospitals/police |
| `scripts/enrich-bundle-rental-cars.mjs` | Rental car generation |
| `scripts/lib/logger.mjs` | Shared logger utility |
| `src/data/travel-mock/wikidata-country-cache.json` | Wikidata SPARQL cache (23 MB) |
