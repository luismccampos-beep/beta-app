/**
 * Inferência de país a partir do título Wikivoyage, texto e CSV de cidades.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fold } from './cost-of-living-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COL_CSV = resolve(__dirname, '../../data/cost-of-living/cost-of-living_v2.csv');

/** @type {Map<string, { name: string; code: string; continent: string }> | null} */
let cityCountryCache = null;

export const COUNTRY_META = {
  Portugal: { name: 'Portugal', code: 'PT', continent: 'Europa' },
  Espanha: { name: 'Espanha', code: 'ES', continent: 'Europa' },
  França: { name: 'França', code: 'FR', continent: 'Europa' },
  Itália: { name: 'Itália', code: 'IT', continent: 'Europa' },
  Alemanha: { name: 'Alemanha', code: 'DE', continent: 'Europa' },
  'Reino Unido': { name: 'Reino Unido', code: 'GB', continent: 'Europa' },
  Brasil: { name: 'Brasil', code: 'BR', continent: 'América' },
  'Estados Unidos': { name: 'Estados Unidos', code: 'US', continent: 'América' },
  Marrocos: { name: 'Marrocos', code: 'MA', continent: 'África' },
  Japão: { name: 'Japão', code: 'JP', continent: 'Ásia' },
  Tailândia: { name: 'Tailândia', code: 'TH', continent: 'Ásia' },
  Austrália: { name: 'Austrália', code: 'AU', continent: 'Oceânia' },
  China: { name: 'China', code: 'CN', continent: 'Ásia' },
  Índia: { name: 'Índia', code: 'IN', continent: 'Ásia' },
  México: { name: 'México', code: 'MX', continent: 'América' },
  Argentina: { name: 'Argentina', code: 'AR', continent: 'América' },
  Chile: { name: 'Chile', code: 'CL', continent: 'América' },
  Colômbia: { name: 'Colômbia', code: 'CO', continent: 'América' },
  Peru: { name: 'Peru', code: 'PE', continent: 'América' },
  Canadá: { name: 'Canadá', code: 'CA', continent: 'América' },
  Suíça: { name: 'Suíça', code: 'CH', continent: 'Europa' },
  Áustria: { name: 'Áustria', code: 'AT', continent: 'Europa' },
  Bélgica: { name: 'Bélgica', code: 'BE', continent: 'Europa' },
  Holanda: { name: 'Holanda', code: 'NL', continent: 'Europa' },
  Grécia: { name: 'Grécia', code: 'GR', continent: 'Europa' },
  Croácia: { name: 'Croácia', code: 'HR', continent: 'Europa' },
  Turquia: { name: 'Turquia', code: 'TR', continent: 'Ásia' },
  Egito: { name: 'Egito', code: 'EG', continent: 'África' },
  'África do Sul': { name: 'África do Sul', code: 'ZA', continent: 'África' },
  Indonésia: { name: 'Indonésia', code: 'ID', continent: 'Ásia' },
  Filipinas: { name: 'Filipinas', code: 'PH', continent: 'Ásia' },
  Vietname: { name: 'Vietname', code: 'VN', continent: 'Ásia' },
  'Coreia do Sul': { name: 'Coreia do Sul', code: 'KR', continent: 'Ásia' },
  Irlanda: { name: 'Irlanda', code: 'IE', continent: 'Europa' },
  Noruega: { name: 'Noruega', code: 'NO', continent: 'Europa' },
  Suécia: { name: 'Suécia', code: 'SE', continent: 'Europa' },
  Dinamarca: { name: 'Dinamarca', code: 'DK', continent: 'Europa' },
  Finlândia: { name: 'Finlândia', code: 'FI', continent: 'Europa' },
  Polónia: { name: 'Polónia', code: 'PL', continent: 'Europa' },
  Hungria: { name: 'Hungria', code: 'HU', continent: 'Europa' },
  Roménia: { name: 'Roménia', code: 'RO', continent: 'Europa' },
  Israel: { name: 'Israel', code: 'IL', continent: 'Ásia' },
  Singapura: { name: 'Singapura', code: 'SG', continent: 'Ásia' },
  Internacional: { name: 'Internacional', code: 'XX', continent: 'Europa' },
  Uruguai: { name: 'Uruguai', code: 'UY', continent: 'América' },
  Equador: { name: 'Equador', code: 'EC', continent: 'América' },
  Paraguai: { name: 'Paraguai', code: 'PY', continent: 'América' },
  Bolívia: { name: 'Bolívia', code: 'BO', continent: 'América' },
  Rússia: { name: 'Rússia', code: 'RU', continent: 'Europa' },
  Polónia: { name: 'Polónia', code: 'PL', continent: 'Europa' },
  'República Checa': { name: 'República Checa', code: 'CZ', continent: 'Europa' },
  'Nova Zelândia': { name: 'Nova Zelândia', code: 'NZ', continent: 'Oceânia' },
  Malásia: { name: 'Malásia', code: 'MY', continent: 'Ásia' },
  Islândia: { name: 'Islândia', code: 'IS', continent: 'Europa' },
  Ucrânia: { name: 'Ucrânia', code: 'UA', continent: 'Europa' },
};

