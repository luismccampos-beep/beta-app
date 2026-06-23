/**
 * Analisa destinos sem país no bundle para identificar padrões.
 *
 * Uso:
 *   node scripts/analyze-bundle-countries.mjs
 *   node scripts/analyze-bundle-countries.mjs --bundle=src/data/travel-mock/bundle-wikivoyage.json
 *   node scripts/analyze-bundle-countries.mjs --limit=50
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
const limitArg = args.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : 100;

function main() {
  if (!existsSync(BUNDLE_PATH)) {
    console.error(`❌ Bundle não encontrado: ${BUNDLE_PATH}`);
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(BUNDLE_PATH, 'utf8'));
  const destinos = bundle.destinos ?? [];

  const semPais = destinos.filter((d) => !d.paisCode || d.paisCode === 'XX');

  console.log(`🔍 Analisando ${semPais.length} destinos sem país...\n`);

  // Agrupar por padrões no nome
  const padroes = {
    comParenteses: [],
    comSlash: [],
    comNumero: [],
    comAcento: [],
    muitoLongos: [],
    outros: [],
  };

  for (const d of semPais) {
    const nome = d.nome ?? '';
    if (/\([^)]+\)/.test(nome)) {
      padroes.comParenteses.push(d);
    } else if (nome.includes('/')) {
      padroes.comSlash.push(d);
    } else if (/\d/.test(nome)) {
      padroes.comNumero.push(d);
    } else if (/[áàâãéèêíïóôõúüñç]/i.test(nome)) {
      padroes.comAcento.push(d);
    } else if (nome.length > 30) {
      padroes.muitoLongos.push(d);
    } else {
      padroes.outros.push(d);
    }
  }

  console.log('📊 Padrões encontrados:');
  console.log(`   Com parênteses (ex: "Cidade (País)"): ${padroes.comParenteses.length}`);
  console.log(`   Com slash (ex: "Cidade/Região"): ${padroes.comSlash.length}`);
  console.log(`   Com números (ex: "City 2"): ${padroes.comNumero.length}`);
  console.log(`   Com acentos (ex: "São Paulo"): ${padroes.comAcento.length}`);
  console.log(`   Muito longos (>30 chars): ${padroes.muitoLongos.length}`);
  console.log(`   Outros: ${padroes.outros.length}`);
  console.log('');

  // Mostrar exemplos de cada categoria
  console.log('═══════════════════════════════════════');
  console.log('📋 EXEMPLOS POR CATEGORIA:');
  console.log('═══════════════════════════════════════\n');

  if (padroes.comParenteses.length > 0) {
    console.log(`1. COM PARÊNTESES (${padroes.comParenteses.length}):`);
    padroes.comParenteses.slice(0, LIMIT).forEach((d) => {
      console.log(`   - ${d.nome}`);
    });
    console.log('');
  }

  if (padroes.comSlash.length > 0) {
    console.log(`2. COM SLASH (${padroes.comSlash.length}):`);
    padroes.comSlash.slice(0, LIMIT).forEach((d) => {
      console.log(`   - ${d.nome}`);
    });
    console.log('');
  }

  if (padroes.comNumero.length > 0) {
    console.log(`3. COM NÚMEROS (${padroes.comNumero.length}):`);
    padroes.comNumero.slice(0, LIMIT).forEach((d) => {
      console.log(`   - ${d.nome}`);
    });
    console.log('');
  }

  if (padroes.comAcento.length > 0) {
    console.log(`4. COM ACENTOS (${padroes.comAcento.length}):`);
    padroes.comAcento.slice(0, LIMIT).forEach((d) => {
      console.log(`   - ${d.nome}`);
    });
    console.log('');
  }

  if (padroes.muitoLongos.length > 0) {
    console.log(`5. MUITO LONGOS (${padroes.muitoLongos.length}):`);
    padroes.muitoLongos.slice(0, LIMIT).forEach((d) => {
      console.log(`   - ${d.nome}`);
    });
    console.log('');
  }

  if (padroes.outros.length > 0) {
    console.log(`6. OUTROS (${padroes.outros.length}):`);
    padroes.outros.slice(0, LIMIT).forEach((d) => {
      console.log(`   - ${d.nome}`);
    });
    console.log('');
  }

  // Análise de comprimento
  const comprimentos = semPais.map((d) => d.nome?.length ?? 0);
  const avgLen = comprimentos.reduce((a, b) => a + b, 0) / comprimentos.length;
  const maxLen = Math.max(...comprimentos);
  const minLen = Math.min(...comprimentos);

  console.log('═══════════════════════════════════════');
  console.log('📏 ESTATÍSTICAS DE COMPRIMENTO:');
  console.log('═══════════════════════════════════════');
  console.log(`   Média: ${avgLen.toFixed(1)} caracteres`);
  console.log(`   Mínimo: ${minLen} caracteres`);
  console.log(`   Máximo: ${maxLen} caracteres`);
  console.log('');

  // Distribuição por tamanho
  const faixas = {
    '0-10': 0,
    '11-20': 0,
    '21-30': 0,
    '31-50': 0,
    '51+': 0,
  };

  for (const len of comprimentos) {
    if (len <= 10) faixas['0-10']++;
    else if (len <= 20) faixas['11-20']++;
    else if (len <= 30) faixas['21-30']++;
    else if (len <= 50) faixas['31-50']++;
    else faixas['51+']++;
  }

  console.log('📊 Distribuição por comprimento:');
  for (const [faixa, count] of Object.entries(faixas)) {
    const pct = ((count / semPais.length) * 100).toFixed(1);
    console.log(`   ${faixa} chars: ${count} (${pct}%)`);
  }
  console.log('');

  // Sugestões
  console.log('═══════════════════════════════════════');
  console.log('💡 SUGESTÕES DE CORREÇÃO:');
  console.log('═══════════════════════════════════════');
  console.log('');

  if (padroes.comParenteses.length > 0) {
    console.log('1. Parênteses: Verificar se o conteúdo entre parênteses é um país/região');
    console.log('   Ex: "Taichung (Taiwan)" → adicionar ao PAREN_COUNTRY');
    console.log('');
  }

  if (padroes.comSlash.length > 0) {
    console.log('2. Slash: Verificar se o segundo segmento é um país');
    console.log('   Ex: "Zona Volcànica de la Garrotxa/Catalunya" → adicionar ao SEGMENT_COUNTRY');
    console.log('');
  }

  if (padroes.comAcento.length > 0) {
    console.log('3. Acentos: Verificar se são cidades conhecidas não mapeadas');
    console.log('   Ex: "Adis Abeba" → adicionar ao MANUAL_CITY_COUNTRY');
    console.log('');
  }

  console.log('4. Geral: A maioria dos destinos sem país são cidades pequenas/pouco conhecidas');
  console.log('   que não estão em nenhum dos mapas. Considerar:');
  console.log('   - Aumentar o CITY_COUNTRY_CSV com mais cidades');
  console.log('   - Usar geocodificação automática (Photon/GeoNames) como fallback');
  console.log('   - Aceitar que ~30-40% de artigos Wikivoyage são de locais obscuros');
  console.log('');
}

main();