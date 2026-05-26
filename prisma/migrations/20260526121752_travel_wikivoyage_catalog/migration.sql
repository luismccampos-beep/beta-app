-- CreateTable
CREATE TABLE "wv_destinations" (
    "id" INTEGER NOT NULL,
    "slug" VARCHAR(32) NOT NULL,
    "lang" VARCHAR(8) NOT NULL DEFAULT 'pt',
    "nome" VARCHAR(255) NOT NULL,
    "pais" VARCHAR(120) NOT NULL,
    "pais_code" VARCHAR(8) NOT NULL,
    "continente" VARCHAR(80),
    "iata" VARCHAR(8),
    "tipo" VARCHAR(40),
    "clima" VARCHAR(40),
    "descricao" TEXT,
    "descricao_completa" TEXT,
    "resumo" TEXT,
    "veja" JSONB,
    "faca" JSONB,
    "coma" JSONB,
    "dicas" JSONB,
    "tags" JSONB,
    "wikivoyage_url" VARCHAR(500),
    "wikipedia_resumo" TEXT,
    "wikipedia_url" VARCHAR(500),
    "clima_tempo" JSONB,
    "custo_de_vida" JSONB,
    "transporte" JSONB,
    "latitude" REAL,
    "longitude" REAL,
    "imagem_url" VARCHAR(500),
    "imagem_query" VARCHAR(255),
    "hotel_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wv_destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wv_hotels" (
    "id" INTEGER NOT NULL,
    "destino_id" INTEGER NOT NULL,
    "nome" VARCHAR(300) NOT NULL,
    "estrelas" INTEGER NOT NULL DEFAULT 3,
    "preco_por_noite" INTEGER NOT NULL,
    "comodidades" JSONB NOT NULL DEFAULT '[]',
    "fonte" VARCHAR(40),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wv_hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wv_flights" (
    "id" INTEGER NOT NULL,
    "origem" VARCHAR(8) NOT NULL,
    "destino_id" INTEGER NOT NULL,
    "destino_iata" VARCHAR(8),
    "preco" INTEGER NOT NULL,
    "duracao_minutos" INTEGER NOT NULL,
    "companhia" VARCHAR(120) NOT NULL,
    "cabin_class" VARCHAR(32) NOT NULL DEFAULT 'economy',
    "escalas" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wv_flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wv_listings" (
    "id" TEXT NOT NULL,
    "destino_id" INTEGER,
    "article" VARCHAR(255) NOT NULL,
    "type" VARCHAR(32) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "address" VARCHAR(500),
    "price" VARCHAR(120),
    "latitude" REAL,
    "longitude" REAL,
    "url" VARCHAR(500),
    "payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wv_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "col_cities" (
    "id" TEXT NOT NULL,
    "city" VARCHAR(200) NOT NULL,
    "country" VARCHAR(120) NOT NULL,
    "city_key" VARCHAR(255) NOT NULL,
    "indices" JSONB NOT NULL,
    "budgets" JSONB,
    "raw_prices" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "col_cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "col_country_indices" (
    "id" TEXT NOT NULL,
    "country" VARCHAR(120) NOT NULL,
    "col_index" REAL NOT NULL,
    "rent_index" REAL,
    "payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "col_country_indices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wv_destinations_slug_key" ON "wv_destinations"("slug");

-- CreateIndex
CREATE INDEX "wv_destinations_pais_nome_idx" ON "wv_destinations"("pais", "nome");

-- CreateIndex
CREATE INDEX "wv_destinations_lang_nome_idx" ON "wv_destinations"("lang", "nome");

-- CreateIndex
CREATE INDEX "wv_destinations_iata_idx" ON "wv_destinations"("iata");

-- CreateIndex
CREATE INDEX "wv_hotels_destino_id_idx" ON "wv_hotels"("destino_id");

-- CreateIndex
CREATE INDEX "wv_flights_origem_destino_id_idx" ON "wv_flights"("origem", "destino_id");

-- CreateIndex
CREATE INDEX "wv_flights_destino_iata_idx" ON "wv_flights"("destino_iata");

-- CreateIndex
CREATE INDEX "wv_listings_destino_id_type_idx" ON "wv_listings"("destino_id", "type");

-- CreateIndex
CREATE INDEX "wv_listings_article_type_idx" ON "wv_listings"("article", "type");

-- CreateIndex
CREATE UNIQUE INDEX "col_cities_city_key_key" ON "col_cities"("city_key");

-- CreateIndex
CREATE INDEX "col_cities_country_city_idx" ON "col_cities"("country", "city");

-- CreateIndex
CREATE UNIQUE INDEX "col_country_indices_country_key" ON "col_country_indices"("country");

-- AddForeignKey
ALTER TABLE "wv_hotels" ADD CONSTRAINT "wv_hotels_destino_id_fkey" FOREIGN KEY ("destino_id") REFERENCES "wv_destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wv_flights" ADD CONSTRAINT "wv_flights_destino_id_fkey" FOREIGN KEY ("destino_id") REFERENCES "wv_destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wv_listings" ADD CONSTRAINT "wv_listings_destino_id_fkey" FOREIGN KEY ("destino_id") REFERENCES "wv_destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
