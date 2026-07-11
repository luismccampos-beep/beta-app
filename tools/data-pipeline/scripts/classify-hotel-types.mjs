#!/usr/bin/env node
/**
 * Classify wv_hotels into accommodation types based on name patterns.
 *
 * Types: hotel, resort, apartamento, guest_house, camping, hostel, motel, pousada
 *
 * Usage:
 *   node scripts/classify-hotel-types.mjs --dry-run --limit 100
 *   node scripts/classify-hotel-types.mjs --limit 5000
 *   node scripts/classify-hotel-types.mjs          # all hotels
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── Classification patterns (order matters — first match wins) ──
const TYPE_PATTERNS = [
  { tipo: 'resort',       re: /\b(resort|resorts|resid(?:ence|encia)\s+resort)\b/i },
  { tipo: 'camping',      re: /\b(camping|campsite|glamping|caravan|ref[uú]gio|hut\b|cabana\b)\b/i },
  { tipo: 'apartamento',  re: /\b(apartamento|apartment|apart-?hotel|aparthotel|flat\b|studio\b|loft\b)\b/i },
  { tipo: 'guest_house',  re: /\b(guest\s*house|guesthouse|pensi[oóó]n|pens[aã]o|hospedaria|bed\s*(?:&|and)\s*breakfast|b&b|ryokan|auberge|herberg)\b/i },
  { tipo: 'hostel',       re: /\b(hostel|albergue|dorm\b)\b/i },
  { tipo: 'motel',        re: /\b(motel)\b/i },
  { tipo: 'pousada',      re: /\b(pousada|parador|posada|hostal|fonda)\b/i },
  { tipo: 'eco_lodge',    re: /\b(eco-?lodge|eco-?hotel|lodge\b)\b/i },
  { tipo: 'villa',        re: /\b(villa\b|chalet\b|cottage\b|bungalow\b)\b/i },
  // Default hotel pattern — catches "hotel", "inn", "suites", etc.
  { tipo: 'hotel',        re: /\b(hotel|inn\b|suites?\b|lodging|alojamento)\b/i },
];

function classifyHotelName(nome) {
  const n = nome.trim();
  for (const { tipo, re } of TYPE_PATTERNS) {
    if (re.test(n)) return tipo;
  }
  return 'hotel'; // default
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const limitArg = args.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : undefined;

  console.log(`\n🏷️  Hotel Type Classification${dryRun ? ' (DRY RUN)' : ''}`);
  console.log('─'.repeat(50));

  // Count unclassified hotels
  const unclassified = await prisma.wvHotel.count({
    where: { tipoAlojamento: null },
  });
  console.log(`Hotels without classification: ${unclassified}`);

  if (unclassified === 0) {
    console.log('✅ All hotels already classified!');
    await prisma.$disconnect();
    return;
  }

  const batchSize = limit ?? unclassified;
  const hotels = await prisma.wvHotel.findMany({
    where: { tipoAlojamento: null },
    select: { id: true, nome: true },
    take: batchSize,
    orderBy: { id: 'asc' },
  });

  console.log(`Processing ${hotels.length} hotels...\n`);

  // Classify
  const updates = [];
  const stats = {};
  for (const h of hotels) {
    const tipo = classifyHotelName(h.nome);
    updates.push({ id: h.id, tipo });
    stats[tipo] = (stats[tipo] ?? 0) + 1;
  }

  // Show stats
  console.log('Classification breakdown:');
  for (const [tipo, count] of Object.entries(stats).sort((a, b) => b[1] - a[1])) {
    const bar = '█'.repeat(Math.min(Math.ceil(count / Math.max(...Object.values(stats)) * 30), 30));
    console.log(`  ${tipo.padEnd(16)} ${String(count).padStart(6)}  ${bar}`);
  }

  if (dryRun) {
    console.log(`\n🔍 Dry run — no changes written.`);
    console.log(`\nSample classifications:`);
    for (const u of updates.slice(0, 15)) {
      const h = hotels.find((x) => x.id === u.id);
      console.log(`  [${u.tipo.padEnd(14)}] ${h?.nome}`);
    }
  } else {
    // Batch update
    let done = 0;
    const BATCH = 500;
    for (let i = 0; i < updates.length; i += BATCH) {
      const chunk = updates.slice(i, i + BATCH);
      await Promise.all(
        chunk.map((u) =>
          prisma.wvHotel.update({
            where: { id: u.id },
            data: { tipoAlojamento: u.tipo },
          }),
        ),
      );
      done += chunk.length;
      process.stdout.write(`\r  Updated ${done}/${updates.length}`);
    }
    console.log(`\n✅ Classified ${updates.length} hotels.`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
