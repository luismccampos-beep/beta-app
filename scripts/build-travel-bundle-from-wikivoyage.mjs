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

import { buildDestinationCard, excerptResumo } from './lib/wikivoyage-card.mjs';
import { inferCountryFromDestination } from './lib/city-country-lookup.mjs';

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

const SHOP_OR_POI_RE =
  /\b(primark|zara|h&m|mediamarkt|supermercado|mercadona|carrefour|decathlon|fnac|ikea|mcdonald|starbucks|caf[eé]|restaurant|restaurante|bar\b|pub\b|plaza|praça|church|igreja|cathedral|museu|museum|monument|castelo|castle|fortaleza|fort\b|playground|parque nacional|national park|mercado|market|shopping|loja|store\b|boutique|galeria|gallery|teatro|theater|theatre|estádio|stadium|universidade|university|escola|school|hospital|farmácia|pharmacy|banco|bank\b|atm\b|posto|gas station|estação|station\b|terminal\b|porto\b|harbour|harbor|beach\b|praia\b|miradouro|viewpoint|torre\b|tower\b|ponte\b|bridge\b|ruínas|ruins|monast[eé]rio|monastery|palácio|palace|sinagoga|synagogue|mesquita|mosque|templo|temple\b|aquário|aquarium|zoo\b|jardim bot|botanical)\b/i;
const ACCOMMODATION_RE =
  /\b(hotel|hostel|pousada|resort|albergar|guesthouse|guest house|motel|inn\b|suites?\b|lodging|alojamento|parador|pens[aã]o|bed and breakfast|b&b|apartamento tur[ií]stico|apart-?hotel|aparthotel|ryokan|pension\b|auberge|herberg|hospedaria|hostal\b|posada\b|fonda\b|caravan|camping\b|glamping|ref[uú]gio|hut\b|chalet\b|villa hotel|eco-?lodge)\b/i;

function isLikelyAccommodationName(nome) {
  const n = String(nome ?? '').trim();
  if (n.length < 2) return false;
  if (SHOP_OR_POI_RE.test(n)) return false;
  return ACCOMMODATION_RE.test(n);
}

/** Nome do artigo → IATA (expandido ~300 cidades PT+EN+variantes).
 *  Inclui países com IATA do principal aeroporto para gerar voos. */
