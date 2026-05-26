# Dados de custo de vida (offline)

CSV usados pelo script `npm run travel:demo:enrich-budget` para gravar `custo_de_vida` no bundle Wikivoyage.

## Ficheiros usados

| Ficheiro | Uso |
|----------|-----|
| `cost-of-living_v2.csv` | **Principal** — ~4 900 cidades, preços por item (x1…x55, estilo Numbeo) |
| `cost-of-living.csv` | Fallback se `_v2` não existir |
| `Cost_of_Living_Index_by_Country_2024.csv` | Índice por país (121 países, NYC=100) quando não há cidade |
| `wikipedia_cost_of_living_indices3.csv` | Alternativa ao índice por país |
| `global_cost_of_living_crisis_2026.csv` | Refino para ~80 cidades (salário, renda, índices) |

## Não usados pelo script (referência / BI)

- `sotw-countries-2026-05-23.csv` — macroeconomia (PIB, inflação), não preços de consumo
- `Living_Wage_Dataset_2026-04-02_Export.xlsx` — salário mínimo digno (formato diferente)
- `Cost_Of_Living_Dashboard.pbix` — dashboard Power BI

## Hierarquia (100% dos destinos)

1. **Cidade** — preços reais do CSV (`cost-of-living_v2`), com match exato, prefixo ou fuzzy (≥86%).
2. **País** — índice Kaggle 2024 (ou média das cidades do país) × fator de localidade (capital 1.2, vila 0.7, rural 0.6, …).
3. **Continente / global** — índice por `continente` no bundle quando não há país; senão fallback global.

Sem aleatoriedade: fatores fixos por tipo Wikivoyage (`cidade`, `praia`, `montanha`, …) e nome do destino.

## Perfis de orçamento

- **Mochileiro:** refeição económica + transporte  
- **Conforto:** refeição mista + transporte  
- **Luxo:** mid-range + táxi  

Valores em **USD**.

## Comando

```bash
npm run travel:demo:enrich-budget
npm run travel:demo:enrich-budget -- --limit 500
```

## Fontes

- [Global Cost of Living (Kaggle)](https://www.kaggle.com/datasets/mvieira101/global-cost-of-living)
- [Cost of Living Index by Country 2024 (Kaggle)](https://www.kaggle.com/datasets/myrios/cost-of-living-index-by-country-by-number-2024)
