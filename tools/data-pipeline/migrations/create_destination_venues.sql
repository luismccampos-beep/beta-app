-- Migration: Create destination_venues table
-- Source: unified restaurant datasets (Yelp, Zomato, TripAdvisor, Michelin)

CREATE TABLE IF NOT EXISTS destination_venues (
    id          VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    destino_id  INTEGER NOT NULL,
    venue_id    VARCHAR(32) NOT NULL,
    source      VARCHAR(20) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    address     TEXT,
    city        VARCHAR(200) NOT NULL,
    country     VARCHAR(120) NOT NULL,
    latitude    REAL NOT NULL,
    longitude   REAL NOT NULL,
    cuisine     VARCHAR(500),
    price_range SMALLINT,
    rating      REAL NOT NULL,
    review_count INTEGER NOT NULL DEFAULT 0,
    award       VARCHAR(50),
    phone       VARCHAR(50),
    website     VARCHAR(500),
    url         VARCHAR(500),
    created_at  TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT fk_destination_venues_destino
        FOREIGN KEY (destino_id) REFERENCES wv_destinations(id) ON DELETE CASCADE,
    CONSTRAINT uq_destination_venues_destino_venue
        UNIQUE (destino_id, venue_id)
);

CREATE INDEX idx_destination_venues_destino ON destination_venues(destino_id);
CREATE INDEX idx_destination_venues_venue   ON destination_venues(venue_id);
CREATE INDEX idx_destination_venues_source  ON destination_venues(source);
CREATE INDEX idx_destination_venues_coords  ON destination_venues(latitude, longitude);
