-- Materialized view for destination search (resolves N+1)
-- Combines destination data with hotel stats in a single queryable view
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_destination_search AS
SELECT
  d.id,
  d.slug,
  d.nome,
  d.pais,
  d.pais_code,
  d.continente,
  d.tipo,
  d.clima,
  d.lang,
  d.latitude,
  d.longitude,
  d.descricao,
  d.resumo,
  d.imagem_url,
  d.wikipedia_resumo,
  d.custo_de_vida,
  d.tags,
  d.transporte,
  d.wikivoyage_url,
  d.deleted_at,
  COALESCE(h.hotel_count, 0) AS hotel_count,
  COALESCE(h.avg_stars, 0) AS avg_hotel_stars,
  COALESCE(h.min_price, 0) AS min_hotel_price
FROM wv_destinations d
LEFT JOIN (
  SELECT
    destino_id,
    COUNT(*) AS hotel_count,
    AVG(estrelas) AS avg_stars,
    MIN(preco_por_noite) AS min_price
  FROM wv_hotels
  GROUP BY destino_id
) h ON h.destino_id = d.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_destination_search_id ON mv_destination_search (id);
CREATE INDEX IF NOT EXISTS idx_mv_destination_search_nome ON mv_destination_search USING GIN (to_tsvector('portuguese', nome));
CREATE INDEX IF NOT EXISTS idx_mv_destination_search_pais ON mv_destination_search (pais);
CREATE INDEX IF NOT EXISTS idx_mv_destination_search_continente ON mv_destination_search (continente);
CREATE INDEX IF NOT EXISTS idx_mv_destination_search_tipo ON mv_destination_search (tipo);
CREATE INDEX IF NOT EXISTS idx_mv_destination_search_clima ON mv_destination_search (clima);
