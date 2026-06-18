/**
 * Demo "Caminho Perfeito" — dados hardcoded curados para a demo.
 *
 * Quando TRAVEL_DEMO_PERFECT=true e o destino pesquisado corresponde
 * a um destino demo, o sistema devolve estes dados em vez de ir
 * ao Wikivoyage, base de dados ou APIs externas.
 *
 * Ativar: TRAVEL_DEMO_PERFECT=true (env var)
 * Destinos suportados: Porto (OPO)
 *
 * Para controlo máximo durante a demo, usar ?perfect=1 na query string.
 */

import type { TravelResult } from '../../app/components/data/mockResults';
import type { MockDestination, MockHotel, MockFlight } from './mock-travel/types';
import type { DestinationDetailData } from '../../app/components/pages/DestinationDetailPage';
import type { DestinationMapMarker } from './destination-map';
import { summarizeCostOfLiving } from './cost-tier';
import { summarizeAirport } from './transport-summary';
import { continentFromCountryCode } from './continent';

// ── Constants ──────────────────────────────────────────────────────────────────

/** IATA codes for demo destinations. */
export const DEMO_IATA_CODES = new Set(['OPO']);

/** Demo slug prefix for destination detail pages. */
export const DEMO_SLUG = 'demo-porto';

/** Dedicated demo destination IDs (avoid collisions with real DB IDs). */
const DEMO_PORTO_ID = 999_001;

// ── Porto Hero & Gallery Images (curadas, Unsplash de alta qualidade) ──────────

const PORTO_IMAGES = {
  /** Hero: Vista panorâmica do Porto com a Ponte Dom Luís I e o Rio Douro */
  hero: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1400&q=80',
  /** Ribeira do Porto */
  gallery: [
    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1569517279367-f8b4b4227f56?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1601375321743-4ab66804f74f?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1585201730775-e4ec24e16e5a?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1583587174393-112b9d68d62e?auto=format&fit=crop&w=800&q=75',
  ],
};

// ── Porto Destination Data ─────────────────────────────────────────────────────

