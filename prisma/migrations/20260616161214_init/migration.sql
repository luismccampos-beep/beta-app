-- CreateEnum
CREATE TYPE "AirlineType" AS ENUM ('LOW_COST', 'LEGACY', 'REGIONAL');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('ALTA', 'MEDIA', 'BAIXA');

-- AlterTable
ALTER TABLE "airlines" ADD COLUMN     "type" "AirlineType" NOT NULL DEFAULT 'LEGACY';

-- CreateTable
CREATE TABLE "flight_routes" (
    "id" TEXT NOT NULL,
    "origin_id" TEXT NOT NULL,
    "dest_id" TEXT NOT NULL,
    "distance_km" INTEGER,
    "duration_min" INTEGER,

    CONSTRAINT "flight_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_price_statistics" (
    "id" TEXT NOT NULL,
    "route_id" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "preco_medio" DECIMAL(10,2),
    "preco_min" DECIMAL(10,2),
    "preco_max" DECIMAL(10,2),
    "preco_medio_low_cost" DECIMAL(10,2),
    "preco_medio_legacy" DECIMAL(10,2),
    "amostra_count" INTEGER NOT NULL DEFAULT 0,
    "confianca" "ConfidenceLevel" NOT NULL DEFAULT 'MEDIA',
    "fonte" VARCHAR(100),
    "ano" INTEGER NOT NULL DEFAULT 2026,

    CONSTRAINT "flight_price_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flight_routes_origin_id_idx" ON "flight_routes"("origin_id");

-- CreateIndex
CREATE INDEX "flight_routes_dest_id_idx" ON "flight_routes"("dest_id");

-- CreateIndex
CREATE UNIQUE INDEX "flight_routes_origin_id_dest_id_key" ON "flight_routes"("origin_id", "dest_id");

-- CreateIndex
CREATE INDEX "flight_price_statistics_route_id_idx" ON "flight_price_statistics"("route_id");

-- CreateIndex
CREATE INDEX "flight_price_statistics_mes_idx" ON "flight_price_statistics"("mes");

-- CreateIndex
CREATE UNIQUE INDEX "flight_price_statistics_route_id_mes_ano_key" ON "flight_price_statistics"("route_id", "mes", "ano");

-- AddForeignKey
ALTER TABLE "flight_routes" ADD CONSTRAINT "flight_routes_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_routes" ADD CONSTRAINT "flight_routes_dest_id_fkey" FOREIGN KEY ("dest_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_price_statistics" ADD CONSTRAINT "flight_price_statistics_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "flight_routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
