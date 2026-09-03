# AKMLEVA — Documentation Index

This folder contains architecture decisions, implementation plans, audits, and data pipeline references for the AKMLEVA platform.

---

## Architecture & Schema

| Document | Description |
|----------|-------------|
| [TRAVEL-INTELLIGENCE-SCHEMA.md](./TRAVEL-INTELLIGENCE-SCHEMA.md) | Database schema design principles and sourcing strategy for the travel intelligence layer |
| [SCHEMA_MIGRATION_PLAN.md](./SCHEMA_MIGRATION_PLAN.md) | Incremental, backward-compatible DB migration plan from the codebase review |
| [SCHEMA_REFACTORING_PHASE2.md](./SCHEMA_REFACTORING_PHASE2.md) | Phase 2 schema refactoring objectives and approach |
| [CULTURAL_DATA_ARCHITECTURE.md](./CULTURAL_DATA_ARCHITECTURE.md) | Ingestion strategy for museums, monuments, outdoor activities and events (OSM/Wikidata/UNESCO) |

---

## Data Pipeline & Catalog

| Document | Description |
|----------|-------------|
| [TRAVEL_CATALOG_API.md](./TRAVEL_CATALOG_API.md) | Internal Wikivoyage catalog API — replaces the monolithic JSON bundle with Postgres |
| [ENRICHMENT-SUMMARY.md](./ENRICHMENT-SUMMARY.md) | Results of the destination enrichment pipeline (28k+ destinations, bundle stats) |
| [GEOCODING-SUMMARY.md](./GEOCODING-SUMMARY.md) | Geocoding state for destinations and Wikivoyage hotels; GeoNames cache reference |
| [OSM_HOTELS.md](./OSM_HOTELS.md) | OpenStreetMap hotel integration MVP (Overpass, Photon, Wikidata/Commons) |
| [wikivoyage_links.md](./wikivoyage_links.md) | Auto-generated Wikivoyage multilingual link matrix (28k+ destinations, 30+ languages) |

---

## Features & UI

| Document | Description |
|----------|-------------|
| [DESTINATION-CARD-MELHORIAS.md](./DESTINATION-CARD-MELHORIAS.md) | Destination card improvements — hero image, gallery, translations, video, media validation |
| [VIDEOS-DESTINO-IMPLEMENTACAO.md](./VIDEOS-DESTINO-IMPLEMENTACAO.md) | Implementation plan for video integration in destination cards |
| [TRIP_RECOMMENDATION.md](./TRIP_RECOMMENDATION.md) | Intelligent trip recommendation + cost estimation (MVP) |
| [ENHANCED_TRAVEL_PREFERENCES_REFACTORING.md](./ENHANCED_TRAVEL_PREFERENCES_REFACTORING.md) | Refactoring plan for the EnhancedTravelPreferencesForm component |
| [FORMULARIO-MELHORIAS.md](./FORMULARIO-MELHORIAS.md) | UX/conversion audit of the travel preferences form |

---

## Migration & Infrastructure

| Document | Description |
|----------|-------------|
| [TANSTACK-START-MIGRATION.md](./TANSTACK-START-MIGRATION.md) | Complete migration plan from Next.js to TanStack Start |

---

## Audits & Compliance

| Document | Description |
|----------|-------------|
| [AUDIT-AKMLEVA.md](./AUDIT-AKMLEVA.md) | Senior tech lead technical audit (June 2026) |
| [Auditoria-2.md](./Auditoria-2.md) | Second audit pass (June 2026) |
| [DATA_COMPLIANCE.md](./DATA_COMPLIANCE.md) | External data source inventory — licenses, attribution, caching, commercial use |

---

## Related

- [Root README](../README.md) — project overview, tech stack, quick start
- [AGENTS.md](../AGENTS.md) — agent/AI assistant guide and command reference
- [ACCESSIBILITY.md](../ACCESSIBILITY.md) — accessibility guidelines and audit results
- [CONTRIBUTING.md](../CONTRIBUTING.md) — contribution guide