export const DEMO_PORTO_DEST: MockDestination = {
  id: DEMO_PORTO_ID,
  lang: 'pt',
  nome: 'Porto',
  pais: 'Portugal',
  paisCode: 'PT',
  iata: 'OPO',
  continente: 'Europa',
  tipo: 'cidade',
  clima: 'mediterrânico',
  latitude: 41.1579,
  longitude: -8.6291,
  descricao:
    'O Porto é uma cidade vibrante no noroeste de Portugal, conhecida pelo seu centro histórico classificado como Património Mundial da UNESCO, pelas caves de Vinho do Porto em Vila Nova de Gaia e pela icónica Ponte Dom Luís I.',
  descricaoCompleta:
    'O Porto, segunda maior cidade de Portugal, encanta pela sua autenticidade e beleza intemporal. As ruas estreitas da Ribeira descem até ao Rio Douro, onde os barcos rabelos recordam os tempos do transporte do Vinho do Porto. A cidade combina na perfeição o charme medieval com uma vibrante cena cultural contemporânea, desde a Casa da Música até à Fundação Serralves. A gastronomia portuense é um deleite à parte: da famosa francesinha aos pastéis de nata, passando pelas tripas à moda do Porto. As caves de Vinho do Porto em Vila Nova de Gaia oferecem provas inesquecíveis com vista para o centro histórico.',
  resumo:
    'O Porto, cidade Invicta, é um tesouro ribeirinho Património da Humanidade. Das caves de Vinho do Porto à arquitetura contemporânea da Casa da Música, cada rua revela uma história. A Ribeira, a Ponte Dom Luís I e a Livraria Lello são paragens obrigatórias.',
  veja: [
    'Torre dos Clérigos — suba os 225 degraus para a melhor vista panorâmica da cidade',
    'Livraria Lello — uma das livrarias mais bonitas do mundo, com escadaria de sonho',
    'Ponte Dom Luís I — atravesse o tabuleiro superior a pé para vistas inesquecíveis',
    'Estação de São Bento — deslumbre-se com os 20.000 azulejos do átrio',
    'Palácio da Bolsa — visite o Salão Árabe, uma obra-prima do século XIX',
    'Sé do Porto — catedral-fortaleza com vista para a cidade e o Douro',
  ],
  faca: [
    'Prove Vinho do Porto nas caves de Vila Nova de Gaia (Taylor\'s, Graham\'s, Sandeman)',
    'Passeie de barco pelo Douro nos tradicionais barcos rabelos',
    'Assista a um concerto na Casa da Música, obra-prima de Rem Koolhaas',
    'Explore o Jardim do Palácio de Cristal e as suas vistas sobre o Douro',
    'Visite o Museu de Serralves e os seus jardins contemporâneos',
    'Caminhe pela marginal da Foz do Douro até ao pôr-do-sol',
  ],
  coma: [
    'Francesinha — a sandes icónica do Porto com molho picante, no Café Santiago ou Bufete Fase',
    'Tripas à Moda do Porto — prato histórico que deu o nome aos tripeiros',
    'Bacalhau à Gomes de Sá — conforto portuense por excelência',
    'Pastéis de Nata na Fábrica da Nata ou na Manteigaria',
    'Petiscos e vinho verde no Mercado do Bolhão renovado',
    'Jantar com vista no restaurante do Yeatman Hotel em Gaia',
  ],
  tags: [
    'Património Mundial',
    'Gastronomia',
    'Vinho do Porto',
    'Cultura',
    'Arquitetura',
    'Fotografia',
    'Romântico',
    'Gourmet',
  ],
  imagem_url: PORTO_IMAGES.hero,
  imagem_query: 'Porto Portugal city travel',
  wikivoyageUrl: 'https://pt.wikivoyage.org/wiki/Porto',
  wikipedia_resumo:
    'O Porto é a segunda maior cidade de Portugal e capital da Área Metropolitana do Porto. O centro histórico do Porto, classificado como Património Mundial pela UNESCO em 1996, é um dos mais antigos e preservados da Europa. A cidade foi berço do Infante D. Henrique e desempenhou um papel crucial na Era dos Descobrimentos. O vinho do Porto, produzido nas encostas do Douro e envelhecido nas caves de Gaia, tornou a cidade conhecida mundialmente.',
  wikipedia_url: 'https://pt.wikipedia.org/wiki/Porto',
  clima_tempo: {
    descricao: 'céu limpo',
    temperatura_c: 22,
    sensacao_c: 20,
    humidade_pct: 65,
    atualizado: '2026-06-18T12:00:00Z',
  },
  custo_de_vida: {
    moeda: 'EUR',
    fonte: 'Dados locais (demo)',
    nivel: 'cidade',
    confianca: 'alta',
    orcamentos: {
      mochileiro: {
        total_dia: 55,
        moeda: 'EUR',
        itens: ['Hostel em albergue (20-25€)', 'Refeição económica (10-15€)', 'Transportes públicos (5€)', 'Atividades gratuitas'],
      },
      conforto: {
        total_dia: 150,
        moeda: 'EUR',
        itens: ['Hotel 3-4★ centro (80-120€)', 'Refeição em restaurante (25-40€)', 'Transportes + táxi ocasional', 'Museus e provas de vinho'],
      },
      luxo: {
        total_dia: 450,
        moeda: 'EUR',
        itens: ['Hotel 5★ (250-350€)', 'Jantar gourmet (60-100€)', 'Motorista privado', 'Provas premium + spa'],
      },
    },
  },
  transporte: {
    fonte: 'OurAirports + OpenFlights (demo)',
    aeroporto: {
      iata: 'OPO',
      nome: 'Aeroporto Francisco Sá Carneiro',
      tipo: 'international',
      municipio: 'Maia / Porto',
      pais_code: 'PT',
      lat: 41.2481,
      lon: -8.6814,
      scheduled_service: true,
      distancia_km: 11,
      match: 'iata',
    },
    rede: {
      ligacoes_diretas: 98,
      rotas_registadas: 142,
      hubs_com_ligacao: ['LIS', 'MAD', 'BCN', 'CDG', 'AMS', 'FRA', 'LGW', 'GVA', 'ZRH', 'MUC'],
      ligacoes_desde_hubs: {
        LIS: true,
        MAD: true,
        BCN: true,
        CDG: true,
        AMS: true,
        FRA: true,
      },
      top_destinos: [
        { iata: 'LIS', nome: 'Lisboa' },
        { iata: 'MAD', nome: 'Madrid' },
        { iata: 'BCN', nome: 'Barcelona' },
        { iata: 'CDG', nome: 'Paris' },
        { iata: 'LGW', nome: 'Londres' },
      ],
    },
  },
};