const CITY_IATA = {
  // ── Portugal ──
  Lisboa: 'LIS', Lisbon: 'LIS',
  Porto: 'OPO', Oporto: 'OPO',
  Faro: 'FAO',
  Funchal: 'FNC', Madeira: 'FNC',
  'Ponta Delgada': 'PDL', Açores: 'PDL', Azores: 'PDL',
  'Angra do Heroísmo': 'TER',
  Horta: 'HOR',
  'Santa Maria': 'SMA',
  Flores: 'FLW',
  Coimbra: 'CBP',
  Braga: 'BGZ',
  Évora: 'EUR', Evora: 'EUR',
  Aveiro: 'AVE',
  Cascais: 'LIS',
  Sintra: 'LIS',
  Lagos: 'FAO',
  Tavira: 'FAO',
  Albufeira: 'FAO',
  Portimão: 'FAO',
  Guimarães: 'OPO', Guimaraes: 'OPO',
  'Vila Real': 'OPO',
  'Viana do Castelo': 'OPO',
  Chaves: 'OPO',
  'Castelo Branco': 'LIS',
  Guarda: 'OPO',
  Leiria: 'LIS',
  Santarém: 'LIS', Santarem: 'LIS',
  Setúbal: 'LIS', Setubal: 'LIS',
  Beja: 'FAO',
  Portalegre: 'LIS',
  Tomar: 'LIS',
  Óbidos: 'LIS', Obidos: 'LIS',
  Nazaré: 'LIS', Nazare: 'LIS',
  Peniche: 'LIS',
  Ericeira: 'LIS',
  'Figueira da Foz': 'OPO',
  'Vila Nova de Gaia': 'OPO',
  Matosinhos: 'OPO',
  Amarante: 'OPO',
  Lamego: 'OPO',
  'Peso da Régua': 'OPO',
  'Vila do Conde': 'OPO',
  'Póvoa de Varzim': 'OPO',
  Barcelos: 'OPO',
  'Ponte de Lima': 'OPO',
  Monção: 'OPO', Moncao: 'OPO',
  'Vila Nova de Cerveira': 'OPO',
  Elvas: 'LIS',
  Estremoz: 'LIS',
  Monsaraz: 'LIS',
  Marvão: 'LIS', Marvao: 'LIS',
  'Vila Viçosa': 'LIS',
  Serpa: 'FAO',
  Mértola: 'FAO', Mertola: 'FAO',
  Alcoutim: 'FAO',
  Silves: 'FAO',
  Loulé: 'FAO', Loule: 'FAO',
  Olhão: 'FAO', Olhao: 'FAO',
  Lagoa: 'FAO',
  Monchique: 'FAO',
  Sagres: 'FAO',
  'Vila do Bispo': 'FAO',
  Caldas: 'LIS',
  Fátima: 'LIS', Fatima: 'LIS',
  Batalha: 'LIS',
  Alcobaça: 'LIS', Alcobaca: 'LIS',
  Mafra: 'LIS',
  Sesimbra: 'LIS',
  Almada: 'LIS',
  Caparica: 'LIS',
  'Vila Franca de Xira': 'LIS',
  Loures: 'LIS',
  Odivelas: 'LIS',
  Amadora: 'LIS',
  Oeiras: 'LIS',
  Queluz: 'LIS',
  Belém: 'LIS', Belem: 'LIS',
  // ── Espanha ──
  Madrid: 'MAD',
  Barcelona: 'BCN', 'Barcelona ': 'BCN',
  Valência: 'VLC', Valencia: 'VLC',
  Sevilha: 'SVQ', Seville: 'SVQ',
  Málaga: 'AGP', Malaga: 'AGP',
  Palma: 'PMI', 'Palma de Mallorca': 'PMI', Mallorca: 'PMI',
  Bilbau: 'BIO', Bilbao: 'BIO',
  Granada: 'GRX',
  Salamanca: 'SLM',
  'San Sebastián': 'EAS', 'San Sebastian': 'EAS', Donostia: 'EAS',
  Santiago: 'SCQ', 'Santiago de Compostela': 'SCQ',
  Saragoça: 'ZAZ', Zaragoza: 'ZAZ',
  Córdoba: 'ODB', Cordoba: 'ODB',
  Toledo: 'MAD',
  Segóvia: 'MAD', Segovia: 'MAD',
  Ávila: 'MAD', Avila: 'MAD',
  Cáceres: 'BJZ', Caceres: 'BJZ',
  Mérida: 'BJZ', Merida: 'BJZ',
  Cádiz: 'XRY', Cadiz: 'XRY',
  Jerez: 'XRY',
  Almería: 'LEI', Almeria: 'LEI',
  Gijón: 'OVD', Gijon: 'OVD',
  Oviedo: 'OVD',
  Santander: 'SDR',
  'A Coruña': 'LCG', 'A Coruna': 'LCG', LaCoruna: 'LCG',
  Vigo: 'VGO',
  Pamplona: 'PNA',
  Logroño: 'RJL', Logrono: 'RJL',
  Ibiza: 'IBZ', Eivissa: 'IBZ',
  Menorca: 'MAH', Mahón: 'MAH',
  Lanzarote: 'ACE', Arrecife: 'ACE',
  Fuerteventura: 'FUE',
  'Las Palmas': 'LPA', 'Gran Canaria': 'LPA',
  Tenerife: 'TFS', 'Santa Cruz': 'TFN',
  'La Gomera': 'GMZ',
  'La Palma': 'SPC',
  Tarragona: 'REU',
  Girona: 'GRO', Gerona: 'GRO',
  Lleida: 'ILD', Lérida: 'ILD',
  Huesca: 'HSK',
  Teruel: 'TEV',
  Cuenca: 'MAD',
  Albacete: 'ABC',
  'Ciudad Real': 'MAD',
  Badajoz: 'BJZ',
  Huelva: 'SVQ',
  Jaén: 'GRX', Jaen: 'GRX',
  Algeciras: 'GIB',
  Marbella: 'AGP',
  Ronda: 'AGP',
  Torremolinos: 'AGP',
  Benidorm: 'ALC',
  Alicante: 'ALC',
  Murcia: 'RMU', Múrcia: 'RMU',
  Cartagena: 'RMU',
  León: 'LEN', Leon: 'LEN',
  Burgos: 'RGS',
  Valladolid: 'VLL',
  Zamora: 'SLM',
  Ponferrada: 'LEN',
  Lugo: 'SCQ',
  Ourense: 'VGO', Orense: 'VGO',
  Andorra: 'TLS', 'Andorra la Vella': 'TLS',
  Gibraltar: 'GIB',
  // ── França ──
  Paris: 'CDG',
  Nice: 'NCE',
  Lyon: 'LYS',
  Marselha: 'MRS', Marseille: 'MRS',
  Bordeaux: 'BOD',
  Nantes: 'NTE',
  Lille: 'LIL',
  Estrasburgo: 'SXB', Strasbourg: 'SXB',
  Toulouse: 'TLS',
  Montpellier: 'MPL',
  Biarritz: 'BIQ',
  'Aix-en-Provence': 'MRS', Aix: 'MRS',
  Avignon: 'AVN',
  Cannes: 'NCE',
  Mónaco: 'NCE', Monaco: 'NCE',
  Chamonix: 'GVA',
  Grenoble: 'GNB',
  Annecy: 'GVA',
  Dijon: 'DIJ',
  Reims: 'PAR',
  'Le Havre': 'LEH',
  Rouen: 'URO',
  Caen: 'CFR',
  Rennes: 'RNS',
  Brest: 'BES',
  'La Rochelle': 'LRH',
  'Saint-Malo': 'DNR',
  Calais: 'LIL',
  Metz: 'ETZ',
  Nancy: 'ETZ',
  Colmar: 'SXB',
  Córsega: 'AJA', Corsica: 'AJA',
  Ajaccio: 'AJA',
  Bastia: 'BIA',
  Perpignan: 'PGF',
  Carcassonne: 'CCF',
  Pau: 'PUF',
  Lourdes: 'LDE',
  'Saint-Étienne': 'EBU',
  Clermont: 'CFE', 'Clermont-Ferrand': 'CFE',
  Limoges: 'LIG',
  Poitiers: 'PIS',
  Tours: 'TUF',
  Orléans: 'ORY', Orleans: 'ORY',
  Angers: 'ANE',
  'Le Mans': 'LME',
  Amiens: 'PAR',
  Troyes: 'PAR',
  'Aix-les-Bains': 'CMF',
  Évian: 'GVA', Evian: 'GVA',
  Courchevel: 'GVA',
  // ── Itália ──
  Roma: 'FCO', Rome: 'FCO',
  Milão: 'MXP', Milan: 'MXP',
  Veneza: 'VCE', Venice: 'VCE',
  Florença: 'FLR', Florence: 'FLR',
  Nápoles: 'NAP', Naples: 'NAP',
  Bologna: 'BLQ', Bolonha: 'BLQ',
  Turim: 'TRN', Turin: 'TRN',
  Génova: 'GOA', Genoa: 'GOA',
  Pisa: 'PSA',
  Verona: 'VRN',
  Palermo: 'PMO',
  Catânia: 'CTA', Catania: 'CTA',
  Cagliari: 'CAG',
  Bari: 'BRI',
  Brindisi: 'BDS',
  Trieste: 'TRS',
  Ancona: 'AOI',
  Perugia: 'PEG',
  Rimini: 'RMI',
  Bergamo: 'BGY',
  Brescia: 'VBS',
  Como: 'MXP',
  Siena: 'FLR',
  Lucca: 'PSA',
  Parma: 'PMF',
  Módena: 'BLQ', Modena: 'BLQ',
  Ravena: 'BLQ', Ravenna: 'BLQ',
  Pádua: 'VCE', Padua: 'VCE',
  Vicenza: 'VRN',
  Trento: 'VRN',
  Bolzano: 'BZO',
  Livorno: 'PSA',
  Pescara: 'PSR',
  Lecce: 'BDS',
  Taranto: 'BRI',
  Olbia: 'OLB',
  Alghero: 'AHO',
  Trapani: 'TPS',
  Ragusa: 'CTA',
  Siracusa: 'CTA', Syracuse: 'CTA',
  Messina: 'REG',
  'Reggio Calabria': 'REG',
  Potenza: 'BRI',
  Campobasso: 'NAP',
  Aosta: 'TRN',
  Sanremo: 'NCE',
  Portofino: 'GOA',
  Amalfi: 'NAP',
  Positano: 'NAP',
  Sorrento: 'NAP',
  Capri: 'NAP',
  Ischia: 'NAP',
  Sardenha: 'CAG', Sardinia: 'CAG',
  Sicília: 'PMO', Sicily: 'PMO',
  Cinque: 'GOA',
  // ── Reino Unido ──
  Londres: 'LHR', London: 'LHR',
  Edimburgo: 'EDI', Edinburgh: 'EDI',
  Manchester: 'MAN',
  Birmingham: 'BHX',
  Liverpool: 'LPL',
  Glasgow: 'GLA',
  Bristol: 'BRS',
  Leeds: 'LBA',
  Newcastle: 'NCL',
  Cardiff: 'CWL',
  Belfast: 'BFS',
  Southampton: 'SOU',
  Aberdeen: 'ABZ',
  Inverness: 'INV',
  Cambridge: 'STN',
  Oxford: 'LHR',
  Brighton: 'LGW',
  Bath: 'BRS',
  York: 'LBA',
  'Stratford-upon-Avon': 'BHX',
  Cornwall: 'NQY', 'St Ives': 'NQY',
  'Lake District': 'MAN',
  Escócia: 'EDI', Scotland: 'EDI',
  'Ilha de Man': 'IOM', 'Isle of Man': 'IOM',
  Guernsey: 'GCI',
  Jersey: 'JER',
  // ── Alemanha ──
  Berlim: 'BER', Berlin: 'BER',
  Munique: 'MUC', Munich: 'MUC',
  Hamburgo: 'HAM', Hamburg: 'HAM',
  Frankfurt: 'FRA', Francoforte: 'FRA',
  Colónia: 'CGN', Cologne: 'CGN', Koln: 'CGN',
  Düsseldorf: 'DUS', Dusseldorf: 'DUS',
  Estugarda: 'STR', Stuttgart: 'STR',
  Nuremberga: 'NUE', Nuremberg: 'NUE',
  Hannover: 'HAJ',
  Bremen: 'BRE',
  Leipzig: 'LEJ',
  Dresden: 'DRS',
  Dortmund: 'DTM',
  Heidelberg: 'FRA',
  Friburgo: 'BSL', Freiburg: 'BSL',
  'Floresta Negra': 'STR', 'Black Forest': 'STR',
  Baviera: 'MUC', Bavaria: 'MUC',
  Rothenburg: 'NUE',
  Regensburg: 'MUC',
  Augsburg: 'MUC',
  Constança: 'FDH', Konstanz: 'FDH',
  Bonn: 'CGN',
  Essen: 'DUS',
  Munster: 'FMO', Münster: 'FMO',
  Aachen: 'MST',
  Trier: 'LUX',
  Mainz: 'FRA',
  Wiesbaden: 'FRA',
  Potsdam: 'BER',
  Rostock: 'RLG',
  Kiel: 'HAM',
  Lubeck: 'HAM', Lübeck: 'HAM',
  Sylt: 'GWT',
  Heligoland: 'HAM',
  // ── Países Baixos ──
  Amesterdão: 'AMS', Amsterdam: 'AMS',
  Roterdão: 'RTM', Rotterdam: 'RTM',
  'Haia': 'RTM', 'The Hague': 'RTM',
  Utrecht: 'AMS',
  Eindhoven: 'EIN',
  Groningen: 'GRQ',
  Maastricht: 'MST',
  Arnhem: 'AMS',
  Nijmegen: 'AMS',
  Leiden: 'AMS',
  Delft: 'RTM',
  Gouda: 'RTM',
  Haarlem: 'AMS',
  Volendam: 'AMS',
  Giethoorn: 'AMS',
  'Ilhas Wadden': 'GRQ',
  // ── Bélgica / Luxemburgo ──
  Bruxelas: 'BRU', Brussels: 'BRU',
  Antuérpia: 'ANR', Antwerp: 'ANR',
  Bruges: 'OST', Brugge: 'OST',
  Ghent: 'BRU', Gand: 'BRU',
  Liège: 'LGG', Liege: 'LGG',
  Namur: 'BRU',
  Lovaina: 'BRU', Leuven: 'BRU',
  Luxemburgo: 'LUX', Luxembourg: 'LUX',
  // ── Suíça ──
  Zurique: 'ZRH', Zurich: 'ZRH',
  Genebra: 'GVA', Geneva: 'GVA',
  Basileia: 'BSL', Basel: 'BSL',
  Berna: 'BRN', Bern: 'BRN',
  Lucerna: 'ZRH', Lucerne: 'ZRH',
  Lugano: 'LUG',
  Lausanne: 'GVA',
  Interlaken: 'BRN',
  Zermatt: 'GVA',
  'St. Moritz': 'ZRH',
  Davos: 'ZRH',
  Grindelwald: 'BRN',
  Montreux: 'GVA',
  Jungfrau: 'BRN',
  // ── Áustria ──
  Viena: 'VIE', Vienna: 'VIE',
  Salzburgo: 'SZG', Salzburg: 'SZG',
  Innsbruck: 'INN',
  Graz: 'GRZ',
  Linz: 'LNZ',
  Klagenfurt: 'KLU',
  Bregenz: 'FDH',
  Hallstatt: 'SZG',
  Zell: 'SZG',
  Kitzbuhel: 'SZG', Kitzbühel: 'SZG',
  Vorarlberg: 'FDH',
  // ── Irlanda ──
  Dublin: 'DUB',
  Cork: 'ORK',
  Galway: 'SNN',
  Shannon: 'SNN',
  Limerick: 'SNN',
  Killarney: 'ORK',
  Donegal: 'CFN',
  Sligo: 'NOC',
  Waterford: 'WAT',
  Kilkenny: 'DUB',
  // ── Países Nórdicos ──
  Copenhaga: 'CPH', Copenhagen: 'CPH',
  Aarhus: 'AAR', Arhus: 'AAR',
  Aalborg: 'AAL',
  Odense: 'BLL',
  Billund: 'BLL',
  Bornholm: 'RNN',
  Estocolmo: 'ARN', Stockholm: 'ARN',
  Gotemburgo: 'GOT', Gothenburg: 'GOT',
  Malmo: 'MMX', Malmö: 'MMX',
  Uppsala: 'ARN',
  Kiruna: 'KRN',
  Lulea: 'LLA', Luleå: 'LLA',
  Visby: 'VBY',
  Oslo: 'OSL',
  Bergen: 'BGO',
  Stavanger: 'SVG',
  Trondheim: 'TRD',
  Tromsø: 'TOS', Tromso: 'TOS',
  'Lofoten Islands': 'LKN', Lofoten: 'LKN',
  Svalbard: 'LYR',
  Helsínquia: 'HEL', Helsinki: 'HEL',
  Rovaniemi: 'RVN',
  Turku: 'TKU',
  Tampere: 'TMP',
  Oulu: 'OUL',
  Lapónia: 'RVN', Lapland: 'RVN',
  Reiquiavique: 'KEF', Reykjavik: 'KEF', Reykjavík: 'KEF',
  Islândia: 'KEF', Iceland: 'KEF',
  Akureyri: 'AEY',
  Ilhas: 'FAE', Faroe: 'FAE',
  Gronelândia: 'GOH', Greenland: 'GOH',
  // ── Europa de Leste ──
  Praga: 'PRG', Prague: 'PRG',
  Brno: 'BRQ',
  'Český Krumlov': 'PRG', Cesky: 'PRG',
  Karlovy: 'KLV',
  Varsóvia: 'WAW', Warsaw: 'WAW',
  Cracóvia: 'KRK', Cracovia: 'KRK', Krakow: 'KRK',
  Gdansk: 'GDN', Gdańsk: 'GDN',
  Wroclaw: 'WRO', Wrocław: 'WRO',
  Poznan: 'POZ', Poznań: 'POZ',
  Lodz: 'LCJ', Łódź: 'LCJ',
  Katowice: 'KTW',
  Rzeszow: 'RZE', Rzeszów: 'RZE',
  Szczecin: 'SZZ',
  Lublin: 'LUZ',
  Bialystok: 'WAW', Białystok: 'WAW',
  Zakopane: 'KRK',
  Torun: 'BZG', Toruń: 'BZG',
  Budapeste: 'BUD', Budapest: 'BUD',
  Debrecen: 'DEB',
  Pecs: 'BUD', Pécs: 'BUD',
  Szeged: 'BUD',
  'Lago Balaton': 'SOB', Balaton: 'SOB',
  Bucareste: 'OTP', Bucharest: 'OTP',
  Cluj: 'CLJ', 'Cluj-Napoca': 'CLJ',
  Timisoara: 'TSR', Timişoara: 'TSR',
  Brasov: 'OTP', Braşov: 'OTP',
  Sibiu: 'SBZ',
  Sighisoara: 'TGM', Sighişoara: 'TGM',
  Constanta: 'CND', Constanţa: 'CND',
  Transilvânia: 'CLJ', Transylvania: 'CLJ',
  Sofia: 'SOF',
  Plovdiv: 'PDV',
  Varna: 'VAR',
  Burgas: 'BOJ',
  Belgrado: 'BEG', Belgrade: 'BEG',
  Novi: 'BEG',
  Zagreb: 'ZAG',
  Split: 'SPU',
  Dubrovnik: 'DBV',
  Zadar: 'ZAD',
  Rijeka: 'RJK',
  Pula: 'PUY',
  Hvar: 'SPU',
  Korcula: 'SPU', Korčula: 'SPU',
  Ljubljana: 'LJU',
  Bled: 'LJU',
  Sarajevo: 'SJJ',
  Mostar: 'OMO',
  Skopje: 'SKP',
  Ohrid: 'OHD',
  Tirana: 'TIA',
  Podgorica: 'TGD',
  Kotor: 'TGD',
  Budva: 'TGD',
  Pristina: 'PRN',
  Bratislava: 'BTS',
  Kosice: 'KSC', Košice: 'KSC',
  Tallinn: 'TLL',
  Tartu: 'TAY',
  Riga: 'RIX',
  Jurmala: 'RIX', Jūrmala: 'RIX',
  Vilnius: 'VNO',
  Kaunas: 'KUN',
  Klaipeda: 'PLQ', Klaipėda: 'PLQ',
  Trakai: 'VNO',
  Minsk: 'MSQ',
  Kiev: 'KBP', Kyiv: 'KBP',
  Lviv: 'LWO',
  Odessa: 'ODS',
  Kharkiv: 'HRK',
  Dnipro: 'DNK',
  Chernivtsi: 'CWC',
  Chisinau: 'RMO', Chişinău: 'RMO',
  Tbilisi: 'TBS',
  Batumi: 'BUS',
  Kutaisi: 'KUT',
  Yerevan: 'EVN', Erevan: 'EVN',
  Baku: 'GYD',
  Moscovo: 'SVO', Moscow: 'SVO',
  'São Petersburgo': 'LED', 'Saint Petersburg': 'LED',
  'St. Petersburg': 'LED',
  Kazan: 'KZN',
  Sochi: 'AER',
  Vladivostok: 'VVO',
  Novosibirsk: 'OVB',
  Yekaterinburg: 'SVX',
  Rússia: 'SVO', Russia: 'SVO',
  // ── Turquia / Chipre ──
  Istambul: 'IST', Istanbul: 'IST',
  Ancara: 'ESB', Ankara: 'ESB',
  Antália: 'AYT', Antalya: 'AYT',
  Izmir: 'ADB', İzmir: 'ADB',
  Bodrum: 'BJV',
  Dalaman: 'DLM',
  Cesme: 'ADB', Çeşme: 'ADB',
  Fethiye: 'DLM',
  Marmaris: 'DLM',
  Alanya: 'AYT',
  Capadócia: 'ASR', Cappadocia: 'ASR',
  Pamukkale: 'DNZ',
  Éfeso: 'ADB', Ephesus: 'ADB',
  Trabzon: 'TZX',
  Konya: 'KYA',
  Bursa: 'YEI',
  Turquia: 'IST', Turkey: 'IST',
  Chipre: 'LCA', Cyprus: 'LCA',
  Nicósia: 'LCA', Nicosia: 'LCA',
  // ── Grécia ──
  Atenas: 'ATH', Athens: 'ATH',
  Salónica: 'SKG', Thessaloniki: 'SKG',
  Heraklion: 'HER', Heraclião: 'HER',
  Creta: 'HER', Crete: 'HER',
  Santorini: 'JTR',
  Mykonos: 'JMK',
  Rodes: 'RHO', Rhodes: 'RHO',
  Corfu: 'CFU',
  Zakynthos: 'ZTH',
  Cefalónia: 'EFL', Kefalonia: 'EFL',
  Kos: 'KGS',
  Paros: 'PAS',
  Naxos: 'JNX',
  Milos: 'MLO',
  Chios: 'JKH',
  Lesbos: 'MJT',
  Samos: 'SMI',
  Skiathos: 'JSI',
  Kalambaka: 'ATH',
  Meteora: 'ATH',
  Delfos: 'ATH', Delphi: 'ATH',
  Olimpia: 'KLX', Olympia: 'KLX',
  Nauplia: 'ATH', Nafplio: 'ATH',
  Monemvasia: 'ATH',
  Grécia: 'ATH', Greece: 'ATH',
  // ── Ásia ──
  Tóquio: 'NRT', Tokyo: 'NRT',
  Quioto: 'KIX', Kyoto: 'KIX',
  Osaka: 'KIX',
  Sapporo: 'CTS',
  Fukuoka: 'FUK',
  Nagoya: 'NGO',
  Hiroshima: 'HIJ',
  Naha: 'OKA',
  Okinawa: 'OKA',
  Kanazawa: 'KMQ',
  Hakone: 'NRT',
  Nikko: 'NRT', Nikkō: 'NRT',
  Nara: 'KIX',
  Kobe: 'KIX', Kōbe: 'KIX',
  Yokohama: 'NRT',
  Takayama: 'NGO',
  Fuji: 'NRT',
  Nagasaki: 'NGS',
  Kumamoto: 'KMJ',
  Kagoshima: 'KOJ',
  Sendai: 'SDJ',
  Matsuyama: 'MYJ',
  Japão: 'NRT', Japan: 'NRT',
  Seoul: 'ICN', Seul: 'ICN',
  Busan: 'PUS',
  Jeju: 'CJU',
  Gyeongju: 'PUS',
  Coreia: 'ICN', Korea: 'ICN',
  'Coreia do Norte': 'ICN', 'North Korea': 'ICN',
  Pequim: 'PEK', Beijing: 'PEK',
  Xangai: 'PVG', Shanghai: 'PVG',
  Cantão: 'CAN', Guangzhou: 'CAN',
  Shenzhen: 'SZX',
  Chengdu: 'CTU',
  Chongqing: 'CKG',
  Xian: 'XIY',
  Hangzhou: 'HGH',
  Nanjing: 'NKG',
  Kunming: 'KMG',
  Guilin: 'KWL',
  Lhasa: 'LXA',
  Harbin: 'HRB',
  Sanya: 'SYX',
  Xiamen: 'XMN',
  Suzhou: 'PVG',
  Zhangjiajie: 'DYG',
  Huangshan: 'TXN',
  China: 'PEK',
  'Hong Kong': 'HKG',
  Macau: 'MFM', Macao: 'MFM',
  Taiwan: 'TPE', Taipei: 'TPE',
  Kaohsiung: 'KHH',
  Singapura: 'SIN', Singapore: 'SIN',
  Bangkok: 'BKK', Banguecoque: 'BKK',
  Chiang: 'CNX', 'Chiang Mai': 'CNX',
  Phuket: 'HKT',
  Krabi: 'KBV',
  Pattaya: 'UTP',
  Ko: 'USM', Samui: 'USM',
  'Koh Samui': 'USM',
  'Koh Phi Phi': 'KBV',
  'Koh Phangan': 'USM',
  'Koh Tao': 'URT',
  Ayutthaya: 'BKK',
  Sukhothai: 'THS',
  Kanchanaburi: 'BKK',
  'Khao Sok': 'URT',
  Tailândia: 'BKK', Thailand: 'BKK',
  'Ho Chi Minh': 'SGN', Saigon: 'SGN',
  Hanoi: 'HAN', Hanoí: 'HAN',
  'Da Nang': 'DAD', Danang: 'DAD',
  'Hoi An': 'DAD',
  Hue: 'HUI', Huế: 'HUI',
  Nha: 'CXR', NhaTrang: 'CXR',
  Dalat: 'DLI', Đà: 'DLI',
  'Phu Quoc': 'PQC',
  'Ha Long': 'HPH', Halong: 'HPH',
  Sapa: 'HAN',
  Vietname: 'SGN', Vietnam: 'SGN',
  Phnom: 'PNH', 'Phnom Penh': 'PNH',
  'Siem Reap': 'REP', Angkor: 'REP',
  Sihanoukville: 'KOS',
  Battambang: 'REP',
  Camboja: 'PNH', Cambodia: 'PNH',
  Vientiane: 'VTE',
  'Luang Prabang': 'LPQ',
  Vang: 'VTE',
  Laos: 'VTE',
  Yangon: 'RGN',
  Mandalay: 'MDL',
  Bagan: 'NYU',
  'Inle Lake': 'HEH',
  Myanmar: 'RGN', Burma: 'RGN',
  'Kuala Lumpur': 'KUL',
  Penang: 'PEN',
  Langkawi: 'LGK',
  Malaca: 'KUL', Melaka: 'KUL',
  'Kota Kinabalu': 'BKI',
  Kuching: 'KCH',
  Malásia: 'KUL', Malaysia: 'KUL',
  Borneo: 'BKI', Bornéu: 'BKI',
  Bali: 'DPS',
  Jakarta: 'CGK',
  Yogyakarta: 'JOG',
  Lombok: 'LOP',
  Surabaya: 'SUB',
  Bandung: 'BDO',
  Medan: 'KNO',
  Padang: 'PDG',
  Manado: 'MDC',
  Makassar: 'UPG',
  Flores: 'LBJ',
  Komodo: 'LBJ',
  Sumatra: 'KNO',
  Sulawesi: 'UPG',
  Java: 'JOG',
  Indonésia: 'CGK', Indonesia: 'CGK',
  Manila: 'MNL',
  Cebu: 'CEB',
  Boracay: 'MPH',
  Palawan: 'PPS',
  'Puerto Princesa': 'PPS',
  Bohol: 'TAG',
  Siargao: 'IAO',
  Davao: 'DVO',
  Baguio: 'MNL',
  Filipinas: 'MNL', Philippines: 'MNL',
  Mumbai: 'BOM', Bombaim: 'BOM',
  Deli: 'DEL', Delhi: 'DEL',
  Bangalore: 'BLR',
  Chennai: 'MAA',
  Calcutá: 'CCU', Kolkata: 'CCU',
  Goa: 'GOI',
  Jaipur: 'JAI',
  Agra: 'DEL',
  Udaipur: 'UDR',
  Jodhpur: 'JDH',
  Varanasi: 'VNS',
  Kerala: 'COK',
  Kochi: 'COK',
  Munnar: 'COK',
  Darjeeling: 'IXB',
  Shimla: 'IXC',
  Manali: 'IXC',
  Rishikesh: 'DED',
  Amritsar: 'ATQ',
  Hyderabad: 'HYD',
  Pune: 'PNQ',
  Ahmedabad: 'AMD',
  Lucknow: 'LKO',
  Índia: 'DEL', India: 'DEL',
  'Ilhas Maldivas': 'MLE', Maldivas: 'MLE', Maldives: 'MLE',
  Colombo: 'CMB',
  Kandy: 'CMB',
  Galle: 'CMB',
  Sigiriya: 'CMB',
  Nepal: 'KTM', Katmandu: 'KTM', Kathmandu: 'KTM',
  Pokhara: 'PKR',
  Everest: 'LUA',
  Butão: 'PBH', Bhutan: 'PBH',
  Bangladesh: 'DAC', Daca: 'DAC', Dhaka: 'DAC',
  Paquistão: 'ISB', Pakistan: 'ISB',
  Lahore: 'LHE',
  Karachi: 'KHI',
  Islamabad: 'ISB',
  Mongólia: 'UBN', Mongolia: 'UBN',
  'Ulaanbaatar': 'UBN', Ulan: 'UBN',
  Cazaquistão: 'NQZ', Kazakhstan: 'NQZ',
  Almaty: 'ALA',
  Astana: 'NQZ',
  Uzbequistão: 'TAS', Uzbekistan: 'TAS',
  Tashkent: 'TAS',
  Samarkand: 'SKD', Samarcanda: 'SKD',
  Bukhara: 'BHK', Bucara: 'BHK',
  Khiva: 'UGC',
  'Silk Road': 'TAS',
  // ── Médio Oriente ──
  Dubai: 'DXB',
  'Abu Dhabi': 'AUH',
  Sharjah: 'SHJ',
  'Ras Al Khaimah': 'RKT',
  Emirados: 'DXB', UAE: 'DXB',
  Doha: 'DOH', Qatar: 'DOH',
  Muscat: 'MCT', Mascate: 'MCT', Omã: 'MCT', Oman: 'MCT',
  Salalah: 'SLL',
  Riad: 'RUH', Riyadh: 'RUH',
  Jeddah: 'JED', Jidá: 'JED',
  Medina: 'MED',
  Meca: 'JED', Mecca: 'JED',
  Arábia: 'RUH', Arabia: 'RUH',
  Kuwait: 'KWI',
  Bahrain: 'BAH', Barém: 'BAH',
  Telavive: 'TLV', Tel: 'TLV', 'Tel Aviv': 'TLV',
  Jerusalém: 'TLV', Jerusalem: 'TLV',
  'Mar Morto': 'TLV', 'Dead Sea': 'TLV',
  Eilat: 'ETM',
  Haifa: 'HFA',
  Nazaré: 'TLV', Nazareth: 'TLV',
  Belém: 'TLV', Bethlehem: 'TLV',
  Israel: 'TLV',
  Amã: 'AMM', Amman: 'AMM',
  Petra: 'AMM',
  'Wadi Rum': 'AQJ',
  Aqaba: 'AQJ',
  Jordânia: 'AMM', Jordan: 'AMM',
  Beirute: 'BEY', Beirut: 'BEY',
  Líbano: 'BEY', Lebanon: 'BEY',
  Damasco: 'DAM', Damascus: 'DAM',
  Síria: 'DAM', Syria: 'DAM',
  Bagdade: 'BGW', Baghdad: 'BGW',
  Teerão: 'IKA', Tehran: 'IKA',
  Tabriz: 'TBZ',
  Shiraz: 'SYZ',
  Isfahan: 'IFN', Esfahan: 'IFN',
  Irão: 'IKA', Iran: 'IKA',
  // ── África ──
  Casablanca: 'CMN',
  Marraquexe: 'RAK', Marrakech: 'RAK',
  Fez: 'FEZ', Fes: 'FEZ',
  Tânger: 'TNG', Tanger: 'TNG',
  Agadir: 'AGA',
  Rabat: 'RBA',
  Essaouira: 'ESU',
  Chefchaouen: 'TTU', Xexuão: 'TTU',
  Ouarzazate: 'OZZ',
  Merzouga: 'ERH', Sahara: 'ERH',
  Marrocos: 'CMN', Morocco: 'CMN',
  Cairo: 'CAI', 'Cairo ': 'CAI',
  Luxor: 'LXR',
  'Sharm el-Sheikh': 'SSH', Sharm: 'SSH',
  Hurghada: 'HRG',
  Alexandria: 'HBE',
  Aswan: 'ASW', Assuão: 'ASW',
  Dahab: 'SSH',
  Siwa: 'CAI',
  Egito: 'CAI', Egypt: 'CAI',
  Tunis: 'TUN', Tunes: 'TUN',
  Sousse: 'NBE',
  Hammamet: 'NBE',
  Djerba: 'DJE',
  Tunísia: 'TUN', Tunisia: 'TUN',
  Argélia: 'ALG', Algeria: 'ALG', Argel: 'ALG',
  Joanesburgo: 'JNB', Johannesburg: 'JNB',
  'Cidade do Cabo': 'CPT', 'Cape Town': 'CPT',
  Durban: 'DUR',
  Kruger: 'MQP',
  Pretoria: 'PRY', Pretória: 'PRY',
  'Porto Elizabeth': 'PLZ',
  Stellenbosch: 'CPT',
  Garden: 'GRJ',
  Quénia: 'NBO', Kenya: 'NBO',
  Nairobi: 'NBO',
  Mombaça: 'MBA', Mombasa: 'MBA',
  Masai: 'NBO', Mara: 'NBO',
  'Masai Mara': 'NBO',
  Zanzibar: 'ZNZ',
  'Dar es Salaam': 'DAR',
  Kilimanjaro: 'JRO',
  Arusha: 'JRO',
  Serengeti: 'JRO',
  Tanzânia: 'DAR', Tanzania: 'DAR',
  Uganda: 'EBB', Kampala: 'EBB',
  Entebbe: 'EBB',
  Ruanda: 'KGL', Rwanda: 'KGL', Kigali: 'KGL',
  Etiópia: 'ADD', Ethiopia: 'ADD', 'Addis Ababa': 'ADD', Adis: 'ADD',
  Gana: 'ACC', Ghana: 'ACC', Accra: 'ACC',
  Senegal: 'DSS', Dakar: 'DSS',
  Nigéria: 'LOS', Nigeria: 'LOS', Lagos: 'LOS',
  'Ivory Coast': 'ABJ', Abidjan: 'ABJ',
  Camarões: 'DLA', Cameroon: 'DLA',
  Angola: 'LAD', Luanda: 'LAD',
  Moçambique: 'MPM', Mozambique: 'MPM', Maputo: 'MPM',
  'Ilha de Moçambique': 'MPM',
  Vilanculos: 'VNX',
  Bazaruto: 'VNX',
  Namíbia: 'WDH', Namibia: 'WDH', Windhoek: 'WDH',
  Swakopmund: 'WDH',
  Etosha: 'WDH',
  Botsuana: 'GBE', Botswana: 'GBE', Gaborone: 'GBE',
  Okavango: 'MUB', Maun: 'MUB',
  Zimbabué: 'HRE', Zimbabwe: 'HRE', Harare: 'HRE',
  'Victoria Falls': 'VFA',
  Zâmbia: 'LUN', Zambia: 'LUN', Lusaka: 'LUN',
  Maurícia: 'MRU', Mauritius: 'MRU',
  Seychelles: 'SEZ', Seicheles: 'SEZ',
  Madagáscar: 'TNR', Madagascar: 'TNR', Antananarivo: 'TNR',
  Cabo: 'RAI', 'Cabo Verde': 'RAI', 'Cape Verde': 'RAI', Praia: 'RAI',
  Sal: 'SID',
  'São Vicente': 'VXE',
  'São Tomé': 'TMS', 'Sao Tome': 'TMS',
  Bissau: 'OXB', Guiné: 'OXB',
  Mali: 'BKO', Bamako: 'BKO',
  'Burkina Faso': 'OUA',
  Malawi: 'LLW', Lilongwe: 'LLW',
  // ── Américas ──
  'Nova Iorque': 'JFK', 'New York': 'JFK', NYC: 'JFK',
  'Los Angeles': 'LAX',
  'San Francisco': 'SFO',
  'Las Vegas': 'LAS',
  Miami: 'MIA',
  Orlando: 'MCO',
  Chicago: 'ORD',
  Boston: 'BOS',
  Washington: 'IAD', 'Washington DC': 'IAD',
  Seattle: 'SEA',
  Portland: 'PDX',
  Denver: 'DEN',
  Dallas: 'DFW',
  Houston: 'IAH',
  Atlanta: 'ATL',
  Philadelphia: 'PHL',
  Phoenix: 'PHX',
  'San Diego': 'SAN',
  'New Orleans': 'MSY',
  Nashville: 'BNA',
  Austin: 'AUS',
  Charleston: 'CHS',
  Savannah: 'SAV',
  'Salt Lake City': 'SLC',
  Minneapolis: 'MSP',
  Detroit: 'DTW',
  Pittsburgh: 'PIT',
  'San Antonio': 'SAT',
  Tampa: 'TPA',
  'Fort Lauderdale': 'FLL',
  'Palm Springs': 'PSP',
  Aspen: 'ASE',
  'Lake Tahoe': 'RNO',
  Yellowstone: 'BZN',
  'Grand Canyon': 'FLG',
  Yosemite: 'FAT',
  Anchorage: 'ANC',
  Alaska: 'ANC',
  Honolulu: 'HNL',
  Hawaii: 'HNL', Havaí: 'HNL',
  Maui: 'OGG',
  Kauai: 'LIH',
  USA: 'JFK', 'United States': 'JFK',
  Toronto: 'YYZ',
  Vancouver: 'YVR',
  Montreal: 'YUL',
  Calgary: 'YYC',
  Ottawa: 'YOW',
  Edmonton: 'YEG',
  Quebec: 'YQB',
  Winnipeg: 'YWG',
  Halifax: 'YHZ',
  Victoria: 'YYJ',
  Banff: 'YYC',
  Whistler: 'YVR',
  Jasper: 'YEG',
  Niágara: 'YYZ', Niagara: 'YYZ',
  Canadá: 'YYZ', Canada: 'YYZ',
  'Mexico City': 'MEX', 'Cidade do México': 'MEX',
  Cancún: 'CUN', Cancun: 'CUN',
  Playa: 'CUN', 'Playa del Carmen': 'CUN',
  Tulum: 'CUN',
  Cabo: 'SJD', 'Los Cabos': 'SJD', 'Cabo San Lucas': 'SJD',
  'Puerto Vallarta': 'PVR',
  Guadalajara: 'GDL',
  Oaxaca: 'OAX',
  Mérida: 'MID', Merida: 'MID',
  Monterrey: 'MTY',
  'San Miguel': 'QRO',
  Guanajuato: 'BJX',
  Puebla: 'PBC',
  Acapulco: 'ACA',
  Cozumel: 'CZM',
  Holbox: 'CUN',
  Chichén: 'CUN', Chichen: 'CUN',
  México: 'MEX', Mexico: 'MEX',
  'Rio de Janeiro': 'GIG', Rio: 'GIG',
  'São Paulo': 'GRU', 'Sao Paulo': 'GRU',
  Brasília: 'BSB', Brasilia: 'BSB',
  Salvador: 'SSA',
  Recife: 'REC',
  Fortaleza: 'FOR',
  Florianópolis: 'FLN', Florianopolis: 'FLN',
  'Porto Alegre': 'POA',
  Curitiba: 'CWB',
  Belo: 'CNF', 'Belo Horizonte': 'CNF',
  Manaus: 'MAO',
  Belém: 'BEL', Belem: 'BEL',
  Natal: 'NAT',
  'São Luís': 'SLZ',
  Maceió: 'MCZ', Maceio: 'MCZ',
  Vitória: 'VIX', Vitoria: 'VIX',
  Cuiabá: 'CGB', Cuiaba: 'CGB',
  'Campo Grande': 'CGR',
  Goiânia: 'GYN', Goiania: 'GYN',
  João: 'JPA', Pessoa: 'JPA',
  Foz: 'IGU', 'Foz do Iguaçu': 'IGU', Iguacu: 'IGU',
  'Rio Grande': 'RIG',
  Pantanal: 'CGB',
  Amazonia: 'MAO', Amazónia: 'MAO',
  Américas: 'GRU',
  Brasil: 'GRU', Brazil: 'GRU',
  'Buenos Aires': 'EZE',
  Bariloche: 'BRC',
  Mendoza: 'MDZ',
  Córdoba: 'COR', Cordoba: 'COR',
  Ushuaia: 'USH',
  'El Calafate': 'FTE',
  Salta: 'SLA',
  Iguazú: 'IGR', Iguazu: 'IGR',
  Rosário: 'ROS', Rosario: 'ROS',
  Mar: 'MDQ', 'Mar del Plata': 'MDQ',
  Patagónia: 'BRC', Patagonia: 'BRC',
  Argentina: 'EZE',
  Santiago: 'SCL',
  'San Pedro': 'CJC', Atacama: 'CJC',
  Valparaíso: 'SCL', Valparaiso: 'SCL',
  Pucón: 'ZCO', Pucon: 'ZCO',
  'Puerto Natales': 'PNT',
  'Punta Arenas': 'PUQ',
  'Ilha da Páscoa': 'IPC', 'Easter Island': 'IPC',
  Chile: 'SCL',
  Lima: 'LIM',
  Cusco: 'CUZ', Cuzco: 'CUZ',
  'Machu Picchu': 'CUZ',
  Arequipa: 'AQP',
  Trujillo: 'TRU',
  Iquitos: 'IQT',
  Nazca: 'LIM',
  Puno: 'JUL',
  Titicaca: 'JUL',
  Peru: 'LIM', Perú: 'LIM',
  Bogotá: 'BOG', Bogota: 'BOG',
  Cartagena: 'CTG',
  Medellín: 'MDE', Medellin: 'MDE',
  Cali: 'CLO',
  'Santa Marta': 'SMR',
  Barranquilla: 'BAQ',
  'San Andrés': 'ADZ',
  Eje: 'MDE',
  Colômbia: 'BOG', Colombia: 'BOG',
  Quito: 'UIO',
  Guayaquil: 'GYE',
  Cuenca: 'CUE',
  Galápagos: 'GPS', Galapagos: 'GPS',
  Equador: 'UIO', Ecuador: 'UIO',
  Caracas: 'CCS',
  Isla: 'PMV', Margarita: 'PMV',
  Venezuela: 'CCS',
  'La Paz': 'LPB',
  'Santa Cruz': 'VVI',
  Sucre: 'SRE',
  Uyuni: 'UYU',
  Potosí: 'POI', Potosi: 'POI',
  Bolívia: 'LPB', Bolivia: 'LPB',
  Assunção: 'ASU', Asuncion: 'ASU',
  Paraguai: 'ASU', Paraguay: 'ASU',
  Montevideu: 'MVD', Montevideo: 'MVD',
  'Punta del Este': 'PDP',
  Colonia: 'MVD',
  Uruguai: 'MVD', Uruguay: 'MVD',
  'Cidade do Panamá': 'PTY', Panama: 'PTY',
  Bocas: 'BOC',
  'San Blas': 'PTY',
  'San José': 'SJO', 'San Jose': 'SJO',
  Liberia: 'LIR',
  Tamarindo: 'LIR',
  Arenal: 'SJO',
  'Manuel Antonio': 'SJO',
  Nicarágua: 'MGA', Nicaragua: 'MGA',
  Granada: 'MGA',
  León: 'MGA', Leon: 'MGA',
  Ometepe: 'MGA',
  Honduras: 'SAP', 'San Pedro Sula': 'SAP',
  Roatán: 'RTB', Roatan: 'RTB',
  Utila: 'RTB',
  Copán: 'SAP',
  'El Salvador': 'SAL',
  Guatemala: 'GUA',
  Antigua: 'GUA',
  Atitlán: 'GUA', Atitlan: 'GUA',
  Tikal: 'FRS',
  Belize: 'BZE',
  Cuba: 'HAV', Havana: 'HAV',
  Varadero: 'VRA',
  Trinidad: 'HAV',
  'Santiago de Cuba': 'SCU',
  Viñales: 'HAV', Vinales: 'HAV',
  Jamaica: 'MBJ', Montego: 'MBJ',
  Negril: 'MBJ',
  Kingston: 'KIN',
  Ocho: 'OCJ',
  'Dominican Republic': 'PUJ',
  'Punta Cana': 'PUJ',
  'Santo Domingo': 'SDQ',
  Samaná: 'AZS', Samana: 'AZS',
  'Puerto Plata': 'POP',
  'Porto Rico': 'SJU', 'Puerto Rico': 'SJU', 'San Juan': 'SJU',
  Bahamas: 'NAS', Nassau: 'NAS',
  Barbados: 'BGI',
  'Santa Lúcia': 'UVF', 'Saint Lucia': 'UVF',
  Aruba: 'AUA',
  Curaçao: 'CUR', Curacao: 'CUR',
  'Trinidad e Tobago': 'POS', 'Trinidad and Tobago': 'POS',
  // ── Oceânia ──
  Sydney: 'SYD',
  Melbourne: 'MEL',
  Brisbane: 'BNE',
  Perth: 'PER',
  Adelaide: 'ADL',
  Cairns: 'CNS',
  'Gold Coast': 'OOL',
  Darwin: 'DRW',
  Hobart: 'HBA',
  Tasmania: 'HBA', Tasmânia: 'HBA',
  Canberra: 'CBR',
  Uluru: 'AYQ', 'Ayers Rock': 'AYQ',
  Austrália: 'SYD', Australia: 'SYD',
  Auckland: 'AKL',
  Wellington: 'WLG',
  Christchurch: 'CHC',
  Queenstown: 'ZQN',
  Rotorua: 'ROT',
  Nelson: 'NSN',
  Dunedin: 'DUD',
  Taupo: 'TUO', Taupō: 'TUO',
  Bay: 'AKL',
  Napier: 'NPE',
  'New Zealand': 'AKL',
  Fiji: 'NAN', Nadi: 'NAN',
  Suva: 'SUV',
  'Ilhas Cook': 'RAR', Rarotonga: 'RAR',
  'Polinésia Francesa': 'PPT', Tahiti: 'PPT', Bora: 'PPT',
  Nova: 'NOU', 'Nova Caledónia': 'NOU', 'New Caledonia': 'NOU',
  Vanuatu: 'VLI',
  Samoa: 'APW', Apia: 'APW',
  Tonga: 'TBU',
  Palau: 'ROR',
  Guam: 'GUM',
  'Papua-Nova Guiné': 'POM', 'Papua New Guinea': 'POM',
  'Ilhas Salomão': 'HIR', Solomons: 'HIR',
  // ── Países/regiões com IATA principal ──
  Portugal: 'LIS',
  Espanha: 'MAD', Spain: 'MAD',
  França: 'CDG', France: 'CDG',
  Itália: 'FCO', Italy: 'FCO',
  Alemanha: 'FRA', Germany: 'FRA',
  'Reino Unido': 'LHR', 'United Kingdom': 'LHR', UK: 'LHR',
  Suíça: 'ZRH', Switzerland: 'ZRH',
  Áustria: 'VIE', Austria: 'VIE',
  Bélgica: 'BRU', Belgium: 'BRU',
  Holanda: 'AMS', Netherlands: 'AMS',
  Irlanda: 'DUB', Ireland: 'DUB',
  Noruega: 'OSL', Norway: 'OSL',
  Suécia: 'ARN', Sweden: 'ARN',
  Finlândia: 'HEL', Finland: 'HEL',
  Dinamarca: 'CPH', Denmark: 'CPH',
  Islândia: 'KEF', Iceland: 'KEF',
  Polónia: 'WAW', Poland: 'WAW',
  'República Checa': 'PRG', 'Czech Republic': 'PRG', Czech: 'PRG',
  Eslováquia: 'BTS', Slovakia: 'BTS',
  Hungria: 'BUD', Hungary: 'BUD',
  Roménia: 'OTP', Romania: 'OTP',
  Bulgária: 'SOF', Bulgaria: 'SOF',
  Croácia: 'SPU', Croatia: 'SPU',
  Eslovénia: 'LJU', Slovenia: 'LJU',
  Sérvia: 'BEG', Serbia: 'BEG',
  Bósnia: 'SJJ', Bosnia: 'SJJ',
  Albânia: 'TIA', Albania: 'TIA',
  Macedónia: 'SKP', Macedonia: 'SKP',
  Montenegro: 'TGD',
  'Báltico States': 'RIX', Baltics: 'RIX',
  Estónia: 'TLL', Estonia: 'TLL',
  Letónia: 'RIX', Latvia: 'RIX',
  Lituânia: 'VNO', Lithuania: 'VNO',
  Ucrânia: 'KBP', Ukraine: 'KBP',
  Bielorrússia: 'MSQ', Belarus: 'MSQ',
  Geórgia: 'TBS', Georgia: 'TBS',
  Arménia: 'EVN', Armenia: 'EVN',
  Azerbaijão: 'GYD', Azerbaijan: 'GYD',
  Turquia: 'IST', Turkey: 'IST',
  Chipre: 'LCA', Cyprus: 'LCA',
  Grécia: 'ATH', Greece: 'ATH',
  Malta: 'MLA',
  Japão: 'NRT', Japan: 'NRT',
  'Coreia do Sul': 'ICN', 'South Korea': 'ICN',
  China: 'PEK',
  Taiwan: 'TPE',
  Singapura: 'SIN', Singapore: 'SIN',
  Tailândia: 'BKK', Thailand: 'BKK',
  Vietname: 'SGN', Vietnam: 'SGN',
  Indonésia: 'CGK', Indonesia: 'CGK',
  Malásia: 'KUL', Malaysia: 'KUL',
  Filipinas: 'MNL', Philippines: 'MNL',
  Índia: 'DEL', India: 'DEL',
  'Sri Lanka': 'CMB',
  Maldivas: 'MLE', Maldives: 'MLE',
  Nepal: 'KTM',
  Paquistão: 'ISB', Pakistan: 'ISB',
  Bangladesh: 'DAC',
  Mongólia: 'UBN', Mongolia: 'UBN',
  Cazaquistão: 'NQZ', Kazakhstan: 'NQZ',
  Uzbequistão: 'TAS', Uzbekistan: 'TAS',
  Emirados: 'DXB', UAE: 'DXB',
  Qatar: 'DOH',
  Omã: 'MCT', Oman: 'MCT',
  Arábia: 'RUH', Arabia: 'RUH', 'Saudi Arabia': 'RUH',
  Kuwait: 'KWI',
  Bahrain: 'BAH',
  Israel: 'TLV',
  Jordânia: 'AMM', Jordan: 'AMM',
  Líbano: 'BEY', Lebanon: 'BEY',
  Irão: 'IKA', Iran: 'IKA',
  Marrocos: 'CMN', Morocco: 'CMN',
  Egito: 'CAI', Egypt: 'CAI',
  Tunísia: 'TUN', Tunisia: 'TUN',
  Argélia: 'ALG', Algeria: 'ALG',
  'África do Sul': 'JNB', 'South Africa': 'JNB',
  Quénia: 'NBO', Kenya: 'NBO',
  Tanzânia: 'DAR', Tanzania: 'DAR',
  Uganda: 'EBB',
  Ruanda: 'KGL', Rwanda: 'KGL',
  Etiópia: 'ADD', Ethiopia: 'ADD',
  Gana: 'ACC', Ghana: 'ACC',
  Senegal: 'DSS',
  Nigéria: 'LOS', Nigeria: 'LOS',
  'Costa do Marfim': 'ABJ', 'Ivory Coast': 'ABJ',
  Angola: 'LAD',
  Moçambique: 'MPM', Mozambique: 'MPM',
  Namíbia: 'WDH', Namibia: 'WDH',
  Botsuana: 'GBE', Botswana: 'GBE',
  Maurícia: 'MRU', Mauritius: 'MRU',
  Seychelles: 'SEZ',
  'Cabo Verde': 'RAI', 'Cape Verde': 'RAI',
  Madagáscar: 'TNR', Madagascar: 'TNR',
  'Estados Unidos': 'JFK', USA: 'JFK', 'United States': 'JFK',
  Canadá: 'YYZ', Canada: 'YYZ',
  México: 'MEX', Mexico: 'MEX',
  Brasil: 'GRU', Brazil: 'GRU',
  Argentina: 'EZE',
  Chile: 'SCL',
  Peru: 'LIM', Perú: 'LIM',
  Colômbia: 'BOG', Colombia: 'BOG',
  Equador: 'UIO', Ecuador: 'UIO',
  Bolívia: 'LPB', Bolivia: 'LPB',
  Paraguai: 'ASU', Paraguay: 'ASU',
  Uruguai: 'MVD', Uruguay: 'MVD',
  Panamá: 'PTY', Panama: 'PTY',
  'Costa Rica': 'SJO',
  Nicarágua: 'MGA', Nicaragua: 'MGA',
  Guatemala: 'GUA',
  Cuba: 'HAV',
  Jamaica: 'MBJ',
  'República Dominicana': 'PUJ', 'Dominican Republic': 'PUJ',
  Austrália: 'SYD', Australia: 'SYD',
  'Nova Zelândia': 'AKL', 'New Zealand': 'AKL',
  Fiji: 'NAN',
};

