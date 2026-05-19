/**
 * Gera destinos, hotéis e voos mock (PT) para desenvolvimento sem Hotelbeds/Duffel.
 * Uso: node scripts/generate-travel-mock-data.mjs
 * Env: MOCK_DESTINOS=200 MOCK_HOTEIS=2000 MOCK_VOOS=3000
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../src/data/travel-mock');

const NUM_DESTINOS = parseInt(process.env.MOCK_DESTINOS ?? '120', 10);
const NUM_HOTEIS = parseInt(process.env.MOCK_HOTEIS ?? '600', 10);
const NUM_VOOS = parseInt(process.env.MOCK_VOOS ?? '900', 10);
const SEED = parseInt(process.env.MOCK_SEED ?? '42', 10);

const ORIGENS_VOO = ['LIS', 'OPO', 'FNC', 'PDL', 'MAD', 'BCN', 'LHR', 'CDG', 'FRA', 'AMS', 'FCO', 'DUB'];
const DEST_IATA_POOL = [
  'OPO', 'MAD', 'BCN', 'FAO', 'ORY', 'MXP', 'FCO', 'DUB', 'LHR', 'CDG', 'FRA', 'AMS', 'ZRH', 'VIE', 'PRG',
  'ATH', 'IST', 'DXB', 'BKK', 'SIN', 'NRT', 'JFK', 'MIA', 'GRU', 'EZE', 'RAK', 'CMN', 'CPT', 'JNB', 'SYD',
  'AKL', 'LIS', 'FNC', 'PDL', 'BER', 'BRU', 'CPH', 'OSL', 'ARN', 'HEL', 'WAW', 'BUD', 'SEZ', 'MLE', 'HKT',
];

const CONTINENTES = ['Europa', 'Ásia', 'América', 'África', 'Oceânia'];
const TIPOS = ['praia', 'montanha', 'cidade', 'campo', 'ilha'];
const CLIMAS = ['tropical', 'mediterrânico', 'continental', 'árido', 'polar'];
const HOTEL_SUFFIX = ['Hotel', 'Resort', 'Pousada', 'Albergaria', 'Palace', 'Suites'];
const AMENITIES = ['wifi', 'piscina', 'spa', 'estacionamento', 'ar-condicionado', 'pequeno-almoço', 'ginásio'];
const AIRLINES = [
  'TAP Air Portugal', 'Ryanair', 'easyJet', 'Iberia', 'Vueling', 'Lufthansa', 'Air France', 'KLM',
  'British Airways', 'Emirates', 'Turkish Airlines', 'Swiss', 'Aegean', 'Norwegian',
];
const CABINS = ['economy', 'premium_economy', 'business', 'first'];

const PT_CITIES = [
  'Lisboa', 'Porto', 'Coimbra', 'Braga', 'Faro', 'Funchal', 'Ponta Delgada', 'Évora', 'Aveiro', 'Guimarães',
  'Viana do Castelo', 'Setúbal', 'Cascais', 'Sintra', 'Lagos', 'Tavira', 'Angra do Heroísmo', 'Horta',
];
const WORLD_CITIES = [
  'Madrid', 'Barcelona', 'Paris', 'Lyon', 'London', 'Manchester', 'Dublin', 'Rome', 'Milan', 'Venice',
  'Berlin', 'Munich', 'Amsterdam', 'Brussels', 'Zurich', 'Vienna', 'Prague', 'Athens', 'Istanbul', 'Dubai',
  'Bangkok', 'Singapore', 'Tokyo', 'New York', 'Miami', 'Rio de Janeiro', 'Buenos Aires', 'Marrakech',
  'Cape Town', 'Sydney', 'Auckland', 'Reykjavik', 'Oslo', 'Stockholm', 'Copenhagen', 'Warsaw', 'Budapest',
  'Malé', 'Phuket', 'Santorini', 'Mykonos', 'Nice', 'Geneva', 'Edinburgh', 'Seville', 'Valencia', 'Porto',
];
const COUNTRIES = [
  { name: 'Portugal', code: 'PT', continent: 'Europa' },
  { name: 'Espanha', code: 'ES', continent: 'Europa' },
  { name: 'França', code: 'FR', continent: 'Europa' },
  { name: 'Reino Unido', code: 'GB', continent: 'Europa' },
  { name: 'Alemanha', code: 'DE', continent: 'Europa' },
  { name: 'Itália', code: 'IT', continent: 'Europa' },
  { name: 'Grécia', code: 'GR', continent: 'Europa' },
  { name: 'Turquia', code: 'TR', continent: 'Europa' },
  { name: 'Emirados Árabes Unidos', code: 'AE', continent: 'Ásia' },
  { name: 'Tailândia', code: 'TH', continent: 'Ásia' },
  { name: 'Japão', code: 'JP', continent: 'Ásia' },
  { name: 'Estados Unidos', code: 'US', continent: 'América' },
  { name: 'Brasil', code: 'BR', continent: 'América' },
  { name: 'Argentina', code: 'AR', continent: 'América' },
  { name: 'Marrocos', code: 'MA', continent: 'África' },
  { name: 'África do Sul', code: 'ZA', continent: 'África' },
  { name: 'Austrália', code: 'AU', continent: 'Oceânia' },
  { name: 'Irlanda', code: 'IE', continent: 'Europa' },
  { name: 'Holanda', code: 'NL', continent: 'Europa' },
  { name: 'Suíça', code: 'CH', continent: 'Europa' },
];

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(SEED);
function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}
function pickN(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const j = Math.floor(rand() * copy.length);
    out.push(copy.splice(j, 1)[0]);
  }
  return out;
}
function round2(n) {
  return Math.round(n * 100) / 100;
}

const usedIata = new Set(ORIGENS_VOO);
const destinos = [];

for (let i = 0; i < NUM_DESTINOS; i++) {
  const country = pick(COUNTRIES);
  const city =
    country.code === 'PT' && rand() > 0.3 ? pick(PT_CITIES) : pick([...PT_CITIES, ...WORLD_CITIES]);
  let iata = null;
  if (rand() > 0.25) {
    const pool = DEST_IATA_POOL.filter((c) => !usedIata.has(c));
    if (pool.length) {
      iata = pick(pool);
      usedIata.add(iata);
    }
  }
  const tipo = pick(TIPOS);
  const slug = city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  destinos.push({
    id: i + 1,
    nome: city,
    pais: country.name,
    paisCode: country.code,
    iata,
    continente: country.continent,
    tipo,
    clima: pick(CLIMAS),
    descricao: `Descubra ${city}, em ${country.name}: destino de ${tipo} com clima ${pick(CLIMAS)}. Ideal para escapadinhas e férias memoráveis.`,
    imagem_url: `https://images.unsplash.com/photo-1469854523086-cc02afe5c88?auto=format&fit=crop&w=800&q=70&sig=${i}`,
    imagem_query: `${slug},${country.code},travel`,
  });
}

const hoteis = [];
const hotelNames = new Set();
for (let i = 0; i < NUM_HOTEIS; i++) {
  const destino = pick(destinos);
  let nome = `${pick(['Grande', 'Real', 'Vila', 'Solar', 'Palácio', 'Boutique', 'Atlântico', 'Douro'])} ${pick(HOTEL_SUFFIX)}`;
  if (hotelNames.has(nome)) nome = `${nome} ${destino.nome}`;
  hotelNames.add(nome);
  hoteis.push({
    id: i + 1,
    destino_id: destino.id,
    nome,
    estrelas: rand() > 0.7 ? 5 : rand() > 0.4 ? 4 : rand() > 0.15 ? 3 : 2,
    preco_por_noite: round2(35 + rand() * 420),
    comodidades: pickN(AMENITIES, 1 + Math.floor(rand() * 4)),
  });
}

const voos = [];
for (let i = 0; i < NUM_VOOS; i++) {
  const origem = pick(ORIGENS_VOO);
  const destino = pick(destinos.filter((d) => d.iata && d.iata !== origem));
  if (!destino) continue;
  voos.push({
    id: voos.length + 1,
    origem,
    destino_id: destino.id,
    destino_iata: destino.iata,
    preco: round2(29 + rand() * 1100),
    duracao_minutos: 45 + Math.floor(rand() * 855),
    companhia: pick(AIRLINES),
    cabin_class: rand() > 0.85 ? 'business' : rand() > 0.65 ? 'premium_economy' : 'economy',
    escalas: rand() > 0.55 ? 0 : rand() > 0.5 ? 1 : 2,
  });
}

const bundle = {
  meta: {
    seed: SEED,
    generatedAt: new Date().toISOString(),
    counts: { destinos: destinos.length, hoteis: hoteis.length, voos: voos.length },
  },
  destinos,
  hoteis,
  voos,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(resolve(OUT_DIR, 'bundle.json'), JSON.stringify(bundle), 'utf8');
writeFileSync(resolve(OUT_DIR, 'destinos.json'), JSON.stringify(destinos, null, 2), 'utf8');
writeFileSync(resolve(OUT_DIR, 'hoteis.json'), JSON.stringify(hoteis, null, 2), 'utf8');
writeFileSync(resolve(OUT_DIR, 'voos.json'), JSON.stringify(voos, null, 2), 'utf8');

console.log(
  `Gerados ${destinos.length} destinos, ${hoteis.length} hotéis e ${voos.length} voos → ${OUT_DIR}`,
);