/** EN name in CSV → PT display name */
const CSV_COUNTRY_PT = {
  portugal: 'Portugal',
  spain: 'Espanha',
  france: 'França',
  italy: 'Itália',
  germany: 'Alemanha',
  'united kingdom': 'Reino Unido',
  brazil: 'Brasil',
  'united states': 'Estados Unidos',
  morocco: 'Marrocos',
  japan: 'Japão',
  thailand: 'Tailândia',
  australia: 'Austrália',
  china: 'China',
  india: 'Índia',
  mexico: 'México',
  argentina: 'Argentina',
  chile: 'Chile',
  colombia: 'Colômbia',
  peru: 'Peru',
  canada: 'Canadá',
  switzerland: 'Suíça',
  austria: 'Áustria',
  belgium: 'Bélgica',
  netherlands: 'Holanda',
  greece: 'Grécia',
  croatia: 'Croácia',
  turkey: 'Turquia',
  egypt: 'Egito',
  'south africa': 'África do Sul',
  indonesia: 'Indonésia',
  philippines: 'Filipinas',
  vietnam: 'Vietname',
  'south korea': 'Coreia do Sul',
  ireland: 'Irlanda',
  norway: 'Noruega',
  sweden: 'Suécia',
  denmark: 'Dinamarca',
  finland: 'Finlândia',
  poland: 'Polónia',
  hungary: 'Hungria',
  romania: 'Roménia',
  israel: 'Israel',
  singapore: 'Singapura',
};

const COUNTRY_HINTS = [
  { re: /\bPortugal\b|português|Portuguese\b/i, key: 'Portugal' },
  { re: /\bEspanha\b|espanhol|\bSpain\b/i, key: 'Espanha' },
  { re: /\bFrança\b|francês|\bFrance\b/i, key: 'França' },
  { re: /\bItália\b|italiano|\bItaly\b/i, key: 'Itália' },
  { re: /\bAlemanha\b|alemão|\bGermany\b/i, key: 'Alemanha' },
  { re: /\bReino Unido\b|britânico|\bUnited Kingdom\b|\bUK\b/i, key: 'Reino Unido' },
  { re: /\bBrasil\b|brasileiro|\bBrazil\b/i, key: 'Brasil' },
  { re: /\bEstados Unidos\b|americano|\bUnited States\b|\bU\.?S\.?A\.?\b/i, key: 'Estados Unidos' },
  { re: /\bMarrocos\b|\bMorocco\b/i, key: 'Marrocos' },
  { re: /\bJapão\b|japonês|\bJapan\b/i, key: 'Japão' },
  { re: /\bTailândia\b|\bThailand\b/i, key: 'Tailândia' },
  { re: /\bAustrália\b|\bAustralia\b/i, key: 'Austrália' },
  { re: /\bChina\b/i, key: 'China' },
  { re: /\bÍndia\b|\bIndia\b/i, key: 'Índia' },
  { re: /\bMéxico\b|\bMexico\b/i, key: 'México' },
  { re: /\bArgentina\b/i, key: 'Argentina' },
  { re: /\bChile\b/i, key: 'Chile' },
  { re: /\bColômbia\b|\bColombia\b/i, key: 'Colômbia' },
  { re: /\bPeru\b/i, key: 'Peru' },
  { re: /\bCanadá\b|\bCanada\b/i, key: 'Canadá' },
  { re: /\bSuíça\b|\bSwitzerland\b/i, key: 'Suíça' },
  { re: /\bGrécia\b|\bGreece\b/i, key: 'Grécia' },
  { re: /\bCroácia\b|\bCroatia\b/i, key: 'Croácia' },
  { re: /\bTurquia\b|\bTurkey\b/i, key: 'Turquia' },
  { re: /\bEgito\b|\bEgypt\b/i, key: 'Egito' },
  { re: /\bÁfrica do Sul\b|\bSouth Africa\b/i, key: 'África do Sul' },
  { re: /\bIndonésia\b|\bIndonesia\b/i, key: 'Indonésia' },
  { re: /\bSingapura\b|\bSingapore\b/i, key: 'Singapura' },
  { re: /\bRússia\b|\bRussia\b/i, key: 'Rússia' },
  { re: /\bPolónia\b|\bPoland\b/i, key: 'Polónia' },
  { re: /\bRepública Checa\b|\bCzech\b/i, key: 'República Checa' },
  { re: /\bÁustria\b|\bAustria\b/i, key: 'Áustria' },
  { re: /\bBélgica\b|\bBelgium\b/i, key: 'Bélgica' },
  { re: /\bHolanda\b|\bNetherlands\b/i, key: 'Holanda' },
  { re: /\bIrlanda\b|\bIreland\b/i, key: 'Irlanda' },
  { re: /\bNoruega\b|\bNorway\b/i, key: 'Noruega' },
  { re: /\bSuécia\b|\bSweden\b/i, key: 'Suécia' },
  { re: /\bDinamarca\b|\bDenmark\b/i, key: 'Dinamarca' },
  { re: /\bFinlândia\b|\bFinland\b/i, key: 'Finlândia' },
  { re: /\bRoménia\b|\bRomania\b/i, key: 'Roménia' },
  { re: /\bHungria\b|\bHungary\b/i, key: 'Hungria' },
  { re: /\bNova Zelândia\b|\bNew Zealand\b/i, key: 'Nova Zelândia' },
  { re: /\bCoreia do Sul\b|\bSouth Korea\b|\bKorea\b/i, key: 'Coreia do Sul' },
  { re: /\bVietname\b|\bVietnam\b/i, key: 'Vietname' },
  { re: /\bFilipinas\b|\bPhilippines\b/i, key: 'Filipinas' },
  { re: /\bMalásia\b|\bMalaysia\b/i, key: 'Malásia' },
  { re: /\bIslândia\b|\bIceland\b/i, key: 'Islândia' },
  { re: /\bUcrânia\b|\bUkraine\b/i, key: 'Ucrânia' },
];

