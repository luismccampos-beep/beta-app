/**
 * Backfill/repair `wv_destinations` geography from lat/lon using Photon reverse geocoding.
 *
 * Usage:
 *   npm run travel:catalog:backfill-dest-geo -- --dry-run
 *   npm run travel:catalog:backfill-dest-geo -- --limit 200
 *
 * Notes:
 * - Photon has no API key but please be gentle (rate limiting).
 * - We only update when we have coords and a returned country code.
 */
import { setTimeout as delay } from 'node:timers/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

import { loadProjectEnv } from './lib/load-env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
loadProjectEnv(ROOT);

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
const verbose = args.has('--verbose');
const limit = parseInt(argValue('--limit', '500'), 10);
const sleepMs = parseInt(argValue('--sleep-ms', '250'), 10);
const onlyBad = !args.has('--all');
const lang = String(argValue('--lang', 'pt')).trim() || 'pt';

function displayCountryFromCode(code, locale) {
  const cc = typeof code === 'string' ? code.trim().toUpperCase() : '';
  if (!cc || cc.length !== 2) return null;
  try {
    const dn = new Intl.DisplayNames([locale], { type: 'region' });
    const label = dn.of(cc);
    return label && label !== cc ? label : null;
  } catch {
    return null;
  }
}

function normCC(v) {
  const cc = typeof v === 'string' ? v.trim().toUpperCase() : '';
  return cc.length === 2 ? cc : null;
}

async function photonReverse(lat, lon) {
  const url = new URL('https://photon.komoot.io/reverse');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('limit', '1');

  const res = await fetch(url, {
    headers: {
      'User-Agent': process.env.PHOTON_USER_AGENT || 'beta-app-travel/1.0',
      Accept: 'application/json',
    },
  });
  if (!res.ok) return null;
  const json = await res.json();
  const feat = json?.features?.[0];
  const p = feat?.properties ?? null;
  if (!p) return null;

  const cc =
    normCC(p.countrycode) ??
    normCC(p.countryCode) ??
    normCC(p.country_code) ??
    null;

  return {
    countryCode: cc,
    countryName: typeof p.country === 'string' ? p.country : null,
    city:
      (typeof p.city === 'string' && p.city) ||
      (typeof p.town === 'string' && p.town) ||
      (typeof p.village === 'string' && p.village) ||
      (typeof p.county === 'string' && p.county) ||
      null,
  };
}

/** Rough ISO 3166-1 alpha-2 → marketing continent for filters. */
function continentFromCountryCode(code) {
  if (!code) return 'Europe';
  const c = code.toUpperCase();
  const europe = new Set([
    'AL','AD','AT','BY','BE','BA','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR',
    'HU','IS','IE','IT','LV','LI','LT','LU','MT','MD','MC','ME','NL','MK','NO','PL',
    'PT','RO','RU','SM','RS','SK','SI','ES','SE','CH','UA','GB','VA','XK',
  ]);
  const asia = new Set([
    'AF','AM','AZ','BH','BD','BT','BN','KH','CN','GE','HK','IN','ID','IR','IQ','IL',
    'JP','JO','KZ','KW','KG','LA','LB','MO','MY','MV','MN','MM','NP','KP','OM','PK',
    'PS','PH','QA','SA','SG','KR','LK','SY','TW','TJ','TH','TL','TR','TM','AE','UZ',
    'VN','YE',
  ]);
  const africa = new Set([
    'DZ','AO','BJ','BW','BF','BI','CM','CV','CF','TD','KM','CG','CD','CI','DJ','EG',
    'GQ','ER','SZ','ET','GA','GM','GH','GN','GW','KE','LS','LR','LY','MG','MW','ML',
    'MR','MU','MA','MZ','NA','NE','NG','RW','ST','SN','SC','SL','SO','ZA','SS','SD',
    'TZ','TG','TN','UG','ZM','ZW',
  ]);
  const northAmerica = new Set([
    'AG','BS','BB','BZ','CA','CR','CU','DM','DO','SV','GD','GT','HT','HN','JM','MX',
    'NI','PA','KN','LC','VC','TT','US',
  ]);
  const southAmerica = new Set(['AR','BO','BR','CL','CO','EC','GY','PY','PE','SR','UY','VE']);
  const oceania = new Set(['AU','FJ','KI','MH','FM','NR','NZ','PW','PG','WS','SB','TO','TV','VU']);
  if (europe.has(c)) return 'Europe';
  if (asia.has(c)) return 'Asia';
  if (africa.has(c)) return 'Africa';
  if (northAmerica.has(c)) return 'North America';
  if (southAmerica.has(c)) return 'South America';
  if (oceania.has(c)) return 'Oceania';
  return 'Europe';
}

