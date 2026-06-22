/**
 * Verify `wv_hotels` location quality using:
 * - distance to its destination centroid (wv_destinations.lat/lon)
 * - Photon reverse geocode country code from hotel coords (primary)
 * - Nominatim reverse geocode country code from hotel coords (fallback)
 *
 * Action: mark suspicious hotels by setting `fonte = 'rejected_geo'`.
 *
 * Usage:
 *   npm run travel:catalog:verify-hotels-geo -- --dry-run
 *   npm run travel:catalog:verify-hotels-geo -- --limit 500 --max-km 200
 *   npm run travel:catalog:verify-hotels-geo -- --batch-size=500
 *
 * Features:
 * - Photon as primary reverse geocoder (fast, no aggressive rate limit)
 * - Nominatim as fallback (auto-disabled on 429)
 * - Batch commits (default 500 per batch) for better performance
 *
 * Notes:
 * - This is a pragmatic MVP guardrail: it's better to hide a wrong hotel than show an obviously incorrect one.
 * - It only checks hotels with lat/lon present.
 */
import { PrismaClient } from '@prisma/client';
import { setTimeout as delay } from 'node:timers/promises';
import { loadProjectEnv } from './lib/load-env.mjs';

loadProjectEnv();

// Use direct (unpooled) URL for long-running scripts — Neon pooler closes idle connections
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const args = new Set(process.argv.slice(2));
const argValue = (name, fallback) => {
  const idx = process.argv.indexOf(name);
  if (idx !== -1) return process.argv[idx + 1] ?? fallback;
  for (const a of process.argv) {
    if (a.startsWith(`${name}=`)) return a.split('=')[1] ?? fallback;
  }
  return fallback;
};

const dryRun = args.has('--dry-run');
const limit = Math.max(1, Math.min(parseInt(argValue('--limit', '800'), 10) || 800, 5000));
const sleepMs = Math.max(0, Math.min(parseInt(argValue('--sleep-ms', '150'), 10) || 150, 2000));
const maxKm = Math.max(10, Math.min(parseFloat(argValue('--max-km', '250')) || 250, 5000));
const maxReject = Math.max(0, Math.min(parseInt(argValue('--max-reject', '2000'), 10) || 2000, 20000));
const batchSize = Math.max(1, Math.min(parseInt(argValue('--batch-size', '500'), 10) || 500, 2000));
const verbose = args.has('--verbose');

function normCC(v) {
  const cc = typeof v === 'string' ? v.trim().toUpperCase() : '';
  return cc.length === 2 ? cc : null;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

async function photonReverseCountryCode(lat, lon) {
  const url = new URL('https://photon.komoot.io/reverse');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('limit', '1');

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': process.env.PHOTON_USER_AGENT || 'beta-app-travel/1.0',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const p = json?.features?.[0]?.properties ?? null;
    if (!p) return null;
    return (
      normCC(p.countrycode) ??
      normCC(p.countryCode) ??
      normCC(p.country_code) ??
      null
    );
  } catch {
    return null;
  }
}

async function nominatimReverseCountryCode(lat, lon) {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('format', 'json');
  url.searchParams.set('accept-language', 'en');

  const res = await fetch(url, {
    headers: {
      'User-Agent': process.env.PHOTON_USER_AGENT || 'beta-app-travel/1.0',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (res.status === 429) return 'RATE_LIMITED';
  if (!res.ok) return null;

  const json = await res.json();
  const address = json?.address ?? {};
  return normCC(address.country_code);
}

async function main() {
  const rows = await prisma.wvHotel.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null },
      NOT: { fonte: 'rejected_geo' },
    },
    take: limit,
    orderBy: { id: 'asc' },
    select: {
      id: true,
      nome: true,
      fonte: true,
      destinoId: true,
      latitude: true,
      longitude: true,
      destino: { select: { nome: true, pais: true, paisCode: true, latitude: true, longitude: true } },
    },
  });

  console.log(
    `wv_hotels candidates: ${rows.length} (dryRun=${dryRun}, maxKm=${maxKm}, batchSize=${batchSize})`,
  );

  let rejected = 0;
  let ok = 0;
  let skippedNoDestCoords = 0;
  let skippedNoGeo = 0;
  let countryMismatch = 0;
  let farFromDest = 0;
  let nominatimDisabled = false;
  const rejectBatch = [];

  for (const h of rows) {
    if (rejected >= maxReject) break;
    const lat = h.latitude;
    const lon = h.longitude;
    const dLat = h.destino?.latitude ?? null;
    const dLon = h.destino?.longitude ?? null;
    const destCC = h.destino?.paisCode?.trim().toUpperCase() || null;

    if (lat == null || lon == null) continue;
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

    let km = null;
    if (dLat != null && dLon != null && Number.isFinite(dLat) && Number.isFinite(dLon)) {
      km = haversineKm(lat, lon, dLat, dLon);
    } else {
      skippedNoDestCoords += 1;
    }

    // Photon as primary
    let cc = await photonReverseCountryCode(lat, lon);
    await delay(sleepMs);

    // Nominatim as fallback (if Photon failed and Nominatim not disabled)
    if (!cc && !nominatimDisabled) {
      cc = await nominatimReverseCountryCode(lat, lon);
      await delay(sleepMs);

      if (cc === 'RATE_LIMITED') {
        nominatimDisabled = true;
        console.log('\n  ⚠ Nominatim rate-limited (429). Desativado para resto da run.');
        cc = null;
      }
    }

    if (!cc) {
      skippedNoGeo += 1;
      continue;
    }

    const mismatch = destCC && cc && destCC.length === 2 && cc !== destCC;
    const tooFar = km != null && km > maxKm;

    if (mismatch) countryMismatch += 1;
    if (tooFar) farFromDest += 1;

    if (mismatch || tooFar) {
      rejected += 1;
      rejectBatch.push(h.id);
      if (verbose) {
        console.log(
          `[reject] #${h.id} ${h.nome} | dest=${h.destino?.nome} (${destCC}) | cc=${cc} | km=${km?.toFixed?.(1) ?? 'n/a'} | fonte=${h.fonte ?? 'null'}`,
        );
      }

      // Batch commit
      if (!dryRun && rejectBatch.length >= batchSize) {
        await prisma.$executeRaw`
          UPDATE wv_hotels
          SET fonte = 'rejected_geo'
          WHERE id IN (${prisma.join(rejectBatch.map(id => [id]))})
        `;
        console.log(`  -> committed ${rejectBatch.length} rejections`);
        rejectBatch.length = 0;
      }
    } else {
      ok += 1;
    }
  }

  // Final batch commit for remaining rejections
  if (!dryRun && rejectBatch.length > 0) {
    await prisma.$executeRaw`
      UPDATE wv_hotels
      SET fonte = 'rejected_geo'
      WHERE id IN (${prisma.join(rejectBatch.map(id => [id]))})
    `;
    console.log(`  -> committed final ${rejectBatch.length} rejections`);
  }

  console.log(
    `Done. ok=${ok} rejected=${rejected} skippedNoDestCoords=${skippedNoDestCoords} skippedNoGeo=${skippedNoGeo} countryMismatch=${countryMismatch} farFromDest=${farFromDest}${nominatimDisabled ? ' (Nominatim desativado por rate limit)' : ''}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

