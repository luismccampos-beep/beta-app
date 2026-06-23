import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
loadProjectEnv(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const p = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } } });
try {
  const [total, withCoords, geoFound, geoNotFound, geoWrong, rejected, pending] = await Promise.all([
    p.wvHotel.count(),
    p.wvHotel.count({ where: { latitude: { not: null } } }),
    p.wvHotel.count({ where: { fonte: 'geo_found' } }),
    p.wvHotel.count({ where: { fonte: 'geo_not_found' } }),
    p.wvHotel.count({ where: { fonte: 'geo_wrong_country' } }),
    p.wvHotel.count({ where: { fonte: 'rejected_geo' } }),
    p.wvHotel.count({ where: { latitude: null, AND: [{ OR: [{ fonte: null }, { fonte: { notIn: ['rejected_geo','geo_not_found','geo_found','geo_wrong_country'] } }] }] } }),
  ]);
  console.log('\n=== Estado atual wv_hotels ===');
  console.log(`  Total              : ${total.toLocaleString()}`);
  console.log(`  Com coordenadas    : ${withCoords.toLocaleString()} (${(withCoords/total*100).toFixed(1)}%)`);
  console.log(`  geo_found          : ${geoFound.toLocaleString()}`);
  console.log(`  geo_not_found      : ${geoNotFound.toLocaleString()}`);
  console.log(`  geo_wrong_country  : ${geoWrong.toLocaleString()}`);
  console.log(`  rejected_geo       : ${rejected.toLocaleString()}`);
  console.log(`  Pendentes (nunca tentados) : ${pending.toLocaleString()}`);
  const pct = ((withCoords/total)*100).toFixed(1);
  const remaining = total - withCoords;
  const ratePhoton = 50; // ~50 hotéis/seg com 10 workers Photon
  const etaMin = Math.round(remaining / ratePhoton / 60);
  console.log(`\n  Estimativa para geocodificar tudo com 10 workers: ~${etaMin} minutos`);
} finally { await p.$disconnect(); }
