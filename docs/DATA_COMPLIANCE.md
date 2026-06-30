# Data Compliance & Attribution

This document tracks every external data source used in the project, its license, attribution requirements, caching policy, and whether the data can be used commercially. This is a living document — update it whenever a new data source is added.

## Source Inventory

### 1. Wikivoyage (Wikimedia Foundation)

| Field | Value |
|---|---|
| **Scripts** | `parse-wikivoyage-dump.py`, `build-travel-bundle-from-wikivoyage.mjs`, `export-wikivoyage-sleep-to-csv.mjs`, `export-wikivoyage-ml-features.mjs` |
| **License** | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| **Commercial use** | Yes, with attribution |
| **Attribution required** | Yes — "Wikivoyage contributors" + link to source article |
| **Attribution stored** | Yes — in parsed output as `attribution` field |
| **Cache policy** | XML dumps cached as `.xml.bz2` in `data/`; parsed JSONL in `data/wikivoyage/out/` |
| **Redistribution** | Permitted under same license (share-alike) |
| **Rate limits** | None (static dump files) |
| **API key** | None |

### 2. Wikipedia (Wikimedia Foundation)

| Field | Value |
|---|---|
| **Scripts** | `lib/external-enrichment.mjs`, `enrich-bundle-external.mjs`, `search-destinos-sem-hotel-wiki.mjs` |
| **License** | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) (text); varies for media |
| **Commercial use** | Yes, with attribution |
| **Attribution required** | Yes — "Wikipedia — {destName}" |
| **Attribution stored** | Yes — in bundle as `attribution` |
| **Cache policy** | In-memory per run; no persistent cache |
| **Redistribution** | Permitted under same license |
| **Rate limits** | None documented; reasonable use expected |
| **API key** | None (free REST API) |

### 3. Wikidata (Wikimedia Foundation)

| Field | Value |
|---|---|
| **Scripts** | `enrich-bundle-wikidata-pois.mjs`, `enrich-destination-gallery.mjs`, `gerar_links_wikivoyage.py` |
| **License** | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| **Commercial use** | Yes, no attribution required |
| **Attribution requested** | Not required but recommended |
| **Attribution stored** | Not stored |
| **Cache policy** | POI cache at `src/data/travel-mock/wikidata-country-cache.json`; 2s adaptive delay |
| **Redistribution** | Permitted (public domain) |
| **Rate limits** | None documented; 2s delay between requests implemented |
| **API key** | None (free SPARQL/REST API) |

### 4. Wikimedia Commons

| Field | Value |
|---|---|
| **Scripts** | `enrich-images-wikimedia.mjs`, `enrich-destination-gallery.mjs`, `enrich-destination-videos.mjs` |
| **License** | Varies: CC BY-SA, CC BY, Public Domain — validated per file |
| **Commercial use** | Depends on individual file license |
| **Attribution required** | Yes — author + license per file |
| **Attribution stored** | Yes — `license`, `license_url`, `attribution` fields in cache |
| **Cache policy** | Attribution cache at `wikimedia-attribution-cache.json` |
| **Redistribution** | Depends on per-file license |
| **Rate limits** | None documented; reasonable use expected |
| **API key** | None |

### 5. Unsplash

