# Schema Refactoring - Phase 2

## Data: 2026-06-18

## Objetivo
Reduzir a complexidade do schema Prisma, eliminando modelos duplicados e migrando configuração de UI do banco de dados para código/i18n.

## Modelos Marcados como @@ignore

Os seguintes modelos foram marcados com `@@ignore` no `schema.prisma`:

### Cruise
- `CruiseStep` - passos de serviço (UI)
- `CruiseFleet` - frota de navios (UI)
- `CruiseProvider` - fornecedores (UI)
- `CruiseShip` - navios (UI)

### Hotel
- `HotelStep` - passos de serviço (UI)
- `HotelFleet` - tipos de quarto (UI)
- `HotelProvider` - fornecedores (UI)
- `HotelProperty` - propriedades (UI)

### Activity
- `ActivityStep` - passos de serviço (UI)
- `ActivityFleet` - equipamentos/tipos (UI)
- `ActivityProvider` - fornecedores (UI)
- `ActivityOffering` - ofertas (UI)

### Gastronomy
- `GastronomyStep` - passos de serviço (UI)
- `GastronomyFleet` - tipos de restaurante (UI)
- `GastronomyProvider` - fornecedores (UI)
- `GastronomyRestaurant` - restaurantes (UI)

### Event
- `EventStep` - passos de serviço (UI)
- `EventFleet` - tipos de evento (UI)
- `EventProvider` - fornecedores (UI)
- `EventOffering` - ofertas (UI)

### Guide
- `GuideStep` - passos de serviço (UI)
- `GuideFleet` - tipos de guia (UI)
- `GuideProvider` - fornecedores (UI)
- `GuideOffering` - ofertas (UI)

### Transfer
- `TransferStep` - passos de serviço (UI)
- `TransferProvider` - fornecedores (UI)
- `TransferVehicle` - veículos (UI)

## Motivação

Estes modelos armazenavam configuração de UI (chaves de tradução, ícones, cores) que foi migrada para:
1. Ficheiros i18n (`src/messages/*.json`)
2. Componentes React hardcoded
3. Constantes TypeScript

## Próximos Passos

### Fase 2.1 - Eliminar tabelas (futuro)
Após confirmar que nenhum código referencia estas tabelas:
```sql
DROP TABLE IF EXISTS cruise_steps, cruise_fleet, cruise_providers, cruise_ships;
DROP TABLE IF EXISTS hotel_steps, hotel_fleet, hotel_providers, hotel_properties;
DROP TABLE IF EXISTS activity_steps, activity_fleet, activity_providers, activity_offerings;
DROP TABLE IF EXISTS gastronomy_steps, gastronomy_fleet, gastronomy_providers, gastronomy_restaurants;
DROP TABLE IF EXISTS event_steps, event_fleet, event_providers, event_offerings;
DROP TABLE IF EXISTS guide_steps, guide_fleet, guide_providers, guide_offerings;
DROP TABLE IF EXISTS transfer_steps, transfer_providers, transfer_vehicles;
```

### Fase 2.2 - Unificar modelos de alojamento
- Manter `Hotel` como modelo canónico
- `WvHotel` mantém-se como catálogo Wikivoyage (read-only)
- `Accommodation` pode ser eliminado (não usado por lógica de negócio)

### Fase 2.3 - Eliminar JSON duplicados
- `User.favoriteDestinations` → usar `UserFavorite`
- `User.friends` → usar `UserFriend`
- `User.blockedUsers` → criar tabela `BlockedUser` se necessário

## Notas

- As migrações `20260618143018_apply_schema_fixes` e `20260618150537_add_indexes_and_amenity_tables` já aplicaram alterações importantes
- A migração `20260618153000_mark_deprecated_models_ignored` documenta a intenção de ignorar estes modelos
- O `@@ignore` faz com que o Prisma ignore o modelo mas mantém a tabela na BD