// ── Porto Hotels (curados, nomes e preços realistas) ───────────────────────────

export const DEMO_PORTO_HOTELS: MockHotel[] = [
  {
    id: DEMO_PORTO_ID * 10 + 1,
    destino_id: DEMO_PORTO_ID,
    nome: 'Pestana Vintage Porto Hotel',
    estrelas: 5,
    preco_por_noite: 210,
    comodidades: ['Wi-Fi', 'Vista Rio Douro', 'Restaurante', 'Bar', 'Room Service', 'Ar Condicionado'],
    latitude: 41.1405,
    longitude: -8.6127,
    description: 'Hotel 5 estrelas na Ribeira do Porto, em edifício classificado Património Mundial. Vista deslumbrante sobre o Rio Douro e a Ponte Dom Luís I.',
    fonte: 'demo-perfect-path',
  },
  {
    id: DEMO_PORTO_ID * 10 + 2,
    destino_id: DEMO_PORTO_ID,
    nome: 'PortoBay Flores',
    estrelas: 5,
    preco_por_noite: 195,
    comodidades: ['Wi-Fi', 'Spa', 'Piscina Interior', 'Ginásio', 'Restaurante', 'Bar'],
    latitude: 41.1432,
    longitude: -8.6144,
    description: 'Hotel boutique 5 estrelas num palácio do século XVI na Rua das Flores. Spa de luxo e localização central privilegiada.',
    fonte: 'demo-perfect-path',
  },
  {
    id: DEMO_PORTO_ID * 10 + 3,
    destino_id: DEMO_PORTO_ID,
    nome: 'Torel 1884 Suites & Apartments',
    estrelas: 4,
    preco_por_noite: 155,
    comodidades: ['Wi-Fi', 'Ar Condicionado', 'Cozinha', 'Terraço', 'Decoração de luxo'],
    latitude: 41.1465,
    longitude: -8.6130,
    description: 'Apartamentos de luxo num edifício histórico renovado. Decoração excecional com peças de arte e design. Terraço com vista.',
    fonte: 'demo-perfect-path',
  },
  {
    id: DEMO_PORTO_ID * 10 + 4,
    destino_id: DEMO_PORTO_ID,
    nome: 'NH Collection Porto Batalha',
    estrelas: 4,
    preco_por_noite: 125,
    comodidades: ['Wi-Fi', 'Restaurante', 'Bar', 'Ginásio', 'Ar Condicionado', 'TV'],
    latitude: 41.1457,
    longitude: -8.6078,
    description: 'Hotel 4 estrelas na Praça da Batalha, junto ao centro histórico. Excelente relação qualidade-preço.',
    fonte: 'demo-perfect-path',
  },
  {
    id: DEMO_PORTO_ID * 10 + 5,
    destino_id: DEMO_PORTO_ID,
    nome: 'Gallery Hostel Porto',
    estrelas: 3,
    preco_por_noite: 45,
    comodidades: ['Wi-Fi', 'Pequeno-almoço', 'Terraço', 'Cozinha Partilhada', 'Bar', 'Eventos culturais'],
    latitude: 41.1492,
    longitude: -8.6103,
    description: 'Hostel artístico premiado num edifício do século XIX. Ambiente acolhedor com galeria de arte e jantares comunitários.',
    fonte: 'demo-perfect-path',
  },
  {
    id: DEMO_PORTO_ID * 10 + 6,
    destino_id: DEMO_PORTO_ID,
    nome: 'The Yeatman Hotel',
    estrelas: 5,
    preco_por_noite: 280,
    comodidades: ['Wi-Fi', 'Spa', 'Piscina Exterior', 'Restaurante 2★ Michelin', 'Vista Panorâmica', 'Caves de Vinho'],
    latitude: 41.1342,
    longitude: -8.6153,
    description: 'Hotel de luxo em Vila Nova de Gaia com vistas icónicas para o Porto. Restaurante com 2 estrelas Michelin e spa de vinoterapia.',
    fonte: 'demo-perfect-path',
  },
];

