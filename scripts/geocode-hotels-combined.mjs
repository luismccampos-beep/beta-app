#!/usr/bin/env node
/**
 * Pipeline combinada de geocoding — Opção C.
 *
 * Fluxo:
 *   Fase A  → Índice local (hotel-index.json) — match por nome, gratuito, instantâneo
 *   Fase A.5 → Copiar coordenadas do destino para hotéis (destinos já geocodificados)
 *   Fase B  → Geocoding por destino (Photon, workers paralelos)
 *
 * Uso:
 *   node scripts/geocode-hotels-combined.mjs                           # pipeline completa
 *   node scripts/geocode-hotels-combined.mjs --dry-run --limit-b=100   # testar Fase B com 100 destinos
 *   node scripts/geocode-hotels-combined.mjs --skip-a                  # saltar Fase A (índice local)
 *   node scripts/geocode-hotels-combined.mjs --only-a5                 # só copiar dest→hotel
 *   node scripts/geocode-hotels-combined.mjs --country=PT              # só Portugal
 *   node scripts/geocode-hotels-combined.mjs --status                  # ver estado
 *
 * Flags:
 *   --skip-a          Saltar Fase A (índice local)
 *   --only-a5         Só copiar coordenadas de destinos já geocodificados
 *   --skip-a5         Saltar Fase A.5
 *   --dry-run         Não escrever na BD
 *   --limit-b=N       Máx destinos na Fase B
 *   --country=XX      Filtrar por pais_code (ex: PT, FR)
 *   --workers-b=N     Workers na Fase B (default 5, max 20)
 *   --delay-b=N       Delay entre pedidos na Fase B em segundos (default 0.15)
 *   --status          Mostrar estado e sair
 *   --retry-b         Retentar destinos marcados geo_dest_not_found
 */
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
function parseArgs() {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      if (arg === '--status' || arg === '--dry-run' || arg === '--skip-a' || arg === '--skip-a5' || arg === '--only-a5' || arg === '--retry-b') {
        a[arg.slice(2)] = true;
      } else {
        const eq = arg.indexOf('=');
        if (eq > 0) a[arg.slice(2, eq)] = arg.slice(eq + 1);
        else a[arg.slice(2)] = process.argv[++i] ?? true;
      }
    }
  }
  return a;
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------
async function printStatus() {
  const [
    totalHot, hotWithCoords,
    totalDest, destWithCoords,
    hotFound, hotNotFound, hotWrongCountry, hotFromDest,
  ] = await Promise.all([
    prisma.wvHotel.count(),
    prisma.wvHotel.count({ where: { latitude: { not: null }, longitude: { not: null } } }),
    prisma.wvDestination.count(),
    prisma.wvDestination.count({ where: { latitude: { not: null }, longitude: { not: null } } }),
    prisma.wvHotel.count({ where: { fonte: 'geo_found' } }),
    prisma.wvHotel.count({ where: { fonte: 'geo_not_found' } }),
    prisma.wvHotel.count({ where: { fonte: 'geo_wrong_country' } }),
    prisma.wvHotel.count({ where: { fonte: 'geo_from_dest' } }),
  ]);

  const hotPendentes = totalHot - hotWithCoords;

  console.log(`\n=== Estado Geocoding Combinado ===`);
  console.log(`  Hotéis com coordenadas : ${hotWithCoords.toLocaleString()} / ${totalHot.toLocaleString()}  (${(hotWithCoords / totalHot * 100).toFixed(1)}%)`);
  console.log(`    ├─ fonte: geo_found      : ${hotFound.toLocaleString()}`);
  console.log(`    ├─ fonte: geo_from_dest   : ${hotFromDest.toLocaleString()}`);
  console.log(`    └─ fonte: outros          : ${(hotWithCoords - hotFound - hotFromDest).toLocaleString()}`);
  console.log(`  Hotéis sem coordenadas  : ${hotPendentes.toLocaleString()}`);
  console.log(`  Hotéis not_found        : ${hotNotFound.toLocaleString()}`);
  console.log(`  Hotéis wrong_country    : ${hotWrongCountry.toLocaleString()}`);
  console.log(`  Destinos com coordenadas: ${destWithCoords.toLocaleString()} / ${totalDest.toLocaleString()}  (${(destWithCoords / totalDest * 100).toFixed(1)}%)`);
  console.log();

  // Potencial impacto das fases
  const faseA5Impact = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS total
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL AND h.longitude IS NULL
      AND d.latitude IS NOT NULL AND d.longitude IS NOT NULL
  `);
  const faseBImpact = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS total
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL AND h.longitude IS NULL
      AND d.latitude IS NULL AND d.longitude IS NULL
  `);

  console.log('  Impacto potencial:');
  console.log(`    Fase A.5 (copiar dest→hotel): ~${(faseA5Impact[0]?.total ?? 0).toLocaleString()} hotéis (0 chamadas API)`);
  console.log(`    Fase B (geocodificar destinos): ~${(faseBImpact[0]?.total ?? 0).toLocaleString()} hotéis (~${(faseBImpact[0]?.total ?? 0) > 0 ? Math.ceil((faseBImpact[0]?.total ?? 0) / 12) : 0} chamadas API)`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const A = parseArgs();

  if (A.status) {
    await printStatus();
    await prisma.$disconnect();
    return;
  }

  const DRY_RUN = !!A['dry-run'];
  const COUNTRY = (A.country || '').toUpperCase();
  const LIMIT_B = parseInt(A['limit-b'] || '0');
  const WORKERS_B = Math.min(Math.max(1, parseInt(A['workers-b'] || '5')), 20);
  const DELAY_B = Math.max(0.05, parseFloat(A['delay-b'] || '0.15'));
  const SKIP_A = !!A['skip-a'];
  const ONLY_A5 = !!A['only-a5'];
  const SKIP_A5 = !!A['skip-a5'];
  const RETRY_B = !!A['retry-b'];

  const startTime = Date.now();

  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║   Pipeline Combinada de Geocoding       ║`);
  console.log(`╚══════════════════════════════════════════╝`);
  console.log(`  dry-run=${DRY_RUN}  country=${COUNTRY || 'ALL'}`);
  console.log(`  Fases: A${SKIP_A ? ' (skip)' : ''} → A.5${SKIP_A5 ? ' (skip)' : ''} → B${ONLY_A5 ? ' (skip)' : ''}`);
  if (!ONLY_A5) {
    console.log(`  workers-B=${WORKERS_B}  delay-B=${DELAY_B}s  limit-B=${LIMIT_B || 'ALL'}`);
  }

  await printStatus();    // ── Fase A: Índice local ──────────────────────────────────────
  if (!SKIP_A && !ONLY_A5) {
    console.log(`\n╔═══ Fase A: Índice local (hotel-index.json) ═══╗`);
    console.log(`╚══════════════════════════════════════════════════╝`);
    if (COUNTRY) console.log(`  NOTA: Fase A (índice local) não suporta --country. A processar todos os destinos.`);
    try {
      const cmd = [
        'node scripts/backfill-wv-hotels-geo.mjs',
        DRY_RUN ? '--dry-run' : '',
      ].filter(Boolean).join(' ');
      execSync(cmd, { cwd: ROOT, stdio: 'inherit', timeout: 600000 });
      console.log(`  ✅ Fase A concluída.`);
    } catch (e) {
      console.error(`  ❌ Fase A falhou: ${e.message}`);
    }
    console.log();
  }

  // ── Fase A.5: Copiar coords do destino para hotéis ────────────
  if (!SKIP_A5) {
    console.log(`╔═══ Fase A.5: Copiar coords destinos → hotéis ═══╗`);
    console.log(`╚══════════════════════════════════════════════════╝`);
    try {
      // COUNT primeiro
      const faseA5count = await prisma.$queryRawUnsafe(`
        SELECT COUNT(*)::int AS total
        FROM wv_hotels h
        JOIN wv_destinations d ON d.id = h.destino_id
        WHERE h.latitude IS NULL AND h.longitude IS NULL
          AND d.latitude IS NOT NULL AND d.longitude IS NOT NULL
          ${COUNTRY ? `AND d.pais_code = '${COUNTRY}'` : ''}
      `);
      const count = faseA5count[0]?.total ?? 0;
      console.log(`  Hotéis a atualizar: ${count.toLocaleString()}`);

      if (count > 0 && !DRY_RUN) {
        const countryClause = COUNTRY ? `AND d.pais_code = '${COUNTRY}'` : '';
        const result = await prisma.$executeRawUnsafe(`
          UPDATE wv_hotels AS h
          SET latitude = d.latitude,
              longitude = d.longitude,
              fonte = 'geo_from_dest'
          FROM wv_destinations AS d
          WHERE h.destino_id = d.id
            AND h.latitude IS NULL AND h.longitude IS NULL
            AND d.latitude IS NOT NULL AND d.longitude IS NOT NULL
            ${countryClause}
        `);
        console.log(`  ✅ ${result} hotéis atualizados com coordenadas dos destinos.`);
      } else if (DRY_RUN) {
        console.log(`  [dry-run] Seriam atualizados ${count} hotéis.`);
      } else {
        console.log(`  Nada a fazer.`);
      }
    } catch (e) {
      console.error(`  ❌ Fase A.5 falhou: ${e.message}`);
    }
    console.log();
  }

  // ── Fase B: Geocoding por destino ────────────────────────────
  if (!ONLY_A5) {
    console.log(`╔═══ Fase B: Geocoding por destino (Photon) ══════╗`);
    console.log(`╚══════════════════════════════════════════════════╝`);
    try {
      const cmd = [
        'node scripts/_geocode-destinos.mjs',
        DRY_RUN ? '--dry-run' : '',
        LIMIT_B > 0 ? `--limit=${LIMIT_B}` : '',
        COUNTRY ? `--country=${COUNTRY}` : '',
      ].filter(Boolean).join(' ');
      // Sem timeout: Nominatim a 1 req/s para 24k destinos ≈ 6.8h
      execSync(cmd, { cwd: ROOT, stdio: 'inherit', timeout: 0 });
      console.log(`  ✅ Fase B concluída.`);
    } catch (e) {
      console.error(`  ❌ Fase B falhou: ${e.message}`);
    }
    console.log();
  }

  // ── Resumo final ──────────────────────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  console.log(`╔══════════════════════════════════════════╗`);
  console.log(`║   Pipeline Concluída (${elapsed}s)        ║`);
  console.log(`╚══════════════════════════════════════════╝`);
  await printStatus();

  if (DRY_RUN) {
    console.log(`  (dry-run — nada foi alterado na BD)`);
  }
}

main()
  .catch((e) => { console.error('Fatal:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
