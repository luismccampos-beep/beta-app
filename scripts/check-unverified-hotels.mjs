/**
 * List destinations that still have unverified hotels.
 * 
 * Unverified = hotels where fonte != 'rejected_geo'
 * (i.e., hotels that haven't been processed by the geo verification script yet,
 *  or were processed and passed verification)
 * 
 * Usage:
 *   npm run travel:catalog:check-unverified-hotels
 */

import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';

loadProjectEnv();

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

async function main() {
  // Find destinations that have at least one unverified hotel
  const destinations = await prisma.$queryRaw`
    SELECT 
      d.id,
      d.nome AS destination_name,
      d.pais AS country,
      d.pais_code AS country_code,
      COUNT(h.id) AS total_hotels,
      COUNT(CASE WHEN h.fonte != 'rejected_geo' OR h.fonte IS NULL THEN 1 END) AS unverified_hotels,
      COUNT(CASE WHEN h.fonte = 'rejected_geo' THEN 1 END) AS rejected_hotels
    FROM wv_destinations d
    INNER JOIN wv_hotels h ON h.destino_id = d.id
    GROUP BY d.id, d.nome, d.pais, d.pais_code
    HAVING COUNT(CASE WHEN h.fonte != 'rejected_geo' OR h.fonte IS NULL THEN 1 END) > 0
    ORDER BY d.pais, d.nome
  `;

  console.log('\n=== Destinos com hotéis não verificados ===\n');
  console.log(`Total de destinos: ${destinations.length}\n`);

  // Write to CSV file
  const outputDir = join(process.cwd(), 'data', 'reports');
  mkdirSync(outputDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const csvPath = join(outputDir, `unverified-hotels-${timestamp}.csv`);
  
  const csvHeader = 'destination_id;destination_name;country;country_code;total_hotels;unverified_hotels;rejected_hotels;pending_percentage\n';
  const csvRows = destinations.map(dest => {
    const total = parseInt(dest.total_hotels);
    const unverified = parseInt(dest.unverified_hotels);
    const rejected = parseInt(dest.rejected_hotels);
    const pct = total > 0 ? Math.round((unverified / total) * 100) : 0;
    return `${dest.id};"${dest.destination_name}";"${dest.country}";${dest.country_code};${total};${unverified};${rejected};${pct}%`;
  }).join('\n');
  
  writeFileSync(csvPath, csvHeader + csvRows, 'utf-8');
  console.log(`📄 Relatório guardado em: ${csvPath}\n`);

  // Group by country
  const byCountry = destinations.reduce((acc, dest) => {
    const country = dest.country || 'Desconhecido';
    if (!acc[country]) acc[country] = [];
    acc[country].push(dest);
    return acc;
  }, {});

  for (const [country, dests] of Object.entries(byCountry).sort()) {
    console.log(`\n📍 ${country} (${dests.length} destinos)`);
    console.log('─'.repeat(80));
    
    for (const dest of dests) {
      const total = parseInt(dest.total_hotels);
      const unverified = parseInt(dest.unverified_hotels);
      const rejected = parseInt(dest.rejected_hotels);
      const pct = total > 0 ? Math.round((unverified / total) * 100) : 0;
      
      console.log(`  • ${dest.destination_name}`);
      console.log(`    Total: ${total} | Não verificados: ${unverified} | Rejeitados: ${rejected} | ${pct}% pendente`);
    }
  }

  // Summary stats
  const totalHotels = await prisma.wvHotel.count();
  const unverifiedHotels = await prisma.wvHotel.count({
    where: {
      OR: [
        { fonte: null },
        { fonte: { not: 'rejected_geo' } }
      ]
    }
  });
  const rejectedHotels = await prisma.wvHotel.count({
    where: { fonte: 'rejected_geo' }
  });

  console.log('\n=== Resumo Geral ===');
  console.log(`Total de hotéis na base: ${totalHotels}`);
  console.log(`Hotéis não verificados: ${unverifiedHotels} (${Math.round((unverifiedHotels/totalHotels)*100)}%)`);
  console.log(`Hotéis rejeitados: ${rejectedHotels} (${Math.round((rejectedHotels/totalHotels)*100)}%)`);
  console.log(`Destinos com hotéis não verificados: ${destinations.length}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });