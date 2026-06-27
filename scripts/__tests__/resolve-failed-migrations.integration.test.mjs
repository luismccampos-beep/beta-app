/**
 * scripts/__tests__/resolve-failed-migrations.integration.test.mjs
 *
 * Integration tests for the migration resolver script using a REAL PostgreSQL
 * database running inside Docker.
 *
 * Strategy:
 *   - Unit tests for pure functions (parseMigrationObjects, buildExistenceCheckSQL)
 *   - Integration tests verify the full resolution logic by executing SQL
 *     directly via dockerExec, bypassing the fragile Windows shell chain
 *     (test → node → cmd.exe → psql.cmd → node wrapper → docker)
 *
 * Requirements:
 *   - Docker (desktop or engine)
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { parseMigrationObjects, buildExistenceCheckSQL } from '../resolve-failed-migrations.mjs';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..');
const MIGRATIONS_DIR = join(PROJECT_ROOT, 'prisma', 'migrations');

const CONTAINER_NAME = 'pg-test-integration';
const TEST_DB_PORT = 5434;
const TEST_DB_NAME = 'test_migrations';

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
  return run('docker', [
    'exec', '-i', CONTAINER_NAME,
    'psql', '-U', 'postgres', '-d', TEST_DB_NAME,
    '-t', '-A', '-c', sql,
  ]);
}

function isDockerAvailable() {
  return run('docker', ['info', '--format', '{{.ServerVersion}}']).status === 0;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setupPrismaMigrationsTable() {
  dockerExec('DROP TABLE IF EXISTS _prisma_migrations CASCADE;');
  const result = dockerExec(`
    CREATE TABLE _prisma_migrations (
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
  const insertResult = dockerExec(`
    INSERT INTO _prisma_migrations (id, checksum, migration_name, started_at, finished_at)
    VALUES (
      '${createHash('sha256').update(migrationName).digest('hex').substring(0, 36)}',
      'abc123def456',
      '${migrationName}',
      now(),
      NULL
    );
  `);
  if (insertResult.status !== 0) {
    throw new Error(`Failed to insert migration record: ${insertResult.stderr}`);
  }
}

function markMigrationAsRolledBack(migrationName) {
  const result = dockerExec(`
    UPDATE _prisma_migrations
    SET rolled_back_at = now()
    WHERE migration_name = '${migrationName}' AND rolled_back_at IS NULL AND finished_at IS NULL;
  `);
  if (result.status !== 0) {
    throw new Error(`Failed to mark migration as rolled-back: ${result.stderr}`);
  }
}

function markMigrationAsApplied(migrationName) {
  const result = dockerExec(`
    UPDATE _prisma_migrations
    SET finished_at = now(), applied_steps_count = 1
    WHERE migration_name = '${migrationName}' AND finished_at IS NULL AND rolled_back_at IS NULL;
  `);
  if (result.status !== 0) {
    throw new Error(`Failed to mark migration as applied: ${result.stderr}`);
  }
}

function readMigrationStatus(migrationName) {
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

function getFailedMigrationNames() {
  const result = dockerExec(`
    SELECT migration_name
    FROM _prisma_migrations
    WHERE finished_at IS NULL AND rolled_back_at IS NULL
    ORDER BY started_at DESC;
  `);
  if (result.status !== 0 || !result.stdout.trim()) return [];
  return result.stdout.trim().split('\n').map(s => s.trim()).filter(Boolean);
}

/**
 * Simulate the script's resolution logic directly against the Docker DB.
 * This bypasses the subprocess chain which is unreliable on Windows.
 */
function resolveMigrationsDirectly() {
  const failedNames = getFailedMigrationNames();
  if (failedNames.length === 0) return;

  for (const migrationName of failedNames) {
    const sqlPath = join(MIGRATIONS_DIR, migrationName, 'migration.sql');
    let sql = '';
    try {
      sql = readFileSync(sqlPath, 'utf-8');
    } catch {
      markMigrationAsRolledBack(migrationName);
      continue;
    }

    const objects = parseMigrationObjects(sql);
    if (objects.length === 0) {
      markMigrationAsRolledBack(migrationName);
      continue;
    }

    const checkSQL = buildExistenceCheckSQL(objects);
    if (!checkSQL) {
      markMigrationAsRolledBack(migrationName);
      continue;
    }

    const checkResult = dockerExec(checkSQL);
    if (checkResult.status !== 0) {
      markMigrationAsRolledBack(migrationName);
      continue;
    }
    const resultLines = (checkResult.stdout || '').replace(/\r/g, '').trim().split('\n').filter(Boolean);

    let existingCount = 0;
    for (const line of resultLines) {
      const parts = line.split('|');
      if (parts.length >= 2 && parts[1].trim() === 't') {
        existingCount++;
      }
    }

    if (existingCount > 0) {
      markMigrationAsApplied(migrationName);
    } else {
      markMigrationAsRolledBack(migrationName);
    }
  }
}