| Field | Value |
|---|---|
| **Scripts** | `lib/unsplash-client.mjs`, `lib/image-providers.mjs`, `enrich-bundle-unsplash-images.mjs` |
| **License** | [Unsplash License](https://unsplash.com/license) — free for commercial use |
| **Commercial use** | Yes |
| **Attribution required** | Not required but appreciated |
| **Attribution stored** | Yes — `photographer` + `photographer_url` |
| **Cache policy** | `src/data/travel-mock/unsplash-cache.json` |
| **Redistribution** | Permitted (images can be downloaded and used) |
| **Rate limits** | ~50 req/h (demo key) |
| **API key** | `UNSPLASH_ACCESS_KEY` in `.env.local` |

### 6. Pexels (Photos & Videos)

| Field | Value |
|---|---|
| **Scripts** | `lib/image-providers.mjs`, `lib/video-providers.mjs`, `enrich-bundle-unsplash-images.mjs`, `enrich-bundle-videos.mjs` |
| **License** | [Pexels License](https://www.pexels.com/license/) — free for commercial use |
| **Commercial use** | Yes |
| **Attribution required** | Not required but appreciated |
| **Attribution stored** | Yes — `photographer` + `photographer_url` (photos); not stored for videos |
| **Cache policy** | Same Unsplash cache; 429 detection |
| **Redistribution** | Permitted |
| **Rate limits** | ~200 req/h |
| **API key** | `PEXELS_API_KEY` in `.env.local` |

### 7. Pixabay

| Field | Value |
|---|---|
| **Scripts** | `lib/image-providers.mjs`, `enrich-bundle-unsplash-images.mjs` |
| **License** | [Pixabay License](https://pixabay.com/service/license/) — free for commercial use |
| **Commercial use** | Yes |
| **Attribution required** | Not required |
| **Attribution stored** | Yes — `photographer` + `pageURL` |
| **Cache policy** | Images downloaded to `public/travel-images/` (hotlinking prohibited); `lib/image-cache.mjs` manages local cache |
| **Redistribution** | Permitted |
| **Rate limits** | ~100 req/min |
| **API key** | `PIXABAY_API_KEY` in `.env.local` |

### 8. OpenStreetMap (Nominatim Geocoding)

| Field | Value |
|---|---|
| **Scripts** | `lib/external-enrichment.mjs`, `geocode-wv-hotels-parallel.mjs`, `geocode-wv-hotels.py`, `verify-wv-hotels-geo.mjs` |
| **License** | [ODbL](https://opendatacommons.org/licenses/odbl/) |
| **Commercial use** | Yes, with attribution |
| **Attribution required** | Yes — "© OpenStreetMap contributors" |
| **Attribution stored** | **Not stored** — compliance gap |
| **Cache policy** | No persistent cache; adaptive rate limiting (1 req/s) |
| **Redistribution** | Permitted under ODbL (share-alike) |
| **Rate limits** | 1 req/s (Nominatim Usage Policy); 429 detection with fallback |
| **API key** | None (requires `User-Agent` header — set to `AkmlevaTravelDemo/1.0`) |

### 9. Overpass API (OSM POIs)

| Field | Value |
|---|---|
| **Scripts** | `enrich-bundle-cultural-pois.mjs`, `enrich-bundle-hospitals-police.mjs`, `backfill-hotels-from-osm.mjs` |
| **License** | [ODbL](https://opendatacommons.org/licenses/odbl/) |
| **Commercial use** | Yes, with attribution |
| **Attribution required** | Yes — "© OpenStreetMap contributors" |
| **Attribution stored** | Partially — source marked as `'overpass'` in POI data; no formal notice |
| **Cache policy** | Adaptive delay (5-30s); exponential backoff on 429 |
| **Redistribution** | Permitted under ODbL |
| **Rate limits** | None hard limit; 5-30s delay implemented |
| **API key** | None |

### 10. Overture Maps

| Field | Value |
|---|---|
| **Scripts** | `enrich-bundle-overture-pois.mjs`, `lib/duckdb-poi.mjs` |
| **License** | [Community License](https://overturemaps.org/license/) |
| **Commercial use** | Yes |
| **Attribution required** | Not required |
| **Attribution stored** | Source marked as `'overture'` with `overture_id` |
| **Cache policy** | DuckDB queries on S3 Parquet; no local cache |
| **Redistribution** | Permitted |
| **Rate limits** | None (S3 dataset) |
| **API key** | None |

### 11. GeoNames

| Field | Value |
|---|---|
| **Scripts** | `download-geonames-hotels.mjs`, `geocode-destinations-geonames.mjs`, `geocode-from-geonames.mjs`, `lib/country-names.mjs` |
| **License** | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| **Commercial use** | Yes, with attribution |
| **Attribution required** | Yes — "GeoNames (www.geonames.org)" |
| **Attribution stored** | **Not stored for geocoding results** — compliance gap; `country-names.mjs` cites source |
| **Cache policy** | `data/geonames-cache/` (hotel JSON files, cities, dumps) |
| **Redistribution** | Permitted under CC BY 4.0 |
| **Rate limits** | 2,000 calls/h (free tier) |
| **API key** | `GEONAMES_USERNAME` in `.env.local` |

### 12. LocationIQ

| Field | Value |
|---|---|
| **Scripts** | `_geocode-destinos.mjs`, `check-geocode-apis.mjs` |
| **License** | [LocationIQ Terms](https://locationiq.com/terms) |
| **Commercial use** | Yes (paid plan) |
| **Attribution required** | Yes — free tier requires attribution |
| **Attribution stored** | **Not stored** — compliance gap |
| **Cache policy** | No cache; used as fallback geocoder |
| **Rate limits** | 5,000 req/day (free tier) |
| **API key** | `LOCATIONIQ_API_KEY` in `.env.local` |

### 13. OpenCage

| Field | Value |
|---|---|
| **Scripts** | `_geocode-destinos.mjs`, `check-geocode-apis.mjs` |
| **License** | [OpenCage Terms](https://opencagedata.com/terms) |
| **Commercial use** | Yes (paid plan) |
| **Attribution required** | Yes — requires attribution to OpenCage + OpenStreetMap |
| **Attribution stored** | **Not stored** — compliance gap |
| **Cache policy** | No cache; used as fallback geocoder |
| **Rate limits** | 2,500 req/day (free tier) |
| **API key** | `OPENCAGE_API_KEY` in `.env.local` |

### 14. OpenWeatherMap

| Field | Value |
|---|---|
| **Scripts** | `lib/external-enrichment.mjs`, `enrich-bundle-weather.mjs` |
| **License** | [OWM Terms](https://openweathermap.uk/terms) |
| **Commercial use** | Yes (paid plan for commercial) |
| **Attribution required** | Yes — free tier requires "Powered by OpenWeather" |
| **Attribution stored** | **Not stored** — compliance gap |
| **Cache policy** | Snapshot data in bundle; no persistent cache |
| **Rate limits** | 60 calls/min (free tier) |
| **API key** | `OPENWEATHER_API_KEY` in `.env` / `.env.local` |

### 15. LiteAPI

| Field | Value |
|---|---|
| **Scripts** | `enrich-bundle-hotels-remaining.mjs`, `search-destinos-sem-hotel-wiki.mjs` |
| **License** | LiteAPI Terms of Service |
| **Commercial use** | Yes (paid plan) |
| **Attribution required** | Per provider terms |
| **Attribution stored** | Not stored; source marked as `'liteapi'` |
| **API key** | `LITEAPI_API_KEY` (not set in .env files) |

### 16. Duffel / Scrape.do / Tavily / Transit.land / AISstream

| Source | Status | API Key |
|---|---|---|
| Duffel | Diagnostic only — not actively used | Set in `.env.local` |
| Scrape.do | Flights provider fallback — used in `live-flights.ts` | Set in `.env.local` |
| Tavily | Test scripts only — not in production | Set in `.env` |
| Transit.land | No active scripts | Set in `.env.local` |
| AISstream.io | No active scripts | Set in `.env.local` |

Scrape.do is actively used as a fallback flight data provider. The others have API keys configured but no production scripts actively consuming them — either implement proper usage with compliance tracking, or remove unused keys.

## Compliance Gaps Summary

| Gap | Sources Affected | Priority | Action |
|---|---|---|---|
| Missing attribution for geocoding results | OpenStreetMap/Nominatim, GeoNames, LocationIQ, OpenCage | **HIGH** | Store attribution string in DB or bundle for each geocoded entity |
| Missing attribution for weather data | OpenWeatherMap | **MEDIUM** | Add "Powered by OpenWeather" notice in UI |
| LiteAPI key not configured | LiteAPI | **MEDIUM** | Set API key or remove unused code |
| Unused API keys present | Transit.land, AISstream | **LOW** | Remove keys from .env files if not used |

## Recommended Attribution UI

For a travel platform, attribution should be displayed per data type:

- **Destinations**: "Based on Wikivoyage (CC BY-SA 3.0)" — link to source
- **Photos**: Photographer credit per image (already stored)
- **Map data**: "© OpenStreetMap contributors" on all map views
- **Weather**: "Powered by OpenWeather" on weather sections
- **Geocoding results**: Attribution per provider in page footer
- **POIs**: "© OpenStreetMap contributors" on all POI displays

## Cache & Data Retention

| Data Type | Cache Location | Retention | Notes |
|---|---|---|---|
| Bundle JSON | `src/data/travel-mock/` | Indefinite (committed) | Rebuilt on pipeline run |
| Unsplash images | `src/data/travel-mock/unsplash-cache.json` | Indefinite | URLs only |
| Pixabay images | `public/travel-images/` | Indefinite | Downloaded per Pixabay license |
| Wikimedia attribution | `wikimedia-attribution-cache.json` | Indefinite | Metadata only |
| GeoNames dumps | `data/geonames-cache/` | Indefinite | Refresh periodically |
| Wikivoyage dumps | `data/` | Indefinite | Refresh on data update |

## GDPR Considerations

- **No personal data** is collected through these data sources (they are POIs, destinations, hotel data)
- User personal data (auth) is handled separately via Prisma + PostgreSQL — ensure proper retention policies are in place
- If hotel guest data is ever imported from third parties, a DPA (Data Processing Agreement) is required
- Cookie consent and analytics tracking are outside the scope of this document — handled via the web app's cookie consent mechanism
