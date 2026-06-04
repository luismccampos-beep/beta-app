# Bases de dados de hotéis

Ficheiros para enriquecer o bundle Wikivoyage (`bundle-wikivoyage.json`) com alojamento real ou semi-estruturado.

| Ficheiro | Registos | Cobertura | Utilidade |
|----------|----------|-----------|-----------|
| `Empreendimentos_TurADsticos_Existentes.csv` | ~5 600 | Portugal (RNET) | Hotéis/apartamentos licenciados — nome, concelho, estrelas, GPS |
| `Estabelecimentos_de_Alojamento_Local.csv` | ~112 000 | Portugal (RNAL) | Alojamento local — muito volume por concelho/localidade |
| `wikivoyage-listings-en.csv` | ~67 000 sleep | Global (EN) | Listagens `sleep` por artigo Wikivoyage |
| `Accommodation.csv` | ~2,6 M | **Tirol do Sul / OpenDataHub** | Útil só para destinos nos Alpes (~46–47°N); não cobre o mundo |
| `hotel.db` | demo | — | **Não é catálogo** — base SQLite de reservas/PMS (quartos, hóspedes) |
| `wikidata-hotels.json` | — | Global | Hotéis com coordenadas via SPARQL (alta cobertura) |
| `wikivoyage-sleep-hotels.json` | ~67k | Global (EN) | Listagens `{{sleep}}` / `{{durma}}` — preços, GPS, descrição |
| `hotel-chains-wikipedia.csv` | — | Global | Tabela de cadeias/marcas (Wikipedia) para bootstrap |

## Estado actual do bundle

- **28 475** destinos, **~366 000** hotéis (majoritariamente dos listings PT/EN na construção Wikivoyage)
- **~2 300** destinos ficam **sem nenhum hotel** (8 %)
- Em **Portugal**, ~**760** de **1 196** destinos sem hotel (muitos artigos mal classificados como PT)

| `wikipedia-hotels.json` | Wikipedia (script) | Hotéis reais por categoria/país — complemento offline |

```bash
npm run travel:fetch:wikipedia-hotels
npm run travel:fetch:wikipedia-hotels -- --country=Portugal --limit=300
```

## Wikidata (recomendado para escala)

```bash
npm run travel:fetch:wikidata-hotels -- --limit-total=20000 --batch=800 --delay=1200
npm run travel:fetch:wikidata-hotels -- --resume --limit-total=50000 --delay=2000
```

API simulada:

```http
GET /api/travel/v1/hotels/simulated?city=Lisbon&country=Portugal&profile=conforto&checkIn=2026-06-15
```

**Rate limit (HTTP 429):** o script faz retry automático com pausa. Se falhar, usa `--resume-failed`. Aumenta `--delay=1500` se necessário.

**Portugal (~8 na categoria país):** use também cidades: `--country=Portugal` (inclui Lisboa, Porto, …).

**UK:** a categoria correcta é `Hotels_in_the_United_Kingdom`, não `United_Kingdom`.

## Wikipedia por cadeia (hotel chains)

```bash
npm run travel:fetch:wikipedia-hotels -- --chain=marriott,hilton,accor,ihg,hyatt,fourseasons,ritzcarlton --limit=200 --delay=1500
```

Chaves suportadas no script: `marriott`, `hilton`, `accor`, `ihg`, `hyatt`, `fourseasons`, `ritzcarlton`, `sheraton`, `nh`.

Tabela de cadeias (bootstrap):

```bash
npm run travel:fetch:wikipedia-hotel-chains:install
npm run travel:fetch:wikipedia-hotel-chains
```

Auto-chain (usa a tabela acima para gerar queries):

```bash
npm run travel:fetch:wikipedia-hotels -- --chain=auto --chain-auto-max=25 --limit=80 --delay=1500
```

Auto-chain + brands (Managed/Franchised):

