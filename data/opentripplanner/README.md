# OpenTripPlanner (OTP) — roteamento transit local

Motor **open-source** para autocarro/metro/comboio com horários (**GTFS**) + caminhada. Corre em Docker; **sem API na cloud**.

## Setup rápido

```bash
# 1. Descarregar OSM Portugal + GTFS Carris Metropolitana (Lisboa)
npm run otp:prepare

# 2. Construir o grafo (primeira vez: 5–15 min, ~2 GB RAM)
npm run otp:build

# 3. Servir na porta 8080
npm run otp:up
```

`.env.local`:

```env
OTP_BASE_URL="http://localhost:8080"
VALHALLA_BASE_URL="http://localhost:8002"
TRAVEL_ROUTING_LOCAL_ONLY=true
```

Reinicia `npm run dev`. Na página do destino, modo **Transit** usa OTP; **Carro / A pé / Bicicleta** usa Valhalla.

## Ficheiros nesta pasta

| Ficheiro | Origem |
|----------|--------|
| `portugal.osm.pbf` | Geofabrik |
| `carrismetropolitana-gtfs.zip` | [api.carrismetropolitana.pt/gtfs](https://api.carrismetropolitana.pt/gtfs) |
| `graph.obj` (após build) | Gerado pelo OTP |

Os ficheiros grandes estão no `.gitignore`.

## Mais feeds GTFS

Coloca mais `.zip` com **"gtfs" no nome** nesta pasta e corre `npm run otp:build` de novo (ex.: Metro Lisboa, CP — URLs em [Transitland](https://www.transit.land/)).

Variável opcional: `OTP_GTFS_URL` para outro zip na preparação.

## API na app

`GET /api/travel/routing/local?from=lat,lon&to=lat,lon&mode=transit`

GraphQL direto: `http://localhost:8080/otp/gtfs/v1` · UI: `http://localhost:8080/graphiql`
