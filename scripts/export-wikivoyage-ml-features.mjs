/**
 * Export Wikivoyage travel bundle → ml-service training files.
 *
 *   node scripts/export-wikivoyage-ml-features.mjs
 *   MAX_ML_DESTINATIONS=12000 node scripts/export-wikivoyage-ml-features.mjs
 */
import { createWriteStream, existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const OUT_DIR = resolve(ROOT, 'ml-service/app/data');

const MAX = parseInt(process.env.MAX_ML_DESTINATIONS ?? '0', 10) || Infinity;

function escapeCsv(s) {
  const v = String(s ?? '').replace(/"/g, '""');
  return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v}"` : v;
}

function buildTags(d) {
  const parts = [d.tipo, d.clima, d.continente, d.paisCode, d.lang].filter(Boolean);
  return [...new Set(parts)].join('|');
}

function buildDoc(d) {
  const desc = (d.descricaoCompleta ?? d.descricao ?? '').slice(0, 800);
  return [
    d.nome,
    d.pais,
    d.continente,
    d.tipo,
    d.clima,
    buildTags(d),
    desc,
  ]
    .filter(Boolean)
    .join(' ');
}

function main() {
  if (!existsSync(BUNDLE)) {
    console.error(`Missing ${BUNDLE}. Run: npm run travel:demo:build`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  let destinos = bundle.destinos ?? [];

  const withIata = destinos.filter((d) => d.iata);
  const withoutIata = destinos.filter((d) => !d.iata);
  destinos = [...withIata, ...withoutIata];
  if (MAX < Infinity) destinos = destinos.slice(0, MAX);

  const csvPath = resolve(OUT_DIR, 'wikivoyage_destinations.csv');
  const jsonlPath = resolve(OUT_DIR, 'wikivoyage_destinations.jsonl');
  const metaPath = resolve(OUT_DIR, 'wikivoyage_export_meta.json');

  const csv = createWriteStream(csvPath, { encoding: 'utf8' });
  csv.write(
    'item_id,destino_id,type,nome,pais,pais_code,iata,continente,tipo,clima,lang,tags,text_doc\n',
  );

  const jsonl = createWriteStream(jsonlPath, { encoding: 'utf8' });
  let n = 0;

  for (const d of destinos) {
    const itemId = `wv-${d.lang ?? 'pt'}-${d.id}`;
    const tags = buildTags(d);
    const textDoc = buildDoc(d);
    const row = [
      itemId,
      String(d.id),
      'destination',
      d.nome,
      d.pais,
      d.paisCode ?? '',
      d.iata ?? '',
      d.continente,
      d.tipo,
      d.clima,
      d.lang ?? '',
      tags,
      textDoc,
    ];
    csv.write(row.map(escapeCsv).join(',') + '\n');

    jsonl.write(
      JSON.stringify({
        item_id: itemId,
        destino_id: d.id,
        nome: d.nome,
        iata: d.iata,
        pais: d.pais,
        paisCode: d.paisCode,
        continente: d.continente,
        tipo: d.tipo,
        clima: d.clima,
        lang: d.lang,
        tags: tags.split('|'),
        text_doc: textDoc,
        wikivoyageUrl: d.wikivoyageUrl,
      }) + '\n',
    );
    n += 1;
  }

  csv.end();
  jsonl.end();

  const meta = {
    exportedAt: new Date().toISOString(),
    source: bundle.meta?.source ?? 'wikivoyage',
    count: n,
    withIata: destinos.filter((d) => d.iata).length,
    csv: csvPath,
    jsonl: jsonlPath,
  };
  writeFileSync(metaPath, JSON.stringify(meta, null, 2));

  console.log(`Exported ${n} destinations to ml-service/app/data/`);
  console.log(`  ${csvPath}`);
  console.log(`  ${jsonlPath}`);
}

main();
