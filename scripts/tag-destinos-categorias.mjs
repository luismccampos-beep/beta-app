/**
 * tag-destinos-categorias.mjs
 *
 * Classifica automaticamente cada destino do bundle-wikivoyage.json
 * em categorias (Cultura, Natureza, Aventura, Gastronomia, etc.)
 * baseado em keywords nos campos descricao, veja, faca, coma, dicas,
 * tags, tipo e nome.
 *
 * Uso:
 *   node scripts/tag-destinos-categorias.mjs              # atualiza bundle
 *   node scripts/tag-destinos-categorias.mjs --stats      # só estatísticas
 *   node scripts/tag-destinos-categorias.mjs --db         # atualiza DB também
 *   node scripts/tag-destinos-categorias.mjs --limit=100  # testar c/ 100
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE_PATH = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');

// --- Categorias e keywords (português) ---
// Cada categoria tem um array de palavras/expressões a pesquisar nos campos.
// A ordem importa: mais específicas primeiro para evitar falsos positivos.
const CATEGORIA_KEYWORDS = {
  'Cultura': [
    // Monumentos & História
    'museu', 'museus', 'igreja', 'igrejas', 'monumento', 'monumentos',
    'património', 'patrimônio', 'património mundial', 'patrimônio mundial',
    'castelo', 'castelos', 'palácio', 'palácios', 'fortaleza',
    'catedral', 'catedrais', 'sé', 'basílica', 'mosteiro', 'convento',
    'ruínas', 'ruina', 'sítio arqueológico', 'sítio arqueológico',
    'património histórico', 'patrimônio histórico',
    'património cultural', 'patrimônio cultural',
    'centro histórico', 'cidade histórica', 'cidade velha',
    'unesco', 'classificado', 'classificada',
    'arquitectura', 'arquitetura', 'barroco', 'renascentista', 'gótico',
    'medieval', 'românico', 'manuelino', 'azulejo', 'azulejos',
    // Arte & Cultura
    'galeria', 'galerias', 'exposição', 'exposições', 'teatro', 'teatros',
    'ópera', 'cinema', 'cinemas', 'biblioteca', 'bibliotecas',
    'centro cultural', 'centro de arte', 'fundação',
    'arte sacra', 'arte contemporânea', 'arte moderna',
    'artesanato', 'artista', 'artistas', 'pintura', 'escultura',
    'sinagoga', 'mesquita', 'templo', 'pagode', 'estupa',
    'mausoléu', 'túmulo', 'sepultura',
  ],
  'Natureza': [
    'parque', 'parques', 'parque nacional', 'parque natural',
    'reserva natural', 'reserva', 'paisagem', 'paisagens',
    'montanha', 'montanhas', 'serra', 'cordilheira', 'pico', 'picos',
    'trilha', 'trilhas', 'trilho', 'trilhos', 'caminhada', 'caminhadas',
    'sendeiro', 'sendeiros', 'percurso pedestre', 'rota', 'rotas',
    'miradouro', 'miradouros', 'vista panorâmica',
    'floresta', 'florestas', 'bosque', 'selva', 'mata', 'amazónia', 'amazônia',
    'rio', 'rios', 'cascata', 'cascatas', 'queda de água', 'cacheira',
    'lago', 'lagos', 'lagoa', 'lagoas', 'ribeira', 'ribeiras',
    'gruta', 'grutas', 'caverna', 'cavernas', 'algar', 'algares',
    'vulcão', 'vulcões', 'cratera', 'geiser', 'termas', 'águas termais',
    'jardim', 'jardins', 'jardim botânico', 'jardim zoológico',
    'observação de aves', 'birdwatching', 'fauna', 'flora',
    'natureza', 'nature', 'ecoturismo', 'eco-turismo',
    'campo', 'campos', 'aldeia', 'aldeias', 'interior', 'rural',
    'vale', 'vales', 'planície', 'planícies', 'penhasco',
    'arquipélago', 'ilha', 'ilhas', 'ilhéu', 'ilhéus',
    'dunas', 'deserto', 'oásis',
  ],
  'Praia & Sol': [
    'praia', 'praias', 'areia', 'mar', 'oceano', 'atlântico',
    'costa', 'costeiro', 'litoral', 'litorâneo', 'litorânea',
    'baía', 'baias', 'enseada', 'enseadas', 'calheta',
    'piscina', 'piscinas', 'piscina natural', 'piscinas naturais',
    'marisco', 'peixe fresco', 'frente-mar',
    'verão', 'veraneio', 'banhos', 'banhista', 'nadar', 'natação',
    'barco', 'barcos', 'iate', 'iates', 'veleiro', 'vela', 'navegação',
    'mergulho', 'snorkeling', 'snorkel', 'surf', 'bodyboard',
    'passeio de barco', 'passeios de barco', 'cruzeiro', 'cruzeiros',
    'sol', 'pôr do sol', 'pôr-do-sol', 'nascer do sol',
    'tropical', 'paraíso', 'ilha paradisíaca',
  ],
  'Aventura': [
    'trilha radical', 'trilha', 'trekking', 'montanhismo', 'alpinismo',
    'escalada', 'rapel', 'slide', 'tirolesa', 'canyoning',
    'mergulho', 'mergulho', 'snorkeling', 'snorkel',
    'surf', 'bodyboard', 'kitesurf', 'windsurf', 'stand up paddle',
    'rafting', 'canoagem', 'caiaque', 'kayak', 'canoa',
    'bungee jumping', 'paraquedismo', 'asas-delta', 'parapente',
    'safari', 'safáris', 'big five', 'observação de animais',
    'bicicleta', 'btt', 'mountain bike', 'ciclismo', 'pedalar',
    'destino radical', 'aventura', 'desporto radical', 'desportos radicais',
    'explorar', 'exploração', 'expedição',
    'paintball', 'airsoft', 'quad', 'buggy', 'jipe', '4x4',
    'espeleologia', 'gruta', 'caverna',
  ],
  'Gastronomia': [
    'gastronomia', 'culinária', 'cozinha', 'cozinhar',
    'restaurante', 'restaurantes', 'tasca', 'tascas', 'taberna',
    'comer', 'comida', 'comidas', 'prato', 'pratos', 'especialidade',
    'vinho', 'vinhos', 'adega', 'adegas', 'enoturismo', 'rota dos vinhos',
    'cerveja', 'cervejas', 'cervejaria', 'cervejarias', 'pub', 'pubs',
    'queijo', 'queijos', 'presunto', 'enchidos', 'salsicharia',
    'azeite', 'pão', 'pastelaria', 'doçaria', 'doce', 'doces',
    'mercado', 'mercados', 'mercado municipal', 'mercado tradicional',
    'feira', 'feiras', 'feira gastronómica', 'feira gastronômica',
    'prova de vinhos', 'degustação', 'degustações',
    'comer bem', 'cozinha típica', 'cozinha regional',
    'petiscos', 'tapas', 'pintxos', 'meze',
    'street food', 'comida de rua', 'food truck',
    'bar', 'bares', 'café', 'cafés', 'cafetaria',
  ],
  'Vida Noturna': [
    'vida noturna', 'noite', 'noitada',
    'bar', 'bares', 'pub', 'pubs', 'discoteca', 'discotecas',
    'balada', 'baladas', 'festa', 'festas', 'festas populares',
    'clube', 'clubes', 'nightclub', 'boate', 'boates',
    'música ao vivo', 'concerto', 'concertos', 'show', 'shows',
    'dança', 'dançar', 'fado', 'samba', 'forró', 'axé', 'sertanejo',
    'kizomba', 'salsa', 'reggaeton', 'eletrónica', 'música eletrónica',
    'cocktail', 'cocktails', 'coquetel', 'coquetéis', 'drink', 'drinks',
    'happy hour', 'after hours', 'after',
    'casino', 'cassino', 'cassinos',
    'espetáculo', 'espetáculos', 'entretenimento',
  ],
  'Relaxamento': [
    'spa', 'spas', 'bem-estar', 'bem estar', 'wellness', 'saúde',
    'yoga', 'meditação', 'pilates', 'alongamento',
    'massagem', 'massagens', 'tratamento', 'tratamentos',
    'termas', 'águas termais', 'caldas', 'banhos termais',
    'retiro', 'retiros', 'relaxamento', 'relaxar', 'descanso',
    'paisagem tranquila', 'paisagem serena', 'paz', 'tranquilidade',
    'jardim zen', 'jardim japonês', 'aromaterapia',
    'sauna', 'banho turco', 'hammam', 'jacuzzi', 'hidromassagem',
    'vista relaxante', 'ambiente calmo', 'lugares tranquilos',
    'férias relaxantes', 'descansar', 'recarregar', 'escape',
  ],
  'Romântico': [
    'romântico', 'romântica', 'amor', 'casal', 'casais',
    'lua de mel', 'lua-de-mel', 'lua de mel',
    'pôr do sol', 'pôr-do-sol', 'por-do-sol', 'paisagem romântica',
    'jantar à luz de velas', 'jantar romântico',
    'viagem a dois', 'escapadinha', 'fim de semana romântico',
    'passeio romântico', 'passeio a dois',
    'hotel romântico', 'suíte', 'suíte nupcial', 'vista panorâmica',
    'miradouro', 'miradouros', 'pôr do sol',
    'destino romântico', 'paraíso', 'refúgio',
    'jardim', 'jardins', 'flores', 'roseiral',
    'gôndola', 'passeio de barco', 'passeio de gôndola',
  ],
  'Família': [
    'família', 'famílias', 'familiar', 'criança', 'crianças', 'filhos',
    'parque temático', 'parque aquático', 'parque de diversões',
    'zoológico', 'jardim zoológico', 'aquário', 'delfinário',
    'actividades para crianças', 'atividades para crianças',
    'parque infantil', 'playground', 'brinquedos',
    'escola', 'museu interactivo', 'museu interativo',
    'passeio em família', 'viagem em família',
    'hotel familiar', 'resort familiar',
    'seguro', 'tranquilo', 'calmo', 'acessível',
    'animação', 'entretenimento infantil',
    'minigolfe', 'mini-golfe', 'kart', 'karting',
    'praia familiar', 'praia para famílias',
  ],
  'Luxo': [
    'luxo', 'luxuoso', 'luxuosa', 'luxury',
    '5 estrelas', 'cinco estrelas', '5-star',
    'resort', 'resorts', 'hotel de luxo',
    'suite', 'suíte', 'suite presidencial',
    'spa', 'spa de luxo', 'wellness',
    'gastronomia estrelada', 'chef', 'estrela michelin',
    'iate', 'iates', 'heliporto', 'helicóptero',
    'vip', 'exclusivo', 'exclusiva', 'privado', 'privada',
    'butique', 'boutique hotel', 'hotel boutique',
    'serviço personalizado', 'concierge', 'mordomo',
    'vista panorâmica', 'vista para o mar', 'vista para o oceano',
    'campo de golfe', 'golfe', 'clube de golfe',
    'clube privado', 'experiência premium', 'premium',
  ],
};

// --- Helpers ---

function flattenDestText(dest) {
  const parts = [];

  if (dest.nome) parts.push(dest.nome);
  if (dest.descricao) parts.push(dest.descricao);
  if (dest.descricaoCompleta) parts.push(dest.descricaoCompleta);
  if (dest.resumo) parts.push(dest.resumo);
  if (dest.wikipediaResumo) parts.push(dest.wikipediaResumo);
  if (dest.tipo) parts.push(dest.tipo);

  // Arrays de strings
  for (const field of ['veja', 'faca', 'coma']) {
    if (Array.isArray(dest[field])) {
      parts.push(...dest[field].filter(Boolean));
    }
  }

  // Dicas (objeto com arrays de strings)
  if (dest.dicas && typeof dest.dicas === 'object') {
    for (const val of Object.values(dest.dicas)) {
      if (Array.isArray(val)) parts.push(...val.filter(Boolean));
    }
  }

  // Tags
  if (Array.isArray(dest.tags)) {
    parts.push(...dest.tags.filter(Boolean));
  }

  return parts.join(' ').toLowerCase();
}

function classifyDestination(dest) {
  const text = flattenDestText(dest);
  const categorias = [];

  for (const [cat, keywords] of Object.entries(CATEGORIA_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.includes(kw)) {
        categorias.push(cat);
        break; // uma keyword basta para atribuir a categoria
      }
    }
  }

  // Se não encontrou nada, tenta inferir pelo tipo
  if (categorias.length === 0 && dest.tipo) {
    const tipoMap = {
      'praia': 'Praia & Sol',
      'montanha': 'Natureza',
      'natureza': 'Natureza',
      'cidade': null, // muito genérico, melhor ficar sem categoria
      'campo': 'Natureza',
      'deserto': 'Natureza',
      'ilha': 'Praia & Sol',
      'neve': 'Natureza',
      'ski': 'Natureza',
    };
    const fallback = tipoMap[dest.tipo.toLowerCase().trim()];
    if (fallback) categorias.push(fallback);
  }

  return [...new Set(categorias)]; // unique
}

// --- Stats ---

function printStats(stats) {
  console.log('=== Categorias atribuídas ===');
  const sorted = Object.entries(stats.categorias).sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of sorted) {
    const pct = ((count / stats.total) * 100).toFixed(1);
    console.log(`  ${cat.padEnd(20)} ${String(count).padStart(5)} destino(s) (${pct}%)`);
  }
  console.log(`\n  Sem categoria: ${stats.semCategoria} (${((stats.semCategoria / stats.total) * 100).toFixed(1)}%)`);
  console.log(`  Total: ${stats.total} destinos`);
  console.log(`  Média de categorias por destino: ${stats.media.toFixed(2)}`);
  console.log(`  Destinos com 0: ${stats.distribuicao['0'] || 0}`);
  console.log(`  Destinos com 1: ${stats.distribuicao['1'] || 0}`);
  console.log(`  Destinos com 2: ${stats.distribuicao['2'] || 0}`);
  console.log(`  Destinos com 3+: ${stats.distribuicao['3+'] || 0}`);
}

function computeStats(bundle, categoriasMap) {
  const catCounts = {};
  let semCategoria = 0;
  let totalCats = 0;
  const distribuicao = { '0': 0, '1': 0, '2': 0, '3+': 0 };

  for (const dest of bundle.destinos) {
    const cats = categoriasMap.get(dest.id) || [];
    totalCats += cats.length;

    if (cats.length === 0) {
      semCategoria++;
      distribuicao['0']++;
    } else if (cats.length === 1) {
      distribuicao['1']++;
    } else if (cats.length === 2) {
      distribuicao['2']++;
    } else {
      distribuicao['3+']++;
    }

    for (const c of cats) {
      catCounts[c] = (catCounts[c] || 0) + 1;
    }
  }

  return {
    total: bundle.destinos.length,
    categorias: catCounts,
    semCategoria,
    media: totalCats / bundle.destinos.length,
    distribuicao,
  };
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2);
  const onlyStats = args.includes('--stats');
  const syncDb = args.includes('--db');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 0;

  if (!existsSync(BUNDLE_PATH)) {
    console.error(`Bundle não encontrado: ${BUNDLE_PATH}`);
    console.error('Execute `npm run travel:demo:build` primeiro.');
    process.exit(1);
  }

  console.log('=== Auto-tagging de Categorias ===');
  console.log(`Bundle: ${BUNDLE_PATH}`);
  console.log();

  const bundle = JSON.parse(readFileSync(BUNDLE_PATH, 'utf8'));
  const destinos = limit > 0 ? bundle.destinos.slice(0, limit) : bundle.destinos;
  console.log(`Processando ${destinos.length} destinos...`);

  const categoriasMap = new Map();

  for (let i = 0; i < destinos.length; i++) {
    const dest = destinos[i];
    const cats = classifyDestination(dest);
    categoriasMap.set(dest.id, cats);

    if ((i + 1) % 1000 === 0) {
      process.stdout.write(`  ${i + 1}/${destinos.length}...\n`);
    }
  }

  const stats = computeStats({ destinos }, categoriasMap);
  console.log();
  printStats(stats);

  if (onlyStats) {
    console.log('\n(only stats — não foram feitas alterações)');
    return;
  }

  // Aplicar ao bundle
  let modificados = 0;
  for (const dest of destinos) {
    const cats = categoriasMap.get(dest.id);
    if (cats) {
      dest.categorias = cats;
      modificados++;
    }
  }

  console.log(`\n${modificados} destinos atualizados no bundle.`);

  if (limit === 0) {
    writeFileSync(BUNDLE_PATH, JSON.stringify(bundle, null, 2), 'utf8');
    console.log(`Bundle salvo em: ${BUNDLE_PATH}`);
    console.log(`Tamanho: ${(Buffer.byteLength(JSON.stringify(bundle), 'utf8') / 1024 / 1024).toFixed(2)} MB`);
  } else {
    console.log(`(modo limit=${limit} — bundle NÃO foi salvo para evitar misturar dados parciais)`);
  }

  // Sincronizar com DB (com batch)
  if (syncDb) {
    if (limit > 0) {
      console.warn('\n⚠️  --limit com --db não é recomendado (DB fica parcial). Continua assim mesmo...');
    }
    console.log('\n=== Sincronizando com DB ===');
    const { loadProjectEnv } = await import('./lib/load-env.mjs');
    loadProjectEnv(ROOT);
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
    });

    try {
      let dbOk = 0;
      const BATCH_SIZE = 500;
      const updates = [];

      for (const dest of destinos) {
        const cats = categoriasMap.get(dest.id);
        if (cats && cats.length > 0) {
          updates.push(
            prisma.wvDestination.update({
              where: { id: dest.id },
              data: { categorias: cats },
            })
          );
          if (updates.length >= BATCH_SIZE) {
            await Promise.all(updates);
            dbOk += updates.length;
            process.stdout.write(`  DB: ${dbOk}/${destinos.length}...\n`);
            updates.length = 0;
          }
        }
      }
      if (updates.length > 0) {
        await Promise.all(updates);
        dbOk += updates.length;
      }
      console.log(`DB atualizado: ${dbOk} destinos`);
    } finally {
      await prisma.$disconnect();
    }
  }

  console.log('\n=== Concluído ===');
}

main().catch(console.error);
