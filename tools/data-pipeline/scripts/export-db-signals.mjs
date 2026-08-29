/**
 * Export real DB user signal → ml-service training files.
 *
 * The ML recommender/personalization modules are trained from files in
 * `ml-service/app/data`. This script replaces the synthetic seed data with
 * real user signal collected in Postgres:
 *
 *   - `preference_events.jsonl` — from `preference_events` (budget ranges,
 *     travel styles, funnel steps) consumed by the personalization modules.
 *   - `interactions.csv` + `items.csv` — destination interactions derived
 *     from `favorites`, `saved_itineraries`, `reviews`, `bookings`,
 *     `trip_destinations`, `wv_destination_reviews` and recommendation
 *     click events (`recommendation_events`), mapped to the Wikivoyage
 *     `wv-<lang>-<destino_id>` item ids used by the destination embeddings.
 *
 * Existing files are merged (deduped by user+item, highest score wins) so the
 * demo corpus keeps working. Pass `--fresh` to start from DB data only.
 *
 *   npm run travel:ml:export-signals
 *   npm run travel:ml:export-signals -- --fresh
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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

const ML_DATA = resolve(ROOT, '..', '..', 'ml-service', 'app', 'data');
const INTERACTIONS = resolve(ML_DATA, 'interactions.csv');
const ITEMS = resolve(ML_DATA, 'items.csv');
const EVENTS = resolve(ML_DATA, 'preference_events.jsonl');

const args = new Set(process.argv.slice(2));
const fresh = args.has('--fresh');
const verbose = args.has('--verbose');
// Telemetry retention: --prune-events-days=N deletes recommendation_events older
// than N days AFTER the export reads them (export-then-prune keeps training
// data lossless). Default 0 = disabled. Clicks are exported before pruning.
const pruneFlag = process.argv.find((a) => a.startsWith('--prune-events-days='));
const pruneEventsDays = pruneFlag ? Number(pruneFlag.split('=')[1]) : 0;

// Explicit interaction scores per signal source (0-5 scale, recommender normalizes by max).
// Ordered by intent strength: click < planned < favorite < saved/booked.
const SCORE = { clicked: 2, planned: 3, favorite: 4, saved: 5, booked: 5 };

function escapeCsv(s) {
  const v = String(s ?? '').replace(/"/g, '""');
  return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v}"` : v;
}

function loadCsv(path) {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .slice(1) // drop header
    .map((line) => {
      // Minimal CSV split — our files never contain embedded commas inside quoted cells
      // beyond item ids/tags which are pipe-separated.
      return line.split(',').map((c) => c.replace(/^"|"$/g, ''));
    });
}

function dedupeInteractions(rows) {
  const best = new Map();
  for (const [user_id, item_id, score] of rows) {
    const key = `${user_id}\u0000${item_id}`;
    const cur = best.get(key);
    if (cur === undefined || Number(score) > cur) best.set(key, Number(score));
  }
  return [...best.entries()].map(([key, score]) => {
    const sep = key.indexOf('\u0000');
    return [key.slice(0, sep), key.slice(sep + 1), String(score)];
  });
}

function dedupeItems(rows) {
  const seen = new Map();
  for (const row of rows) {
    if (!seen.has(row[0])) seen.set(row[0], row);
  }
  return [...seen.values()];
}

// items.csv row: item_id,type,subtype,tags,nome,pais,continente,clima
function wvItemRow(itemId, d) {
  const tags = [d.tipo, d.clima, d.continente, d.paisCode, d.lang].filter(Boolean).join('|');
  return [
    itemId,
    'destination',
    d.tipo ?? '',
    tags,
    d.nome,
    d.pais ?? '',
    d.continente ?? '',
    d.clima ?? '',
  ];
}

async function main() {
  mkdirSync(ML_DATA, { recursive: true });

  // 1. Preference events (real, flowing) — faithful export for the ML modules.
  const events = await prisma.preferenceEvent.findMany({
    orderBy: { timestamp: 'asc' },
  });
  const eventLines = events.map((e) =>
    JSON.stringify({
      user_id: e.userId ?? '',
      session_id: e.sessionId,
      preference_type: e.preferenceType,
      action: e.action,
      old_value: e.oldValue,
      new_value: e.newValue,
      timestamp: e.timestamp.toISOString(),
      context: e.context,
    }),
  );
  writeFileSync(EVENTS, eventLines.length ? eventLines.join('\n') + '\n' : '', 'utf8');

  // 2. Wikivoyage lookup: map app Destination → wv-<lang>-<destino_id>.
  const wv = await prisma.wvDestination.findMany({
    select: {
      id: true,
      lang: true,
      slug: true,
      nome: true,
      pais: true,
      paisCode: true,
      continente: true,
      tipo: true,
      clima: true,
    },
  });
  const bySlug = new Map();
  const byNameCountry = new Map();
  const wvById = new Map();
  for (const d of wv) {
    wvById.set(d.id, d);
    if (d.slug) {
      if (!bySlug.has(d.slug)) bySlug.set(d.slug, []);
      bySlug.get(d.slug).push(d);
    }
    const key = `${d.nome.toLowerCase()}|${(d.paisCode ?? '').toUpperCase()}`;
    if (!byNameCountry.has(key)) byNameCountry.set(key, []);
    byNameCountry.get(key).push(d);
  }

  function resolveItem(appDest) {
    // Prefer pt, fall back to any lang.
    const pick = (list) => {
      if (!list) return null;
      const pt = list.find((d) => d.lang === 'pt');
      return pt ?? list[0];
    };
    const d = pick(bySlug.get(appDest.slug))
      ?? pick(byNameCountry.get(`${appDest.name.toLowerCase()}|${(appDest.countryCode ?? '').toUpperCase()}`));
    if (!d) return null;
    return { item_id: `wv-${d.lang}-${d.id}`, wv: d };
  }

  const destinations = await prisma.destination.findMany({
    select: { id: true, slug: true, name: true, countryCode: true },
  });
  const destToItem = new Map();
  let destUnmatched = 0;
  for (const dest of destinations) {
    const resolved = resolveItem(dest);
    if (resolved) destToItem.set(dest.id, resolved.item_id);
    else destUnmatched += 1;
  }

  // 3. Interaction signals from the app's interactive tables.
  const interactionRows = [];

  const favorites = await prisma.favorite.findMany({
    where: { itemType: 'destination', destinationId: { not: null } },
    select: { userId: true, destinationId: true },
  });
  for (const f of favorites) {
    const item = destToItem.get(f.destinationId);
    if (item) interactionRows.push([f.userId, item, SCORE.favorite]);
  }

  const saved = await prisma.savedItinerary.findMany({
    where: { deletedAt: null, destinationId: { not: null } },
    select: { userId: true, destinationId: true },
  });
  for (const s of saved) {
    const item = destToItem.get(s.destinationId);
    if (item) interactionRows.push([s.userId, item, SCORE.saved]);
  }

  const reviews = await prisma.review.findMany({
    where: { deletedAt: null, reviewStatus: 'APPROVED', destinationId: { not: null } },
    select: { userId: true, destinationId: true, rating: true },
  });
  for (const r of reviews) {
    if (r.rating == null) continue;
    const item = destToItem.get(r.destinationId);
    if (item) interactionRows.push([r.userId, item, r.rating]);
  }

  const bookings = await prisma.booking.findMany({
    where: {
      deletedAt: null,
      destinationId: { not: null },
      bookingStatus: { in: ['CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED'] },
    },
    select: { userId: true, destinationId: true },
  });
  for (const b of bookings) {
    const item = destToItem.get(b.destinationId);
    if (item) interactionRows.push([b.userId, item, SCORE.booked]);
  }

  // Planned (trip builder) — weaker intent than booking, stronger than a view.
  const planned = await prisma.tripDestination.findMany({
    select: { destinationId: true, trip: { select: { userId: true } } },
  });
  for (const td of planned) {
    const item = destToItem.get(td.destinationId);
    if (item && td.trip?.userId) interactionRows.push([td.trip.userId, item, SCORE.planned]);
  }

  // Recommendation click events from the web feedback loop (already ML item ids).
  const clicks = await prisma.recommendationEvent.findMany({
    where: { eventType: 'click', userId: { not: null } },
    select: { userId: true, itemId: true },
    distinct: ['userId', 'itemId'],
  });
  for (const c of clicks) {
    if (c.itemId.startsWith('wv-')) {
      interactionRows.push([c.userId, c.itemId, SCORE.clicked]);
    }
  }

  const realInteractions = dedupeInteractions(interactionRows);

  // 3b. Optional retention prune — only after clicks were exported above.
  let pruned = 0;
  if (Number.isFinite(pruneEventsDays) && pruneEventsDays > 0) {
    const cutoff = new Date(Date.now() - pruneEventsDays * 86_400_000);
    const removed = await prisma.recommendationEvent.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
    pruned = removed.count;
    console.log(`Pruned ${pruned} recommendation_events older than ${pruneEventsDays} days (cutoff ${cutoff.toISOString()}).`);
  }

  // 4. Merge with existing files (or start fresh).
  let allInteractions = fresh ? realInteractions : [...loadCsv(INTERACTIONS), ...realInteractions];
  allInteractions = dedupeInteractions(allInteractions);

  // Items referenced by interactions need a row in items.csv.
  const referencedItemIds = new Set(allInteractions.map(([, item_id]) => item_id));
  const newItems = [];
  for (const [destId, itemId] of destToItem.entries()) {
    if (!referencedItemIds.has(itemId)) continue;
    const dest = destinations.find((d) => d.id === destId);
    const resolved = resolveItem(dest);
    if (!resolved) continue;
    const { wv: d } = resolved;
    newItems.push(wvItemRow(itemId, d));
  }

  // Click-event item ids are already `wv-<lang>-<id>`; resolve their catalog
  // rows directly (they may have no app Destination counterpart).
  for (const itemId of referencedItemIds) {
    if (!itemId.startsWith('wv-')) continue;
    const m = /^wv-([a-z]{2})-(\d+)$/.exec(itemId);
    const d = m ? wvById.get(Number(m[2])) : undefined;
    if (d) newItems.push(wvItemRow(`wv-${d.lang}-${d.id}`, d));
  }

  let allItems = fresh ? [] : loadCsv(ITEMS);
  allItems = dedupeItems([...allItems, ...newItems]);

  // 5. Write files (header + rows).
  writeFileSync(INTERACTIONS, 'user_id,item_id,score\n' + allInteractions.map((r) => r.map(escapeCsv).join(',')).join('\n') + '\n', 'utf8');
  writeFileSync(ITEMS, 'item_id,type,subtype,tags,nome,pais,continente,clima\n' + allItems.map((r) => r.map(escapeCsv).join(',')).join('\n') + '\n', 'utf8');

  const meta = {
    exportedAt: new Date().toISOString(),
    fresh,
    pruned_recommendation_events: pruned,
    preference_events: events.length,
    interactions_real: realInteractions.length,
    interactions_total: allInteractions.length,
    items_total: allItems.length,
    destinations_matched: destToItem.size,
    destinations_unmatched: destUnmatched,
    recommendation_clicks: clicks.length,
    planned_trips: planned.length,
  };
  writeFileSync(resolve(ML_DATA, 'signal_export_meta.json'), JSON.stringify(meta, null, 2));

  console.log('DB signal export —', JSON.stringify(meta, null, 2));
  if (verbose) {
    console.log('  preference_events.jsonl →', EVENTS);
    console.log('  interactions.csv        →', INTERACTIONS);
    console.log('  items.csv               →', ITEMS);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());