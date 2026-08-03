#!/usr/bin/env node

/**
 * Script de enriquecimento de vídeos para destinos
 * Busca vídeos no Wikimedia Commons via categoria (Wikidata P373)
 * 
 * Uso:
 *   node scripts/enrich-destination-videos.mjs --only-missing --limit=100
 *   node scripts/enrich-destination-videos.mjs --country=PT --dry-run
 *   node scripts/enrich-destination-videos.mjs --force --concurrency=10
 */

import { PrismaClient } from '@akmleva/db';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// ─────────────────────────── config ───────────────────────────

const DEFAULT_CONCURRENCY = 5;
const DEFAULT_LIMIT = 100;
const WIKIMEDIA_API_BASE = 'https://commons.wikimedia.org/w/api.php';

// ─────────────────────────── argumentos ───────────────────────

const args = process.argv.slice(2);
const options = {
  onlyMissing: args.includes('--only-missing'),
  force: args.includes('--force'),
  dryRun: args.includes('--dry-run'),
  limit: parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || String(DEFAULT_LIMIT), 10),
  concurrency: parseInt(args.find(a => a.startsWith('--concurrency='))?.split('=')[1] || String(DEFAULT_CONCURRENCY), 10),
  country: args.find(a => a.startsWith('--country='))?.split('=')[1],
};

// ─────────────────────────── helpers ──────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchCommonsCategory(wikidataId) {
  try {
    const url = new URL(WIKIMEDIA_API_BASE);
    url.searchParams.set('action', 'query');
    url.searchParams.set('prop', 'pageprops');
    url.searchParams.set('titles', `Category:${wikidataId}`);
    url.searchParams.set('format', 'json');
    url.searchParams.set('origin', '*');

    const response = await fetch(url.toString());
    const data = await response.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    const page = Object.values(pages)[0];
    return page.pageprops?.wikibase_item || null;
  } catch (error) {
    console.error(`Erro ao buscar categoria Commons para ${wikidataId}:`, error);
    return null;
  }
}

async function fetchCommonsVideos(commonsCategory, limit = 8) {
  try {
    const url = new URL(WIKIMEDIA_API_BASE);
    url.searchParams.set('action', 'query');
    url.searchParams.set('list', 'categorymembers');
    url.searchParams.set('cmtitle', `Category:${commonsCategory}`);
    url.searchParams.set('cmtype', 'file');
    url.searchParams.set('cmlimit', String(limit * 2));
    url.searchParams.set('format', 'json');
    url.searchParams.set('origin', '*');

    const response = await fetch(url.toString());
    const data = await response.json();

    const files = (data.query?.categorymembers ?? [])
      .filter((f) => /\.(webm|ogv|mp4)$/i.test(f.title))
      .slice(0, limit);

    return files;
  } catch (error) {
    console.error(`Erro ao buscar vídeos da categoria ${commonsCategory}:`, error);
    return [];
  }
}

function buildVideoUrl(filename) {
  const encoded = encodeURIComponent(filename.replace(/^File:/, ''));
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}`;
}

// ─────────────────────────── processamento ────────────────────

async function processDestination(destino) {
  // Verificar se já tem vídeos
  if (!options.force) {
    const existingVideos = await prisma.wvDestinationVideo.count({
      where: { destinoId: destino.id }
    });
    if (existingVideos > 0 && options.onlyMissing) {
      return false; // Pular
    }
  }

  // Buscar categoria Commons via Wikidata P373
  const commonsCategory = await fetchCommonsCategory(destino.wikidataId);
  if (!commonsCategory) {
    console.log(`  ⚠️  ${destino.nome}: sem categoria Commons (P373)`);
    return false;
  }

  // Buscar vídeos da categoria
  const videoFiles = await fetchCommonsVideos(commonsCategory, 4);
  if (videoFiles.length === 0) {
    console.log(`  ⚠️  ${destino.nome}: sem vídeos na categoria ${commonsCategory}`);
    return false;
  }

  console.log(`  ✓ ${destino.nome}: ${videoFiles.length} vídeo(s) encontrado(s)`);

  if (options.dryRun) {
    console.log(`    [DRY RUN] Vídeos:`, videoFiles.map((f) => f.title));
    return true;
  }

  // Salvar no banco de dados
  for (let i = 0; i < videoFiles.length; i++) {
    const file = videoFiles[i];
    const filename = file.title.replace(/^File:/, '');

    await prisma.wvDestinationVideo.upsert({
      where: {
        id: `${destino.id}-${i}`
      },
      update: {
        url: buildVideoUrl(file.title),
        author: file.user ?? null,
        license: 'CC BY-SA',
        source: 'wikimedia',
        sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(file.title)}`,
        isVerified: true,
      },
      create: {
        destinoId: destino.id,
        url: buildVideoUrl(file.title),
        author: file.user ?? null,
        license: 'CC BY-SA',
        source: 'wikimedia',
        sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(file.title)}`,
        isVerified: true,
      },
    });
  }

  return true;
}

// ─────────────────────────── main ─────────────────────────────

async function main() {
  console.log('🎬 Enriquecimento de Vídeos - Wikimedia Commons');
  console.log('━'.repeat(60));
  console.log('Opções:', {
    onlyMissing: options.onlyMissing,
    force: options.force,
    dryRun: options.dryRun,
    limit: options.limit,
    concurrency: options.concurrency,
    country: options.country || 'todos',
  });
  console.log('━'.repeat(60));

  // Buscar destinos
  const where = {
    wikidataId: { not: null },
  };

  if (options.country) {
    where.paisCode = options.country.toUpperCase();
  }

  const destinos = await prisma.wvDestination.findMany({
    where,
    select: {
      id: true,
      nome: true,
      wikidataId: true,
      paisCode: true,
    },
    take: options.limit,
  });

  console.log(`📊 ${destinos.length} destinos encontrados\n`);

  if (destinos.length === 0) {
    console.log('Nenhum destino encontrado com os filtros especificados.');
    return;
  }

  // Processar em lotes (concorrência limitada)
  let processed = 0;
  let success = 0;
  let skipped = 0;

  for (let i = 0; i < destinos.length; i += options.concurrency) {
    const batch = destinos.slice(i, i + options.concurrency);
    
    const results = await Promise.allSettled(
      batch.map(dest => processDestination(dest))
    );

    for (const result of results) {
      processed++;
      if (result.status === 'fulfilled' && result.value) {
        success++;
      } else {
        skipped++;
      }
    }

    // Rate limiting
    if (i + options.concurrency < destinos.length) {
      await sleep(1000);
    }
  }

  // Resumo
  console.log('\n' + '━'.repeat(60));
  console.log('📈 Resumo:');
  console.log(`  Total processados: ${processed}`);
  console.log(`  ✓ Com vídeos: ${success}`);
  console.log(`  ⚠️  Sem vídeos: ${skipped}`);
  if (options.dryRun) {
    console.log('  [DRY RUN] Nenhuma alteração feita no banco');
  }
  console.log('━'.repeat(60));
}

// ─────────────────────────── execução ─────────────────────────

main()
  .catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });