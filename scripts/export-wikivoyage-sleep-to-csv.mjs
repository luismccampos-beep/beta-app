/**
 * Exporta sleep listings do JSONL Wikivoyage para CSV no formato
 * que o build-hotel-data-index.py espera (wikivoyage-listings-en.csv).
 *
 * Uso:
 *   node scripts/export-wikivoyage-sleep-to-csv.mjs
 *   node scripts/export-wikivoyage-sleep-to-csv.mjs --lang en
 *   node scripts/export-wikivoyage-sleep-to-csv.mjs --lang pt
 *
 * Saída: data/hotels/wikivoyage-listings-{lang}.csv
 */
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const WV_OUT = resolve(ROOT, 'data/wikivoyage/out');

function parseCsvValue(val) {
  if (val == null || val === '') return '';
  const s = String(val).replace(/"/g, '""');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s}"`;
  }
  return s;
}

function escapeCsv(row) {
  return Object.values(row).map(parseCsvValue).join(',');
}

async function convertJsonlToCsv(lang) {
  const jsonlPath = resolve(WV_OUT, `${lang}-articles.jsonl`);
  if (!existsSync(jsonlPath)) {
    console.error(`JSONL não encontrado: ${jsonlPath}`);
    return 0;
  }

  const outDir = resolve(ROOT, 'data/hotels');
  mkdirSync(outDir, { recursive: true });
  const csvPath = resolve(outDir, `wikivoyage-listings-${lang}.csv`);

  const headers = [
    'type', 'article', 'title', 'alt', 'url', 'email',
    'address', 'lat', 'lon', 'latitude', 'longitude',
    'phone', 'tollfree', 'fax',
    'hours', 'price', 'checkin', 'checkout',
    'wikidata', 'lastedit', 'content',
  ];

  const out = createWriteStream(csvPath, { encoding: 'utf-8' });
  out.write('\uFEFF'); // BOM for Excel compatibility
  out.write(headers.map(parseCsvValue).join(',') + '\n');

  const rl = createInterface({
    input: createReadStream(jsonlPath, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  let articleCount = 0;
  let listingCount = 0;
  let sleepCount = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const article = JSON.parse(line);
      articleCount++;
      const listings = article.listings ?? [];
      if (!listings.length) continue;

      const articleTitle = article.title ?? '';

      for (const listing of listings) {
        // Check if this is a sleep listing by type
        const type = (listing.type || listing.tipo || '').toLowerCase().trim();
        const isSleep = type === 'sleep' || type === 'dormir' || type === 'durma';

        // Also check name for accommodation keywords
        const name = listing.name || listing.nome || listing.alt || '';
        const nameLower = name.toLowerCase();
        const looksLikeHotel =
          /\b(hotel|hostel|pousada|resort|inn\b|lodge|guesthouse|motel|albergue|camping|suites?)\b/.test(nameLower);

        if (!isSleep && !looksLikeHotel) continue;

        // Map fields to CSV columns
        const row = {
          type: isSleep ? 'sleep' : 'sleep',
          article: articleTitle,
          title: name,
          alt: listing.alt || '',
          url: listing.url || '',
          email: listing.email || '',
          address: listing.address || '',
          lat: listing.lat || '',
          lon: listing.lon || listing.long || listing.longitude || '',
          latitude: listing.latitude || '',
          longitude: listing.longitude || listing.lon || listing.long || '',
          phone: listing.phone || '',
          tollfree: listing.tollfree || '',
          fax: listing.fax || '',
          hours: listing.hours || '',
          price: listing.price || '',
          checkin: listing.checkin || '',
          checkout: listing.checkout || '',
          wikidata: listing.wikidata || '',
          lastedit: listing.lastedit || '',
          content: listing.content || listing.sobre || '',
        };

        out.write(escapeCsv(row) + '\n');
        listingCount++;
        if (isSleep) sleepCount++;
      }

      if (articleCount % 5000 === 0) {
        process.stdout.write(`  [${lang}] ${articleCount} artigos processados...\n`);
      }
    } catch {
      // skip malformed lines
    }
  }

  out.end();
  console.log(`\n[${lang.toUpperCase()}] Concluído:`);
  console.log(`  Artigos: ${articleCount}`);
  console.log(`  Total listings (sleep): ${sleepCount}`);
  console.log(`  Total listings exportados: ${listingCount}`);
  console.log(`  CSV: ${csvPath}`);

  return listingCount;
}

async function main() {
  const args = process.argv.slice(2);
  const langArg = args.includes('--lang')
    ? args[args.indexOf('--lang') + 1]
    : 'en';
  const langs = langArg === 'both' ? ['en', 'pt'] : [langArg];

  let total = 0;
  for (const lang of langs) {
    total += await convertJsonlToCsv(lang);
  }
  console.log(`\nTotal global: ${total} listings exportados`);
}

main().catch(console.error);