/** Preço base por estrelas × multiplicador regional (EUR). Determinístico, sem Math.random(). */
const REGION_PRICE_MULTIPLIER = {
  // Europa Ocidental
  PT: 1.0, ES: 1.05, FR: 1.15, IT: 1.1, DE: 1.05, GB: 1.2, CH: 1.5, AT: 1.1, BE: 1.05,
  NL: 1.1, IE: 1.1, LU: 1.2, MC: 1.8,
  // Europa Sul / Mediterrâneo
  GR: 0.8, HR: 0.75, SI: 0.75, MT: 0.85, CY: 0.8, AL: 0.5, ME: 0.55, MK: 0.45,
  BA: 0.5, RS: 0.5, BG: 0.5, RO: 0.55, MD: 0.45,
  // Europa Norte
  NO: 1.2, SE: 1.1, DK: 1.15, FI: 1.1, IS: 1.3,
  // Europa Leste
  PL: 0.6, CZ: 0.65, SK: 0.6, HU: 0.6, EE: 0.65, LV: 0.6, LT: 0.6, UA: 0.4,
  BY: 0.4, GE: 0.45,
  // Ásia
  JP: 0.9, KR: 0.8, CN: 0.6, TW: 0.65, HK: 1.0, SG: 1.05,
  TH: 0.4, VN: 0.35, KH: 0.3, LA: 0.3, MM: 0.3, MY: 0.5, ID: 0.35, PH: 0.4,
  IN: 0.35, LK: 0.35, NP: 0.25, BD: 0.3, PK: 0.3,
  MN: 0.35, KZ: 0.4, UZ: 0.35,
  // Médio Oriente
  AE: 1.0, QA: 1.0, SA: 0.85, KW: 0.9, BH: 0.9, OM: 0.8,
  IL: 1.0, JO: 0.65, LB: 0.55, TR: 0.6,
  // Américas
  US: 1.3, CA: 1.1, MX: 0.65, BR: 0.7, AR: 0.6, CL: 0.7, CO: 0.55,
  PE: 0.55, EC: 0.5, BO: 0.4, PY: 0.45, UY: 0.65, VE: 0.35,
  PA: 0.65, CR: 0.7, GT: 0.5, SV: 0.5, HN: 0.45, NI: 0.45, BZ: 0.55,
  DO: 0.6, CU: 0.55, JM: 0.7, BS: 0.9, BB: 0.75, TT: 0.7,
  // África
  ZA: 0.55, MA: 0.5, EG: 0.4, TN: 0.45, DZ: 0.45,
  KE: 0.45, TZ: 0.4, UG: 0.35, RW: 0.4, ET: 0.4, GH: 0.45, NG: 0.5,
  SN: 0.45, CI: 0.5, CM: 0.5, AO: 0.6, MZ: 0.45, NA: 0.5, BW: 0.55,
  MU: 0.8, SC: 0.9, CV: 0.5,
  // Oceânia
  AU: 1.0, NZ: 0.95, FJ: 0.55, PF: 0.8, NC: 0.75,
};

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