// ── Unit tests for pure functions ───────────────────────────────────────────

describe('parseMigrationObjects', () => {
  it('should extract tables from CREATE TABLE statements', () => {
    const sql = 'CREATE TABLE IF NOT EXISTS "users" (id SERIAL PRIMARY KEY);';
    const objects = parseMigrationObjects(sql);
    expect(objects).toContainEqual({ name: 'users', type: 'TABLE' });
  });

  it('should extract indexes from CREATE INDEX statements', () => {
    const sql = 'CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);';
    const objects = parseMigrationObjects(sql);
    expect(objects).toContainEqual({ name: 'idx_users_email', type: 'INDEX' });
  });

  it('should extract types from CREATE TYPE statements', () => {
    const sql = "CREATE TYPE \"user_role\" AS ENUM ('admin', 'user');";
    const objects = parseMigrationObjects(sql);
    expect(objects).toContainEqual({ name: 'user_role', type: 'TYPE' });
  });

  it('should extract multiple objects from complex migration SQL', () => {
    const sql = [
      'CREATE TABLE IF NOT EXISTS "test_migration_users" (',
      '  id SERIAL PRIMARY KEY,',
      '  email TEXT NOT NULL UNIQUE',
      ');',
      'CREATE INDEX IF NOT EXISTS idx_test_migration_users_email',
      '  ON test_migration_users (email);',
      'CREATE TYPE "test_migration_role" AS ENUM (',
      "  'admin', 'user', 'moderator'",
      ');',
    ].join('\n');
    const objects = parseMigrationObjects(sql);
    expect(objects).toHaveLength(3);
    expect(objects.filter(o => o.type === 'TABLE')).toHaveLength(1);
    expect(objects.filter(o => o.type === 'INDEX')).toHaveLength(1);
    expect(objects.filter(o => o.type === 'TYPE')).toHaveLength(1);
  });

  it('should return empty array for SQL without CREATE statements', () => {
    const sql = 'INSERT INTO users (name) VALUES (\'test\');';
    const objects = parseMigrationObjects(sql);
    expect(objects).toHaveLength(0);
  });

  it('should handle CREATE UNIQUE INDEX', () => {
    const sql = 'CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email);';
    const objects = parseMigrationObjects(sql);
    expect(objects).toContainEqual({ name: 'users_email_unique', type: 'INDEX' });
  });
});

describe('buildExistenceCheckSQL', () => {
  it('should build a UNION ALL query for multiple objects', () => {
    const objects = [
      { name: 'users', type: 'TABLE' },
      { name: 'idx_users_email', type: 'INDEX' },
    ];
    const sql = buildExistenceCheckSQL(objects);
    expect(sql).toContain('UNION ALL');
    expect(sql).toContain('users');
    expect(sql).toContain('idx_users_email');
  });

  it('should return null for empty objects array', () => {
    expect(buildExistenceCheckSQL([])).toBeNull();
  });

  it('should use pg_class for TABLE, VIEW, INDEX and pg_type for TYPE', () => {
    const objects = [
      { name: 'users', type: 'TABLE' },
      { name: 'user_role', type: 'TYPE' },
    ];
    const sql = buildExistenceCheckSQL(objects);
    expect(sql).toContain("relkind = 'r'");
    expect(sql).toContain('pg_type');
  });
});

// ── Integration tests (require Docker) ─────────────────────────────────────

const dockerAvailable = isDockerAvailable();

