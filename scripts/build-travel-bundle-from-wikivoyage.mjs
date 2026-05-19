/**
 * Converte artigos Wikivoyage (JSONL) → bundle de viagens demo (destinos, hotéis, voos).
 *
 * Uso:
 *   node scripts/build-travel-bundle-from-wikivoyage.mjs
 *   node scripts/build-travel-bundle-from-wikivoyage.mjs --lang pt
 *
 * Requer: data/wikivoyage/out/pt-articles.jsonl (npm run wikivoyage:extract:pt)
 */
import { createReadStream, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const WV_OUT = resolve(ROOT, 'data/wikivoyage/out');
const TRAVEL_OUT = resolve(ROOT, 'src/data/travel-mock');

const ORIGENS_VOO = ['LIS', 'OPO', 'FNC', 'PDL', 'MAD', 'BCN', 'LHR', 'CDG', 'FRA', 'AMS', 'FCO', 'DUB'];
const AIRLINES = [
  'TAP Air Portugal', 'Ryanair', 'easyJet', 'Iberia', 'Vueling', 'Lufthansa', 'Air France', 'KLM',
  'British Airways', 'Emirates', 'Turkish Airlines', 'Swiss', 'Aegean',
];
const MAX_HOTELS_PER_DEST = parseInt(process.env.MAX_HOTELS_PER_DEST ?? '40', 10);
const MAX_DESTINATIONS = parseInt(process.env.MAX_WV_DESTINATIONS ?? '0', 10) || Infinity;

/** Nome do artigo → IATA (expandido para demo PT/EU) */
const CITY_IATA = {
  Lisboa: 'LIS',
  Lisbon: 'LIS',
  Porto: 'OPO',
  Oporto: 'OPO',
  Faro: 'FAO',
  Funchal: 'FNC',
  'Ponta Delgada': 'PDL',
  'Angra do Heroísmo': 'TER',
  Horta: 'HOR',
  Coimbra: 'CBP',
  Braga: 'BGZ',
  Évora: 'EUR',
  Aveiro: 'AVE',
  Cascais: 'LIS',
  Sintra: 'LIS',
  Lagos: 'FAO',
  Tavira: 'FAO',
  Madrid: 'MAD',
  Barcelona: 'BCN',
  'Barcelona ': 'BCN',
  Paris: 'CDG',
  Londres: 'LHR',
  London: 'LHR',
  Dublin: 'DUB',
  Roma: 'FCO',
  Rome: 'FCO',
  Milão: 'MXP',
  Milan: 'MXP',
  Veneza: 'VCE',
  Venice: 'VCE',
  Florença: 'FLR',
  Florence: 'FLR',
  Berlim: 'BER',
  Berlin: 'BER',
  Munique: 'MUC',
  Munich: 'MUC',
  Amesterdão: 'AMS',
  Amsterdam: 'AMS',
  Bruxelas: 'BRU',
  Brussels: 'BRU',
  Zurique: 'ZRH',
  Zurich: 'ZRH',
  Viena: 'VIE',
  Vienna: 'VIE',
  Praga: 'PRG',
  Prague: 'PRG',
  Atenas: 'ATH',
  Athens: 'ATH',
  Istambul: 'IST',
  Istanbul: 'IST',
  Dubai: 'DXB',
  'Nova Iorque': 'JFK',
  'New York': 'JFK',
  Miami: 'MIA',
  'Rio de Janeiro': 'GIG',
  'São Paulo': 'GRU',
  'Buenos Aires': 'EZE',
  Marraquexe: 'RAK',
  Marrakech: 'RAK',
  'Cidade do Cabo': 'CPT',
  'Cape Town': 'CPT',
  Sydney: 'SYD',
  'Buenos Aires': 'EZE',
  Bangkok: 'BKK',
  Singapura: 'SIN',
  Singapore: 'SIN',
  Tóquio: 'NRT',
  Tokyo: 'NRT',
  Reykjavík: 'KEF',
  Reykjavik: 'KEF',
  Oslo: 'OSL',
  Estocolmo: 'ARN',
  Stockholm: 'ARN',
  Copenhaga: 'CPH',
  Copenhagen: 'CPH',
  Varsóvia: 'WAW',
  Warsaw: 'WAW',
  Budapeste: 'BUD',
  Budapest: 'BUD',
  Nice: 'NCE',
  Genebra: 'GVA',
  Geneva: 'GVA',
  Edimburgo: 'EDI',
  Edinburgh: 'EDI',
  Sevilha: 'SVQ',
  Seville: 'SVQ',
  Valência: 'VLC',
  Valencia: 'VLC',
  Granada: 'GRX',
  Salamanca: 'SLM',
  Bilbau: 'BIO',
  Bordeaux: 'BOD',
  Lyon: 'LYS',
  Marselha: 'MRS',
  Marseille: 'MRS',
  Nantes: 'NTE',
  Estrasburgo: 'SXB',
  Luxemburgo: 'LUX',
  Mónaco: 'NCE',
  Monaco: 'NCE',
  Andorra: 'TLS',
  Gibraltar: 'GIB',
  Malta: 'MLA',
  Valletta: 'MLA',
  Split: 'SPU',
  Dubrovnik: 'DBV',
  Zagreb: 'ZAG',
  Sarajevo: 'SJJ',
  Belgrado: 'BEG',
  Bucareste: 'OTP',
  Sofia: 'SOF',
  Cracóvia: 'KRK',
  Cracovia: 'KRK',
  Gdansk: 'GDN',
  Helsínquia: 'HEL',
  Helsinki: 'HEL',
  Tallinn: 'TLL',
  Riga: 'RIX',
  Vilnius: 'VNO',
  Kiev: 'KBP',
  Kyiv: 'KBP',
  Moscovo: 'SVO',
  Moscow: 'SVO',
  'São Petersburgo': 'LED',
  Casablanca: 'CMN',
  Tunis: 'TUN',
  Cairo: 'CAI',
  'Cairo ': 'CAI',
  Luxor: 'LXR',
  Nairobi: 'NBO',
  Zanzibar: 'ZNZ',
  Mauritius: 'MRU',
  Seychelles: 'SEZ',
  Maldivas: 'MLE',
  Maldives: 'MLE',
  Bali: 'DPS',
  'Hong Kong': 'HKG',
  Pequim: 'PEK',
  Beijing: 'PEK',
  Xangai: 'PVG',
  Shanghai: 'PVG',
  Seoul: 'ICN',
  'Sri Lanka': 'CMB',
  Colombo: 'CMB',
  Hanoi: 'HAN',
  'Ho Chi Minh': 'SGN',
  'Kuala Lumpur': 'KUL',
  Jakarta: 'CGK',
  Manila: 'MNL',
  'Siem Reap': 'REP',
  'Phnom Penh': 'PNH',
  Luanda: 'LAD',
  Maputo: 'MPM',
  'Praia': 'RAI',
  Bissau: 'OXB',
  Macau: 'MFM',
  'Las Vegas': 'LAS',
  'Los Angeles': 'LAX',
  'San Francisco': 'SFO',
  Chicago: 'ORD',
  Boston: 'BOS',
  Washington: 'IAD',
  Toronto: 'YYZ',
  Vancouver: 'YVR',
  'Mexico City': 'MEX',
  Cancún: 'CUN',
  Cancun: 'CUN',
  Havana: 'HAV',
  Lima: 'LIM',
  Cusco: 'CUZ',
  Bogotá: 'BOG',
  Bogota: 'BOG',
  Cartagena: 'CTG',
  Santiago: 'SCL',
  Montevideo: 'MVD',
  Quito: 'UIO',
  'La Paz': 'LPB',
  'Machu Picchu': 'CUZ',
  Patagónia: 'BRC',
  Galápagos: 'GPS',
  Antártida: 'USH',
  Islândia: 'KEF',
  Noruega: 'OSL',
  Suécia: 'ARN',
  Finlândia: 'HEL',
  Dinamarca: 'CPH',
  Alemanha: 'FRA',
  França: 'CDG',
  Espanha: 'MAD',
  Itália: 'FCO',
  Grécia: 'ATH',
  Croácia: 'SPU',
  Portugal: 'LIS',
};

const COUNTRY_HINTS = [
  { re: /\bPortugal\b|português/i, name: 'Portugal', code: 'PT', continent: 'Europa' },
  { re: /\bEspanha\b|espanhol|Spain\b/i, name: 'Espanha', code: 'ES', continent: 'Europa' },
  { re: /\bFrança\b|francês|France\b/i, name: 'França', code: 'FR', continent: 'Europa' },
  { re: /\bItália\b|italiano|Italy\b/i, name: 'Itália', code: 'IT', continent: 'Europa' },
  { re: /\bAlemanha\b|alemão|Germany\b/i, name: 'Alemanha', code: 'DE', continent: 'Europa' },
  { re: /\bReino Unido\b|britânico|United Kingdom\b/i, name: 'Reino Unido', code: 'GB', continent: 'Europa' },
  { re: /\bBrasil\b|brasileiro|Brazil\b/i, name: 'Brasil', code: 'BR', continent: 'América' },
  { re: /\bEstados Unidos\b|americano|United States\b/i, name: 'Estados Unidos', code: 'US', continent: 'América' },
  { re: /\bMarrocos\b|moroccan|Morocco\b/i, name: 'Marrocos', code: 'MA', continent: 'África' },
  { re: /\bJapão\b|japonês|Japan\b/i, name: 'Japão', code: 'JP', continent: 'Ásia' },
  { re: /\bTailândia\b|thai|Thailand\b/i, name: 'Tailândia', code: 'TH', continent: 'Ásia' },
  { re: /\bAustrália\b|australian|Australia\b/i, name: 'Austrália', code: 'AU', continent: 'Oceânia' },
];

function normalizeTitle(s) {
  return s.normalize('NFD').replace(/\p{M}/gu, '').trim();
}

function lookupIata(title) {
  if (CITY_IATA[title]) return CITY_IATA[title];
  const n = normalizeTitle(title);
  for (const [k, v] of Object.entries(CITY_IATA)) {
    if (normalizeTitle(k) === n) return v;
  }
  return null;
}

function stripWiki(text) {
  if (!text) return '';
  return text
    .replace(/\{\{[^}]*\}\}/g, ' ')
    .replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, '$1')
    .replace(/'''+/g, '')
    .replace(/==+[^=]+==+/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerpt(text, max = 420) {
  const clean = stripWiki(text);
  const cut = clean.slice(0, max);
  const last = cut.lastIndexOf('.');
  return (last > 80 ? cut.slice(0, last + 1) : cut).trim() + (clean.length > max ? '…' : '');
}

function inferCountry(text, lang) {
  for (const h of COUNTRY_HINTS) {
    if (h.re.test(text)) return { name: h.name, code: h.code, continent: h.continent };
  }
  if (lang === 'pt') return { name: 'Portugal', code: 'PT', continent: 'Europa' };
  return { name: 'Internacional', code: 'XX', continent: 'Europa' };
}

function inferTipo(text) {
  const t = text.toLowerCase();
  if (/praia|beach|costa|mar\b/i.test(t)) return 'praia';
  if (/montanha|ski|alpes|serra/i.test(t)) return 'montanha';
  if (/ilha|island|arquipélago|archipelago/i.test(t)) return 'ilha';
  if (/campo|rural|aldeia/i.test(t)) return 'campo';
  return 'cidade';
}

function inferClima(text) {
  const t = text.toLowerCase();
  if (/tropical|equatorial/i.test(t)) return 'tropical';
  if (/mediterrân|mediterrane/i.test(t)) return 'mediterrânico';
  if (/árido|desert|saara/i.test(t)) return 'árido';
  if (/polar|ártic|antártic/i.test(t)) return 'polar';
  return 'continental';
}

function inferStars(listing, nome) {
  const blob = `${nome} ${listing.sobre ?? ''} ${listing.alt ?? ''}`.toLowerCase();
  if (/5 estrela|luxury|luxo|palace|grand hotel/i.test(blob)) return 5;
  if (/4 estrela|boutique/i.test(blob)) return 4;
  if (/hostel|pousada|albergue|budget|económ/i.test(blob)) return 2;
  return 3;
}

function inferPrice(stars) {
  const base = { 2: 45, 3: 85, 4: 140, 5: 260 }[stars] ?? 90;
  return Math.round(base + Math.random() * base * 0.4);
}

function isDestinationArticle(article) {
  const { title, text } = article;
  if (!title || !text || title.includes(':')) return false;
  if (/^(Ficheiro|Categoria|Predefinição|MediaWiki|Ajuda|Wikivoyage):/i.test(title)) return false;
  if (text.length < 120) return false;
  if (/^#redirect/i.test(text.trim())) return false;
  const listings = article.listings?.length ?? 0;
  if (listings > 0) return true;
  if (/{{estilo}}/i.test(text)) return true;
  if (/==Entenda|==Chegue|==Veja|==Faça|==Coma|==Durma|==Saiba/i.test(text)) return true;
  return false;
}

function listingAmenities(listing) {
  const out = [];
  const blob = `${listing.sobre ?? ''} ${listing.wifi ?? ''}`.toLowerCase();
  if (/wifi|wi-fi|internet/i.test(blob)) out.push('wifi');
  if (/piscina|pool/i.test(blob)) out.push('piscina');
  if (/spa/i.test(blob)) out.push('spa');
  if (/estacionamento|parking/i.test(blob)) out.push('estacionamento');
  if (/pequeno.almoço|breakfast/i.test(blob)) out.push('pequeno-almoço');
  return out.length ? out : ['wifi'];
}

async function readJsonl(path) {
  const articles = [];
  if (!existsSync(path)) return articles;
  const rl = createInterface({ input: createReadStream(path, { encoding: 'utf-8' }), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      articles.push(JSON.parse(line));
    } catch {
      /* skip bad line */
    }
  }
  return articles;
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildBundle(articles, lang) {
  const rand = mulberry32(42 + (lang === 'en' ? 1 : 0));
  const destinos = [];
  const hoteis = [];
  const voos = [];
  let destId = 0;
  let hotelId = 0;
  let flightId = 0;

  const candidates = articles.filter(isDestinationArticle);
  const limited =
    MAX_DESTINATIONS < Infinity ? candidates.slice(0, MAX_DESTINATIONS) : candidates;

  for (const art of limited) {
    const title = art.title.trim();
    const text = art.text ?? '';
    const country = inferCountry(text, lang);
    const iata = lookupIata(title);
    const listings = art.listings ?? [];

    destId += 1;
    const slug = title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    destinos.push({
      id: destId,
      nome: title,
      pais: country.name,
      paisCode: country.code,
      iata,
      continente: country.continent,
      tipo: inferTipo(text),
      clima: inferClima(text),
      descricao: excerpt(text),
      descricaoCompleta: excerpt(text, 1200),
      imagem_url: `https://images.unsplash.com/photo-1469854523086-cc02afe5c88?auto=format&fit=crop&w=1200&q=70&sig=${destId}`,
      imagem_query: `${title},${country.name},travel`,
      wikivoyageUrl: art.url,
      lang: art.lang ?? lang,
    });

    const hotelList = listings.slice(0, MAX_HOTELS_PER_DEST);
    for (const listing of hotelList) {
      const nome =
        listing.nome || listing.name || listing.alt || `Alojamento ${hotelId + 1}`;
      if (!nome || nome.length < 2) continue;
      const stars = inferStars(listing, nome);
      hotelId += 1;
      hoteis.push({
        id: hotelId,
        destino_id: destId,
        nome: nome.trim(),
        estrelas: stars,
        preco_por_noite: inferPrice(stars),
        comodidades: listingAmenities(listing),
        wikivoyageUrl: art.url,
      });
    }

    if (iata) {
      for (const origem of ORIGENS_VOO) {
        if (origem === iata) continue;
        flightId += 1;
        voos.push({
          id: flightId,
          origem,
          destino_id: destId,
          destino_iata: iata,
          preco: Math.round(35 + rand() * 900),
          duracao_minutos: 50 + Math.floor(rand() * 800),
          companhia: AIRLINES[Math.floor(rand() * AIRLINES.length)],
          cabin_class: rand() > 0.88 ? 'business' : rand() > 0.6 ? 'premium_economy' : 'economy',
          escalas: rand() > 0.5 ? 0 : rand() > 0.5 ? 1 : 2,
        });
      }
    }
  }

  return {
    meta: {
      seed: 42,
      generatedAt: new Date().toISOString(),
      source: 'wikivoyage',
      license: 'CC BY-SA 3.0',
      langs: [lang],
      counts: { destinos: destinos.length, hoteis: hoteis.length, voos: voos.length },
    },
    destinos,
    hoteis,
    voos,
  };
}

function mergeBundles(a, b) {
  const destinos = [...a.destinos];
  const hoteis = [...a.hoteis];
  const voos = [...a.voos];
  const idOffset = destinos.length;
  const hotelOffset = hoteis.length;
  const flightOffset = voos.length;

  for (const d of b.destinos) {
    destinos.push({ ...d, id: d.id + idOffset });
  }
  for (const h of b.hoteis) {
    hoteis.push({ ...h, id: h.id + hotelOffset, destino_id: h.destino_id + idOffset });
  }
  for (const v of b.voos) {
    voos.push({
      ...v,
      id: v.id + flightOffset,
      destino_id: v.destino_id + idOffset,
    });
  }

  return {
    meta: {
      seed: 42,
      generatedAt: new Date().toISOString(),
      source: 'wikivoyage',
      license: 'CC BY-SA 3.0',
      langs: [...new Set([...(a.meta.langs ?? []), ...(b.meta.langs ?? [])])],
      counts: { destinos: destinos.length, hoteis: hoteis.length, voos: voos.length },
    },
    destinos,
    hoteis,
    voos,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const langArg = args.includes('--lang')
    ? args[args.indexOf('--lang') + 1]
    : 'pt';
  const langs = langArg === 'both' ? ['pt', 'en'] : [langArg];

  mkdirSync(TRAVEL_OUT, { recursive: true });

  let bundle = null;
  for (const lang of langs) {
    const jsonl = resolve(WV_OUT, `${lang}-articles.jsonl`);
    if (!existsSync(jsonl)) {
      console.warn(`Skip ${lang}: missing ${jsonl}`);
      continue;
    }
    console.log(`Reading ${jsonl}...`);
    const articles = await readJsonl(jsonl);
    console.log(`  ${articles.length} articles loaded`);
    const part = buildBundle(articles, lang);
    console.log(
      `  -> ${part.meta.counts.destinos} destinos, ${part.meta.counts.hoteis} hotéis, ${part.meta.counts.voos} voos`,
    );
    bundle = bundle ? mergeBundles(bundle, part) : part;
  }

  if (!bundle) {
    console.error('No Wikivoyage JSONL found. Run: npm run wikivoyage:extract:pt');
    process.exit(1);
  }

  const outPath = resolve(TRAVEL_OUT, 'bundle-wikivoyage.json');
  writeFileSync(outPath, JSON.stringify(bundle));
  const mb = (Buffer.byteLength(JSON.stringify(bundle)) / 1024 / 1024).toFixed(2);
  console.log(`\nWrote ${outPath} (${mb} MB)`);
  console.log(
    `Total: ${bundle.meta.counts.destinos} destinos, ${bundle.meta.counts.hoteis} hotéis, ${bundle.meta.counts.voos} voos`,
  );
  console.log('Set TRAVEL_DEMO_DATA=wikivoyage in .env.local to use this bundle.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
