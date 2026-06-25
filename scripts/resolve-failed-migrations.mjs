#!/usr/bin/env node
/**
 * scripts/resolve-failed-migrations.mjs
 *
 * Auto-resolves failed Prisma migrations so CI doesn't get stuck on P3009.
 *
 * How it works:
 *   1. Query `_prisma_migrations` for failed migrations via psql.
 *   2. For each failed migration, read its SQL file and extract the database
 *      objects it tries to create (tables, views, indexes, types).
 *   3. Check if those objects exist in the database.
 *      - If yes → `prisma migrate resolve --applied`
 *      - If no  → `prisma migrate resolve --rolled-back`
 *   4. Exit cleanly so the caller can run `prisma migrate deploy`.
 *
 * Requires:
 *   psql (PostgreSQL client) — install in CI with:
 *     sudo apt-get install -y postgresql-client --no-install-recommends
 *
 * Usage:
 *   node scripts/resolve-failed-migrations.mjs
 *
 * Environment variables:
 *   DATABASE_URL_UNPOOLED  – required (direct Neon URL, NOT the pooled one)
 *   DATABASE_URL           – fallback if DATABASE_URL_UNPOOLED is empty
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const MIGRATIONS_DIR = join(PROJECT_ROOT, 'prisma', 'migrations');

// ── Environment / URLs ──────────────────────────────────────────────────────

function getDbUrl() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) {
    console.error('[resolve] ❌ DATABASE_URL_UNPOOLED e DATABASE_URL estão vazias.');
    process.exit(2);
  }
  return url;
}

// ── Subprocess helpers ──────────────────────────────────────────────────────

function run(args, opts = {}) {
  const isWin = process.platform === 'win32';
  const cmd = isWin ? 'npx.cmd' : 'npx';
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL_UNPOOLED: getDbUrl() },
    shell: isWin,
    ...opts,
  });
  return result.status ?? (result.signal ? 128 + result.signal : 1);
}

/**
 * Run a SQL query via psql and return the raw tab-separated output.
 * psql must be installed — see the Requires note at the top of this file.
 */
function psqlQuery(sql) {
  const url = getDbUrl();
  const isWin = process.platform === 'win32';
  const psqlBin = isWin ? 'psql.cmd' : 'psql';
  const result = spawnSync(psqlBin, ['-d', url, '-t', '-A', '-c', sql], {
    stdio: 'pipe',
    encoding: 'utf-8',
    timeout: 30000,
    shell: isWin,
  });

  if (result.error) {
    console.error(`[resolve] ❌ psql não está disponível: ${result.error.message}`);
    console.error('          Instale postgresql-client: sudo apt-get install -y postgresql-client');
    process.exit(2);
  }

  if (result.status !== 0) {
    console.error(`[resolve] ❌ psql devolveu código ${result.status}`);
    const stderr = (result.stderr ?? '').trim();
    if (stderr) console.error(`          stderr: ${stderr}`);
    process.exit(2);
  }

  return result.stdout.trim();
}

// ── SQL parsing ─────────────────────────────────────────────────────────────

/**
 * Parse migration SQL and extract names of database objects the migration
 * creates. Each regex is reset independently so lastIndex issues with the /g
 * flag don't interfere.
 *
 * Supports:
 *   - CREATE [UNIQUE] INDEX [CONCURRENTLY] [IF NOT EXISTS] <name> ON …
 *   - CREATE [MATERIALIZED] VIEW [IF NOT EXISTS] <name> …
 *   - CREATE TABLE [IF NOT EXISTS] [schema.]<name> (…
 *   - CREATE TYPE <name>
 *   - ALTER TYPE <name> RENAME TO <newname>
 */
