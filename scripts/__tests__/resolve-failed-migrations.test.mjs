/**
 * scripts/__tests__/resolve-failed-migrations.test.mjs
 *
 * Unit tests for the pure functions used by the migration resolver script.
 * These tests verify that SQL parsing and existence-check SQL generation
 * work correctly for all supported migration patterns.
 */

import { describe, it, expect } from 'vitest';
import { parseMigrationObjects, buildExistenceCheckSQL } from '../resolve-failed-migrations.mjs';

// ── parseMigrationObjects ──────────────────────────────────────────────────

describe('parseMigrationObjects', () => {
  it('detects a CREATE TABLE statement', () => {
    const sql = 'CREATE TABLE IF NOT EXISTS "users" (\n  id SERIAL PRIMARY KEY\n);';
    const result = parseMigrationObjects(sql);
    expect(result).toEqual([{ name: 'users', type: 'TABLE' }]);
  });

  it('detects a CREATE TABLE with schema prefix', () => {
    const sql = 'CREATE TABLE "public"."accounts" (id SERIAL);';
    const result = parseMigrationObjects(sql);
    expect(result).toEqual([{ name: 'accounts', type: 'TABLE' }]);
  });

  it('detects a CREATE TABLE without IF NOT EXISTS', () => {
    const sql = 'CREATE TABLE sessions (id SERIAL);';
    const result = parseMigrationObjects(sql);
    expect(result).toEqual([{ name: 'sessions', type: 'TABLE' }]);
  });

  it('detects a CREATE MATERIALIZED VIEW with multi-line body', () => {
    const sql = [
      'CREATE MATERIALIZED VIEW IF NOT EXISTS mv_destination_search AS',
      'SELECT',
      '  d.id,',
      '  d.nome,',
      '  COALESCE(h.hotel_count, 0) AS hotel_count',
      'FROM wv_destinations d',
      'LEFT JOIN (...) h ON h.destino_id = d.id;',
    ].join('\n');
    const result = parseMigrationObjects(sql);
    expect(result).toEqual([{ name: 'mv_destination_search', type: 'VIEW' }]);
  });

  it('detects a CREATE VIEW (non-materialized)', () => {
    const sql = 'CREATE VIEW active_users AS SELECT * FROM users WHERE active = true;';
    const result = parseMigrationObjects(sql);
    expect(result).toEqual([{ name: 'active_users', type: 'VIEW' }]);
  });

  it('detects a CREATE VIEW with schema prefix', () => {
    const sql = 'CREATE VIEW "public"."user_summary" AS SELECT id, name FROM users;';
    const result = parseMigrationObjects(sql);
    expect(result).toEqual([{ name: 'user_summary', type: 'VIEW' }]);
  });

  it('detects a CREATE INDEX statement', () => {
    const sql = 'CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);';
    const result = parseMigrationObjects(sql);
    expect(result).toEqual([{ name: 'idx_users_email', type: 'INDEX' }]);
  });

  it('detects a CREATE UNIQUE INDEX', () => {
    const sql = 'CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_email ON users (email);';
    const result = parseMigrationObjects(sql);
    expect(result).toEqual([{ name: 'idx_unique_email', type: 'INDEX' }]);
  });

  it('detects a CREATE INDEX CONCURRENTLY', () => {
    const sql = 'CREATE INDEX CONCURRENTLY idx_concurrent ON users (name);';
    const result = parseMigrationObjects(sql);
    expect(result).toEqual([{ name: 'idx_concurrent', type: 'INDEX' }]);
  });

  it('detects a CREATE TYPE statement', () => {
    const sql = 'CREATE TYPE "user_role" AS ENUM (\'admin\', \'user\', \'moderator\');';
    const result = parseMigrationObjects(sql);
    expect(result).toEqual([{ name: 'user_role', type: 'TYPE' }]);
  });

  it('detects an ALTER TYPE … RENAME TO statement', () => {
    const sql = 'ALTER TYPE "old_role" RENAME TO "new_role";';
    const result = parseMigrationObjects(sql);
    expect(result).toEqual([{ name: 'new_role', type: 'TYPE' }]);
  });

  it('handles a full migration SQL with multiple object types', () => {
    const sql = [
      'CREATE TABLE IF NOT EXISTS "orders" (',
      '  id SERIAL PRIMARY KEY,',
      '  user_id INTEGER NOT NULL,',
      '  total DECIMAL(10,2)',
      ');',
      '',
      'CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);',
      '',
      'CREATE MATERIALIZED VIEW IF NOT EXISTS order_summary AS',
      'SELECT',
      '  user_id,',
      '  COUNT(*) AS order_count',
      'FROM orders',
      'GROUP BY user_id;',
    ].join('\n');
    const result = parseMigrationObjects(sql);
    // Order follows the regex evaluation order: INDEX → VIEW → TABLE
    expect(result).toEqual([
      { name: 'idx_orders_user_id', type: 'INDEX' },
      { name: 'order_summary', type: 'VIEW' },
      { name: 'orders', type: 'TABLE' },
    ]);
  });

  it('handles the actual failed migration SQL (destination_search_mv)', () => {
    const sql = [
      '-- Materialized view for destination search (resolves N+1)',
      'CREATE MATERIALIZED VIEW IF NOT EXISTS mv_destination_search AS',
      'SELECT',
      '  d.id,',
      '  d.slug,',
      '  d.nome,',
      '  d.pais,',
      '  d.pais_code,',
      '  d.continente,',
      '  d.tipo,',
      '  d.clima,',
      '  d.lang,',
      '  d.latitude,',
      '  d.longitude,',
      '  d.descricao,',
      '  d.resumo,',
      '  d.imagem_url,',
      '  d.wikipedia_resumo,',
      '  d.custo_de_vida,',
      '  d.tags,',
      '  d.transporte,',
      '  d.wikivoyage_url,',
      '  d.deleted_at,',
      '  COALESCE(h.hotel_count, 0) AS hotel_count,',
      '  COALESCE(h.avg_stars, 0) AS avg_hotel_stars,',
      '  COALESCE(h.min_price, 0) AS min_hotel_price',
      'FROM wv_destinations d',
      'LEFT JOIN (',
      '  SELECT',
      '    destino_id,',
      '    COUNT(*) AS hotel_count,',
      '    AVG(estrelas) AS avg_stars,',
      '    MIN(preco_por_noite) AS min_price',
      '  FROM wv_hotels',
      '  GROUP BY destino_id',
      ') h ON h.destino_id = d.id;',
      '',
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_destination_search_id ON mv_destination_search (id);',
      'CREATE INDEX IF NOT EXISTS idx_mv_destination_search_nome ON mv_destination_search USING GIN (to_tsvector(\'portuguese\', nome));',
      'CREATE INDEX IF NOT EXISTS idx_mv_destination_search_pais ON mv_destination_search (pais);',
      'CREATE INDEX IF NOT EXISTS idx_mv_destination_search_continente ON mv_destination_search (continente);',
      'CREATE INDEX IF NOT EXISTS idx_mv_destination_search_tipo ON mv_destination_search (tipo);',
      'CREATE INDEX IF NOT EXISTS idx_mv_destination_search_clima ON mv_destination_search (clima);',
    ].join('\n');
    const result = parseMigrationObjects(sql);
    expect(result).toContainEqual({ name: 'mv_destination_search', type: 'VIEW' });
    expect(result).toContainEqual({ name: 'idx_mv_destination_search_id', type: 'INDEX' });
    expect(result).toContainEqual({ name: 'idx_mv_destination_search_nome', type: 'INDEX' });
    expect(result).toContainEqual({ name: 'idx_mv_destination_search_pais', type: 'INDEX' });
    expect(result).toContainEqual({ name: 'idx_mv_destination_search_continente', type: 'INDEX' });
    expect(result).toContainEqual({ name: 'idx_mv_destination_search_tipo', type: 'INDEX' });
    expect(result).toContainEqual({ name: 'idx_mv_destination_search_clima', type: 'INDEX' });
    expect(result).toHaveLength(7);
  });

  it('returns empty array for SQL with no CREATE statements', () => {
    const sql = [
      '-- This is a comment',
      'ALTER TABLE users ADD COLUMN age INTEGER;',
      'DROP INDEX IF EXISTS old_index;',
    ].join('\n');
    const result = parseMigrationObjects(sql);
    expect(result).toEqual([]);
  });

  it('handles quoted identifiers with mixed case', () => {
    const sql = 'CREATE TABLE "UserProfiles" (id SERIAL);';
    const result = parseMigrationObjects(sql);
    expect(result).toEqual([{ name: 'UserProfiles', type: 'TABLE' }]);
  });
});

