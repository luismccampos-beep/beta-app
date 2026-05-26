-- CreateTable
CREATE TABLE "wv_hotel_reviews" (
    "id" TEXT NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "author_name" VARCHAR(120),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wv_hotel_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wv_hotel_reviews_hotel_id_created_at_idx" ON "wv_hotel_reviews"("hotel_id", "created_at");

-- AddForeignKey
ALTER TABLE "wv_hotel_reviews" ADD CONSTRAINT "wv_hotel_reviews_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "wv_hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
