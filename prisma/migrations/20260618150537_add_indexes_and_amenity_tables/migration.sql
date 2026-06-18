/*
  Warnings:

  - You are about to drop the column `images` on the `accommodations` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `hotels` table. All the data in the column will be lost.
  - You are about to drop the column `blocked_users` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `favorite_destinations` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `friends` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accommodations" DROP COLUMN "images";

-- AlterTable
ALTER TABLE "hotels" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "blocked_users",
DROP COLUMN "favorite_destinations",
DROP COLUMN "friends";

-- CreateTable
CREATE TABLE "hotel_amenities" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "hotel_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wv_hotel_amenities" (
    "id" SERIAL NOT NULL,
    "wv_hotel_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "wv_hotel_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hotel_amenities_hotel_id_idx" ON "hotel_amenities"("hotel_id");

-- CreateIndex
CREATE INDEX "hotel_amenities_name_idx" ON "hotel_amenities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_amenities_hotel_id_name_key" ON "hotel_amenities"("hotel_id", "name");

-- CreateIndex
CREATE INDEX "wv_hotel_amenities_wv_hotel_id_idx" ON "wv_hotel_amenities"("wv_hotel_id");

-- CreateIndex
CREATE INDEX "wv_hotel_amenities_name_idx" ON "wv_hotel_amenities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "wv_hotel_amenities_wv_hotel_id_name_key" ON "wv_hotel_amenities"("wv_hotel_id", "name");

-- CreateIndex
CREATE INDEX "accommodations_destination_id_type_idx" ON "accommodations"("destination_id", "type");

-- CreateIndex
CREATE INDEX "accommodations_published_name_idx" ON "accommodations"("published", "name");

-- CreateIndex
CREATE INDEX "hotels_star_rating_price_per_night_idx" ON "hotels"("star_rating", "price_per_night");

-- CreateIndex
CREATE INDEX "wv_destinations_iata_lang_hotel_count_idx" ON "wv_destinations"("iata", "lang", "hotel_count");

-- CreateIndex
CREATE INDEX "wv_hotels_destino_id_preco_por_noite_idx" ON "wv_hotels"("destino_id", "preco_por_noite");
