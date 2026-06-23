import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = process.argv.slice(2);
const inputPath = args.find(a => !a.startsWith('--'));
const dryRun = args.includes('--dry-run');

if (!inputPath) {
  console.error('Usage: node scripts/import-gmaps-scraper.mjs <caminho-do-json> [--dry-run]');
  console.error('  <caminho-do-json>  Path to hoteis_resultado_*.json or hoteis_coletados_*.json');
  console.error('  --dry-run          Apenas mostra o que seria importado, sem escrever na BD');
  process.exit(1);
}

const { loadProjectEnv } = await import('./lib/load-env.mjs');
loadProjectEnv(ROOT);

const prisma = new PrismaClient();

function parseEstrelas(hotel) {
  const category = hotel.categories?.[0] || '';
  const match = category.match(/(\d+)\s*estrelas?/i);
  if (match) return Math.min(parseInt(match[1]), 5) || 3;

  const rating = hotel.rating;
  if (rating != null && typeof rating === 'number') {
    if (rating >= 4.5) return 5;
    if (rating >= 3.5) return 4;
    if (rating >= 2.5) return 3;
    if (rating >= 1.5) return 2;
    return 1;
  }
  return 3;
}

function buildComodidades(hotel) {
  const comodidades = {};
  if (hotel.website) comodidades.website = hotel.website;
  if (hotel.phone) comodidades.phone = hotel.phone;
  if (hotel.rating != null) comodidades.rating = hotel.rating;
  if (hotel.reviews_count != null) comodidades.reviews_count = hotel.reviews_count;
  if (hotel.categories?.length) comodidades.categories = hotel.categories;
  if (hotel.hours) comodidades.hours = hotel.hours;
  if (hotel.link) comodidades.gmaps_link = hotel.link;
  if (hotel.reviews_url) comodidades.reviews_url = hotel.reviews_url;
  if (hotel.thumbnail) comodidades.thumbnail = hotel.thumbnail;
  if (hotel.address) comodidades.address = hotel.address;
  if (hotel.info) comodidades.raw_info = hotel.info;
  return comodidades;
}

async function getNextId() {
  const result = await prisma.$queryRawUnsafe`SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM wv_hotels`;
  return Number(result[0].next_id);
}

async function importar() {
  console.log(`=== Import Google Maps Scraper ===\n`);
  console.log(`Input: ${inputPath}`);
  if (dryRun) console.log('Modo: DRY RUN (sem escrita)');
  console.log();

  const content = readFileSync(inputPath, 'utf8');
  const data = JSON.parse(content);

  let nextId = dryRun ? 0 : await getNextId();
  let totalInseridos = 0;
  let totalAtualizados = 0;
  let totalIgnorados = 0;
  let totalCidades = data.length;
  let totalHoteisEncontrados = 0;

  for (const cidade of data) {
    const destinoId = cidade.cidade_id;
    const hoteis = cidade.hoteis || [];

    if (!destinoId) {
      console.log(`  ⚠ Cidade sem ID: ${cidade.cidade_nome || 'desconhecida'}, ignorada`);
      continue;
    }

    for (const hotel of hoteis) {
      if (!hotel.name) continue;
      totalHoteisEncontrados++;

      const nome = hotel.name.trim();
      const googlePlaceId = hotel.place_id || null;
      const latitude = hotel.coordinates?.latitude ?? hotel.coordinates?.lat ?? null;
      const longitude = hotel.coordinates?.longitude ?? hotel.coordinates?.lng ?? null;
      const description = hotel.address || null;
      const imageUrl = hotel.thumbnail || null;
      const estrelas = parseEstrelas(hotel);
      const comodidades = buildComodidades(hotel);

      if (googlePlaceId) {
        const existing = await prisma.wvHotel.findFirst({
          where: { googlePlaceId }
        });

        if (existing) {
          if (!dryRun) {
            await prisma.wvHotel.update({
              where: { id: existing.id },
              data: {
                nome,
                destinoId,
                estrelas,
                latitude: latitude ?? existing.latitude,
                longitude: longitude ?? existing.longitude,
                description: description ?? existing.description,
                imageUrl: imageUrl ?? existing.imageUrl,
                comodidades
              }
            });
          }
          totalAtualizados++;
          continue;
        }
      }

      const existingByName = await prisma.wvHotel.findFirst({
        where: { nome, destinoId }
      });

      if (existingByName) {
        if (!dryRun) {
          await prisma.wvHotel.update({
            where: { id: existingByName.id },
            data: {
              estrelas,
              latitude: latitude ?? existingByName.latitude,
              longitude: longitude ?? existingByName.longitude,
              description: description ?? existingByName.description,
              imageUrl: imageUrl ?? existingByName.imageUrl,
              comodidades,
              googlePlaceId: googlePlaceId ?? existingByName.googlePlaceId
            }
          });
        }
        totalAtualizados++;
        continue;
      }

      if (dryRun) {
        totalInseridos++;
        continue;
      }

      const id = nextId++;
      try {
        await prisma.wvHotel.create({
          data: {
            id,
            destinoId,
            nome,
            estrelas,
            precoPorNoite: 0,
            comodidades,
            fonte: 'google_maps_scraper',
            latitude,
            longitude,
            description,
            imageUrl,
            googlePlaceId
          }
        });
        totalInseridos++;
      } catch (err) {
        if (err.code === 'P2002') {
          totalIgnorados++;
        } else {
          console.error(`  Erro ao inserir "${nome}" (id=${id}): ${err.message}`);
        }
      }
    }
  }

  console.log('\n=== Resumo ===');
  console.log(`Cidades processadas: ${totalCidades}`);
  console.log(`Hotéis encontrados:  ${totalHoteisEncontrados}`);
  console.log(`Inseridos:           ${totalInseridos}`);
  console.log(`Atualizados:         ${totalAtualizados}`);
  console.log(`Ignorados (dup):     ${totalIgnorados}`);

  await prisma.$disconnect();
}

importar().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