function inferCountry(title, text, lang) {
  return inferCountryFromDestination(title, text, lang);
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

function inferPrice(stars, paisCode) {
  const base = { 2: 45, 3: 85, 4: 140, 5: 260 }[stars] ?? 90;
  const mult = REGION_PRICE_MULTIPLIER[paisCode] ?? 1.0;
  return Math.round(base * mult);
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
    const country = inferCountry(title, text, lang);
    const iata = lookupIata(title);
    const listings = art.listings ?? [];

    destId += 1;
    const slug = title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    const tipo = inferTipo(text);
    const clima = inferClima(text);
    const card = buildDestinationCard({ text, title, tipo, clima, lang: art.lang ?? lang, preParsedSections: art.sections });

    destinos.push({
      id: destId,
      nome: title,
      pais: country.name,
      paisCode: country.code,
      iata,
      continente: country.continent,
      tipo,
      clima,
      descricao: card.resumo ?? excerpt(text),
      descricaoCompleta: excerptResumo(text, 1200) || excerpt(text, 1200),
      resumo: card.resumo,
      veja: card.veja,
      faca: card.faca,
      coma: card.coma,
      tags: card.tags,
      dicas: card.dicas,
      imagem_url: `https://images.unsplash.com/photo-1469854523086-cc02afe5c88?auto=format&fit=crop&w=1200&q=70&sig=${destId}`,
      imagem_query: `${title},${country.name},travel`,
      wikivoyageUrl: art.url,
      lang: art.lang ?? lang,
    });

    const hotelList = listings.slice(0, MAX_HOTELS_PER_DEST * 3);
    for (const listing of hotelList) {
      const nome =
        listing.nome || listing.name || listing.alt || `Alojamento ${hotelId + 1}`;
      if (!nome || nome.length < 2) continue;
      if (!isLikelyAccommodationName(nome)) continue;
      const stars = inferStars(listing, nome);
      hotelId += 1;
      hoteis.push({
        id: hotelId,
        destino_id: destId,
        nome: nome.trim(),
        estrelas: stars,
        preco_por_noite: inferPrice(stars, country.code),
        comodidades: listingAmenities(listing),
        wikivoyageUrl: art.url,
        fonte: 'wikivoyage-listing',
      });
      if (hoteis.filter((h) => h.destino_id === destId).length >= MAX_HOTELS_PER_DEST) break;
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