/** Primeiro segmento do título Wikivoyage (EN) → país PT. */
const SEGMENT_COUNTRY = {
  portugal: 'Portugal',
  spain: 'Espanha',
  france: 'França',
  italy: 'Itália',
  germany: 'Alemanha',
  'united kingdom': 'Reino Unido',
  uk: 'Reino Unido',
  brazil: 'Brasil',
  'united states': 'Estados Unidos',
  usa: 'Estados Unidos',
  japan: 'Japão',
  china: 'China',
  india: 'Índia',
  australia: 'Austrália',
  canada: 'Canadá',
  mexico: 'México',
  argentina: 'Argentina',
  chile: 'Chile',
  colombia: 'Colômbia',
  peru: 'Peru',
  morocco: 'Marrocos',
  egypt: 'Egito',
  turkey: 'Turquia',
  greece: 'Grécia',
  croatia: 'Croácia',
  switzerland: 'Suíça',
  austria: 'Áustria',
  belgium: 'Bélgica',
  netherlands: 'Holanda',
  ireland: 'Irlanda',
  norway: 'Noruega',
  sweden: 'Suécia',
  denmark: 'Dinamarca',
  finland: 'Finlândia',
  poland: 'Polónia',
  russia: 'Rússia',
  iceland: 'Islândia',
  thailand: 'Tailândia',
  indonesia: 'Indonésia',
  vietnam: 'Vietname',
  philippines: 'Filipinas',
  singapore: 'Singapura',
  'south africa': 'África do Sul',
  'new zealand': 'Nova Zelândia',
  israel: 'Israel',
};

const BR_STATE_RE =
  /\b(Rio Grande do Sul|Santa Catarina|Paraná|Parana|São Paulo|Minas Gerais|Rio de Janeiro|Espírito Santo|Bahia|Pernambuco|Ceará|Pará|Amazonas|Distrito Federal|Goiás|Mato Grosso|Mato Grosso do Sul|Acre|Amapá|Roraima|Rondônia|Tocantins|Maranhão|Piauí|Rio Grande do Norte|Paraíba|Alagoas|Sergipe)\b/i;

const PT_REGION_RE =
  /\b(Algarve|Alentejo|Minho|Douro|Trás-os-Montes|Açores|Madeira|Beira Baixa|Beira Alta|Ribatejo|Estremadura)\b/i;

const PAREN_COUNTRY = {
  uruguai: 'Uruguai',
  uruguay: 'Uruguai',
  argentina: 'Argentina',
  brasil: 'Brasil',
  brazil: 'Brasil',
  portugal: 'Portugal',
  espanha: 'Espanha',
  spain: 'Espanha',
  franca: 'França',
  france: 'França',
  italia: 'Itália',
  italy: 'Itália',
  alemanha: 'Alemanha',
  germany: 'Alemanha',
  mexico: 'México',
  chile: 'Chile',
  peru: 'Peru',
  colombia: 'Colômbia',
  equador: 'Equador',
  paraguai: 'Paraguai',
  bolivia: 'Bolívia',
  'rio grande do sul': 'Brasil',
  'sao paulo': 'Brasil',
  'são paulo': 'Brasil',
  bahia: 'Brasil',
  'minas gerais': 'Brasil',
  parana: 'Brasil',
  paraná: 'Brasil',
  'santa catarina': 'Brasil',
  algarve: 'Portugal',
  acores: 'Portugal',
  açores: 'Portugal',
  madeira: 'Portugal',
};

