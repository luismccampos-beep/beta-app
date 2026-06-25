-- Create destination reviews table
CREATE TABLE IF NOT EXISTS wv_destination_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destino_id INTEGER NOT NULL REFERENCES wv_destinations(id) ON DELETE CASCADE,
    author_name VARCHAR(120) NOT NULL,
    author_email VARCHAR(255),
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wv_destination_reviews_destino_id ON wv_destination_reviews (destino_id);
CREATE INDEX IF NOT EXISTS idx_wv_destination_reviews_approved ON wv_destination_reviews (destino_id, is_approved);