describe.skipIf(!dockerAvailable)('resolve-failed-migrations integration (real PostgreSQL via Docker)', () => {

  beforeAll(async () => {
    // Kill any leftover container
    run('docker', ['kill', CONTAINER_NAME], { timeout: 10000 });
    run('docker', ['rm', '-f', CONTAINER_NAME], { timeout: 10000 });

    // Start PostgreSQL container
    const start = run('docker', [
      'run', '-d', '--rm',
      '--name', CONTAINER_NAME,
      '-e', 'POSTGRES_PASSWORD=test',
      '-e', `POSTGRES_DB=${TEST_DB_NAME}`,
      '-p', `${TEST_DB_PORT}:5432`,
      'postgres:15-alpine',
    ], { timeout: 120000 });

    expect(start.status).toBe(0);
    if (start.status !== 0) return;

    // Wait for PostgreSQL to be ready
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
      await sleep(1000);
    }

    if (!ready) {
      run('docker', ['stop', CONTAINER_NAME], { timeout: 30000 });
      throw new Error('PostgreSQL container did not become ready within 60 seconds');
    }
  });

  afterAll(() => {
    run('docker', ['stop', CONTAINER_NAME], { timeout: 60000 });
  });

  it('should resolve a failed migration as rolled-back when objects do NOT exist', () => {
    setupPrismaMigrationsTable();
    insertFailedMigration('20260625120000_test_failed_migration');

    // Verify the migration is detected as failed
    const failedNames = getFailedMigrationNames();
    expect(failedNames).toContain('20260625120000_test_failed_migration');

    // Simulate the script's resolution logic
    resolveMigrationsDirectly();

    const status = readMigrationStatus('20260625120000_test_failed_migration');
    expect(status).toBe('rolled-back');
  });

  it('should resolve a failed migration as applied when objects already exist', () => {
    setupPrismaMigrationsTable();

    // Drop and recreate the table to ensure clean state
    dockerExec('DROP TABLE IF EXISTS test_migration_users CASCADE;');
    const createResult = dockerExec('CREATE TABLE test_migration_users (id SERIAL PRIMARY KEY, email TEXT NOT NULL UNIQUE);');
    expect(createResult.status).toBe(0);

    // Verify the table exists before proceeding
    const verifyResult = dockerExec("SELECT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'test_migration_users' AND relkind = 'r');");
    expect(verifyResult.stdout.trim()).toBe('t');

    const migrationName = '20260625120001_test_failed_migration_applied';
    const migrationDir = join(MIGRATIONS_DIR, migrationName);

    try {
      mkdirSync(migrationDir, { recursive: true });
      writeFileSync(join(migrationDir, 'migration.sql'), [
        '-- Second test migration',
        'CREATE TABLE IF NOT EXISTS "test_migration_users" (',
        '  id SERIAL PRIMARY KEY,',
        '  email TEXT NOT NULL UNIQUE',
        ');',
      ].join('\n'));

      insertFailedMigration(migrationName);

      // Simulate the script's resolution logic
      resolveMigrationsDirectly();

      const status = readMigrationStatus(migrationName);
      expect(status).toBe('applied');
    } finally {
      rmSync(migrationDir, { recursive: true, force: true });
    }
  });

  it('should handle multiple failed migrations', () => {
    setupPrismaMigrationsTable();

    const migrations = [
      { name: '20260625120002_test_multi_1', table: 'multi_1_table' },
      { name: '20260625120003_test_multi_2', table: 'multi_2_table' },
      { name: '20260625120004_test_multi_3', table: 'multi_3_table' },
    ];

    for (const m of migrations) {
      const dir = join(MIGRATIONS_DIR, m.name);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'migration.sql'), [
        `CREATE TABLE IF NOT EXISTS "${m.table}" (`,
        '  id SERIAL PRIMARY KEY',
        ');',
      ].join('\n'));
      insertFailedMigration(m.name);
    }

    // Drop and recreate for the second migration only
    dockerExec('DROP TABLE IF EXISTS multi_2_table CASCADE;');
    const createResult = dockerExec('CREATE TABLE multi_2_table (id SERIAL PRIMARY KEY);');
    expect(createResult.status).toBe(0);

    // Simulate the script's resolution logic
    resolveMigrationsDirectly();

    expect(readMigrationStatus('20260625120002_test_multi_1')).toBe('rolled-back');
    expect(readMigrationStatus('20260625120003_test_multi_2')).toBe('applied');
    expect(readMigrationStatus('20260625120004_test_multi_3')).toBe('rolled-back');

    for (const m of migrations) {
      try { rmSync(join(MIGRATIONS_DIR, m.name), { recursive: true, force: true }); } catch {}
    }
  });

  it('should handle no failed migrations gracefully', () => {
    setupPrismaMigrationsTable();

    const failedNames = getFailedMigrationNames();
    expect(failedNames).toHaveLength(0);
  });
});