```bash
npm run travel:fetch:wikipedia-hotel-chains
npm run travel:fetch:wikipedia-hotels -- --chain=auto-brands --chain-auto-max=10 --chain-auto-brands=both --chain-auto-brands-max=60 --search-limit=500 --delay=1500
```

**Teto ~2k com `--chain=auto-brands`:** a Wikipedia só devolve ~500 resultados por pesquisa e há muita deduplicação. Para passar disso, use **por país** (categorias `Category:Hotels_in_*`):

```bash
# 1 país
npm run travel:fetch:wikipedia-hotels -- --country=Portugal --limit=500 --delay=1500

# Vários países (presets)
npm run travel:fetch:wikipedia-hotels -- --countries=iberia --limit=500 --delay=1500
npm run travel:fetch:wikipedia-hotels -- --countries=europe --limit=300 --delay=1500
npm run travel:fetch:wikipedia-hotels -- --countries=mediterranean --limit=300 --delay=2000
npm run travel:fetch:wikipedia-hotels -- --countries=top --limit=300 --delay=2000

# Lista explícita
npm run travel:fetch:wikipedia-hotels -- --countries=Portugal,Spain,France,Italy,Greece --limit=400 --delay=1500

# Ver todos os países + presets
npm run travel:fetch:wikipedia-hotels -- --list-countries
```

Presets: `iberia`, `lusophone`, `europe`, `mediterranean`, `americas`, `asia`, `africa`, `oceania`, `top`, `all`.

## Listas Wikipedia + categorias cadeia/cidade