// ── buildExistenceCheckSQL ─────────────────────────────────────────────────

describe('buildExistenceCheckSQL', () => {
  it('builds a query for a single TABLE object', () => {
    const objects = [{ name: 'users', type: 'TABLE' }];
    const sql = buildExistenceCheckSQL(objects);
    expect(sql).toBe(
      "SELECT 'users' AS obj_name, EXISTS (SELECT 1 FROM pg_class WHERE relname = 'users' AND relkind = 'r') AS exists_flag"
    );
  });

  it('builds a query for a single VIEW object', () => {
    const objects = [{ name: 'mv_test', type: 'VIEW' }];
    const sql = buildExistenceCheckSQL(objects);
    expect(sql).toContain("relkind IN ('v', 'm')");
    expect(sql).toContain("'mv_test'");
  });

  it('builds a query for a single INDEX object', () => {
    const objects = [{ name: 'idx_test', type: 'INDEX' }];
    const sql = buildExistenceCheckSQL(objects);
    expect(sql).toContain("relkind = 'i'");
    expect(sql).toContain("'idx_test'");
  });

  it('builds a query for a single TYPE object', () => {
    const objects = [{ name: 'user_role', type: 'TYPE' }];
    const sql = buildExistenceCheckSQL(objects);
    expect(sql).toContain('pg_type');
    expect(sql).toContain("'user_role'");
  });

  it('builds a UNION ALL query for multiple objects', () => {
    const objects = [
      { name: 'users', type: 'TABLE' },
      { name: 'idx_users_email', type: 'INDEX' },
      { name: 'user_summary', type: 'VIEW' },
    ];
    const sql = buildExistenceCheckSQL(objects);
    expect(sql).toContain('UNION ALL');
    expect(sql).toContain("'users'");
    expect(sql).toContain("'idx_users_email'");
    expect(sql).toContain("'user_summary'");
  });

  it('returns null for an empty array', () => {
    expect(buildExistenceCheckSQL([])).toBeNull();
  });

  it('handles the full set of objects from destination_search_mv migration', () => {
    const objects = [
      { name: 'mv_destination_search', type: 'VIEW' },
      { name: 'idx_mv_destination_search_id', type: 'INDEX' },
      { name: 'idx_mv_destination_search_nome', type: 'INDEX' },
      { name: 'idx_mv_destination_search_pais', type: 'INDEX' },
      { name: 'idx_mv_destination_search_continente', type: 'INDEX' },
      { name: 'idx_mv_destination_search_tipo', type: 'INDEX' },
      { name: 'idx_mv_destination_search_clima', type: 'INDEX' },
    ];
    const sql = buildExistenceCheckSQL(objects);
    expect(sql).toContain('UNION ALL');
    expect(sql).toMatch(/mv_destination_search.*relkind IN \('v', 'm'\)/s);
    // Should have 7 UNION ALL parts (6 UNION ALL joins for 7 items)
    expect(sql.split('UNION ALL')).toHaveLength(7);
  });
});
