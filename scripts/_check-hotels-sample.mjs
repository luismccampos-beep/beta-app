import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
try {
  // Distribution by fonte (source)
  const byFonte = await p.$queryRaw`
    SELECT fonte, COUNT(*)::int as total
    FROM wv_hotels
    GROUP BY fonte
    ORDER BY total DESC
    LIMIT 20
  `;
  console.log('\n=== Hotéis por fonte (origem) ===');
  console.table(byFonte);

  // Sample of real hotels
  const sample = await p.wvHotel.findMany({
    take: 10,
    where: { fonte: { not: 'rejected_geo' } },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      nome: true,
      estrelas: true,
      precoPorNoite: true,
      fonte: true,
      latitude: true,
      longitude: true,
      googlePlaceId: true,
      wikidataId: true,
      destino: { select: { nome: true, pais: true } }
    }
  });
  console.log('\n=== Amostra de hotéis (primeiros 10) ===');
  sample.forEach(h => {
    console.log(`  [${h.id}] ${h.nome} | ${h.destino?.nome}, ${h.destino?.pais}`);
    console.log(`       ${h.estrelas}★ | €${h.precoPorNoite}/noite | fonte=${h.fonte ?? 'null'} | geo=${h.latitude ? `${h.latitude},${h.longitude}` : 'sem coords'} | googlePlaceId=${h.googlePlaceId ?? 'N/A'}`);
  });

  // Check hotels with Google Place IDs (proven real)
  const withGoogle = await p.wvHotel.count({ where: { googlePlaceId: { not: null } } });
  const withWikidata = await p.wvHotel.count({ where: { wikidataId: { not: null } } });
  const withDescription = await p.wvHotel.count({ where: { description: { not: null } } });
  const withImage = await p.wvHotel.count({ where: { imageUrl: { not: null } } });

  console.log('\n=== Indicadores de qualidade ===');
  console.log(`  Com Google Place ID: ${withGoogle}`);
  console.log(`  Com Wikidata ID:     ${withWikidata}`);
  console.log(`  Com descrição:       ${withDescription}`);
  console.log(`  Com imagem:          ${withImage}`);

} catch(e) {
  console.error('Erro:', e.message);
} finally {
  await p.$disconnect();
}
