/**
 * scripts/__tests__/resolve-failed-migrations.integration.mjs
 *
 * Integration tests for the migration resolver script using a REAL PostgreSQL
 * database running inside Docker.
 *
 * Requirements:
 *   - Docker (desktop or engine)
 *
 * How it works:
 *   1. Starts a temporary PostgreSQL Docker container
 *   2. Creates a psql wrapper script that delegates to `docker exec`
 *      (so the resolve script can use psql even if it's not installed locally)
 *   3. Creates test migration fixtures and _prisma_migrations records
 *   4. Runs the resolve script as a subprocess
 *   5. Verifies the migration was resolved correctly
 *   6. Cleans up (stops container, removes test fixtures)
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawnSync, execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, delimiter as pathDelimiter } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomBytes } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..');
const MIGRATIONS_DIR = join(PROJECT_ROOT, 'prisma', 'migrations');
const SCRIPTS_DIR = join(PROJECT_ROOT, 'scripts');

const CONTAINER_NAME = `pg-test-integration-${randomBytes(4).toString('hex')}`;
const TEST_DB_PORT = 5434;
const TEST_DB_NAME = 'test_migrations';
const TEST_DB_URL = `postgresql://postgres:test@localhost:${TEST_DB_PORT}/${TEST_DB_NAME}`;

const TEST_MIGRATION_NAME = '20260625120000_test_failed_migration';
const TEST_MIGRATION_DIR = join(MIGRATIONS_DIR, TEST_MIGRATION_NAME);
const TEST_MIGRATION_SQL = join(TEST_MIGRATION_DIR, 'migration.sql');

/** A temporary directory that holds a psql wrapper script. */
let wrapperDir = null;

// ── Helpers ─────────────────────────────────────────────────────────────────

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    stdio: 'pipe',
    encoding: 'utf-8',
    timeout: 30000,
    ...opts,
  });
}

function dockerExec(sql) {
  const result = run('docker', [
    'exec', '-i', CONTAINER_NAME,
    'psql', '-U', 'postgres', '-d', TEST_DB_NAME,
    '-t', '-A', '-c', sql,
  ]);
  return result;
}

function isDockerAvailable() {
  return run('docker', ['info', '--format', '{{.ServerVersion}}']).status === 0;
}

function isPsqlAvailable() {
  const result = run('psql', ['--version']);
  return result.status === 0;
}

/**
 * Create a psql wrapper script that delegates to `docker exec`.
 * Returns the directory containing the wrapper.
 */
function createPsqlWrapper() {
  const wrapperDirPath = join(SCRIPTS_DIR, '.psql-wrapper');
  if (!existsSync(wrapperDirPath)) {
    mkdirSync(wrapperDirPath, { recursive: true });
  }

  const isWin = process.platform === 'win32';

  if (isWin) {
    const wrapperPath = join(wrapperDirPath, 'psql.cmd');
    if (!existsSync(wrapperPath)) {
      writeFileSync(wrapperPath, [
        '@echo off',
        `docker exec -i ${CONTAINER_NAME} psql -U postgres -d ${TEST_DB_NAME} %*`,
        '',
      ].join('\r\n'));
    }
  } else {
    const wrapperPath = join(wrapperDirPath, 'psql');
    if (!existsSync(wrapperPath)) {
      writeFileSync(wrapperPath, [
        '#!/bin/sh',
        `exec docker exec -i "${CONTAINER_NAME}" psql -U postgres -d "${TEST_DB_NAME}" "$@"`,
        '',
      ].join('\n'));
      spawnSync('chmod', ['+x', wrapperPath], { stdio: 'pipe' });
    }
  }

  return wrapperDirPath;
}

// ── Migration SQL fixture ──────────────────────────────────────────────────

const TEST_MIGRATION_SQL_CONTENT = [
  '-- Test migration for integration tests',
  'CREATE TABLE IF NOT EXISTS "test_migration_users" (',
  '  id SERIAL PRIMARY KEY,',
  '  email TEXT NOT NULL UNIQUE',
  ');',
  '',
  'CREATE INDEX IF NOT EXISTS idx_test_migration_users_email',
  '  ON test_migration_users (email);',
  '',
  'CREATE TYPE "test_migration_role" AS ENUM (',
  "  'admin', 'user', 'moderator'",
  ');',
].join('\n');