/**
 * @param {string} nome
 */
export function countryFromParenthetical(nome) {
  const m = nome.match(/\(([^)]+)\)/);
  if (!m) return null;
  const inner = fold(m[1]);
  const direct = PAREN_COUNTRY[inner];
  if (direct) return metaFromPtName(direct);
  for (const [key, country] of Object.entries(PAREN_COUNTRY)) {
    if (inner.includes(key) || key.includes(inner)) return metaFromPtName(country);
  }
  return null;
}

const MANUAL_CITY_COUNTRY = {
  gramado: 'Brasil',
  'rio de janeiro': 'Brasil',
  'sao paulo': 'Brasil',
  'são paulo': 'Brasil',
  brasilia: 'Brasil',
  brasília: 'Brasil',
  salvador: 'Brasil',
  recife: 'Brasil',
  fortaleza: 'Brasil',
  curitiba: 'Brasil',
  florianopolis: 'Brasil',
  florianópolis: 'Brasil',
  'belo horizonte': 'Brasil',
  manaus: 'Brasil',
  'porto alegre': 'Brasil',
  coimbra: 'Portugal',
  braga: 'Portugal',
  faro: 'Portugal',
  funchal: 'Portugal',
  aveiro: 'Portugal',
  evora: 'Portugal',
  évora: 'Portugal',
  cascais: 'Portugal',
  sintra: 'Portugal',
  lagos: 'Portugal',
  tavira: 'Portugal',
};

function csvCountryToPt(enName) {
  const k = fold(enName);
  return CSV_COUNTRY_PT[k] ?? enName;
}

function metaFromPtName(ptName) {
  return COUNTRY_META[ptName] ?? COUNTRY_META.Internacional;
}

/** Nome do país (PT/EN) ou código ISO → código ISO-2 para aeroportos/CSV. */
export function isoFromPais(pais, paisCode) {
  const code = String(paisCode ?? '')
    .trim()
    .toUpperCase();
  if (code && code !== 'XX' && code.length === 2) return code;

  const name = String(pais ?? '').trim();
  if (name && COUNTRY_META[name]?.code && COUNTRY_META[name].code !== 'XX') {
    return COUNTRY_META[name].code;
  }
  const f = fold(name);
  for (const [key, meta] of Object.entries(COUNTRY_META)) {
    if (fold(key) === f && meta.code !== 'XX') return meta.code;
  }
  return '';
}

/**
 * @returns {Map<string, string>} cityFold → PT country name
 */
export function loadCityCountryMap() {
  if (cityCountryCache) return cityCountryCache;
  cityCountryCache = new Map(Object.entries(MANUAL_CITY_COUNTRY).map(([k, v]) => [k, v]));

  if (!existsSync(COL_CSV)) return cityCountryCache;

  const lines = readFileSync(COL_CSV, 'utf8').trim().split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 3) continue;
    const city = parts[0];
    const countryEn = parts[1];
    const pt = csvCountryToPt(countryEn);
    cityCountryCache.set(fold(city), pt);
  }
  return cityCountryCache;
}

/**
 * @param {string} blob
 */
function hintsFromText(blob) {
  for (const h of COUNTRY_HINTS) {
    if (h.re.test(blob)) return metaFromPtName(h.key);
  }
  return null;
}

/**
 * @param {string} title
 * @param {string} text
 * @param {string} lang
 */
export function inferCountryFromDestination(title, text, lang = 'pt') {
  const fromParen = countryFromParenthetical(title);
  if (fromParen) return fromParen;

  const cityMap = loadCityCountryMap();
  const blob = `${title}\n${(text ?? '').slice(0, 4000)}`;
  const segments = title.split('/').map((s) => s.trim()).filter(Boolean);
  const leaf = segments[0] ?? title;
  const manual = MANUAL_CITY_COUNTRY[fold(leaf.replace(/\([^)]*\)/g, '').trim())];
  if (manual) return metaFromPtName(manual);

  for (const seg of segments) {
    const fromCity = cityMap.get(fold(seg));
    if (fromCity) return metaFromPtName(fromCity);
    const segCountry = SEGMENT_COUNTRY[fold(seg)];
    if (segCountry) return metaFromPtName(segCountry);
  }

  if (BR_STATE_RE.test(blob)) return metaFromPtName('Brasil');
  if (PT_REGION_RE.test(blob)) return metaFromPtName('Portugal');

  const fromText = hintsFromText(blob);
  if (fromText && fromText.name !== 'Internacional') return fromText;

  if (lang === 'pt' && segments.length === 1 && PT_REGION_RE.test(blob)) {
    return metaFromPtName('Portugal');
  }
  return metaFromPtName('Internacional');
}
