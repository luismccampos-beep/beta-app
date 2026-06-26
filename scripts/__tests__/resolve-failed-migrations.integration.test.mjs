/**
 * scripts/__tests__/resolve-failed-migrations.integration.test.mjs
 *
 * Integration tests for the migration resolver script using a REAL PostgreSQL
 * database running inside Docker.
 *
 * Approach:
 *   - Uses a fixed container name for deterministic wrapper creation
 *   - Creates a Node.js wrapper script (`psql-wrapper.mjs`) that:
 *     * Strips the `-d <host-url>` argument (which points to host port)
 *     * Connects via Unix socket inside the container
 *     * Passes through all other arguments (-t, -A, -c <sql>, etc.)
 *   - Adds the wrapper's directory to PATH for the resolve script
 *
 * Requirements:
 *   - Docker (desktop or engine)
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, delimiter as pathDelimiter } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..');
const MIGRATIONS_DIR = join(PROJECT_ROOT, 'prisma', 'migrations');
const WRAPPER_DIR = join(PROJECT_ROOT, 'scripts', '.psql-wrapper');

// Fixed container name so the wrapper always knows where to connect
const CONTAINER_NAME = 'pg-test-integration';
const TEST_DB_PORT = 5434;
const TEST_DB_NAME = 'test_migrations';
const TEST_DB_URL = `postgresql://postgres:test@localhost:${TEST_DB_PORT}/${TEST_DB_NAME}`;

const TEST_MIGRATION_NAME = '20260625120000_test_failed_migration';
const TEST_MIGRATION_DIR = join(MIGRATIONS_DIR, TEST_MIGRATION_NAME);
const TEST_MIGRATION_SQL = join(TEST_MIGRATION_DIR, 'migration.sql');

let wrapperDir = null;

// ── Helper: cross-platform sleep ────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Helper: run a command ──────────────────────────────────────────────────

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

/**
 * Create a Node.js wrapper script that stands in for `psql`.
 *
 * The resolver script calls `spawnSync('psql', ['-d', <host-url>, '-t', '-A', '-c', <sql>])`.
 * Inside the Docker container, the host URL's port (5434) doesn't match the
 * container's PostgreSQL port (5432), so we must:
 *   1. Strip the `-d <host-url>` arguments
 *   2. Connect via Unix socket to the container's PostgreSQL
 *   3. Pass through all other arguments (-t, -A, -c, etc.)
 *
 * This wrapper handles argument parsing correctly (unlike batch .cmd files
 * that mangle arguments with spaces/quoting).
 */