Artigos tipo [List of largest hotels in Europe](https://en.wikipedia.org/wiki/List_of_largest_hotels_in_Europe), [List of integrated resorts](https://en.wikipedia.org/wiki/List_of_integrated_resorts), [List of Marriott hotels](https://en.wikipedia.org/wiki/List_of_Marriott_hotels), e as 72 subcategorias `Hotels_in_*` + 61 categorias de cadeia:

```bash
# Só listas (7 artigos default)
npm run travel:fetch:wikipedia-hotel-lists -- --preset=lists --delay=1500

# Categorias de cadeia (Marriott, Accor, Four Seasons, …)
npm run travel:fetch:wikipedia-hotel-lists -- --preset=chains --limit=300 --delay=1500

# Cidades (Lisbon, Bangkok, Dubai, … + subcats de Category:Hotels_by_city)
npm run travel:fetch:wikipedia-hotel-lists -- --preset=cities --limit=300 --delay=1500

# Tudo
npm run travel:fetch:wikipedia-hotel-lists -- --preset=all --limit=300 --delay=2000

# Lista específica
npm run travel:fetch:wikipedia-hotel-lists -- --list="List of integrated resorts" --delay=1500
```

## Wikivoyage Sleep / Durma (recomendado — muito mais que Wikidata)

O dump/listings já extrai `{{sleep}}`, `{{durma}}`, `{{dormir}}` (ver `scripts/parse-wikivoyage-dump.py`). Export para o simulador offline:

```bash
# Se ainda não tens o CSV EN (~67k sleep):
npm run wikivoyage:extract:en -- --listings

npm run travel:export:wikivoyage-sleep
npm run travel:export:wikivoyage-sleep -- --lang=both   # + JSONL PT se existir
```

Gera `data/hotels/wikivoyage-sleep/index.json` + `shards/*.json` (carregamento **lazy por destino** — não carrega 400k em RAM). O simulador usa **Wikipedia + Wikidata + Wikivoyage sleep** juntos.

Re-export após atualizar o script (se ainda só tens o monólito):

```bash
npm run travel:export:wikivoyage-sleep
``` O bundle (`travel:demo:build`) já tem ~366k hotéis Wikivoyage; este JSON é a versão leve para `/api/travel/v1/hotels/simulated`.

## GeoNames (Geopy — batch no bundle)

```bash
# .env.local: GEONAMES_USERNAME=...
npm run travel:geonames:install
npm run travel:demo:enrich-geonames -- --limit 100
npm run travel:demo:enrich-geonames -- --limit 20 --dry-run
```

API em tempo real: `GET /api/travel/v1/geonames?q=Lisboa,Portugal&nearby=1`

Para escala global (10k+ coordenadas), use também **Wikidata** (`wikidata-hotels.json`):

```bash
npm run travel:fetch:wikidata-hotels -- --limit-total=50000 --batch=80 --delay=2000
npm run travel:fetch:wikidata-hotels -- --resume
```

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

## Busca Wikipedia / Wikivoyage (destinos sem hotel)

Gera links (CSV) e consulta as APIs MediaWiki (sem scraping):

```bash
# Só links — instantâneo (inclui idiomas locais: vi, zh, ja, th, hi…)
npm run travel:search:destinos-sem-hotel-wiki -- --links-only

# Pesquisa API + resumos PT/EN via langlinks da Wikipedia
npm run travel:search:destinos-sem-hotel-wiki -- --limit=50 --extracts
npm run travel:search:destinos-sem-hotel-wiki -- --resume --limit=50 --extracts --delay=400

# Só en/pt (sem idiomas locais automáticos)
npm run travel:search:destinos-sem-hotel-wiki -- --no-local-langs

# Forçar idiomas (ex. Vietname)
npm run travel:search:destinos-sem-hotel-wiki -- --wiki-langs=en,pt,vi,zh --extracts

# Lista fixa (ex. os 949)
npm run travel:search:destinos-sem-hotel-wiki -- --from-file=data/hotels/destinos-sem-hotel-949.txt --links-only
```

Por país/continente (automático):

| Projeto | Idiomas típicos |
|---------|-----------------|
| **Wikivoyage** | en, pt + **de, fr, it, es** (Europa); **fr** (África); **es** (Américas) |
| **Wikipedia** | en, pt + **de, fr, it, pl, ru** + locais (vi, zh, ja, th, ar…) |

Queries WV por idioma: `dormir hotel` (pt), `schlafen hotel` (de), `dormir hébergement` (fr), etc.

A “tradução” usa **langlinks** da Wikipedia (PT/EN a partir do artigo local); opcional: `LIBRETRANSLATE_URL`.

Estado do pipeline: `npm run travel:wiki:status`

Saídas: `data/hotels/destinos-sem-hotel-wiki-links.csv`, `destinos-sem-hotel-wiki-search.json`.

### Pipeline → bundle → Postgres

Se o bundle já tiver hotéis sintéticos em todos os destinos (`Destinos sem hotel: 0`), o script usa automaticamente `data/hotels/destinos-sem-hotel-949.txt`. Alternativas: `--weak-hotels` (837 destinos só synthetic/liteapi) ou `--from-file=...`.

```bash
# 1) Pesquisar + extrair (várias línguas; retomar com --resume)
npm run travel:search:destinos-sem-hotel-wiki -- --extracts --limit=50 --delay=400
npm run travel:search:destinos-sem-hotel-wiki -- --resume --limit=50 --extracts

# 2) Aplicar ao bundle (resumo PT + hotéis inferidos dos artigos)
npm run travel:demo:apply-wiki-to-bundle

# 3) Sincronizar só Wikipedia/hotéis wiki para a BD
npm run travel:catalog:sync-wiki

# Atalho (lote de 50)
npm run travel:wiki:pipeline
```

Tradução automática quando não há artigo PT: definir `LIBRETRANSLATE_URL` no `.env.local` (ex. instância [LibreTranslate](https://libretranslate.com)).

Importação completa do catálogo (se ainda não correu): `npm run travel:catalog:import -- --fresh`

## Limitações

- **Accommodation.csv** não substitui uma API global (LiteAPI, Hotelbeds, Google Hotels).
- Matching por nome falha em homónimos (ex.: “Springfield”).
- Para preços ao vivo, usar LiteAPI / Crawlbase / mock existente.
