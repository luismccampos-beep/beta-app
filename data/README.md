# Dados Wikivoyage

## Ficheiros de entrada

| Ficheiro | Idioma | Tamanho (aprox.) |
|----------|--------|------------------|
| `ptwikivoyage-latest-pages-articles.xml.bz2` | Português | ~9 MB |
| `enwikivoyage-latest-pages-articles.xml.bz2` | Inglês | ~123 MB |

São dumps XML MediaWiki (texto e wikilinks; **sem imagens**).

## Extrair para JSONL

```bash
# Dependência (uma vez)
py -3 -m pip install -r scripts/requirements-wikivoyage.txt

# Teste rápido (50 artigos PT)
py -3 scripts/parse-wikivoyage-dump.py --lang pt --max-pages 50

# Todos os artigos PT (~4 600 páginas, ~1–2 min)
py -3 scripts/parse-wikivoyage-dump.py --lang pt

# Inglês (demora mais — ficheiro maior)
py -3 scripts/parse-wikivoyage-dump.py --lang en

# Ambos + listings (hotéis, restaurantes, etc. nos templates)
py -3 scripts/parse-wikivoyage-dump.py --lang both --listings
```

Saída em `data/wikivoyage/out/`:

- `pt-articles.jsonl` — um artigo por linha (`title`, `text`, `url`, …)
- `en-articles.jsonl`
- `index.json` — estatísticas da extracção

Ou via npm:

```bash
npm run wikivoyage:extract
npm run wikivoyage:extract:pt
```

## Licença (obrigatório)

Conteúdo **CC BY-SA 3.0**:

1. **Atribuição** — link para o artigo Wikivoyage (campo `url` / `attribution` no JSONL).
2. **CompartilhaIgual** — se redistribuir texto alterado, use a mesma licença.

## Base de demonstração na app

Depois de extrair o JSONL:

```bash
npm run travel:demo:build
```

Isto gera `src/data/travel-mock/bundle-wikivoyage.json` com:

- **PT only:** ~2 800 destinos, ~3 400 hotéis, ~1 300 voos (~4 MB)
- **PT + EN:** ~28 500 destinos, ~366 000 hotéis, ~2 800 voos (~109 MB)
- Hotéis dos templates `{{durma}}` / `{{sleep}}`; voos sintéticos LIS, OPO, MAD, BCN, etc.

Ative no `.env.local`:

```env
TRAVEL_USE_MOCK_DATA=true
TRAVEL_DEMO_DATA=wikivoyage
```

Pipeline completo:

```bash
npm run travel:demo:full
```

Estatísticas: `GET /api/travel/demo-stats`

### LiteAPI (hotéis ao vivo)

Autocomplete de cidades/áreas/hotéis (Google Places via LiteAPI):

```env
LITEAPI_API_KEY="sand_…"   # ou prod_…
```

```http
GET /api/travel/liteapi/places?q=Lisboa&type=locality,hotel&language=pt
```

Resposta: `places[]` com `placeId` (usar depois em rates/booking LiteAPI). A chave **não** deve ir ao browser — só este proxy no servidor.

### Google Hotels (Crawlbase, offline)

Scripts Python em `scripts/google-hotels/` — listagens + detalhes via Crawlbase (render JS):

```env
CRAWLBASE_JS_TOKEN="…"
```

```bash
npm run travel:google-hotels:install
npm run travel:google-hotels:listings -- --location Lisboa
npm run travel:google-hotels:details -- --limit 5
```

Saída: `data/google-hotels/google_hotels.json` e `google_hotel_details.json`. Ver `scripts/google-hotels/README.md`.

### Wikipedia, clima e custo de vida (offline)

```bash
# Chave em .env.local: OPENWEATHER_API_KEY (opcional, para clima)
npm run travel:demo:enrich-external
npm run travel:demo:enrich-external -- --limit 50 --only wikipedia
```

Grava no bundle: `wikipedia_resumo`, `clima_tempo` (snapshot OpenWeather).

### Orçamentos diários (CSV Kaggle, offline)

Coloque os CSV em `data/cost-of-living/` (ver `data/cost-of-living/README.md`).