function createPsqlWrapper() {
  mkdirSync(WRAPPER_DIR, { recursive: true });

  // Remove any stale wrappers first
  try { rmSync(join(WRAPPER_DIR, 'psql.cmd'), { force: true }); } catch {}
  try { rmSync(join(WRAPPER_DIR, 'psql'), { force: true }); } catch {}

  const isWin = process.platform === 'win32';

  // CommonJS script (uses require since it's run as a standalone process)
  const wrapperContent = [
    '#!/usr/bin/env node',
    '// Auto-generated psql wrapper for integration tests',
    '// Strips -d <host-url> and delegates to Docker PostgreSQL container',
    '',
    'const { spawnSync } = require("child_process");',
    '',
    `const CONTAINER = "${CONTAINER_NAME}";`,
    `const DB_NAME = "${TEST_DB_NAME}";`,
    '',
    '// Filter out -d <url>, pass everything else through',
    'const args = [];',
    'const originalArgs = process.argv.slice(2);',
    'for (let i = 0; i < originalArgs.length; i++) {',
    '  if (originalArgs[i] === "-d") {',
    '    i++; // Skip the URL value',
    '    continue;',
    '  }',
    '  args.push(originalArgs[i]);',
    '}',
    '',
    'const result = spawnSync("docker", [',
    '  "exec", "-i", CONTAINER,',
    '  "psql", "-U", "postgres", "-d", DB_NAME,',
    '  ...args',
    '], {',
    '  stdio: "pipe",',
    '  encoding: "utf-8",',
    '  timeout: 30000,',
    '});',
    '',
    'process.stdout.write(result.stdout || "");',
    'process.stderr.write(result.stderr || "");',
    'process.exit(result.status ?? 1);',
    '',
  ].join('\n');

  if (isWin) {
    writeFileSync(join(WRAPPER_DIR, 'psql.cmd'), [
      '@echo off',
      `node "${join(WRAPPER_DIR, 'psql-wrapper.cjs')}" %*`,
      '',
    ].join('\r\n'));
    // Also write the Node.js wrapper as .cjs (CommonJS) since it uses require()
    writeFileSync(join(WRAPPER_DIR, 'psql-wrapper.cjs'), wrapperContent);
  } else {
    // On Unix, create a direct node wrapper (no .cmd layer)
    writeFileSync(join(WRAPPER_DIR, 'psql'), [
      '#!/usr/bin/env node',
      wrapperContent,
    ].join('\n'));
    spawnSync('chmod', ['+x', join(WRAPPER_DIR, 'psql')], { stdio: 'pipe' });
  }

  return WRAPPER_DIR;
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

function buildPathWithWrapper() {
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
  if (existsSync(WRAPPER_DIR)) {
    try { rmSync(join(WRAPPER_DIR, 'psql.cmd'), { force: true }); } catch {}
    try { rmSync(join(WRAPPER_DIR, 'psql'), { force: true }); } catch {}
    try { rmSync(join(WRAPPER_DIR, 'psql-wrapper.mjs'), { force: true }); } catch {}
    try { rmSync(join(WRAPPER_DIR, 'psql-wrapper.cjs'), { force: true }); } catch {}
    try { rmSync(WRAPPER_DIR, { force: true }); } catch {}
  }
}

function runResolveScript() {
  const env = {
    ...process.env,
    DATABASE_URL_UNPOOLED: TEST_DB_URL,
    PATH: buildPathWithWrapper(),
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

  beforeAll(async () => {
    if (!dockerAvailable) return;

    // 0. Kill any leftover container from a previous run
    run('docker', ['kill', CONTAINER_NAME], { timeout: 10000 });
    run('docker', ['rm', '-f', CONTAINER_NAME], { timeout: 10000 });

    // 1. Start PostgreSQL container
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
      await sleep(1000);
    }

    if (!ready) {
      run('docker', ['stop', CONTAINER_NAME], { timeout: 30000 });
      throw new Error('PostgreSQL container did not become ready within 60 seconds');
    }

    // Verify the container is actually reachable via dockerExec
    const testQuery = dockerExec('SELECT 1 AS test;');
    console.log(`[test:debug] dockerExec test: status=${testQuery.status}, stdout=${testQuery.stdout.trim()}`);

    // 3. Create psql wrapper (always, since psql is not available on this host)
    wrapperDir = createPsqlWrapper();

    // 4. Verify the wrapper works by calling psql.cmd --version with the modified PATH
    const wrapperEnv = { ...process.env, DATABASE_URL_UNPOOLED: TEST_DB_URL, PATH: buildPathWithWrapper() };
    const wrapperTest = run('psql.cmd', ['--version'], { env: wrapperEnv, shell: true, timeout: 15000 });
    console.log(`[test:debug] psql.cmd wrapper test: status=${wrapperTest.status}, stdout=${(wrapperTest.stdout || '').trim()}, stderr=${(wrapperTest.stderr || '').trim()}`);

    // 5. Create migration fixtures in prisma/migrations/
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

    createDatabaseObjects();

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

    const migrations = [
      { name: '20260625120002_test_multi_1', table: 'multi_1_table' },
      { name: '20260625120003_test_multi_2', table: 'multi_2_table' },
      { name: '20260625120004_test_multi_3', table: 'multi_3_table' },
    ];

    for (const m of migrations) {
      const dir = join(MIGRATIONS_DIR, m.name);
      const sql = join(dir, 'migration.sql');
      mkdirSync(dir, { recursive: true });
      writeFileSync(sql, [
        `CREATE TABLE IF NOT EXISTS "${m.table}" (`,
        '  id SERIAL PRIMARY KEY',
        ');',
      ].join('\n'));

      insertFailedMigration(m.name);
    }

    // Create objects for the second migration only
    dockerExec('CREATE TABLE IF NOT EXISTS multi_2_table (id SERIAL PRIMARY KEY);');

    const result = runResolveScript();
    expect(result.status).toBe(0);

    expect(readMigrationStatus('20260625120002_test_multi_1')).toBe('rolled-back');
    expect(readMigrationStatus('20260625120003_test_multi_2')).toBe('applied');
    expect(readMigrationStatus('20260625120004_test_multi_3')).toBe('rolled-back');

    for (const m of migrations) {
      try { rmSync(join(MIGRATIONS_DIR, m.name), { recursive: true, force: true }); } catch {}
    }
  });

  it('should exit cleanly when there are no failed migrations', () => {
    if (!dockerAvailable) return;

    const result = runResolveScript();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Nenhuma migração falhada encontrada');
  });
});
