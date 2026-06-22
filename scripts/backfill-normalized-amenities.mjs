/**
 * Backfill script: populates WvHotelAmenity and HotelAmenity tables
 * from existing JSON fields (comodidades / amenities).
 *
 * Run: node scripts/backfill-normalized-amenities.mjs
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backfillWvHotelAmenities() {
  console.log('→ Backfilling WvHotelAmenity from WvHotel.comodidades...');

  const hotels = await prisma.wvHotel.findMany({
    select: { id: true, comodidades: true },
  });

  let total = 0;
  for (const hotel of hotels) {
    const amenities = Array.isArray(hotel.comodidades)
      ? hotel.comodidades.filter((a) => typeof a === 'string')
      : [];

    if (amenities.length === 0) continue;

    const rows = amenities.map((name) => ({
      wvHotelId: hotel.id,
      name: name.trim().toLowerCase(),
    }));

    // Skip existing
    const existing = await prisma.wvHotelAmenity.findMany({
      where: { wvHotelId: hotel.id },
      select: { name: true },
    });
    const existingNames = new Set(existing.map((r) => r.name));

    const toInsert = rows.filter((r) => !existingNames.has(r.name));
    if (toInsert.length === 0) continue;

    await prisma.wvHotelAmenity.createMany({ data: toInsert, skipDuplicates: true });
    total += toInsert.length;
  }

  console.log(`  ✓ ${total} WvHotelAmenity rows inserted`);
}

async function backfillHotelAmenities() {
  console.log('→ Backfilling HotelAmenity from Hotel.amenities...');

  const hotels = await prisma.hotel.findMany({
    select: { id: true, amenities: true },
  });

  let total = 0;
  for (const hotel of hotels) {
    const amenities = Array.isArray(hotel.amenities)
      ? hotel.amenities.filter((a) => typeof a === 'string')
      : [];

    if (amenities.length === 0) continue;

    const rows = amenities.map((name) => ({
      hotelId: hotel.id,
      name: name.trim().toLowerCase(),
    }));

    const existing = await prisma.hotelAmenity.findMany({
      where: { hotelId: hotel.id },
      select: { name: true },
    });
    const existingNames = new Set(existing.map((r) => r.name));

    const toInsert = rows.filter((r) => !existingNames.has(r.name));
    if (toInsert.length === 0) continue;

    await prisma.hotelAmenity.createMany({ data: toInsert, skipDuplicates: true });
    total += toInsert.length;
  }

  console.log(`  ✓ ${total} HotelAmenity rows inserted`);
}

async function main() {
  console.log('=== Backfill Normalized Amenities ===\n');

  await backfillWvHotelAmenities();
  await backfillHotelAmenities();

  console.log('\n✓ Done.');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
