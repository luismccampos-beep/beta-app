# Hotéis via OpenStreetMap (MVP)

Integração gratuita: **BizData** (Overpass), **Photon** (geocodificação), **Wikidata/Commons** (imagens).

## Endpoints

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/api/travel/v1/hotels/osm?location=Porto, Portugal&radius_km=5&limit=20` | Hotéis OSM (BizData) |
| GET | `...&enrich=wikidata` | + imagem Commons quando há `wikidata` |
| GET | `/api/travel/v1/hotels/geocode?q=Hotel Mundial Lisboa&hotelsOnly=1` | Pesquisa por nome (Photon) |
| GET | `/api/travel/v1/hotels/nearby?lat=&lng=` | Catálogo `wv_hotels` com geo na DB |
| GET | `/api/travel/v1/hotels/:id/image` | P18 → `image_url` na DB |
| GET/POST | `/api/travel/v1/hotels/:id/reviews` | Avaliações MVP (1–5 estrelas) |

## Variáveis (opcionais)

```env
# BIZDATA_API_BASE_URL=""
# PHOTON_API_BASE_URL="https://photon.komoot.io"
# PHOTON_USER_AGENT="beta-app-travel/1.0 (contact@example.com)"
```

## Fluxo recomendado

1. **Descoberta** — `hotels/osm` para listar POIs numa cidade.
2. **Pesquisa UX** — `hotels/geocode` enquanto o utilizador escreve o nome.
3. **Persistência** — import/backfill em `wv_hotels` (`latitude`, `longitude`, `wikidata_id`).
4. **Imagem** — `GET .../hotels/:id/image` ou `enrich=wikidata` na busca OSM.
5. **Estrelas sociais** — `POST .../reviews` (OSM não tem ratings centralizados).

## Migrações

```bash
npx prisma migrate deploy
npm run travel:catalog:backfill-geo
```

## Exemplos

```bash
curl "http://localhost:3000/api/travel/v1/hotels/osm?location=Lisboa,%20Portugal&limit=5"
curl "http://localhost:3000/api/travel/v1/hotels/geocode?q=Hotel%20Tivoli%20Lisboa&hotelsOnly=1"
```

---

## See Also

- [GEOCODING-SUMMARY.md](./GEOCODING-SUMMARY.md) — Photon geocoding used for OSM hotel coordinates
- [ENRICHMENT-SUMMARY.md](./ENRICHMENT-SUMMARY.md) — overall enrichment pipeline that includes OSM hotel data
- [CULTURAL_DATA_ARCHITECTURE.md](./CULTURAL_DATA_ARCHITECTURE.md) — broader OSM ingestion strategy for POIs and cultural data
- [TRAVEL_CATALOG_API.md](./TRAVEL_CATALOG_API.md) — catalog API that exposes hotel data
- [DATA_COMPLIANCE.md](./DATA_COMPLIANCE.md) — OSM ODbL and Wikidata CC0 attribution requirements
- [Documentation Index](./README.md)
