#!/usr/bin/env node
/**
 * scripts/prisma-with-fallback.mjs
 *
 * Cross-platform wrapper for the Prisma CLI used by the npm scripts that touch
 * Prisma at install / build / migrate time (postinstall, db:migrate, ...).
 *
 * Why this exists:
 *   Prisma validates `directUrl = env("DATABASE_URL_UNPOOLED")` at config time.
 *   If the variable resolves to "" the CLI throws P1012 and aborts.
 *
 *   Mirroring the GitHub Actions job-level fallback in
 *   `.github/workflows/deploy-migrations.yml`, this wrapper substitutes
 *   `DATABASE_URL` for `DATABASE_URL_UNPOOLED` when the latter is missing or
 *   empty in the inherited process environment (the typical cause is a stale
 *   `export DATABASE_URL_UNPOOLED=""` from a previous shell session, which
 *   shadows .env values — dotenv will not overwrite an already-set var).
 *
 * Notes:
 *   - The fallback only fixes the env-var visibility issue; it does NOT make
 *     migrations safe under PgBouncer transaction pooling. The CI workflow
 *     keeps an explicit step-level env on `migrate status` / `migrate deploy`
 *     that omits the fallback for those steps.
 *   - We deliberately do NOT re-load .env here to avoid masking process env.
 *   - On Windows, `npx` is a `.cmd` shim and requires `shell: true` to be
 *     resolved by Node's spawn (otherwise ENOENT on the shim).
 */

import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const env = { ...process.env };

// Load .env into env if not already set (avoids masking pre-existing env vars
// while still working when .env is the only source).
const envPath = resolve(rootDir, '.env');
if (existsSync(envPath)) {
  const dotenvRaw = readFileSync(envPath, 'utf-8');
  for (const line of dotenvRaw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!env[key]) env[key] = val;
  }
}

// Hard fail early when BOTH URLs are empty — better than forwarding "" to
// Prisma which would surface a generic P1012 the user then has to decode.
if (!env.DATABASE_URL_UNPOOLED && !env.DATABASE_URL) {
  console.error(
    '[prisma] Erro: DATABASE_URL e DATABASE_URL_UNPOOLED estão vazias.\n' +
      '        Configure ambas em .env (use a URL direta do Neon, sem PgBouncer, em DATABASE_URL_UNPOOLED)\n' +
      '        e rode novamente. Ver também: .env.example → bloco TROUBLESHOOTING P1012.'
  );
  process.exit(2);
}

if (!env.DATABASE_URL_UNPOOLED && env.DATABASE_URL) {
  env.DATABASE_URL_UNPOOLED = env.DATABASE_URL;
  console.warn(
    '[prisma] DATABASE_URL_UNPOOLED estava vazia — usando DATABASE_URL como fallback.\n' +
      '          OK para validação de schema. Em produção, sob PgBouncer, prefira a URL direta do Neon.'
  );
}

const isWin = process.platform === 'win32';
const cmd = isWin ? 'npx.cmd' : 'npx';
const args = ['prisma', ...process.argv.slice(2)];

// On Windows, npx is a .cmd shim and needs shell:true so the cmd shim is found.
const result = spawnSync(cmd, args, {
  stdio: 'inherit',
  env,
  shell: isWin,
});

// POSIX convention: when the child is killed by a signal, propagate 128 + signum.
if (result.status !== null) {
  process.exit(result.status);
}
if (result.signal) {
  process.exit(128 + result.signal);
}
process.exit(1);
