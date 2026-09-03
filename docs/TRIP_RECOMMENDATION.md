# Recomendação inteligente + custos estimados (MVP)

## Princípio

| Tipo | MVP |
|------|-----|
| **Preços em tempo real** | Duffel / Hotelbeds / resultados live quando configurados |
| **Estimativas** | Catálogo `wv_hotels`, `wv_flights`, `custo_de_vida` Wikivoyage |
| **Previsão ML de preços** | Fora do MVP — usar agregação + regras |

## Motor de regras (já no código)

- `preference-match.ts` — estilo de viagem, atividades, orçamento, sustentabilidade
- `destination-interests.ts` — texto Wikivoyage (praia, gastronomia, cultura, …)
- `trip-cost-estimator.ts` — alojamento + alimentação + transporte local + voo indicativo
- `trip-recommendation.ts` — combina scores e filtra por `budgetRange`

## API

```http
GET /api/travel/v1/recommend?nights=5&travelers=2&origin=LIS&budgetFilter=1&prefs=<encoded>
POST /api/travel/v1/recommend
```

Resposta por destino:

- `matchPercent` — afinidade com o formulário
- `cost` — breakdown (`accommodationTotal`, `foodTotal`, `flightTotal`, `tripTotal`, `withinBudget`)
- `hotel` — hotel mais barato do catálogo (referência)
- `wikivoyageInterestScore` — match em `veja` / `coma` / tags

## Fluxo do utilizador

1. Formulário de preferências → `prefs` na URL (`encodeTravelPreferencesCompact`)
2. `GET /recommend` → lista ordenada dentro do orçamento
3. Detalhe / pesquisa live → preços reais quando APIs estão ativas

## Voos (roadmap)

1. **MVP atual:** `wv_flights` + mock OpenFlights (indicativo)
2. **Live:** Duffel / Scrape.do (já em `/api/travel/results`)
3. **Futuro:** Skyscanner / LetsFG — integrar como mais um provider

## Privacidade (RGPD)

- `prefs` na query é opt-in do utilizador; evitar persistir orçamento sem consentimento
- Documentar na política de privacidade: orçamento e interesses para recomendação

---

## See Also

- [TRAVEL_CATALOG_API.md](./TRAVEL_CATALOG_API.md) — catalog API that supplies destination data to the recommendation engine
- [ENHANCED_TRAVEL_PREFERENCES_REFACTORING.md](./ENHANCED_TRAVEL_PREFERENCES_REFACTORING.md) — preferences form whose output feeds this engine
- [FORMULARIO-MELHORIAS.md](./FORMULARIO-MELHORIAS.md) — UX audit for the preferences form
- [DESTINATION-CARD-MELHORIAS.md](./DESTINATION-CARD-MELHORIAS.md) — destination cards where recommendations are surfaced
- [Documentation Index](./README.md)
