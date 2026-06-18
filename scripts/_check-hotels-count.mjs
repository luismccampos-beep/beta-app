import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
try {
  const hotels = await p.wvHotel.count();
  const dests = await p.wvDestination.count();
  const hotelsGeo = await p.wvHotel.count({ where: { latitude: { not: null } } });
  const hotelsRejected = await p.wvHotel.count({ where: { fonte: 'rejected_geo' } });
  console.log('Total wv_hotels:', hotels);
  console.log('  Com coordenadas:', hotelsGeo);
  console.log('  Rejeitados (geo):', hotelsRejected);
  console.log('Total wv_destinations:', dests);
} catch(e) {
  console.error('Erro:', e.message);
} finally {
  await p.$disconnect();
}
