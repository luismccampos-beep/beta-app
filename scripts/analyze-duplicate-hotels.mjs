/**
 * Diagnostic: analisa hotéis duplicados em wv_hotels.
 *
 *   node scripts/analyze-duplicate-hotels.mjs
 *   node scripts/analyze-duplicate-hotels.mjs --sample=50
 *   node scripts/analyze-duplicate-hotels.mjs --by-wikidata
 *   node scripts/analyze-duplicate-hotels.mjs --top-destinos=30
 *
 * Duplicado = mesmo destinoId + mesmo nome (normalizado).
 * Também detecta duplicados por wikidataId.
 */
import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

loadProjectEnv(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const sampleArg = process.argv.find((a) => a.startsWith('--sample'));
const SAMPLE = sampleArg
  ? parseInt(sampleArg.split('=')[1] ?? process.argv[process.argv.indexOf('--sample') + 1], 10)
  : 30;

const topArg = process.argv.find((a) => a.startsWith('--top-destinos'));
const TOP_DESTINOS = topArg
  ? parseInt(topArg.split('=')[1] ?? process.argv[process.argv.indexOf('--top-destinos') + 1], 10)
  : 20;

const BY_WIKIDATA = process.argv.includes('--by-wikidata');
const FULL = process.argv.includes('--full');

async function main() {
  console.log('═══ ANÁLISE: Hotéis Duplicados (wv_hotels) ═══\n');

  // ── 1. Totais ──
  const total = await prisma.wvHotel.count();
  const totalDests = await prisma.wvDestination.count();
  console.log(`Total hotéis       : ${total.toLocaleString()}`);
  console.log(`Total destinos      : ${totalDests.toLocaleString()}`);
  console.log(`Média hotéis/destino: ${(total / totalDests).toFixed(1)}\n`);

  // ── 2. Duplicados por (destinoId, nome_normalizado) ──
  console.log('─── Duplicados por (destino, nome) ───\n');

  // We use PostgreSQL to do the heavy lifting: group by destino_id + normalized nome
  const dupGroups = await prisma.$queryRaw`
    WITH normalized AS (
      SELECT
        id,
        destino_id,
        nome,
        fonte,
        latitude,
        longitude,
        wikidata_id,
        google_place_id,
        description,
        image_url,
        estrelas,
        preco_por_noite,
        created_at,
        LOWER(REGEXP_REPLACE(
          UNACCENT(nome),
          '[^a-z0-9]', ' ', 'g'
        )) AS nome_norm
      FROM wv_hotels
    ),
    dup_keys AS (
      SELECT destino_id, nome_norm
      FROM normalized
      GROUP BY destino_id, nome_norm
      HAVING COUNT(*) > 1
    ),
    dup_hotels AS (
      SELECT n.*
      FROM normalized n
      JOIN dup_keys d ON n.destino_id = d.destino_id AND n.nome_norm = d.nome_norm
    )
    SELECT
      destino_id,
      nome_norm,
      COUNT(*)::int as dup_count,
      ARRAY_AGG(nome ORDER BY nome) AS nomes,
      ARRAY_AGG(fonte ORDER BY fonte) AS fontes,
      ARRAY_AGG(id ORDER BY id) AS ids,
      COUNT(CASE WHEN latitude IS NOT NULL THEN 1 END)::int AS with_coords,
      COUNT(CASE WHEN wikidata_id IS NOT NULL THEN 1 END)::int AS with_wikidata,
      COUNT(CASE WHEN google_place_id IS NOT NULL THEN 1 END)::int AS with_google,
      COUNT(CASE WHEN description IS NOT NULL THEN 1 END)::int AS with_description,
      COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END)::int AS with_image
    FROM dup_hotels
    GROUP BY destino_id, nome_norm
    ORDER BY dup_count DESC, destino_id
  `;

  const totalDupGroups = dupGroups.length;
  let totalDupHotels = 0;
  let maxDups = 0;
  for (const g of dupGroups) {
    totalDupHotels += g.dup_count;
    if (g.dup_count > maxDups) maxDups = g.dup_count;
  }

  console.log(`Grupos de duplicados encontrados: ${totalDupGroups.toLocaleString()}`);
  console.log(`Total de hotéis em grupos duplicados: ${totalDupHotels.toLocaleString()} (${((totalDupHotels / total) * 100).toFixed(1)}%)`);
  console.log(`Hotéis a eliminar se ficar 1 por grupo: ${(totalDupHotels - totalDupGroups).toLocaleString()}`);
  console.log(`Máximo de duplicados num grupo: ${maxDups}\n`);

  // ── 3. Top destinos com mais duplicados ──
  console.log('─── Top destinos com mais hotéis duplicados ───\n');

  const topDests = await prisma.$queryRaw`
    WITH normalized AS (
      SELECT
        destino_id,
        LOWER(REGEXP_REPLACE(UNACCENT(nome), '[^a-z0-9]', ' ', 'g')) AS nome_norm
      FROM wv_hotels
    ),
    dup_keys AS (
      SELECT destino_id, nome_norm
      FROM normalized
      GROUP BY destino_id, nome_norm
      HAVING COUNT(*) > 1
    )
    SELECT
      d.id AS destino_id,
      d.nome AS destino_nome,
      d.pais,
      COUNT(DISTINCT dk.nome_norm)::int AS grupos_duplicados
    FROM dup_keys dk
    JOIN wv_destinations d ON d.id = dk.destino_id
    GROUP BY d.id, d.nome, d.pais
    ORDER BY grupos_duplicados DESC
    LIMIT ${TOP_DESTINOS}
  `;

  for (const r of topDests) {
    console.log(`  ${String(r.destino_nome || '?').padEnd(35)} ${String(r.pais || '?').padEnd(20)} ${String(r.grupos_duplicados).padStart(6)} grupos duplicados`);
  }

  // ── 4. Distribuição por fonte nos duplicados ──
  console.log('\n─── Fontes dos hotéis duplicados ───\n');

  const fonteStats = await prisma.$queryRaw`
    WITH normalized AS (
      SELECT
        destino_id,
        fonte,
        LOWER(REGEXP_REPLACE(UNACCENT(nome), '[^a-z0-9]', ' ', 'g')) AS nome_norm
      FROM wv_hotels
    ),
    dup_keys AS (
      SELECT destino_id, nome_norm
      FROM normalized
      GROUP BY destino_id, nome_norm
      HAVING COUNT(*) > 1
    ),
    dup_hotels AS (
      SELECT n.fonte
      FROM normalized n
      JOIN dup_keys d ON n.destino_id = d.destino_id AND n.nome_norm = d.nome_norm
    )
    SELECT
      COALESCE(fonte, 'NULL') AS fonte,
      COUNT(*)::int AS total
    FROM dup_hotels
    GROUP BY fonte
    ORDER BY total DESC
    LIMIT 25
  `;

  console.table(fonteStats);

  // ── 5. Padrão: quantos grupos têm dados úteis (coords, wikidata, etc.) que se perdem ──
  console.log('─── Grupos onde pelo menos 1 hotel tem dados valiosos ───');

  let groupsWithCoords = 0;
  let groupsWithWikidata = 0;
  let groupsWithGoogle = 0;
  let groupsWithDescription = 0;
  let groupsWithImage = 0;
  let groupsAllSameFonte = 0;
  let groupsMixedFontes = 0;

  for (const g of dupGroups) {
    if (g.with_coords > 0) groupsWithCoords++;
    if (g.with_wikidata > 0) groupsWithWikidata++;
    if (g.with_google > 0) groupsWithGoogle++;
    if (g.with_description > 0) groupsWithDescription++;
    if (g.with_image > 0) groupsWithImage++;

    const fontes = g.fontes.filter(Boolean);
    const uniqueFontes = new Set(fontes);
    if (uniqueFontes.size === 1) groupsAllSameFonte++;
    else if (uniqueFontes.size > 1) groupsMixedFontes++;
  }

  console.log(`  Com coordenadas em pelo menos 1      : ${groupsWithCoords.toLocaleString()} (${((groupsWithCoords/totalDupGroups)*100).toFixed(0)}%)`);
  console.log(`  Com wikidata_id em pelo menos 1      : ${groupsWithWikidata.toLocaleString()} (${((groupsWithWikidata/totalDupGroups)*100).toFixed(0)}%)`);
  console.log(`  Com google_place_id em pelo menos 1  : ${groupsWithGoogle.toLocaleString()} (${((groupsWithGoogle/totalDupGroups)*100).toFixed(0)}%)`);
  console.log(`  Com description em pelo menos 1      : ${groupsWithDescription.toLocaleString()} (${((groupsWithDescription/totalDupGroups)*100).toFixed(0)}%)`);
  console.log(`  Com image_url em pelo menos 1        : ${groupsWithImage.toLocaleString()} (${((groupsWithImage/totalDupGroups)*100).toFixed(0)}%)`);
  console.log(`  Todos com mesma fonte                : ${groupsAllSameFonte.toLocaleString()} (${((groupsAllSameFonte/totalDupGroups)*100).toFixed(0)}%)`);
  console.log(`  Com fontes mistas                    : ${groupsMixedFontes.toLocaleString()} (${((groupsMixedFontes/totalDupGroups)*100).toFixed(0)}%)`);
  console.log(`  Totais sem fonte (NULL)              : ${dupGroups.filter(g => g.fontes.every(f => f === null)).length.toLocaleString()}`);

  // ── 6. Amostra de grupos duplicados ──
  console.log(`\n─── Amostra (${Math.min(SAMPLE, totalDupGroups)} grupos duplicados) ───\n`);

  const sample = dupGroups.slice(0, SAMPLE);
  for (const g of sample) {
    const destInfo = await prisma.wvDestination.findUnique({
      where: { id: g.destino_id },
      select: { nome: true, pais: true, paisCode: true },
    });

    const destNome = destInfo?.nome ?? `dest#${g.destino_id}`;
    const pais = destInfo?.pais ?? '?';
    const nomesUnicos = [...new Set(g.nomes)];
    const fontesUnicas = [...new Set(g.fontes)].filter(Boolean);
    console.log(`  [${destNome}] (${pais}) — ${g.dup_count} dups`);
    console.log(`    nomes : ${nomesUnicos.slice(0, 4).join(' | ')}${nomesUnicos.length > 4 ? ` +${nomesUnicos.length - 4}` : ''}`);
    console.log(`    fontes: ${fontesUnicas.length ? fontesUnicas.join(', ') : 'NULL'}`);
    console.log(`    coords:${g.with_coords}  wikidata:${g.with_wikidata}  google:${g.with_google}  desc:${g.with_description}  img:${g.with_image}`);
    console.log();
  }

  // ── 7. Duplicados por wikidata_id ──
  if (BY_WIKIDATA || FULL) {
    console.log('─── Duplicados por wikidata_id ───\n');

    const wikidataDups = await prisma.$queryRaw`
      SELECT
        wikidata_id,
        COUNT(*)::int AS total,
        ARRAY_AGG(id ORDER BY id) AS ids,
        ARRAY_AGG(nome ORDER BY nome) AS nomes,
        ARRAY_AGG(destino_id ORDER BY destino_id) AS destino_ids
      FROM wv_hotels
      WHERE wikidata_id IS NOT NULL
      GROUP BY wikidata_id
      HAVING COUNT(*) > 1
      ORDER BY total DESC
      LIMIT ${SAMPLE}
    `;

    console.log(`Hotéis com wikidata_id: ${await prisma.wvHotel.count({ where: { wikidataId: { not: null } } }).then(n => n.toLocaleString())}`);
    console.log(`Grupos com wikidata_id repetido: ${wikidataDups.length} (amostra de ${Math.min(SAMPLE, wikidataDups.length)})\n`);

    for (const w of wikidataDups) {
      const nomesUnicos = [...new Set(w.nomes)];
      console.log(`  [${w.wikidata_id}] ×${w.total}  → ${nomesUnicos.slice(0, 3).join(' | ')}`);
    }
  }

  // ── 8. Resumo ──
  console.log('\n═══ RESUMO ═══');
  console.log(`Hotéis únicos (1 por grupo)        : ~${(total - totalDupHotels + totalDupGroups).toLocaleString()}`);
  console.log(`Hotéis a remover (duplicados extra) : ~${(totalDupHotels - totalDupGroups).toLocaleString()}`);
  console.log(`Redução                            : ${((totalDupHotels - totalDupGroups) / total * 100).toFixed(1)}%`);

  if (totalDupHotels - totalDupGroups > 0) {
    console.log('\n🧹 Para limpar: node scripts/clean-duplicate-hotels.mjs [--dry-run]');
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Error:', err);
  process.exitCode = 1;
});