export function parseMigrationObjects(sql) {
  const objects = [];

  // CREATE [UNIQUE] INDEX [CONCURRENTLY] [IF NOT EXISTS] <name> ON
  const indexRe = /CREATE\s+(?:UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:CONCURRENTLY\s+)?["']?(\w+)["']?\s+ON\s+/gi;
  let m;
  while ((m = indexRe.exec(sql)) !== null) {
    objects.push({ name: m[1], type: 'INDEX' });
  }

  // CREATE [MATERIALIZED] VIEW [IF NOT EXISTS] [schema.]<name>
  // We intentionally stop matching after the name — the body can span
  // many lines (e.g. ... AS SELECT ... FROM ...).
  const viewRe = /CREATE\s+(?:MATERIALIZED\s+)?VIEW\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:["']?\w+["']?\s*\.\s*)?["']?(\w+)["']?\s+/gi;
  while ((m = viewRe.exec(sql)) !== null) {
    objects.push({ name: m[1], type: 'VIEW' });
  }

  // CREATE TABLE [IF NOT EXISTS] [schema.]<name> (
  const tableRe = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:["']?\w+["']?\s*\.\s*)?["']?(\w+)["']?\s*\(/gi;
  while ((m = tableRe.exec(sql)) !== null) {
    objects.push({ name: m[1], type: 'TABLE' });
  }

  // CREATE TYPE <name>
  const typeRe = /CREATE\s+TYPE\s+["']?(\w+)["']?/gi;
  while ((m = typeRe.exec(sql)) !== null) {
    objects.push({ name: m[1], type: 'TYPE' });
  }

  // ALTER TYPE <oldname> RENAME TO <newname>
  const renameTypeRe = /ALTER\s+TYPE\s+["']?(\w+)["']?\s+RENAME\s+TO\s+["']?(\w+)["']?/gi;
  while ((m = renameTypeRe.exec(sql)) !== null) {
    objects.push({ name: m[2], type: 'TYPE' });
  }

  return objects;
}

/**
 * Build a UNION ALL query that checks whether each object exists in the
 * database. Returns null if the input list is empty.
 */
export function buildExistenceCheckSQL(objects) {
  const checks = [];

  for (const obj of objects) {
    switch (obj.type) {
      case 'TABLE':
        checks.push(
          `SELECT '${obj.name}' AS obj_name, EXISTS (SELECT 1 FROM pg_class WHERE relname = '${obj.name}' AND relkind = 'r') AS exists_flag`
        );
        break;
      case 'VIEW':
        // relkind 'v' = regular view, 'm' = materialized view
        checks.push(
          `SELECT '${obj.name}' AS obj_name, EXISTS (SELECT 1 FROM pg_class WHERE relname = '${obj.name}' AND relkind IN ('v', 'm')) AS exists_flag`
        );
        break;
      case 'INDEX':
        checks.push(
          `SELECT '${obj.name}' AS obj_name, EXISTS (SELECT 1 FROM pg_class WHERE relname = '${obj.name}' AND relkind = 'i') AS exists_flag`
        );
        break;
      case 'TYPE':
        checks.push(
          `SELECT '${obj.name}' AS obj_name, EXISTS (SELECT 1 FROM pg_type WHERE typname = '${obj.name}') AS exists_flag`
        );
        break;
    }
  }

  return checks.length > 0 ? checks.join(' UNION ALL ') : null;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔍 [resolve] A verificar migrações falhadas...\n');

  // 1. Verify psql is available before doing anything else
  const isWin = process.platform === 'win32';
  const psqlBin = isWin ? 'psql.cmd' : 'psql';
  const psqlCheck = spawnSync(psqlBin, ['--version'], {
    stdio: 'pipe',
    encoding: 'utf-8',
    shell: isWin,
  });
  if (psqlCheck.error || psqlCheck.status !== 0) {
    console.error('[resolve] ❌ psql (PostgreSQL client) não está instalado.');
    console.error('          Execute: sudo apt-get install -y postgresql-client --no-install-recommends');
    console.error('          Certifique-se de que o CI instala o cliente PostgreSQL antes deste passo.');
    process.exit(2);
  }
  console.log(`[resolve] ✅ ${(psqlCheck.stdout || '').trim()}`);

  // 2. Query _prisma_migrations for failed entries
  const failedSql = [
    "SELECT migration_name, started_at::text, substring(logs::text from 1 for 300) AS logs",
    "FROM _prisma_migrations",
    "WHERE finished_at IS NULL AND rolled_back_at IS NULL",
    "ORDER BY started_at DESC;",
  ].join('\n');

  const dbOutput = psqlQuery(failedSql);

  if (!dbOutput) {
    console.log('[resolve] ✅ Nenhuma migração falhada encontrada.\n');
    return;
  }

  const lines = dbOutput.split('\n').filter(Boolean);
  if (lines.length === 0) {
    console.log('[resolve] ✅ Nenhuma migração falhada encontrada.\n');
    return;
  }

  const failedMigrations = lines.map((line) => {
    const [name, startedAt, ...logParts] = line.split('|');
    return {
      name: (name || '').trim(),
      startedAt: (startedAt || '').trim(),
      logs: logParts.join('|').trim(),
    };
  });

  console.log(`[resolve] ⚠️  Encontradas ${failedMigrations.length} migração(ões) falhada(s):\n`);
  for (const m of failedMigrations) {
    console.log(`   - ${m.name}`);
    if (m.logs) console.log(`     Logs: ${m.logs.substring(0, 300)}`);
  }
  console.log();

  // 3. Resolve each failed migration
  for (const migration of failedMigrations) {
    const sqlPath = join(MIGRATIONS_DIR, migration.name, 'migration.sql');

    let sql = '';
    try {
      sql = readFileSync(sqlPath, 'utf-8');
    } catch {
      console.warn(
        `[resolve] ⚠️  Ficheiro SQL não encontrado para ${migration.name}` +
          ` — a marcar como rolled-back.`
      );
      const status = run(['prisma', 'migrate', 'resolve', '--rolled-back', migration.name]);
      if (status !== 0) process.exit(status);
      continue;
    }

    const objects = parseMigrationObjects(sql);

    if (objects.length === 0) {
      console.warn(
        `[resolve] ⚠️  Não foi possível detetar objetos na migração ${migration.name}.` +
          `\n          A marcar como rolled-back (seguro para migrações que só alteram dados).`
      );
      const status = run(['prisma', 'migrate', 'resolve', '--rolled-back', migration.name]);
      if (status !== 0) process.exit(status);
      continue;
    }

    console.log(`[resolve] 📋 Objetos detetados em ${migration.name}:`);
    for (const obj of objects) {
      console.log(`           - ${obj.type}: ${obj.name}`);
    }

    const checkSQL = buildExistenceCheckSQL(objects);
    if (!checkSQL) {
      console.warn('[resolve] ⚠️  Não foi possível construir a verificação. A marcar como rolled-back.');
      const status = run(['prisma', 'migrate', 'resolve', '--rolled-back', migration.name]);
      if (status !== 0) process.exit(status);
      continue;
    }

    const checkOutput = psqlQuery(checkSQL);
    const resultLines = checkOutput.split('\n').filter(Boolean);

    let existingCount = 0;
    for (const line of resultLines) {
      // psql -A output: obj_name|exists_flag  (t or f)
      const parts = line.split('|');
      if (parts.length >= 2 && parts[1].trim() === 't') {
        existingCount++;
      }
    }

    console.log(`[resolve] 📊 ${existingCount}/${objects.length} objeto(s) existem na base de dados.`);

    if (existingCount > 0) {
      console.log(`[resolve] ✅ A marcar ${migration.name} como applied...`);
      const status = run(['prisma', 'migrate', 'resolve', '--applied', migration.name]);
      if (status !== 0) process.exit(status);
    } else {
      console.log(`[resolve] 🔄 A marcar ${migration.name} como rolled-back...`);
      const status = run(['prisma', 'migrate', 'resolve', '--rolled-back', migration.name]);
      if (status !== 0) process.exit(status);
    }
    console.log();
  }

  console.log('[resolve] ✅ Todas as migrações falhadas resolvidas. O workflow pode agora executar prisma migrate deploy.');
}

// Only auto-run when executed directly (not when imported as a module for tests)
const isDirectRun = process.argv[1] &&
  (process.argv[1] === fileURLToPath(import.meta.url) ||
   process.argv[1].endsWith('/resolve-failed-migrations.mjs') ||
   process.argv[1].endsWith('\\resolve-failed-migrations.mjs'));

if (isDirectRun) {
  main().catch((err) => {
    console.error('[resolve] ❌ Erro inesperado:', err);
    process.exit(1);
  });
}
