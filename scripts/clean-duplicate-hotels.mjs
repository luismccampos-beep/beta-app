/**
 * Limpa hotéis duplicados em wv_hotels.
 * Estratégia: agrupa por (destino_id, nome normalizado), guarda o melhor e mergeia dados dos outros.
 *
 *   node scripts/clean-duplicate-hotels.mjs --dry-run
 *   node scripts/clean-duplicate-hotels.mjs --dry-run --limit=500
 *   node scripts/clean-duplicate-hotels.mjs --dry-run --mixed-only
 *   node scripts/clean-duplicate-hotels.mjs --dry-run --same-fonte-only
 *   node scripts/clean-duplicate-hotels.mjs --dry-run --top-destinos=50
 *
 *   node scripts/clean-duplicate-hotels.mjs                  # executa (sem dry-run)
 *   node scripts/clean-duplicate-hotels.mjs --batch=200       # batch size
 */
import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

loadProjectEnv(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const DRY_RUN = process.argv.includes('--dry-run');
const MIXED_ONLY = process.argv.includes('--mixed-only');
const SAME_FONTE_ONLY = process.argv.includes('--same-fonte-only');
const NO_MERGE = process.argv.includes('--no-merge');

const limitArg = process.argv.find((a) => a.startsWith('--limit'));
const LIMIT = limitArg
  ? parseInt(limitArg.split('=')[1] ?? process.argv[process.argv.indexOf('--limit') + 1], 10)
  : Infinity;

const batchArg = process.argv.find((a) => a.startsWith('--batch'));
const BATCH = batchArg
  ? parseInt(batchArg.split('=')[1] ?? process.argv[process.argv.indexOf('--batch') + 1], 10)
  : 200;

const topArg = process.argv.find((a) => a.startsWith('--top-destinos'));
const TOP_DESTINOS = topArg
  ? parseInt(topArg.split('=')[1] ?? process.argv[process.argv.indexOf('--top-destinos') + 1], 10)
  : null;

/**
 * Normaliza nome removendo acentos, lowercase, só alfanumérico.
 */
function fold(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ');
}

/**
 * Escolhe o "melhor" hotel de um grupo para guardar.
 * Prioridade: tem coordenadas > tem mais dados > id mais baixo.
 */
function pickBest(hotels) {
  if (hotels.length <= 1) return { keep: hotels[0], remove: [] };

  // Score each hotel: coords (10), description (5), imageUrl (3), wikidataId (2), googlePlaceId (2)
  const scored = hotels.map((h) => {
    let score = 0;
    if (h.latitude != null && h.longitude != null) score += 10;
    if (h.description) score += 5;
    if (h.imageUrl) score += 3;
    if (h.wikidataId) score += 2;
    if (h.googlePlaceId) score += 2;
    // Prefer wikivoyage-listing over synthetic/null
    if (h.fonte === 'wikivoyage-listing') score += 1;
    if (h.fonte === 'wikivoyage-en' || h.fonte === 'wikivoyage-pt') score += 1;
    return { ...h, _score: score };
  });

  // Sort by score desc, then by id asc (keep oldest if tied)
  scored.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score;
    return a.id - b.id;
  });

  return { keep: scored[0], remove: scored.slice(1) };
}

/**
 * Mergeia dados de removed → keeper. Retorna campos a atualizar no keeper.
 */
function mergeData(keeper, removed) {
  const updates = {};

  // Merge fonte: append other fontes if different (keep under 40 chars)
  const fontes = new Set([keeper.fonte, ...removed.map((r) => r.fonte)].filter(Boolean));
  if (fontes.size > 1) {
    let merged = [...fontes].join('+');
    if (merged.length > 40) {
      merged = [...fontes].slice(0, 2).join('+');
      if (merged.length > 40) merged = [...fontes][0];
    }
    updates.fonte = merged;
  }

  // Merge description: use longest
  const bestDesc = removed.reduce(
    (best, r) => (r.description && (!best || r.description.length > best.length) ? r.description : best),
    keeper.description,
  );
  if (bestDesc && bestDesc !== keeper.description) {
    updates.description = bestDesc;
  }

  // Merge imageUrl: use first available
  if (!keeper.imageUrl) {
    const img = removed.find((r) => r.imageUrl)?.imageUrl;
    if (img) updates.imageUrl = img;
  }

  // Merge wikidataId
  if (!keeper.wikidataId) {
    const wd = removed.find((r) => r.wikidataId)?.wikidataId;
    if (wd) updates.wikidataId = wd;
  }

  // Merge googlePlaceId
  if (!keeper.googlePlaceId) {
    const gp = removed.find((r) => r.googlePlaceId)?.googlePlaceId;
    if (gp) updates.googlePlaceId = gp;
  }

  // Merge coords (if keeper lacks them)
  if (keeper.latitude == null || keeper.longitude == null) {
    const withCoords = removed.find((r) => r.latitude != null && r.longitude != null);
    if (withCoords) {
      updates.latitude = withCoords.latitude;
      updates.longitude = withCoords.longitude;
    }
  }

  // Merge estrelas: keep max
  const maxStars = removed.reduce((max, r) => Math.max(max, r.estrelas ?? 0), keeper.estrelas ?? 0);
  if (maxStars !== (keeper.estrelas ?? 0)) {
    updates.estrelas = maxStars;
  }

  return Object.keys(updates).length > 0 ? updates : null;
}