```bash
npm run travel:demo:enrich-budget
```

Grava `custo_de_vida.orcamentos` (mochileiro / conforto / luxo) sem API paga.

Corrigir países errados no bundle (sem rebuild):

```bash
npm run travel:demo:patch-countries
npm run travel:demo:enrich-budget
```

### Transporte aéreo (CSV OurAirports + OpenFlights)

Coloque `airports.csv` e `routes.csv` em `data/transportation/` (ver README nessa pasta).

```bash
npm run travel:demo:enrich-transport
```

Grava `transporte` completo (aeroporto, rotas, preços indicativos, aviões). Depois:

```bash
npm run travel:demo:rebuild-flights      # voos alinhados com routes.csv
npm run travel:demo:enrich-pipeline      # pipeline completo (países → clima → transporte → orçamento → voos)
```

**Voos com preço:** `DUFFEL_ACCESS_TOKEN` (ofertas bookable) ou `SCRAPE_DO_API_KEY` (Google Flights via Scrape.do, fallback). Os CSV são rede e aeroportos, não tarifas.

### Roteamento local (demo sem API na cloud)

| Motor | Modo | Comando |
|-------|------|---------|
| **OpenTripPlanner** | Transit (autocarro/metro) | `npm run otp:prepare && npm run otp:build && npm run otp:up` |
| **Valhalla** | Carro / a pé / bicicleta | `docker compose up valhalla -d` |

```env
OTP_BASE_URL="http://localhost:8080"
VALHALLA_BASE_URL="http://localhost:8002"
TRAVEL_ROUTING_LOCAL_ONLY=true
```

- API: `GET /api/travel/routing/local?from=lat,lon&to=lat,lon&mode=transit`
- UI: cartão **“Como chegar”** (Transit · Carro · A pé · Bicicleta)

Ver `data/opentripplanner/README.md`. **TripGo** só entra se `TRAVEL_ROUTING_LOCAL_ONLY` estiver off.

### Cartões de destino (resumo, veja, faça, coma)

Sem reconstruir o bundle nem apagar imagens já enriquecidas:

```bash
npm run travel:demo:cards
```

Lê `pt-articles.jsonl` / `en-articles.jsonl`, limpa wikitext, extrai secções `==Entenda==`, `==Veja==`, `==Faça==`, `==Coma==` e dicas práticas (`Mantenha-se seguro`, `Respeite`, `Dinheiro`, `Chegue`, …). Grava em cada destino: `resumo`, `veja`, `faca`, `coma`, `dicas`, `tags`. Cartões e página `/destinations/{lang}-{id}` quando `TRAVEL_DEMO_DATA=wikivoyage`.

## ML — embeddings de destinos (fase 2)

```bash
# 1. Exportar features do bundle → ml-service/app/data/
npm run travel:ml:export

# 2. Treinar TF-IDF + SVD (ml-service)
npm run travel:ml:train

# Ou pipeline completo
npm run travel:ml:build
```

Com `ML_SERVICE_BASE_URL` e o ml-service a correr (`cd ml-service && npm run dev`), os resultados em `/results` misturam **regras + embeddings + distância rodoviária (SCGraph)**. Endpoints: `POST /v1/travel/rank`, `POST /v1/travel/distance/batch`. Instalar no ml-service: `pip install scgraph`.

## Imagens de destinos (Pixabay + Pexels + Unsplash)

Ordem no script **`images-map`**: **Pexels → Pixabay (cache local) → Unsplash**.

| API | Variável | Limites (gratuito) | Notas |
|-----|----------|-------------------|--------|
| Pixabay | `PIXABAY_API_KEY` | ~100 req/min | Sem hotlink permanente — ficheiros em `public/travel-images/` |
| Pexels | `PEXELS_API_KEY` | ~200 req/h | Hotlink OK |
| Unsplash | `UNSPLASH_ACCESS_KEY` | ~50 req/h (demo) | Fallback |

