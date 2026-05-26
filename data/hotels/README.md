# Bases de dados de hotéis

Ficheiros para enriquecer o bundle Wikivoyage (`bundle-wikivoyage.json`) com alojamento real ou semi-estruturado.

| Ficheiro | Registos | Cobertura | Utilidade |
|----------|----------|-----------|-----------|
| `Empreendimentos_TurADsticos_Existentes.csv` | ~5 600 | Portugal (RNET) | Hotéis/apartamentos licenciados — nome, concelho, estrelas, GPS |
| `Estabelecimentos_de_Alojamento_Local.csv` | ~112 000 | Portugal (RNAL) | Alojamento local — muito volume por concelho/localidade |
| `wikivoyage-listings-en.csv` | ~67 000 sleep | Global (EN) | Listagens `sleep` por artigo Wikivoyage |
| `Accommodation.csv` | ~2,6 M | **Tirol do Sul / OpenDataHub** | Útil só para destinos nos Alpes (~46–47°N); não cobre o mundo |
| `hotel.db` | demo | — | **Não é catálogo** — base SQLite de reservas/PMS (quartos, hóspedes) |

## Estado actual do bundle

- **28 475** destinos, **~366 000** hotéis (majoritariamente dos listings PT/EN na construção Wikivoyage)
- **~2 300** destinos ficam **sem nenhum hotel** (8 %)
- Em **Portugal**, ~**760** de **1 196** destinos sem hotel (muitos artigos mal classificados como PT)

## Enriquecimento

```bash
npm run travel:demo:build-hotel-index   # gera data/hotels/hotel-index.json
npm run travel:demo:enrich-hotels       # preenche destinos com <1 hotel
npm run travel:demo:enrich-hotels -- --dry-run
```

O script cruza destinos por **nome ≈ concelho/localidade** (PT) e **nome ≈ artigo** (listings EN).

## Destinos ainda sem hotel (~1 500)

Segunda fase (país, geocoding, fuzzy, geo):

```bash
npm run travel:demo:build-hotel-index   # inclui geoGrid
npm run travel:demo:enrich-hotels-remaining
npm run travel:demo:enrich-hotels-remaining -- --liteapi --liteapi-limit=40
npm run travel:demo:enrich-hotels-remaining -- --synthetic   # último recurso demo
```

Variáveis: `HOTEL_GEOCODE_LIMIT=250`, `LITEAPI_API_KEY` (com `--liteapi`).

## Limitações

- **Accommodation.csv** não substitui uma API global (LiteAPI, Hotelbeds, Google Hotels).
- Matching por nome falha em homónimos (ex.: “Springfield”).
- Para preços ao vivo, usar LiteAPI / Crawlbase / mock existente.