async function fetchDuplicateGroups(limit, mixedOnly, sameFonteOnly) {
  // Fetch all hotels with their normalized names using PostgreSQL
  let whereFonte = '';
  if (mixedOnly) {
    // Groups where fontes are NOT all the same
    whereFonte = 'AND EXISTS (SELECT 1 FROM wv_hotels h2 WHERE h2.destino_id = d.destino_id AND LOWER(REGEXP_REPLACE(UNACCENT(h2.nome), \'[^a-z0-9]\', \' \', \'g\')) = d.nome_norm AND h2.fonte IS DISTINCT FROM (SELECT h3.fonte FROM wv_hotels h3 WHERE h3.destino_id = d.destino_id AND LOWER(REGEXP_REPLACE(UNACCENT(h3.nome), \'[^a-z0-9]\', \' \', \'g\')) = d.nome_norm LIMIT 1))';
  } else if (sameFonteOnly) {
    // Groups where all fontes are the same
    whereFonte = 'AND NOT EXISTS (SELECT 1 FROM wv_hotels h2 WHERE h2.destino_id = d.destino_id AND LOWER(REGEXP_REPLACE(UNACCENT(h2.nome), \'[^a-z0-9]\', \' \', \'g\')) = d.nome_norm AND h2.fonte IS DISTINCT FROM (SELECT h3.fonte FROM wv_hotels h3 WHERE h3.destino_id = d.destino_id AND LOWER(REGEXP_REPLACE(UNACCENT(h3.nome), \'[^a-z0-9]\', \' \', \'g\')) = d.nome_norm LIMIT 1))';
  }

  const limitClause = limit < Infinity ? `LIMIT ${limit}` : '';

  const groups = await prisma.$queryRawUnsafe(`
    WITH normalized AS (
      SELECT
        id, destino_id, nome, fonte, latitude, longitude,
        wikidata_id, google_place_id, description, image_url,
        estrelas, preco_por_noite,
        LOWER(REGEXP_REPLACE(UNACCENT(nome), '[^a-z0-9]', ' ', 'g')) AS nome_norm
      FROM wv_hotels
    ),
    dup_keys AS (
      SELECT destino_id, nome_norm, COUNT(*)::int AS cnt
      FROM normalized
      GROUP BY destino_id, nome_norm
      HAVING COUNT(*) > 1
    ),
    ranked AS (
      SELECT
        n.*,
        ROW_NUMBER() OVER (PARTITION BY d.destino_id, d.nome_norm ORDER BY n.id) AS rn
      FROM normalized n
      JOIN dup_keys d ON n.destino_id = d.destino_id AND n.nome_norm = d.nome_norm
      ${whereFonte}
      ${limitClause}
    )
    SELECT
      destino_id,
      nome_norm,
      ARRAY_AGG(id ORDER BY id) AS ids,
      ARRAY_AGG(nome ORDER BY id) AS nomes,
      ARRAY_AGG(fonte ORDER BY id) AS fontes,
      ARRAY_AGG(latitude ORDER BY id) AS lats,
      ARRAY_AGG(longitude ORDER BY id) AS lons,
      ARRAY_AGG(wikidata_id ORDER BY id) AS wikis,
      ARRAY_AGG(google_place_id ORDER BY id) AS googles,
      ARRAY_AGG(description ORDER BY id) AS descriptions,
      ARRAY_AGG(image_url ORDER BY id) AS images,
      ARRAY_AGG(estrelas ORDER BY id) AS stars,
      COUNT(*)::int AS dup_count
    FROM ranked
    GROUP BY destino_id, nome_norm
    ORDER BY dup_count DESC, destino_id
  `);

  return groups;
}