// ── Porto Flights (LIS → OPO) ─────────────────────────────────────────────────

export function buildDemoPortoFlights(origin: string): MockFlight[] {
  const originCode = origin.trim().toUpperCase();
  return [
    {
      id: DEMO_PORTO_ID * 100 + 1,
      origem: originCode,
      destino_id: DEMO_PORTO_ID,
      destino_iata: 'OPO',
      preco: originCode === 'LIS' ? 55 : originCode === 'MAD' ? 85 : 120,
      duracao_minutos: originCode === 'LIS' ? 60 : originCode === 'MAD' ? 75 : 150,
      companhia: 'TAP Air Portugal',
      cabin_class: 'economy',
      escalas: 0,
    },
    {
      id: DEMO_PORTO_ID * 100 + 2,
      origem: originCode,
      destino_id: DEMO_PORTO_ID,
      destino_iata: 'OPO',
      preco: originCode === 'LIS' ? 120 : originCode === 'MAD' ? 180 : 250,
      duracao_minutos: originCode === 'LIS' ? 55 : originCode === 'MAD' ? 70 : 140,
      companhia: 'TAP Air Portugal',
      cabin_class: 'business',
      escalas: 0,
    },
  ];
}

// ── Map Markers ────────────────────────────────────────────────────────────────

