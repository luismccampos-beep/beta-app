# Google Hotels scrapers (Crawlbase)

Extrai listagens e detalhes do [Google Hotels](https://www.google.com/travel/hotels) com a [Crawlbase Crawling API](https://crawlbase.com/crawling-api-avoid-captchas-blocks) (renderização JS + paginação).

Baseado no tutorial [How to Scrape Google Hotels with Python](https://crawlbase.com/blog/how-to-scrape-google-hotels-with-python/) e no repositório [ScraperHub/google-hotels-scrapers](https://github.com/ScraperHub/google-hotels-scrapers).

## Requisitos

1. Conta [Crawlbase](https://crawlbase.com/) — usa o **JS token** (não o token normal).
2. Python 3.10+

```bash
py -3 -m pip install -r scripts/requirements-google-hotels.txt
```

## Configuração

Em `.env.local`:

```env
CRAWLBASE_JS_TOKEN="seu_token_js"
```

Cada pedido consome créditos Crawlbase (~1000 grátis no registo).

## Scripts

| Script | O que faz |
|--------|-----------|
| `google_hotels_listings_scraper.py` | Nome, preço, rating, link (com paginação) |
| `google_hotel_details_scraper.py` | Morada, contacto, reviews, tipo |
| `pipeline.py` | Listagens → detalhes |

Saída em `data/google-hotels/`:

- `google_hotels.json`
- `google_hotel_details.json`

## npm

```bash
npm run travel:google-hotels:install
npm run travel:google-hotels:listings -- --location Lisboa --max-pages 2
npm run travel:google-hotels:details -- --limit 5
npm run travel:google-hotels:pipeline -- --location Lisboa --details-limit 10
```

## Notas

- Os **seletores CSS** do Google mudam com frequência; se vier 0 hotéis, inspeciona a página e atualiza `lib/parsers.py`.
- Não commits `data/google-hotels/*.json` se tiveres dados sensíveis.
- Para produção na app, considera **LiteAPI** (`/api/travel/liteapi/places`) ou Hotelbeds; este scraper é útil para **pesquisa de preços** e enriquecimento offline.
