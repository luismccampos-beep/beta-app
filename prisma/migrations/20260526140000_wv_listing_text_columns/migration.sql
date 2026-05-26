-- Wikivoyage listings: price/url/title can exceed VarChar limits in CSV
ALTER TABLE "wv_listings" ALTER COLUMN "title" SET DATA TYPE TEXT;
ALTER TABLE "wv_listings" ALTER COLUMN "address" SET DATA TYPE TEXT;
ALTER TABLE "wv_listings" ALTER COLUMN "price" SET DATA TYPE TEXT;
ALTER TABLE "wv_listings" ALTER COLUMN "url" SET DATA TYPE TEXT;