export const DEMO_PORTO_MAP_MARKERS: DestinationMapMarker[] = [
  { lat: 41.1405, lon: -8.6127, label: 'Pestana Vintage Porto', kind: 'hotel' },
  { lat: 41.1432, lon: -8.6144, label: 'PortoBay Flores', kind: 'hotel' },
  { lat: 41.1457, lon: -8.6078, label: 'NH Collection Batalha', kind: 'hotel' },
  { lat: 41.1342, lon: -8.6153, label: 'The Yeatman Hotel', kind: 'hotel' },
  { lat: 41.2481, lon: -8.6814, label: 'OPO · Aeroporto Francisco Sá Carneiro', kind: 'airport' },
  { lat: 41.1579, lon: -8.6291, label: 'Porto', kind: 'destination' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

export function isDemoPerfectEnabled(): boolean {
  return process.env.TRAVEL_DEMO_PERFECT?.trim().toLowerCase() === 'true';
}

export function isDemoPerfectRequest(searchParams: URLSearchParams): boolean {
  if (isDemoPerfectEnabled()) return true;
  return searchParams.get('perfect') === '1';
}

export function isDemoDestinationIata(iata: string): boolean {
  return DEMO_IATA_CODES.has(iata.trim().toUpperCase());
}

export function isDemoSlug(slug: string): boolean {
  return slug === DEMO_SLUG || slug === 'pt-' + DEMO_PORTO_ID;
}

// ── Search Results Builder ─────────────────────────────────────────────────────

function pickCheapestDemoFlight(flights: MockFlight[], cabinClass?: string): MockFlight | null {
  const cabin = cabinClass?.trim().toLowerCase();
  const filtered = cabin
    ? flights.filter((f) => f.cabin_class === cabin)
    : flights;
  const list = filtered.length ? filtered : flights;
  return [...list].sort((a, b) => a.preco - b.preco)[0] ?? null;
}

function pickBestDemoHotel(hotels: MockHotel[], minStars?: number): MockHotel | null {
  const filtered = minStars
    ? hotels.filter((h) => h.estrelas >= minStars)
    : hotels;
  return [...(filtered.length ? filtered : hotels)].sort((a, b) => a.preco_por_noite - b.preco_por_noite)[0] ?? null;
}

export function buildDemoTravelResult(opts: {
  origin: string;
  destIata: string;
  mode: string;
  tripType: string;
  nights: number;
  departureDate: string;
  returnDate?: string | null;
  cabinClass?: string;
}): TravelResult | null {
  const { origin, destIata, mode, tripType, nights, departureDate, returnDate, cabinClass } = opts;

  // Only Porto is supported
  if (destIata !== 'OPO') return null;

  const dest = DEMO_PORTO_DEST;
  const continent = continentFromCountryCode(dest.paisCode);
  const tripLabel = tripType === 'roundtrip' ? 'Ida e volta' : 'Só ida';

  const needFlights = mode === 'both' || mode === 'flights';
  const needHotels = mode === 'both' || mode === 'hotels';

  const allFlights = needFlights ? buildDemoPortoFlights(origin) : [];
  const flight = needFlights ? pickCheapestDemoFlight(allFlights, cabinClass) : null;
  const hotel = needHotels ? pickBestDemoHotel(DEMO_PORTO_HOTELS) : null;

  if (mode === 'flights' && !flight) return null;
  if (mode === 'hotels' && !hotel) return null;

  let price = 0;
  if (flight) price += flight.preco;
  if (hotel && mode !== 'flights') price += hotel.preco_por_noite * nights;
  if (mode === 'hotels' && hotel) price = hotel.preco_por_noite * nights;
  if (tripType === 'roundtrip' && flight) price = Math.round(price * 1.85 * 100) / 100;

  const flightLabel = flight
    ? `${flight.companhia} · ${flight.cabin_class === 'business' ? 'Executiva' : 'Económica'}`
    : '—';

  const hotelLabel = hotel
    ? `${hotel.nome} (${hotel.estrelas}★ · ${hotel.preco_por_noite} €/noite)`
    : 'Hotéis (dados de demonstração)';

  const blurb = [
    dest.resumo,
    needFlights && flight
      ? `Voo ${origin} → ${destIata} com ${flight.companhia} (${tripLabel.toLowerCase()}).`
      : null,
    needHotels && hotel ? `Estadia em ${hotel.nome}, ${nights} noite(s).` : null,
    '✨ Experiência curada — os melhores hotéis, restaurantes e atrações do Porto.',
  ]
    .filter(Boolean)
    .join(' ');

  const highlights: string[] = [];
  if (flight) {
    highlights.push(flight.companhia);
    highlights.push(flight.escalas === 0 ? 'Voo Direto' : `${flight.escalas} escala(s)`);
    highlights.push(`${Math.round(flight.duracao_minutos / 60)}h ${flight.duracao_minutos % 60}m`);
  }
  if (hotel) highlights.push(`${hotel.estrelas}★ ${hotel.nome}`);
  highlights.push('Património UNESCO');
  highlights.push('Vinho do Porto');

  return {
    id: `demo-${tripType}-${origin}-${destIata}-${departureDate}-${hotel?.id ?? 0}-${flight?.id ?? 0}`,
    destination: dest.nome,
    country: dest.pais,
    continent,
    imageUrl: PORTO_IMAGES.hero,
    aiMatchScore: 97,
    rating: 4.8,
    reviews: 2847,
    duration: nights,
    price: Math.round(price),
    priceCurrency: 'EUR',
    sustainable: flight ? flight.escalas === 0 : true,
    productType: 'package',
    description: { en: blurb, pt: blurb, es: blurb, fr: blurb },
    highlights: highlights.slice(0, 4),
    bestFor: [
      'Gastronomia & Vinho',
      'Cultura & Património',
      tripLabel,
    ],
    flight: { class: flightLabel },
    accommodation: { type: hotelLabel },
    destinationSlug: DEMO_SLUG,
    destinationCard: {
      resumo: dest.resumo,
      veja: dest.veja,
      faca: dest.faca,
      coma: dest.coma,
      tags: dest.tags,
      dicas: {
        seguranca: ['O Porto é uma cidade muito segura. Como em qualquer cidade turística, tenha atenção a carteiristas nas zonas mais movimentadas da Ribeira.'],
        dinheiro: ['A maioria dos estabelecimentos aceita cartão. Leve algum dinheiro para pequenas compras no Mercado do Bolhão.'],
        transporte: ['O metro do Porto é excelente. Compre o Andante Tour para viagens ilimitadas de 24h ou 72h.'],
        clima: ['Verões quentes (25-35°C). Invernos amenos mas chuvosos. A melhor época é maio-junho e setembro-outubro.'],
        respeite: ['Vista-se adequadamente ao visitar igrejas. É costume cumprimentar com "bom dia" ao entrar em lojas.'],
      },
    },
    sourceUrl: dest.wikivoyageUrl,
    costOfLiving: summarizeCostOfLiving(dest.custo_de_vida) ?? undefined,
    airport: summarizeAirport(dest, destIata, origin) ?? undefined,
    mapMarkers: DEMO_PORTO_MAP_MARKERS,
  };
}

// ── Destination Detail Builder ──────────────────────────────────────────────────

export function buildDemoDestinationDetail(slug: string): DestinationDetailData | null {
  if (!isDemoSlug(slug)) return null;

  const dest = DEMO_PORTO_DEST;

  return {
    slug: DEMO_SLUG,
    nome: dest.nome,
    pais: dest.pais,
    continente: dest.continente,
    iata: dest.iata,
    tipo: dest.tipo,
    clima: dest.clima,
    imageUrl: PORTO_IMAGES.hero,
    resumo: dest.resumo,
    descricao: dest.descricao,
    descricaoCompleta: dest.descricaoCompleta,
    veja: dest.veja ?? [],
    faca: dest.faca ?? [],
    coma: dest.coma ?? [],
    tags: dest.tags ?? [],
    wikivoyageUrl: dest.wikivoyageUrl,
    license: 'Conteúdo curado AKMLEVA',
    videoUrl: undefined,
    galleryImages: PORTO_IMAGES.gallery,
    hotels: DEMO_PORTO_HOTELS.map((h) => ({
      id: h.id,
      nome: h.nome,
      estrelas: h.estrelas,
      preco_por_noite: h.preco_por_noite,
      comodidades: h.comodidades,
    })),
    dicas: {
      seguranca: [
        'O Porto é uma cidade muito segura para turistas, com baixos índices de criminalidade violenta.',
        'Como em qualquer destino turístico, esteja atento a carteiristas nas zonas mais concorridas da Ribeira e Aliados.',
        'As ruas íngremes podem ser escorregadias com chuva — use calçado confortável e antiderrapante.',
      ],
      respeite: [
        'Os portuenses são acolhedores mas reservados. Um "bom dia" ou "boa tarde" ao entrar em estabelecimentos é bem-vindo.',
        'Vista-se adequadamente ao visitar igrejas e monumentos religiosos.',
        'Respeite as filas e o espaço pessoal — os portugueses valorizam a ordem e a cortesia.',
      ],
      comunique: [
        'O português é a língua oficial. A maioria dos profissionais de turismo fala inglês fluentemente.',
        'Os portuenses apreciam quando os visitantes tentam falar português — um "obrigado" faz maravilhas!',
        'O sotaque do Porto é distinto e carregado de personalidade — não estranhe!',
      ],
      dinheiro: [
        'Portugal usa o Euro (€). A maioria dos estabelecimentos aceita cartões de crédito/débito.',
        'Leve dinheiro para pequenas compras no Mercado do Bolhão e cafés tradicionais.',
        'Os preços no Porto são mais acessíveis que em Lisboa. Refeições a partir de 8-12€ num restaurante típico.',
        'A gorjeta não é obrigatória, mas 5-10% são apreciados em restaurantes com bom serviço.',
      ],
      saude: [
        'A água da torneira é perfeitamente segura para beber.',
        'Hospitais e farmácias são de excelente qualidade. Farmácias de serviço 24h disponíveis.',
        'Protetor solar essencial de maio a setembro — o sol português é forte!',
      ],
      transporte: [
        'Metro do Porto: 6 linhas cobrindo a cidade e arredores. Bilhete Andante Tour recomendado (24h/72h).',
        'STCP Autocarros: rede extensa. Elétrico histórico n.º 1 ao longo do Douro é imperdível.',
        'Do aeroporto ao centro: Metro linha E, 30 min até à Trindade.',
        'A cidade é muito walkable. As colinas são o único desafio — use os elevadores e funiculares!',
        'Uber e Bolt amplamente disponíveis e económicos.',
      ],
      horarios: [
        'Lojas no centro: geralmente 9h-19h (seg-sáb). Centros comerciais abertos até às 23h.',
        'Restaurantes: almoço 12h-15h, jantar 19h-23h. Os portugueses jantam tarde.',
        'Museus e monumentos: tipicamente fecham à segunda-feira. Horário 10h-18h.',
        'Caves de Vinho do Porto: abertas todos os dias, geralmente 10h-18h. Reserva recomendada.',
      ],
      beba: [
        'Vinho do Porto: prove as variedades Ruby, Tawny, White e Vintage nas caves de Gaia.',
        'Vinho Verde: fresco e ligeiramente gaseificado, perfeito para dias quentes. Peça um copo por 2-3€.',
        'Café: os portugueses levam o café a sério. Peça um "cimbalino" (expresso) como um local.',
        'Água da torneira é segura. Nos restaurantes, peça "água da casa" para evitar água engarrafada cara.',
      ],
      compre: [
        'Vinho do Porto para levar para casa — as caves têm lojas com excelentes seleções.',
        'Artesanato português: azulejos, filigrana, cortiça e bordados na Rua das Flores.',
        'Livraria Lello: para além da visita, compre um livro exclusivo com o carimbo da loja.',
        'Mercado do Bolhão: produtos frescos, conservas gourmet e souvenirs autênticos.',
      ],
      clima: [
        'Verão (jun-set): quente e seco, 20-35°C. Ideal para esplanadas e passeios à beira-rio.',
        'Outono (out-nov): ameno, 10-20°C. Cores douradas no Douro. Menos turistas.',
        'Inverno (dez-fev): fresco e chuvoso, 5-15°C. Atmosfera acolhedora nos cafés e caves.',
        'Primavera (mar-mai): temperaturas agradáveis, 12-22°C. Cidade florida. Melhor época para visitar.',
      ],
    },
    wikipedia_resumo: dest.wikipedia_resumo,
    wikipedia_url: dest.wikipedia_url,
    clima_tempo: dest.clima_tempo,
    custo_de_vida: dest.custo_de_vida,
    transporte: dest.transporte,
    latitude: dest.latitude,
    longitude: dest.longitude,
    mapMarkers: DEMO_PORTO_MAP_MARKERS,
    imageAttribution: {
      fotografo: 'Nick Fewings',
      fotografo_url: 'https://unsplash.com/@jannerboy62',
      fonte: 'Unsplash',
      licenca: 'Unsplash License',
    },
  };
}

// ── DemoResultsMeta ────────────────────────────────────────────────────────────

export function buildDemoResultsMeta(opts: {
  origin: string;
  destList: string[];
  departureDate: string;
  returnDate: string | null;
  nights: number;
  adults: number;
  cabinClass: string;
  tripType: string;
  mode: string;
}) {
  return {
    origin: opts.origin,
    destinations: opts.destList,
    departureDate: opts.departureDate,
    returnDate: opts.returnDate,
    nights: opts.nights,
    adults: opts.adults,
    cabinClass: opts.cabinClass,
    tripType: opts.tripType,
    mode: opts.mode,
    mock: false,
    catalogSource: 'demo-perfect',
    preferenceMatch: false,
    mlRanking: false,
    demoSource: 'perfect-path-curated',
    demoCounts: { destinos: 1, hoteis: DEMO_PORTO_HOTELS.length, voos: 2 },
    hotelbeds: false,
    duffel: false,
    scrapeDo: false,
    perfect: true,
  };
}