function buildPathForResolveScript() {
  if (!wrapperDir) return process.env.PATH;
  return `${wrapperDir}${pathDelimiter}${process.env.PATH}`;
}

function createMigrationFixtures() {
  if (!existsSync(TEST_MIGRATION_DIR)) {
    mkdirSync(TEST_MIGRATION_DIR, { recursive: true });
  }
  writeFileSync(TEST_MIGRATION_SQL, TEST_MIGRATION_SQL_CONTENT);
}

function removeMigrationFixtures() {
  if (existsSync(TEST_MIGRATION_DIR)) {
    rmSync(TEST_MIGRATION_DIR, { recursive: true, force: true });
  }
}

function removePsqlWrapper() {
  if (wrapperDir && existsSync(wrapperDir)) {
    try { rmSync(join(wrapperDir, 'psql.cmd'), { force: true }); } catch {}
    try { rmSync(join(wrapperDir, 'psql'), { force: true }); } catch {}
    try { rmSync(wrapperDir, { force: true }); } catch {}
  }
}

function runResolveScript() {
  const env = {
    ...process.env,
    DATABASE_URL_UNPOOLED: TEST_DB_URL,
    PATH: buildPathForResolveScript(),
  };

  return run('node', [
    join(PROJECT_ROOT, 'scripts', 'resolve-failed-migrations.mjs'),
  ], { env, timeout: 60000 });
}

function setupPrismaMigrationsTable() {
  const result = dockerExec(`
    CREATE TABLE IF NOT EXISTS _prisma_migrations (
      id VARCHAR(36) PRIMARY KEY,
      checksum VARCHAR(64) NOT NULL,
      finished_at TIMESTAMPTZ,
      migration_name VARCHAR(255) NOT NULL,
      logs TEXT,
      rolled_back_at TIMESTAMPTZ,
      started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      applied_steps_count INTEGER NOT NULL DEFAULT 0
    );
  `);
  if (result.status !== 0) {
    throw new Error(`Failed to create _prisma_migrations: ${result.stderr}`);
  }
}

function insertFailedMigration(migrationName) {
  const result = dockerExec(`
    INSERT INTO _prisma_migrations (id, checksum, migration_name, started_at, finished_at)
    VALUES (
      '${createHash('sha256').update(migrationName).digest('hex').substring(0, 36)}',
      'abc123def456',
      '${migrationName}',
      now(),
      NULL
    );
  `);
  if (result.status !== 0) {
    throw new Error(`Failed to insert migration record: ${result.stderr}`);
  }
}

function readMigrationStatus(migrationName = TEST_MIGRATION_NAME) {
  const result = dockerExec(`
    SELECT
      CASE
        WHEN rolled_back_at IS NOT NULL THEN 'rolled-back'
        WHEN finished_at IS NOT NULL THEN 'applied'
        ELSE 'failed'
      END AS status
    FROM _prisma_migrations
    WHERE migration_name = '${migrationName}';
  `);
  return result.stdout.trim();
}

