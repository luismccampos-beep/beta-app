# Dados de transporte (offline)

Coloque aqui os CSV descarregados. A app usa estes ficheiros no enrich do bundle Wikivoyage.

## Ficheiros usados pelo script

| Ficheiro | Origem | Uso |
|----------|--------|-----|
| `airports.csv` | [OurAirports](https://ourairports.com/data/) | Aeroportos (IATA, coordenadas, tipo, país) |
| `routes.csv` | [OpenFlights](https://openflights.org/data.html) | Rotas comerciais (origem → destino por IATA) |

```bash
npm run travel:demo:enrich-transport
```

Grava em cada destino do bundle:

- `transporte.aeroporto` — IATA, coordenadas, match
- `transporte.rede` — ligações diretas, hubs, `top_destinos`, `ligacoes_desde_hubs`, `preco_indicativo_desde`, `aeronaves_frequentes`

```bash
npm run travel:demo:rebuild-flights   # voos mock só com rotas OpenFlights
npm run travel:demo:enrich-pipeline   # países + clima + transporte + orçamento + voos
```

## Outros ficheiros na pasta

Podem ser úteis mais tarde; **não** entram no enrich atual:

| Ficheiro | Notas |
|----------|--------|
| `airports.dat.txt`, `airports-*.csv` | Duplicados / subconjuntos de aeroportos |
| `aircraft-database-*.csv`, `airplanes.csv` | Base de aeronaves (não usada na demo) |
| `frequency.csv`, `navaid.csv` | Aviação geral (frequências, navaids) |
| `Flight Price Prediction.csv`, `Flight Data.xlsx` | ML / preços (experimento separado) |
| `flight_sample_*.csv.gz` | Amostra de voos históricos |

## Licenças

- **OurAirports**: dados públicos; atribuir [OurAirports.com](https://ourairports.com/) na UI quando mostrar aeroportos.
- **OpenFlights**: rotas sob licença aberta; atribuir [OpenFlights](https://openflights.org/) se publicar a rede de rotas.

## Pipeline sugerido

```bash
npm run travel:demo:build
npm run travel:demo:patch-countries    # opcional
npm run travel:demo:enrich-external    # lat/lon → melhor match "proximo"
npm run travel:demo:enrich-transport
npm run travel:demo:enrich-budget
```
