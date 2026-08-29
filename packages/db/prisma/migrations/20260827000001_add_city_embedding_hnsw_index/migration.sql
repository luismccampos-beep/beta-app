-- Ensure pgvector extension exists
CREATE EXTENSION IF NOT EXISTS vector;

-- HNSW index for cosine distance (best for semantic search)
-- Prisma cannot express USING hnsw, so this is a raw SQL migration.
CREATE INDEX IF NOT EXISTS city_embedding_hnsw_idx
ON "city_embeddings"
USING hnsw (vector vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
