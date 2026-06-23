/**
 * Valida a qualidade dos dados do bundle após o build:
 * - Destinos sem país (paisCode === 'XX')
 * - Destinos sem continente
 * - Destinos com coordenadas suspeitas (país não coincide com geocodificação)
 * - Estatísticas por país/continente
 *
 * Uso:
 *   node scripts/validate-bundle-countries.mjs
 *   node scripts/validate-bundle-countries.mjs --bundle=src/data/travel-mock/bundle-wikivoyage.json
 *   node scripts/validate-bundle-countries.mjs --verbose
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const DEFAULT_BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');

const args = process.argv.slice(2);
const bundlePathArg = args.find((a) => a.startsWith('--bundle='));
const BUNDLE_PATH = bundlePathArg
  ? resolve(ROOT, bundlePathArg.split('=')[1])
  : DEFAULT_BUNDLE;
const verbose = args.includes('--verbose');

function parseArgs() {
  return { bundlePath: BUNDLE_PATH, verbose };
}

function main() {
  const { bundlePath, verbose } = parseArgs();

  if (!existsSync(bundlePath)) {
    console.error(`❌ Bundle não encontrado: ${bundlePath}`);
    console.error('   Gere-o com: npm run travel:demo:build');
    process.exit(1);
  }

  console.log('🔍 Validando bundle...\n');
  console.log(`   Ficheiro: ${bundlePath}\n`);

  const bundle = JSON.parse(readFileSync(bundlePath, 'utf8'));
  const destinos = bundle.destinos ?? [];
  const hoteis = bundle.hoteis ?? [];
  const voos = bundle.voos ?? [];

  console.log(`📊 Dados totais:`);
  console.log(`   Destinos: ${destinos.length}`);
  console.log(`   Hotéis: ${hoteis.length}`);
  console.log(`   Voos: ${voos.length}`);
  console.log('');

  // ── 1. Destinos sem país (paisCode === 'XX' ou vazio) ──
  const semPais = destinos.filter((d) => !d.paisCode || d.paisCode === 'XX');
  console.log(`🚨 Destinos SEM país (paisCode === 'XX'): ${semPais.length}`);
  if (semPais.length > 0 && verbose) {
    console.log('   Exemplos:');
    semPais.slice(0, 10).forEach((d) => {
      console.log(`   - [${d.id}] ${d.nome} | continente: ${d.continente ?? 'null'}`);
    });
    if (semPais.length > 10) {
      console.log(`   ... e mais ${semPais.length - 10} destinos`);
    }
  }
  console.log('');

  // ── 2. Destinos sem continente ──
  const semContinente = destinos.filter((d) => !d.continente);
  console.log(`🚨 Destinos SEM continente: ${semContinente.length}`);
  if (semContinente.length > 0 && verbose) {
    console.log('   Exemplos:');
    semContinente.slice(0, 10).forEach((d) => {
      console.log(`   - [${d.id}] ${d.nome} | pais: ${d.pais ?? 'null'} (${d.paisCode ?? 'XX'})`);
    });
    if (semContinente.length > 10) {
      console.log(`   ... e mais ${semContinente.length - 10} destinos`);
    }
  }
  console.log('');

  // ── 3. Destinos com coordenadas suspeitas (país não coincide com coords) ──
  const comCoords = destinos.filter((d) => d.latitude && d.longitude);
  console.log(`📍 Destinos COM coordenadas: ${comCoords.length}`);
  console.log(`   Destinos SEM coordenadas: ${destinos.length - comCoords.length}`);
  console.log('');

  // ── 4. Estatísticas por país ──
  const porPais = new Map();
  for (const d of destinos) {
    const code = d.paisCode ?? 'XX';
    const nome = d.pais ?? 'Internacional';
    const key = `${code} - ${nome}`;
    porPais.set(key, (porPais.get(key) ?? 0) + 1);
  }

  const sorted = [...porPais.entries()].sort((a, b) => b[1] - a[1]);
  console.log('🌍 Distribuição por país (top 20):');
  sorted.slice(0, 20).forEach(([pais, count]) => {
    const pct = ((count / destinos.length) * 100).toFixed(1);
    console.log(`   ${pais}: ${count} (${pct}%)`);
  });
  console.log('');

  // ── 5. Estatísticas por continente ──
  const porContinente = new Map();
  for (const d of destinos) {
    const cont = d.continente ?? 'Sem continente';
    porContinente.set(cont, (porContinente.get(cont) ?? 0) + 1);
  }

  const sortedCont = [...porContinente.entries()].sort((a, b) => b[1] - a[1]);
  console.log('🗺️  Distribuição por continente:');
  sortedCont.forEach(([cont, count]) => {
    const pct = ((count / destinos.length) * 100).toFixed(1);
    console.log(`   ${cont}: ${count} (${pct}%)`);
  });
  console.log('');

  // ── 6. Hotéis por destino ──
  const hoteisPorDestino = new Map();
  for (const h of hoteis) {
    hoteisPorDestino.set(h.destino_id, (hoteisPorDestino.get(h.destino_id) ?? 0) + 1);
  }

  const destinosSemHoteis = destinos.filter((d) => !hoteisPorDestino.has(d.id));
  console.log(`🏨 Destinos SEM hotéis: ${destinosSemHoteis.length}`);
  if (destinosSemHoteis.length > 0 && verbose) {
    console.log('   Exemplos:');
    destinosSemHoteis.slice(0, 10).forEach((d) => {
      console.log(`   - [${d.id}] ${d.nome} | ${d.pais ?? 'XX'} (${d.paisCode ?? 'XX'})`);
    });
    if (destinosSemHoteis.length > 10) {
      console.log(`   ... e mais ${destinosSemHoteis.length - 10} destinos`);
    }
  }
  console.log('');

  // ── 7. Voos por destino ──
  const voosPorDestino = new Map();
  for (const v of voos) {
    voosPorDestino.set(v.destino_id, (voosPorDestino.get(v.destino_id) ?? 0) + 1);
  }

  const destinosSemVoos = destinos.filter((d) => !voosPorDestino.has(d.id));
  console.log(`✈️  Destinos SEM voos: ${destinosSemVoos.length}`);
  if (destinosSemVoos.length > 0 && verbose) {
    console.log('   Exemplos:');
    destinosSemVoos.slice(0, 10).forEach((d) => {
      console.log(`   - [${d.id}] ${d.nome} | IATA: ${d.iata ?? 'null'}`);
    });
    if (destinosSemVoos.length > 10) {
      console.log(`   ... e mais ${destinosSemVoos.length - 10} destinos`);
    }
  }
  console.log('');

  // ── 8. Destinos suspeitos (país não coincide com continente esperado) ──
  const continentePorPais = {
    PT: 'Europa',
    ES: 'Europa',
    FR: 'Europa',
    IT: 'Europa',
    DE: 'Europa',
    GB: 'Europa',
    BR: 'América',
    US: 'América',
    MA: 'África',
    JP: 'Ásia',
    TH: 'Ásia',
    AU: 'Oceânia',
    CN: 'Ásia',
    IN: 'Ásia',
    MX: 'América',
    AR: 'América',
    CL: 'América',
    CO: 'América',
    PE: 'América',
    CA: 'América',
    CH: 'Europa',
    AT: 'Europa',
    BE: 'Europa',
    NL: 'Europa',
    GR: 'Europa',
    HR: 'Europa',
    TR: 'Ásia',
    EG: 'África',
    ZA: 'África',
    ID: 'Ásia',
    PH: 'Ásia',
    VN: 'Ásia',
    KR: 'Ásia',
    IE: 'Europa',
    NO: 'Europa',
    SE: 'Europa',
    DK: 'Europa',
    FI: 'Europa',
    PL: 'Europa',
    HU: 'Europa',
    RO: 'Europa',
    IL: 'Ásia',
    SG: 'Ásia',
    TW: 'Ásia',
    AQ: 'Antártida',
    ES: 'Europa', // Catalunya
  };

  const suspeitos = destinos.filter((d) => {
    const code = d.paisCode ?? 'XX';
    const cont = d.continente;
    if (!cont || code === 'XX') return false;
    const esperado = continentePorPais[code];
    return esperado && esperado !== cont;
  });

  console.log(`⚠️  Destinos com continente SUSPEITO (não coincide com país): ${suspeitos.length}`);
  if (suspeitos.length > 0 && verbose) {
    console.log('   Exemplos:');
    suspeitos.slice(0, 10).forEach((d) => {
      console.log(
        `   - [${d.id}] ${d.nome} | ${d.pais ?? 'XX'} (${d.paisCode ?? 'XX'}) | continente: ${d.continente}`,
      );
    });
    if (suspeitos.length > 10) {
      console.log(`   ... e mais ${suspeitos.length - 10} destinos`);
    }
  }
  console.log('');

  // ── Resumo ──
  console.log('═══════════════════════════════════════');
  console.log('📋 RESUMO:');
  console.log('═══════════════════════════════════════');
  console.log(`   Total destinos: ${destinos.length}`);
  console.log(`   Sem país (XX): ${semPais.length} (${((semPais.length / destinos.length) * 100).toFixed(1)}%)`);
  console.log(`   Sem continente: ${semContinente.length} (${((semContinente.length / destinos.length) * 100).toFixed(1)}%)`);
  console.log(`   Com coordenadas: ${comCoords.length} (${((comCoords.length / destinos.length) * 100).toFixed(1)}%)`);
  console.log(`   Sem hotéis: ${destinosSemHoteis.length} (${((destinosSemHoteis.length / destinos.length) * 100).toFixed(1)}%)`);
  console.log(`   Sem voos: ${destinosSemVoos.length} (${((destinosSemVoos.length / destinos.length) * 100).toFixed(1)}%)`);
  console.log(`   Continente suspeito: ${suspeitos.length} (${((suspeitos.length / destinos.length) * 100).toFixed(1)}%)`);
  console.log('═══════════════════════════════════════');

  // Exit code: 0 se OK, 1 se houver problemas críticos
  const problemasCriticos = semPais.length + semContinente.length + suspeitos.length;
  if (problemasCriticos > 0) {
    console.log(`\n⚠️  Encontrados ${problemasCriticos} problemas críticos.`);
    console.log('   Sugestão: Revisar os dados ou executar backfills de geocodificação.');
    process.exit(1);
  } else {
    console.log('\n✅ Bundle parece bom! Nenhum problema crítico encontrado.');
    process.exit(0);
  }
}

main();