async function main() {
  const where = {
    latitude: { not: null },
    longitude: { not: null },
    ...(onlyBad
      ? {
          OR: [
            { paisCode: 'XX' },
            { paisCode: '' },
            { continente: null },
            { pais: { equals: 'Internacional' } },
          ],
        }
      : {}),
  };

  const rows = await prisma.wvDestination.findMany({
    where,
    take: Math.max(1, Math.min(limit, 5000)),
    orderBy: { updatedAt: 'asc' },
    select: {
      id: true,
      slug: true,
      lang: true,
      nome: true,
      pais: true,
      paisCode: true,
      continente: true,
      latitude: true,
      longitude: true,
    },
  });

  console.log(`wv_destinations candidates: ${rows.length} (dryRun=${dryRun}, onlyBad=${onlyBad})`);

  let updated = 0;
  let skipped = 0;
  const skipReasons = {
    no_coords: 0,
    invalid_coords: 0,
    photon_no_country: 0,
    already_ok: 0,
  };

  for (const r of rows) {
    const lat = r.latitude;
    const lon = r.longitude;
    if (lat == null || lon == null) {
      skipped += 1;
      skipReasons.no_coords += 1;
      continue;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      skipped += 1;
      skipReasons.invalid_coords += 1;
      continue;
    }

    const rev = await photonReverse(lat, lon);
    await delay(Math.max(0, sleepMs));
    if (!rev?.countryCode) {
      skipped += 1;
      skipReasons.photon_no_country += 1;
      if (verbose) {
        console.log(`[skip photon] ${r.slug} (${r.nome}) @${lat.toFixed(3)},${lon.toFixed(3)}`);
      }
      continue;
    }

    const newPaisCode = rev.countryCode;
    const newPais = displayCountryFromCode(newPaisCode, lang) ?? rev.countryName ?? r.pais;
    const newCont = continentFromCountryCode(newPaisCode);

    const changes = [];
    if (r.paisCode !== newPaisCode) changes.push(`paisCode ${r.paisCode}→${newPaisCode}`);
    if (r.pais !== newPais) changes.push(`pais "${r.pais}"→"${newPais}"`);
    if ((r.continente ?? null) !== newCont) changes.push(`continente ${(r.continente ?? 'null')}→${newCont}`);

    if (changes.length === 0) {
      skipped += 1;
      skipReasons.already_ok += 1;
      if (verbose) {
        console.log(
          `[ok] ${r.slug} (${r.nome}) ${newPaisCode} · ${newPais} — coords batem com a DB`,
        );
      }
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] ${r.slug} (${r.nome}) @${lat.toFixed(3)},${lon.toFixed(3)} :: ${changes.join(' | ')}`);
      updated += 1;
      continue;
    }

    await prisma.wvDestination.update({
      where: { id: r.id },
      data: {
        paisCode: newPaisCode,
        pais: newPais,
        continente: newCont,
      },
    });
    updated += 1;
    if (updated % 25 === 0) console.log(`updated ${updated}/${rows.length}…`);
  }

  console.log(`Done. updated=${updated} skipped=${skipped}`);
  console.log('Skip breakdown:', skipReasons);
  if (updated === 0 && skipReasons.already_ok > 0 && !onlyBad) {
    console.log(
      '\nNada a alterar: para estes destinos, pais/paisCode/continente já coincidem com as coordenadas (Photon).',
    );
    console.log(
      'Se a UI ainda mostra países errados, verifica TRAVEL_CATALOG_SOURCE=db e o campo IATA (vem dos voos, não do país).',
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