function createDatabaseObjects() {
  dockerExec(`
    CREATE TABLE IF NOT EXISTS test_migration_users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE
    );
    CREATE INDEX IF NOT EXISTS idx_test_migration_users_email
      ON test_migration_users (email);
    CREATE TYPE IF NOT EXISTS "test_migration_role" AS ENUM (
      'admin', 'user', 'moderator'
    );
  `);
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('resolve-failed-migrations integration (real PostgreSQL via Docker)', () => {
  const dockerAvailable = isDockerAvailable();

  beforeAll(() => {
    if (!dockerAvailable) return;

    // 1. Start PostgreSQL container
    const start = run('docker', [
      'run', '-d', '--rm',
      '--name', CONTAINER_NAME,
      '-e', `POSTGRES_PASSWORD=test`,
      '-e', `POSTGRES_DB=${TEST_DB_NAME}`,
      '-p', `${TEST_DB_PORT}:5432`,
      'postgres:16-alpine',
    ], { timeout: 120000 });

    expect(start.status).toBe(0);
    if (start.status !== 0) return;

    // 2. Wait for PostgreSQL to be ready (up to 60 seconds)
    let ready = false;
    for (let i = 0; i < 60; i++) {
      const check = run('docker', [
        'exec', CONTAINER_NAME,
        'pg_isready', '-U', 'postgres',
      ]);
      if (check.status === 0) {
        ready = true;
        break;
      }
      execSync('sleep 1', { stdio: 'pipe', timeout: 5000 });
    }

    if (!ready) {
      run('docker', ['stop', CONTAINER_NAME], { timeout: 30000 });
      throw new Error('PostgreSQL container did not become ready within 60 seconds');
    }

    // 3. Create psql wrapper if psql is not available locally
    if (!isPsqlAvailable()) {
      wrapperDir = createPsqlWrapper();
    }

    // 4. Create migration fixtures
    createMigrationFixtures();
  });

  afterAll(() => {
    // Stop the container
    if (dockerAvailable) {
      run('docker', ['stop', CONTAINER_NAME], { timeout: 60000 });
    }

    // Remove temporary files
    removeMigrationFixtures();
    removePsqlWrapper();
  });

  it('should resolve a failed migration as rolled-back when objects do NOT exist', () => {
    if (!dockerAvailable) return;

    setupPrismaMigrationsTable();
    insertFailedMigration(TEST_MIGRATION_NAME);

    const result = runResolveScript();
    expect(result.status).toBe(0);

    const status = readMigrationStatus(TEST_MIGRATION_NAME);
    expect(status).toBe('rolled-back');
  });

  it('should resolve a failed migration as applied when objects already exist', () => {
    if (!dockerAvailable) return;

    // Create the database objects that the migration would have created
    createDatabaseObjects();

    // Use a unique migration name for this test so no conflict with previous test
    const migrationName = '20260625120001_test_failed_migration_applied';
    const migrationDir = join(MIGRATIONS_DIR, migrationName);
    const migrationSql = join(migrationDir, 'migration.sql');

    try {
      mkdirSync(migrationDir, { recursive: true });
      writeFileSync(migrationSql, [
        '-- Second test migration',
        'CREATE TABLE IF NOT EXISTS "test_migration_users" (',
        '  id SERIAL PRIMARY KEY,',
        '  email TEXT NOT NULL UNIQUE',
        ');',
      ].join('\n'));

      insertFailedMigration(migrationName);

      const result = runResolveScript();
      expect(result.status).toBe(0);

      const status = readMigrationStatus(migrationName);
      expect(status).toBe('applied');
    } finally {
      rmSync(migrationDir, { recursive: true, force: true });
    }
  });

  it('should handle multiple failed migrations', () => {
    if (!dockerAvailable) return;

    // Create three failed migrations with different characteristics
    const migrations = [
      { name: '20260625120002_test_multi_1', table: 'multi_1_table' },
      { name: '20260625120003_test_multi_2', table: 'multi_2_table' },
      { name: '20260625120004_test_multi_3', table: 'multi_3_table' },
    ];

    // Create migration fixtures
    for (const m of migrations) {
      const dir = join(MIGRATIONS_DIR, m.name);
      const sql = join(dir, 'migration.sql');
      mkdirSync(dir, { recursive: true });
      writeFileSync(sql, [
        `CREATE TABLE IF NOT EXISTS "${m.table}" (`,
        '  id SERIAL PRIMARY KEY',
        ');',
      ].join('\n'));

      // Insert as failed in _prisma_migrations
      insertFailedMigration(m.name);
    }

    // Create objects for the second migration only (so it gets marked as applied)
    dockerExec('CREATE TABLE IF NOT EXISTS multi_2_table (id SERIAL PRIMARY KEY);');

    const result = runResolveScript();
    expect(result.status).toBe(0);

    // multi_1: objects don't exist → rolled-back
    expect(readMigrationStatus('20260625120002_test_multi_1')).toBe('rolled-back');
    // multi_2: objects already exist → applied
    expect(readMigrationStatus('20260625120003_test_multi_2')).toBe('applied');
    // multi_3: objects don't exist → rolled-back
    expect(readMigrationStatus('20260625120004_test_multi_3')).toBe('rolled-back');

    // Cleanup migration fixtures
    for (const m of migrations) {
      try { rmSync(join(MIGRATIONS_DIR, m.name), { recursive: true, force: true }); } catch {}
    }
  });

  it('should exit cleanly when there are no failed migrations', () => {
    if (!dockerAvailable) return;

    // All previous test migrations should have been resolved (rolled-back or applied),
    // so the query WHERE finished_at IS NULL AND rolled_back_at IS NULL should find none.
    const result = runResolveScript();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Nenhuma migração falhada encontrada');
  });
});
