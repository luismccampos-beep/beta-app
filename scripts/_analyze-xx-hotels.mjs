/**
 * Quick analysis: investigate "XX Internacional" hotels in the DB.
 */
import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';

loadProjectEnv();

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const VALID_COUNTRY_CODES = new Set([
  'AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AS','AT','AU','AW','AX','AZ',
  'BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS','BT','BV','BW','BY','BZ',
  'CA','CC','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','CR','CU','CV','CW','CX','CY','CZ',
  'DE','DJ','DK','DM','DO','DZ',
  'EC','EE','EG','EH','ER','ES','ET',
  'FI','FJ','FK','FM','FO','FR',
  'GA','GB','GD','GE','GF','GG','GH','GI','GL','GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY',
  'HK','HM','HN','HR','HT','HU',
  'ID','IE','IL','IM','IN','IO','IQ','IR','IS','IT',
  'JE','JM','JO','JP',
  'KE','KG','KH','KI','KM','KN','KP','KR','KW','KY','KZ',
  'LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY',
  'MA','MC','MD','ME','MF','MG','MH','MK','ML','MM','MN','MO','MP','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ',
  'NA','NC','NE','NF','NG','NI','NL','NO','NP','NR','NU','NZ',
  'OM',
  'PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PW','PY',
  'QA',
  'RE','RO','RS','RU','RW',
  'SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','SS','ST','SV','SX','SY','SZ',
  'TC','TD','TF','TG','TH','TJ','TK','TL','TM','TN','TO','TR','TT','TV','TW','TZ',
  'UA','UG','UM','US','UY','UZ',
  'VA','VC','VE','VG','VI','VN','VU',
  'WF','WS',
  'XK',
  'YE','YT',
  'ZA','ZM','ZW',
]);

