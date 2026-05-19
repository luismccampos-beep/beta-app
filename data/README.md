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

## ML — embeddings de destinos (fase 2)

```bash
# 1. Exportar features do bundle → ml-service/app/data/
npm run travel:ml:export

# 2. Treinar TF-IDF + SVD (ml-service)
npm run travel:ml:train

# Ou pipeline completo
npm run travel:ml:build
```

Com `ML_SERVICE_BASE_URL` e o ml-service a correr (`cd ml-service && npm run dev`), os resultados em `/results` misturam **regras + embeddings** (55% ML, 45% regras). Endpoint: `POST /v1/travel/rank`.

## Imagens Unsplash

1. [Unsplash Developers](https://unsplash.com/oauth/applications) → **Access Key** → `UNSPLASH_ACCESS_KEY` no `.env.local`
2. Enriquecer fotos no bundle: `npm run travel:unsplash:enrich`  
   Plano **demo** Unsplash: ~**50 pedidos/hora**. O script usa limite 40 destinos e 45 chamadas API por execução; podes repetir de hora a hora (retoma automaticamente).
3. Teste: `GET /api/travel/unsplash-image?nome=Porto&pais=Portugal`

## Licença na app

Os resultados incluem link **Guia Wikivoyage** (CC BY-SA 3.0) em cada cartão quando aplicável.