1. [Pixabay](https://pixabay.com/api/docs/) → `PIXABAY_API_KEY`
2. [Pexels](https://www.pexels.com/api/) → `PEXELS_API_KEY` (opcional)
3. [Unsplash](https://unsplash.com/oauth/applications) → `UNSPLASH_ACCESS_KEY` (opcional)
4. `npm run travel:images:enrich`
5. `npm run travel:images:status`

**Vercel:** imagens Pixabay ficam em `public/travel-images/` (local). Para produção, corre o enrich antes do deploy ou usa só Pexels/Unsplash (URLs remotas).

## Licença na app

Os resultados incluem link **Guia Wikivoyage** (CC BY-SA 3.0) em cada cartão quando aplicável.

---

## Enriquecimento de Hotéis (sem custos)

O projeto tem **382k hotéis** na base de dados Neon (`wv_hotels`), extraídos do Wikivoyage.
A maioria tem nome e destino mas falta coordenadas GPS, imagens e preços reais.
Os scripts abaixo melhoram a qualidade sem custo nenhum.

### Estado atual da BD

| Métrica | Valor |
|---------|-------|
| Total `wv_hotels` | ~382k |
| Com coordenadas GPS | ~5.5k (1.5%) |
| Com Google Place ID | 0 |
| Com imagem | 0 |
| Total `wv_destinations` | ~28.5k |

### Ver estado do pipeline

```bash
# Resumo geral: destinos com/sem hotel, Wikipedia, imagens
npm run travel:wiki:status

# Estado das imagens por destino
npm run travel:images:status

# Exportar lista de destinos ainda sem hotel para CSV
npm run travel:export:destinos-sem-hotel-snapshot
```

### Fase 1 — Coordenadas GPS (100% gratuito, dados locais)

Usa o índice local `data/hotels/hotel-index.json` (367 MB) e Nominatim/OpenStreetMap.
Não precisa de nenhuma chave de API.

```bash
# Constrói o índice local a partir de Hotels.geojson
npm run travel:demo:build-hotel-index

# 1. Patch do índice com coordenadas de communes francesas (melhora hotéis FR)
node scripts/patch-french-hotels-geo.mjs

# 2. Preenche lat/lon nos hotéis da BD a partir do índice local (matching fuzzy melhorado)
npm run travel:catalog:backfill-geo

# Preenche lat/lon nos destinos sem coordenadas
npm run travel:catalog:backfill-dest-geo

# Adiciona código IATA aos destinos
npm run travel:catalog:backfill-iata

# 3. Verifica qualidade — marca hotéis com coords geograficamente erradas
#    (requer acesso à internet: photon.komoot.io)
npm run travel:catalog:verify-hotels-geo -- --dry-run --limit 500
npm run travel:catalog:verify-hotels-geo -- --limit 500
npm run travel:catalog:verify-hotels-geo   # todos (demora mais)
```

### Fase 1b — Geocoding via Nominatim/Python (gratuito, retoma onde parou)

Para hotéis sem coordenadas que o índice local não cobre, o script Python usa o
Nominatim (OpenStreetMap) com validação de país — se o resultado ficar num país
diferente do destino (ex: hotel BR mas coords em PT), é automaticamente rejeitado.

```bash
# Instalar dependências (uma vez)
npm run travel:catalog:geocode-hotels:install

# Ver progresso atual (não corre nada)
npm run travel:catalog:geocode-hotels -- --status

# Testar com 20 hotéis sem escrever na BD
npm run travel:catalog:geocode-hotels -- --dry-run --limit 20

# Correr lote de 500 (retoma automaticamente onde parou)
npm run travel:catalog:geocode-hotels -- --limit 500

# Só hotéis portugueses
npm run travel:catalog:geocode-hotels -- --country PT --limit 200

# Nova tentativa para hotéis marcados como "não encontrado"
npm run travel:catalog:geocode-hotels -- --retry-not-found --limit 200
```

Marcadores usados no campo `fonte` da BD para controlo de estado:

| Valor `fonte` | Significado |
|---------------|-------------|
| `geo_found` | Coordenadas encontradas e validadas |
| `geo_not_found` | Tentado mas Nominatim não encontrou — ignorado na próxima vez |
| `geo_wrong_country` | Nominatim devolveu coords noutro país — rejeitado |
| `rejected_geo` | Rejeitado pelo `verify-hotels-geo` (coords claramente erradas) |

### Fase 2 — Hotéis via Wikipedia (gratuito, sem chave)

Pesquisa a Wikipedia para encontrar hotéis em destinos que ainda não têm nenhum.

```bash
# Pipeline completo (pesquisa → aplica ao bundle → sincroniza BD)
npm run travel:wiki:pipeline

# Ou passo a passo:
npm run travel:search:destinos-sem-hotel-wiki -- --extracts --limit=50 --delay=400
npm run travel:demo:apply-wiki-to-bundle
npm run travel:catalog:sync-wiki
```

### Fase 3 — Hotéis via Wikidata (gratuito, sem chave)

Wikidata SPARQL tem milhares de hotéis com coordenadas verificadas.

```bash
npm run travel:fetch:wikidata-hotels
```

### Fase 4 — Hotéis para destinos ainda vazios (gratuito)

Para destinos que após as fases anteriores continuam sem hotel, usa o índice local
e opcionalmente a LiteAPI (chave sandbox gratuita em `.env.local`).

```bash
# Só índice local (sem API)
npm run travel:demo:enrich-hotels-remaining

# Com LiteAPI sandbox (chave LITEAPI_API_KEY em .env.local)
npm run travel:demo:enrich-hotels-remaining -- --liteapi --liteapi-limit=500
```

### Fase 5 — Imagens dos destinos (gratuito com rate limits)

Não são imagens dos hotéis mas dos destinos — aparece nos cartões de resultado.
Precisa de pelo menos uma chave em `.env.local`: `PEXELS_API_KEY`, `PIXABAY_API_KEY` ou `UNSPLASH_ACCESS_KEY`.

```bash
npm run travel:images:enrich
```

### Fase 6 — Resumos Wikipedia para destinos (gratuito)

```bash
# Só Wikipedia (sem OpenWeather)
npm run travel:demo:enrich-external -- --only wikipedia

# Com limite (para testar)
npm run travel:demo:enrich-external -- --limit 100 --only wikipedia
```

### Ordem recomendada (tudo gratuito)

```bash
npm run travel:wiki:status                               # 1. ver estado atual
npm run travel:demo:build-hotel-index                    # 2. construir índice local
node scripts/patch-french-hotels-geo.mjs                 # 3. patch coordenadas FR
npm run travel:catalog:backfill-geo                      # 4. coords hotéis (índice local)
npm run travel:catalog:backfill-dest-geo                 # 5. coords destinos
npm run travel:catalog:verify-hotels-geo -- --dry-run --limit 500  # 6. verificar qualidade
npm run travel:catalog:verify-hotels-geo -- --limit 500  # 7. marcar coords erradas
npm run travel:catalog:geocode-hotels -- --limit 500     # 8. geocoding Nominatim/Python
npm run travel:wiki:pipeline                             # 9. hotéis via Wikipedia
npm run travel:fetch:wikidata-hotels                     # 10. hotéis via Wikidata
npm run travel:demo:enrich-hotels-remaining              # 11. destinos ainda vazios
npm run travel:demo:enrich-external -- --only wikipedia  # 12. resumos Wikipedia
npm run travel:images:enrich                             # 13. imagens (Pexels/Unsplash)
npm run travel:catalog:geocode-hotels -- --status        # 14. ver estado final geocoding
npm run travel:wiki:status                               # 15. ver estado final geral
```

### Scripts com custo (referência)

| Script | API | Custo estimado |
|--------|-----|----------------|
| `travel:google-hotels:*` | Crawlbase (`CRAWLBASE_JS_TOKEN`) | Pago por request |
| `travel:demo:enrich-weather` | OpenWeather (`OPENWEATHER_API_KEY`) | Pago além do free tier |
| `travel:demo:enrich-hotels-remaining -- --liteapi` | LiteAPI | Grátis (sandbox) / Pago (prod) |
| `travel:import:protected-planet` | Protected Planet | Grátis com registo |
