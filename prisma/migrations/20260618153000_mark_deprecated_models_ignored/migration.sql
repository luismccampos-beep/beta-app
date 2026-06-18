-- Marcar modelos Step/Fleet/Provider/Property como @@ignore
-- Estes modelos armazenavam config UI em BD e foram migrados para i18n/código
-- @@ignore faz com que Prisma ignore estes modelos mas mantém as tabelas na BD

-- Nota: Esta migração é apenas documentação.
-- O @@ignore é aplicado no schema.prisma, não requer SQL.
-- As tabelas continuam existindo até serem eliminadas numa migração futura.

-- Comentários para referência:
-- Models marcados como @@ignore no schema.prisma:
-- - CruiseStep, CruiseFleet, CruiseProvider, CruiseShip
-- - HotelStep, HotelFleet, HotelProvider, HotelProperty
-- - ActivityStep, ActivityFleet, ActivityProvider, ActivityOffering
-- - GastronomyStep, GastronomyFleet, GastronomyProvider, GastronomyRestaurant
-- - EventStep, EventFleet, EventProvider, EventOffering
-- - GuideStep, GuideFleet, GuideProvider, GuideOffering
-- - TransferStep, TransferProvider, TransferVehicle

-- Para eliminar estas tabelas no futuro (após confirmar que não são usadas):
-- DROP TABLE IF EXISTS cruise_steps, cruise_fleet, cruise_providers, cruise_ships;
-- DROP TABLE IF EXISTS hotel_steps, hotel_fleet, hotel_providers, hotel_properties;
-- DROP TABLE IF EXISTS activity_steps, activity_fleet, activity_providers, activity_offerings;
-- DROP TABLE IF EXISTS gastronomy_steps, gastronomy_fleet, gastronomy_providers, gastronomy_restaurants;
-- DROP TABLE IF EXISTS event_steps, event_fleet, event_providers, event_offerings;
-- DROP TABLE IF EXISTS guide_steps, guide_fleet, guide_providers, guide_offerings;
-- DROP TABLE IF EXISTS transfer_steps, transfer_providers, transfer_vehicles;