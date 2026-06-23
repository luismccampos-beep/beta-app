import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const destinos = await prisma.$queryRaw`SELECT COUNT(*) as count FROM wv_destinations`;
  const hoteis = await prisma.$queryRaw`SELECT COUNT(*) as count FROM wv_hotels`;
  const voos = await prisma.$queryRaw`SELECT COUNT(*) as count FROM wv_flights`;
  console.log('destinos:', destinos[0].count);
  console.log('hoteis:', hoteis[0].count);
  console.log('voos:', voos[0].count);
  await prisma.$disconnect();
}

main().catch(console.error);