async function main() {
  console.log('═══ ANÁLISE: Hotéis sem país válido ═══\n');

  // 1. All unique pais_code values with counts
  console.log('1. Todos os pais_code únicos em wv_destinations:\n');
  const paisCodes = await prisma.$queryRaw`
    SELECT pais_code, COUNT(*)::int AS dest_count
    FROM wv_destinations
    GROUP BY pais_code
    ORDER BY dest_count DESC
  `;
  for (const r of paisCodes) {
    const valid = VALID_COUNTRY_CODES.has(r.pais_code) ? '✅' : '⚠';
    console.log(`   ${r.pais_code.padEnd(8)} ${String(r.dest_count).padStart(5)} destinos  ${valid}`);
  }

  // 2. Hotels by invalid pais_code
  console.log('\n2. Hotéis por pais_code inválido:\n');
  const invalidHotels = await prisma.$queryRaw`
    SELECT
      d.pais_code,
      d.pais,
      COUNT(h.id)::int AS total_hotels,
      COUNT(CASE WHEN h.latitude IS NOT NULL THEN 1 END)::int AS with_coords,
      COUNT(CASE WHEN h.fonte IS NULL THEN 1 END)::int AS fonte_null,
      COUNT(CASE WHEN h.fonte = 'rejected_geo' THEN 1 END)::int AS rejected
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    GROUP BY d.pais_code, d.pais
    HAVING d.pais_code NOT IN ('AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AS','AT','AU','AW','AX','AZ','BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS','BT','BV','BW','BY','BZ','CA','CC','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','CR','CU','CV','CW','CX','CY','CZ','DE','DJ','DK','DM','DO','DZ','EC','EE','EG','EH','ER','ES','ET','FI','FJ','FK','FM','FO','FR','GA','GB','GD','GE','GF','GG','GH','GI','GL','GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY','HK','HM','HN','HR','HT','HU','ID','IE','IL','IM','IN','IO','IQ','IR','IS','IT','JE','JM','JO','JP','KE','KG','KH','KI','KM','KN','KP','KR','KW','KY','KZ','LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY','MA','MC','MD','ME','MF','MG','MH','MK','ML','MM','MN','MO','MP','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ','NA','NC','NE','NF','NG','NI','NL','NO','NP','NR','NU','NZ','OM','PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PW','PY','QA','RE','RO','RS','RU','RW','SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','SS','ST','SV','SX','SY','SZ','TC','TD','TF','TG','TH','TJ','TK','TL','TM','TN','TO','TR','TT','TV','TW','TZ','UA','UG','UM','US','UY','UZ','VA','VC','VE','VG','VI','VN','VU','WF','WS','XK','YE','YT','ZA','ZM','ZW')
      AND COUNT(h.id) > 0
    ORDER BY total_hotels DESC
  `;
  for (const r of invalidHotels) {
    console.log(`   ${r.pais_code.padEnd(8)} ${String(r.pais || '').padEnd(30)} ${String(r.total_hotels).padStart(8)} hotéis  (coords:${r.with_coords}  null:${r.fonte_null}  rejected:${r.rejected})`);
  }

  // 3. XX hotels detail: destino + fonte
  console.log('\n3. Top 30 destinos + fontes em XX:\n');
  const xxHotels = await prisma.$queryRaw`
    SELECT
      d.pais,
      d.nome AS destino,
      h.fonte,
      COUNT(h.id)::int AS hotel_count,
      COUNT(CASE WHEN h.latitude IS NOT NULL THEN 1 END)::int AS with_coords
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code = 'XX'
    GROUP BY d.pais, d.nome, h.fonte
    ORDER BY hotel_count DESC
    LIMIT 30
  `;
  for (const r of xxHotels) {
    const fonte = r.fonte || 'NULL';
    console.log(`   ${String(r.destino || '').padEnd(35)} fonte:${fonte.padEnd(25)} ${String(r.hotel_count).padStart(6)}  (coords:${r.with_coords})`);
  }

  // 4. Summary
  console.log('\n4. Sumário:\n');
  const totalXx = await prisma.wvHotel.count({ where: { destino: { paisCode: 'XX' } } });
  const totalDb = await prisma.wvHotel.count();
  console.log(`   Total hotéis na BD    : ${totalDb.toLocaleString()}`);
  console.log(`   Hotéis paisCode=XX    : ${totalXx.toLocaleString()} (${(totalXx/totalDb*100).toFixed(1)}%)`);

  // 5. Top 20 destinos in XX
  console.log('\n5. Top 20 destinos em XX:\n');
  const topXx = await prisma.$queryRaw`
    SELECT d.nome, COUNT(h.id)::int AS hotel_count
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code = 'XX'
    GROUP BY d.nome
    ORDER BY hotel_count DESC
    LIMIT 20
  `;
  for (const r of topXx) {
    console.log(`   ${String(r.nome || '?').padEnd(35)} ${String(r.hotel_count).padStart(8)} hotéis`);
  }

  // 6. Other invalid pais codes
  console.log('\n6. Outros códigos inválidos com hotéis:\n');
  const otherInvalid = await prisma.$queryRaw`
    SELECT d.pais_code, d.pais, COUNT(h.id)::int AS h
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code != 'XX' AND d.pais_code NOT IN ('AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AS','AT','AU','AW','AX','AZ','BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS','BT','BV','BW','BY','BZ','CA','CC','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','CR','CU','CV','CW','CX','CY','CZ','DE','DJ','DK','DM','DO','DZ','EC','EE','EG','EH','ER','ES','ET','FI','FJ','FK','FM','FO','FR','GA','GB','GD','GE','GF','GG','GH','GI','GL','GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY','HK','HM','HN','HR','HT','HU','ID','IE','IL','IM','IN','IO','IQ','IR','IS','IT','JE','JM','JO','JP','KE','KG','KH','KI','KM','KN','KP','KR','KW','KY','KZ','LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY','MA','MC','MD','ME','MF','MG','MH','MK','ML','MM','MN','MO','MP','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ','NA','NC','NE','NF','NG','NI','NL','NO','NP','NR','NU','NZ','OM','PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PW','PY','QA','RE','RO','RS','RU','RW','SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','SS','ST','SV','SX','SY','SZ','TC','TD','TF','TG','TH','TJ','TK','TL','TM','TN','TO','TR','TT','TV','TW','TZ','UA','UG','UM','US','UY','UZ','VA','VC','VE','VG','VI','VN','VU','WF','WS','XK','YE','YT','ZA','ZM','ZW')
    GROUP BY d.pais_code, d.pais
    HAVING COUNT(h.id) > 0
    ORDER BY h DESC
  `;
  for (const r of otherInvalid) {
    console.log(`   ${r.pais_code.padEnd(8)} ${String(r.pais || '').padEnd(30)} ${String(r.h).padStart(8)} hotéis`);
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exitCode = 1;
});