async function main() {
  console.log(`🧹 Limpeza de hotéis duplicados${DRY_RUN ? ' [DRY-RUN]' : ''}`);
  if (MIXED_ONLY) console.log('   Modo: apenas grupos com fontes mistas');
  if (SAME_FONTE_ONLY) console.log('   Modo: apenas grupos com mesma fonte');
  if (NO_MERGE) console.log('   Modo: sem merge de dados (só apaga)');
  if (TOP_DESTINOS) console.log(`   Foco: top ${TOP_DESTINOS} destinos`);
  if (LIMIT < Infinity) console.log(`   Limite: ${LIMIT} grupos`);
  console.log(`   Batch: ${BATCH}\n`);

  // If targeting specific destinations, resolve their IDs first
  let targetDestIds = null;
  if (TOP_DESTINOS) {
    const topDests = await prisma.$queryRaw`
      WITH normalized AS (
        SELECT destino_id, LOWER(REGEXP_REPLACE(UNACCENT(nome), '[^a-z0-9]', ' ', 'g')) AS nome_norm
        FROM wv_hotels
      ),
      dup_keys AS (
        SELECT destino_id, nome_norm
        FROM normalized
        GROUP BY destino_id, nome_norm
        HAVING COUNT(*) > 1
      )
      SELECT d.id, COUNT(DISTINCT dk.nome_norm)::int AS grupos
      FROM dup_keys dk
      JOIN wv_destinations d ON d.id = dk.destino_id
      GROUP BY d.id
      ORDER BY grupos DESC
      LIMIT ${TOP_DESTINOS}
    `;
    targetDestIds = new Set(topDests.map((d) => d.id));
    console.log(`   Destinos focados: ${targetDestIds.size}\n`);
  }

  // Fetch groups in batches to avoid memory issues
  let totalKept = 0;
  let totalRemoved = 0;
  let totalMerged = 0;

  // Process in batches from DB
  let offset = 0;
  let batchNum = 0;

  while (true) {
    // Get one batch of duplicate groups
    const batch = await prisma.$queryRawUnsafe(`
      WITH normalized AS (
        SELECT
          id, destino_id, nome, fonte, latitude, longitude,
          wikidata_id, google_place_id, description, image_url,
          estrelas, preco_por_noite,
          LOWER(REGEXP_REPLACE(UNACCENT(nome), '[^a-z0-9]', ' ', 'g')) AS nome_norm
        FROM wv_hotels
      ),
      dup_keys AS (
        SELECT destino_id, nome_norm
        FROM normalized
        GROUP BY destino_id, nome_norm
        HAVING COUNT(*) > 1
        ${MIXED_ONLY ? `AND EXISTS (
          SELECT 1 FROM normalized n2
          WHERE n2.destino_id = normalized.destino_id
            AND n2.nome_norm = normalized.nome_norm
            AND n2.fonte IS DISTINCT FROM (
              SELECT n3.fonte FROM normalized n3
              WHERE n3.destino_id = normalized.destino_id
                AND n3.nome_norm = normalized.nome_norm
              LIMIT 1
            )
        )` : ''}
        ${SAME_FONTE_ONLY ? `AND NOT EXISTS (
          SELECT 1 FROM normalized n2
          WHERE n2.destino_id = normalized.destino_id
            AND n2.nome_norm = normalized.nome_norm
            AND n2.fonte IS DISTINCT FROM (
              SELECT n3.fonte FROM normalized n3
              WHERE n3.destino_id = normalized.destino_id
                AND n3.nome_norm = normalized.nome_norm
              LIMIT 1
            )
        )` : ''}
        ${targetDestIds ? `AND destino_id IN (${[...targetDestIds].join(',')})` : ''}
        ORDER BY destino_id, nome_norm
        LIMIT ${BATCH} OFFSET ${offset}
      ),
      group_hotels AS (
        SELECT n.*
        FROM normalized n
        JOIN dup_keys d ON n.destino_id = d.destino_id AND n.nome_norm = d.nome_norm
      )
      SELECT
        destino_id,
        nome_norm,
        ARRAY_AGG(id ORDER BY id) AS ids,
        ARRAY_AGG(nome ORDER BY id) AS nomes,
        ARRAY_AGG(fonte ORDER BY id) AS fontes,
        ARRAY_AGG(latitude ORDER BY id) AS lats,
        ARRAY_AGG(longitude ORDER BY id) AS lons,
        ARRAY_AGG(wikidata_id ORDER BY id) AS wikis,
        ARRAY_AGG(google_place_id ORDER BY id) AS googles,
        ARRAY_AGG(description ORDER BY id) AS descriptions,
        ARRAY_AGG(image_url ORDER BY id) AS images,
        ARRAY_AGG(estrelas ORDER BY id) AS stars,
        COUNT(*)::int AS dup_count
      FROM group_hotels
      GROUP BY destino_id, nome_norm
      ORDER BY dup_count DESC, destino_id
    `);

    if (batch.length === 0) break;
    batchNum++;
    offset += BATCH;

    // Process each group in this batch
    for (const g of batch) {
      // Reconstruct hotel objects
      const hotels = g.ids.map((id, i) => ({
        id,
        nome: g.nomes[i],
        fonte: g.fontes[i],
        latitude: g.lats[i],
        longitude: g.lons[i],
        wikidataId: g.wikis[i],
        googlePlaceId: g.googles[i],
        description: g.descriptions[i],
        imageUrl: g.images[i],
        estrelas: g.stars[i],
      }));

      const { keep, remove } = pickBest(hotels);

      if (remove.length === 0) continue; // shouldn't happen

      const removeIds = remove.map((r) => r.id);

      // Merge data from removed into keeper
      let mergeUpdates = null;
      if (!NO_MERGE) {
        mergeUpdates = mergeData(keep, remove);
      }

      if (DRY_RUN) {
        if (totalRemoved < 10 || (totalRemoved < 50 && totalRemoved % 10 === 0)) {
          const destInfo = await prisma.wvDestination.findUnique({
            where: { id: g.destino_id },
            select: { nome: true, pais: true },
          });
          const destNome = destInfo?.nome ?? `#${g.destino_id}`;
          console.log(`  [${destNome}] "${keep.nome}" — keep #${keep.id}, remove ${removeIds.length} (${removeIds.join(',')})`);
          if (mergeUpdates) {
            console.log(`    merge: ${JSON.stringify(mergeUpdates)}`);
          }
        }
        totalKept++;
        totalRemoved += removeIds.length;
        if (mergeUpdates) totalMerged++;
        continue;
      }

      // Execute: update keeper, delete removed
      try {
        if (mergeUpdates) {
          await prisma.wvHotel.update({
            where: { id: keep.id },
            data: mergeUpdates,
          });
        }

        await prisma.wvHotel.deleteMany({
          where: { id: { in: removeIds } },
        });

        totalKept++;
        totalRemoved += removeIds.length;
        if (mergeUpdates) totalMerged++;

        if (totalRemoved <= 10 || totalRemoved % 200 === 0) {
          console.log(`  [${totalRemoved}] removidos… (keep #${keep.id}, del ${removeIds.length})`);
        }
      } catch (err) {
        console.error(`  ERRO ao processar grupo (destino=${g.destino_id}, keep=#${keep.id}):`, err.message);
      }
    }

    if (DRY_RUN && totalRemoved >= LIMIT && LIMIT < Infinity) break;

    if (!DRY_RUN) {
      console.log(`  batch ${batchNum}: ${totalRemoved} removidos, ${totalKept} mantidos, ${totalMerged} mergeados`);
    }
  }

  // Update hotel_counts
  if (!DRY_RUN && totalRemoved > 0) {
    console.log('\n  Atualizando hotel_count…');
    await prisma.$executeRaw`
      UPDATE wv_destinations d
      SET hotel_count = sub.c
      FROM (
        SELECT destino_id, COUNT(*)::int AS c
        FROM wv_hotels
        GROUP BY destino_id
      ) sub
      WHERE d.id = sub.destino_id
    `;
    await prisma.$executeRaw`
      UPDATE wv_destinations
      SET hotel_count = 0
      WHERE id NOT IN (SELECT DISTINCT destino_id FROM wv_hotels)
    `;
    console.log('  hotel_count atualizado.');
  }

  // Final summary
  console.log('\n═══ RESULTADO ═══');
  if (DRY_RUN) {
    console.log(`[DRY-RUN] Seriam mantidos      : ${totalKept.toLocaleString()}`);
    console.log(`[DRY-RUN] Seriam removidos     : ${totalRemoved.toLocaleString()}`);
    console.log(`[DRY-RUN] Grupos com merge     : ${totalMerged.toLocaleString()}`);
    console.log(`\nPara executar: node scripts/clean-duplicate-hotels.mjs`);
  } else {
    console.log(`Mantidos (1 por grupo) : ${totalKept.toLocaleString()}`);
    console.log(`Removidos (duplicados) : ${totalRemoved.toLocaleString()}`);
    console.log(`Grupos com merge       : ${totalMerged.toLocaleString()}`);

    const finalCount = await prisma.wvHotel.count();
    console.log(`\nTotal final wv_hotels  : ${finalCount.toLocaleString()}`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Error:', err);
  process.exitCode = 1;
});
