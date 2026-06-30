/**
 * enrich-destinations-sargassum.mjs
 *
 * Enriquece a tabela Destination com dados de sargaço (sargassum seaweed)
 * a partir do CSV data/nature/sargassum_csv_20260629_567a6a.txt.
 *
 * Guarda os dados em structuredData.sargassum (JSON) de cada destino.
 * Também atualiza bestTimeToVisit/worstTimeToVisit quando aplicável.
 *
 * Estratégia de matching (por ordem de prioridade):
 *   1. Nome exato (case-insensitive, ignorando parênteses)
 *   2. Nome parcial (nome do CSV contém nome do destino ou vice-versa)
 *   3. Proximidade de coordenadas (≤ 0.5° ≈ 55 km)
 *   4. País + similaridade de nome
 *
 * Uso:
 *   node scripts/enrich-destinations-sargassum.mjs --dry-run
 *   node scripts/enrich-destinations-sargassum.mjs --dry-run --limit=20
 *   node scripts/enrich-destinations-sargassum.mjs
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CSV_PATH = resolve(ROOT, 'data/nature/sargassum_csv_20260629_567a6a.txt');

// --- CLI args ---
const args = process.argv.slice(2);
const flags = {};
for (const a of args) {
  if (a.startsWith('--')) {
    const [k, v] = a.replace(/^--/, '').split('=');
    flags[k] = v ?? true;
  }
}
const dryRun = !!flags['dry-run'];
const limit = flags.limit ? parseInt(flags.limit, 10) : undefined;
const verbose = !!flags.verbose;
const force = !!flags.force;

async function confirmWrite() {
  if (force) return true;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('WARNING: This will WRITE to the database. Type "yes" to confirm: ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

// --- CSV parsing ---
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV respecting quoted fields and escaped quotes
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"') {
        const next = line[j + 1];
        if (inQuotes && next === '"') {
          current += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());

    if (fields.length !== headers.length) continue;

    const row = {};
    for (let h = 0; h < headers.length; h++) {
      row[headers[h].trim()] = fields[h].replace(/^"|"$/g, '');
    }
    rows.push(row);
  }
  return rows;
}

// --- Name normalization ---
function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/\s*\([^)]*\)/g, '')  // remove parentheticals
    .replace(/[^a-z0-9\s]/g, ' ')  // only alphanumeric + space
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMainName(name) {
  // Extract the main location name before any "/" or "("
  return name.split(/\s*[/(]/)[0].trim();
}

// --- Matching functions ---
function exactNameMatch(csvName, dest) {
  const csvNorm = normalizeName(extractMainName(csvName));
  const destNameNorm = normalizeName(dest.name);
  const destCityNorm = normalizeName(dest.city);

  // Also try without accent normalization for more precision
  const csvClean = csvName.toLowerCase().split(/[/(]/)[0].trim();
  const destNameClean = dest.name.toLowerCase().trim();
  const destCityClean = dest.city.toLowerCase().trim();

  return csvNorm === destNameNorm ||
    csvNorm === destCityNorm ||
    csvClean === destNameClean ||
    csvClean === destCityClean;
}

function partialNameMatch(csvName, dest) {
  const csvNorm = normalizeName(extractMainName(csvName));
  const destNameNorm = normalizeName(dest.name);
  const destCityNorm = normalizeName(dest.city);

  // Check if one contains the other (minimum 4 chars to avoid false positives)
  if (csvNorm.length >= 4 && destNameNorm.length >= 4) {
    if (csvNorm.includes(destNameNorm) || destNameNorm.includes(csvNorm)) return true;
  }
  if (csvNorm.length >= 4 && destCityNorm.length >= 4) {
    if (csvNorm.includes(destCityNorm) || destCityNorm.includes(csvNorm)) return true;
  }

  // Special handling for well-known beach areas
  const csvMain = extractMainName(csvName).toLowerCase().trim();
  const destName = dest.name.toLowerCase().trim();
  const destCity = dest.city.toLowerCase().trim();

  // Punta Cana / Bávaro -> match "Punta Cana" or "Bávaro" or "Bavaro"
  if (csvMain.includes('punta cana') && (destName.includes('punta cana') || destCity.includes('punta cana') || destName.includes('bavaro') || destCity.includes('bavaro'))) return true;
  if (csvMain.includes('bavaro') && (destName.includes('punta cana') || destCity.includes('punta cana') || destName.includes('bavaro') || destCity.includes('bavaro'))) return true;

  return false;
}

function proximityMatch(csvLat, csvLon, dest) {
  if (dest.latitude == null || dest.longitude == null) return false;
  const dLat = Math.abs(parseFloat(csvLat) - parseFloat(dest.latitude));
  const dLon = Math.abs(parseFloat(csvLon) - parseFloat(dest.longitude));
  // ~0.5 degrees ≈ 55km at equator, generous for region matching
  return dLat <= 0.5 && dLon <= 0.5;
}

function countryNameMatch(csvCountry, csvName, dest) {
  // Match country first, then try name similarity
  if (!dest.country) return false;

  const destCountry = dest.country.toLowerCase().trim();
  const csvCountryNorm = csvCountry.toLowerCase().trim();

  // Country mapping for name variations
  const countryAliases = {
    'usa': ['united states', 'estados unidos', 'eu'],
    'united states': ['usa', 'estados unidos', 'eu'],
    'dominican republic': ['república dominicana', 'republica dominicana'],
    'republica dominicana': ['dominican republic'],
    'república dominicana': ['dominican republic'],
    'puerto rico': ['porto rico'],
    'trinidad & tobago': ['trinidad and tobago', 'trindade e tobago'],
    'antigua & barbuda': ['antigua and barbuda', 'antigua e barbuda'],
    'st. kitts & nevis': ['saint kitts and nevis', 'são cristóvão e nevis'],
    'st. lucia': ['saint lucia', 'santa lúcia'],
    'st. vincent & the grenadines': ['saint vincent and the grenadines', 'são vicente e granadinas'],
    'us virgin islands': ['u.s. virgin islands', 'ilhas virgens americanas'],
    'british virgin islands': ['ilhas virgens britânicas'],
    'côte d\'ivoire': ['costa do marfim', 'cote d\'ivoire'],
    'french guiana': ['guiana francesa'],
  };

  // Check if countries match directly or via aliases
  if (destCountry !== csvCountryNorm) {
    const aliases = countryAliases[csvCountryNorm] || [];
    const reverseAliases = countryAliases[destCountry] || [];
    if (!aliases.includes(destCountry) && !reverseAliases.includes(csvCountryNorm)) {
      return false;
    }
  }

  // Country matches, now try partial name match
  const csvNorm = normalizeName(extractMainName(csvName));
  const destNameNorm = normalizeName(dest.name);
  const destCityNorm = normalizeName(dest.city);

  if (csvNorm.length >= 4 && destNameNorm.length >= 4 &&
      (csvNorm.includes(destNameNorm) || destNameNorm.includes(csvNorm))) return true;
  if (csvNorm.length >= 4 && destCityNorm.length >= 4 &&
      (csvNorm.includes(destCityNorm) || destCityNorm.includes(csvNorm))) return true;

  return false;
}

// --- Month names ---
const MONTH_NAMES_PT = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

function monthRangeToLabel(start, end) {
  if (start === 1 && end === 12) return 'Todo o ano';
  if (start >= 1 && end <= 12) {
    return `${MONTH_NAMES_PT[start - 1]} a ${MONTH_NAMES_PT[end - 1]}`;
  }
  return `Meses ${start}-${end}`;
}

function severityToEmoji(severity) {
  switch (severity) {
    case 'Not affected': return '✅';
    case 'Low': return '🟢';
    case 'Low-Moderate': return '🟡';
    case 'Moderate': return '🟠';
    case 'Moderate-High': return '🟠';
    case 'High': return '🔴';
    case 'High-Severe': return '🔴';
    default: return '⚪';
  }
}

// --- Main ---
async function main() {
  console.log('=== Enriquecimento de Sargaço (Sargassum) ===');
  console.log(`CSV: ${CSV_PATH}`);
  console.log(`Modo: ${dryRun ? 'DRY-RUN (sem escrita)' : 'LIVE (vai escrever na DB)'}`);
  if (limit) console.log(`Limit: ${limit} linhas do CSV`);
  console.log();

  // Read and parse CSV
  const csvText = readFileSync(CSV_PATH, 'utf8');
  const sargassumRows = parseCSV(csvText);
  console.log(`Linhas CSV: ${sargassumRows.length}`);

  if (limit) {
    sargassumRows.length = Math.min(limit, sargassumRows.length);
    console.log(`  (limitado a ${sargassumRows.length})`);
  }

  // Connect to DB
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
  });

  if (!dryRun) {
    const ok = await confirmWrite();
    if (!ok) {
      console.log('Aborted. Use --force to skip confirmation.');
      await prisma.$disconnect();
      process.exit(0);
    }
  }

  try {
    // Fetch all destinations with coordinates
    const destinations = await prisma.destination.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        country: true,
        city: true,
        category: true,
        latitude: true,
        longitude: true,
        structuredData: true,
        bestTimeToVisit: true,
        worstTimeToVisit: true,
      },
    });

    console.log(`Destinos na DB: ${destinations.length}`);
    console.log();

    // Tracking
    const matched = new Set(); // destination IDs we've matched
    let matchedCount = 0;
    let unmatchedCount = 0;
    let skippedGeneric = 0;
    let totalUpdated = 0;

    // Severity counts
    const severityStats = {};

    for (const row of sargassumRows) {
      const csvLocation = row.location;
      const csvCountry = row.country;
      const csvRegion = row.region;
      const csvLat = row.latitude;
      const csvLon = row.longitude;
      const severity = row.severity;
      const peakStart = parseInt(row.peak_start, 10);
      const peakEnd = parseInt(row.peak_end, 10);
      const notes = row.notes || null;

      // Skip generic "All coastlines" entries for matching purposes
      // but track them for country-level insights
      const isGeneric = csvLocation.toLowerCase().includes('all coast') ||
                        csvLocation.toLowerCase().includes('all beach');

      if (isGeneric && csvCountry) {
        skippedGeneric++;
        if (verbose) console.log(`  ⏭️  Genérico: ${csvLocation} (${csvCountry}) — ignorado para matching individual`);
        continue;
      }

      // Try matching strategies
      let bestMatch = null;
      let matchStrategy = '';

      for (const dest of destinations) {
        // Skip already matched destinations (first-come, first-served)
        // Actually, don't skip — a dest could have multiple sargassum zones

        // Strategy 1: Exact name
        if (exactNameMatch(csvLocation, dest)) {
          bestMatch = dest;
          matchStrategy = 'nome exato';
          break;
        }
      }

      // Strategy 2: Partial name
      if (!bestMatch) {
        for (const dest of destinations) {
          if (partialNameMatch(csvLocation, dest)) {
            bestMatch = dest;
            matchStrategy = 'nome parcial';
            break;
          }
        }
      }

      // Strategy 3: Proximity
      if (!bestMatch && csvLat && csvLon) {
        let closestDist = Infinity;
        let closestDest = null;
        for (const dest of destinations) {
          if (proximityMatch(csvLat, csvLon, dest)) {
            const dLat = Math.abs(parseFloat(csvLat) - parseFloat(dest.latitude));
            const dLon = Math.abs(parseFloat(csvLon) - parseFloat(dest.longitude));
            const dist = Math.sqrt(dLat * dLat + dLon * dLon);
            if (dist < closestDist) {
              closestDist = dist;
              closestDest = dest;
            }
          }
        }
        if (closestDest) {
          bestMatch = closestDest;
          matchStrategy = `proximidade (${(closestDist * 111).toFixed(0)} km)`;
        }
      }

      // Strategy 4: Country + name
      if (!bestMatch) {
        for (const dest of destinations) {
          if (countryNameMatch(csvCountry, csvLocation, dest)) {
            bestMatch = dest;
            matchStrategy = 'país + nome';
            break;
          }
        }
      }

      if (bestMatch) {
        matched.add(bestMatch.id);
        matchedCount++;

        const emoji = severityToEmoji(severity);
        const peakLabel = monthRangeToLabel(peakStart, peakEnd);

        severityStats[severity] = (severityStats[severity] || 0) + 1;

        if (verbose || dryRun) {
          console.log(`  ${emoji} "${csvLocation}" → DB:${bestMatch.name} (${bestMatch.country}) [${matchStrategy}]`);
          console.log(`     Severidade: ${severity} | Pico: ${peakLabel}${notes ? ` | Nota: ${notes}` : ''}`);
        }

        if (!dryRun) {
          // Build sargassum data object
          const sargassumData = {
            severity,
            peakStart,
            peakEnd,
            peakLabel,
            region: csvRegion,
            sourceCsv: 'sargassum_csv_20260629_567a6a',
            updatedAt: new Date().toISOString(),
          };
          if (notes) sargassumData.notes = notes;

          // Merge with existing structuredData
          const existing = (bestMatch.structuredData && typeof bestMatch.structuredData === 'object')
            ? { ...bestMatch.structuredData }
            : {};
          existing.sargassum = sargassumData;

          // Update bestTimeToVisit/worstTimeToVisit if severity is High or worse
          const updateData = {
            structuredData: existing,
          };

          if ((severity === 'High' || severity === 'High-Severe') && !bestMatch.worstTimeToVisit) {
            updateData.worstTimeToVisit = `${peakLabel} (risco elevado de sargaço)`;
          }
          if (severity === 'Not affected' || severity === 'Low') {
            // These are safe beaches — could enrich bestTimeToVisit but don't overwrite
            if (!bestMatch.bestTimeToVisit && severity === 'Not affected') {
              updateData.bestTimeToVisit = 'Todo o ano (sem risco de sargaço)';
            }
          }

          await prisma.destination.update({
            where: { id: bestMatch.id },
            data: updateData,
          });
          totalUpdated++;
        }
      } else {
        unmatchedCount++;
        if (verbose || dryRun) {
          console.log(`  ❓ "${csvLocation}" (${csvCountry}) — NÃO encontrado na DB`);
        }
      }
    }

    // Summary
    console.log();
    console.log('========================================');
    console.log('              RESUMO FINAL');
    console.log('========================================');
    console.log(`Linhas CSV processadas: ${sargassumRows.length}`);
    console.log(`  ✅ Matched & ${dryRun ? '(dry-run)' : 'atualizados'}: ${matchedCount}`);
    console.log(`  ❓ Não encontrados:  ${unmatchedCount}`);
    console.log(`  ⏭️  Genéricos (ignorados): ${skippedGeneric}`);
    console.log(`  🎯 Destinos únicos afetados: ${matched.size}`);

    console.log();
    console.log('Distribuição por severidade:');
    for (const [sev, count] of Object.entries(severityStats).sort()) {
      const bar = '█'.repeat(Math.max(1, Math.round(count / 2)));
      console.log(`  ${severityToEmoji(sev)} ${sev.padEnd(18)} ${String(count).padStart(3)} ${bar}`);
    }

    if (dryRun) {
      console.log();
      console.log('⚠️  Modo DRY-RUN — nenhuma alteração foi escrita na base de dados.');
      console.log('   Para executar: node scripts/enrich-destinations-sargassum.mjs');
      console.log();
      console.log('Top destinos NÃO encontrados (primeiros 20):');

      // Show unmatched rows for review
      let shown = 0;
      for (const row of sargassumRows) {
        const csvLocation = row.location;
        if (csvLocation.toLowerCase().includes('all coast') || csvLocation.toLowerCase().includes('all beach')) continue;

        // Check if this row was matched (re-run matching check)
        let wasMatched = false;
        for (const dest of destinations) {
          if (exactNameMatch(row.location, dest) || partialNameMatch(row.location, dest) ||
              (row.latitude && row.longitude && proximityMatch(row.latitude, row.longitude, dest)) ||
              countryNameMatch(row.country, row.location, dest)) {
            wasMatched = true;
            break;
          }
        }
        if (!wasMatched) {
          console.log(`  - "${row.location}" (${row.country}) [${row.region}]`);
          shown++;
          if (shown >= 20) break;
        }
      }
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log();
  console.log('=== Concluído ===');
}

main().catch((e) => {
  console.error('Erro:', e);
  process.exit(1);
});
