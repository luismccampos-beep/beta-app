import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
loadProjectEnv(ROOT);

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const CSV_PATH = resolve(ROOT, 'data/export_towns_for_geocode.csv');

// ---- Patterns (same as _categorize-complete.mjs) ----

const TOPIC_PATTERNS = [
  /\b(tourism|cuisine|tour|architecture|cycling|hiking|monopoly|universe|trip|itinerary|culture|music|art|museum|heritage|history|border|monarch|empire|paleontology|wine|canon|government|indigenous)\b/i,
  /\b(rail\s*travel|bus\s*travel|disabled\s*travel|christmas|new\s*year|vacation\s*camp)\b/i,
  /\b(phrasebook|itinerar|road\s*trip|road\s*66|road\s*1|highway)\b/i,
  /\b(recipes|food|drink|beer|coffee|tea|cuisines|eating|dining)\b/i,
  /\b(budget|cheap|expensive|money|costs|free|affordable)\b/i,
  /\b(safety|crime|danger|safe|health|medical|hospital|police|embassy)\b/i,
  /\b(weather|climate|rain|snow|sun|temperature|season|monsoon)\b/i,
  /\b(language|dialect|accent|slang|communication)\b/i,
  /\b(etiquette|customs|tradition|festival|celebration|holiday|event)\b/i,
  /\b(cinema|film|movie|theatre|theater|opera|ballet|dance|concert)\b/i,
  /\b(photography|photo|photograph|camera|drone)\b/i,
  /\b(shopping|market|bazaar|souvenir|handicraft|artesan[ií]a)\b/i,
  /\b(spa|wellness|yoga|meditation|retreat|relax)\b/i,
  /\b(wildlife|safari|bird|whale|dolphin|coral|reef|diving|snorkel|surf|kayak|rafting)\b/i,
  /\b(golf|ski|snowboard|sport|stadium|arena|race|marathon|cycling)\b/i,
  /\b(volunteer|teaching|study|learn|course|class|workshop|internship)\b/i,
  /\b(cruise|sailing|yacht|ferry|boat|ship|port|harbor)\b/i,
  /\b(train|railway|railroad|station|metro|subway|bus|taxi|ride.?share|uber)\b/i,
  /\b(airport|airline|flight|avia|aviation|aeropuerto)\b/i,
  /\b(hotel|hostel|lodge|resort|inn|accommodation|lodging)\b/i,
  /\b(mobile|phone|internet|wifi|network|sim|card|roaming|gadget)\b/i,
  /\b(travel\s*(literature|writing|blog|journal|guide|book|magazine))\b/i,
  /\b(backpack|packing|luggage|visa|passport|customs|immigration)\b/i,
  /\b(solo|female|gay|lgbt|senior|student|family|kids|children|pet|dog)\b/i,
  /\b(nomad|digital|remote\s*work|coworking)\b/i,
  /\b(space|astronomy|rocket|observatory|planetarium|telescope)\b/i,
  /\b(military|war|battle|fort|castle|ruins|tomb|grave|archaeolog|fossil|dinosaur)\b/i,
  /\b(ghost|haunt|cemetery|mystery|supernatural|crypt|catacomb)\b/i,
  /\b(industrial|factory|mine|mill|power\s*plant|dam|canal|bridge|tunnel)\b/i,
  /\b(royal|king|queen|prince|princess|palace|crown|noble|aristocrat)\b/i,
  /\b(communist|soviet|nazi|fascist|dictator|revolution|civil\s*war|genocide|holocaust)\b/i,
  /\b(unesco|world\s*heritage|conservation|protected|reserve|sanctuary)\b/i,
  /\b(tree|flower|garden|botanic|arboretum|nature|eco|environment)\b/i,
  /\b(light|lighthouse|panorama|viewpoint|overlook|scenic|vista)\b/i,
  /\b(pilgrim|religious|church|cathedral|mosque|temple|synagogue|monastery|convent|shrine|abbey|cult)\b/i,
  /\b(music|jazz|blues|rock|pop|folk|orchestra|symphony|choir)\b/i,
  /\b(fashion|design|interior|decor|furniture)\b/i,
  /\b(writing|poet|novel|fiction|fantasy|sci.?fi)\b/i,
  /\b(cartoon|comic|manga|anime|character|theme\s*park)\b/i,
  /\b(perfume|cosmetic|beauty|makeup)\b/i,
  /\b(antique|vintage|retro|collectible|curio)\b/i,
  /\b(disaster|earthquake|volcano|tsunami|flood|hurricane|tornado|fire|eruption)\b/i,
  /\b(piracy|pirate|treasure|shipwreck|sunken)\b/i,
  /\b(silk\s*road|spice\s*route|inca\s*road|maya|aztec|inca|olmec|toltec)\b/i,
  /\b(vikings|celts|romans|greeks|egyptian|pharaoh|mummy|hieroglyph)\b/i,
  /\b(samurai|ninja|shogun|geisha|zen)\b/i,
  /\b(cowboy|native|tribe|clan|chief|totem)\b/i,
  /\b(ice\s*cream|chocolate|candy|pastry|bread|cheese|oil|vinegar|honey)\b/i,
  /\b(coffee|tea|chai|mate|sake|beer|wine|whiskey|whisky|vodka|rum|gin|cocktail)\b/i,
  /\b(monopoly|gambling|casino|poker|bingo|lottery)\b/i,
  /\b(k.?pop|j.?pop|anime|manga|cosplay)\b/i,
  /\b(chess|checkers|go\b|shogi|mahjong|bridge|poker)\b/i,
  /\b(horse\s*racing|bullfighting|rodeo|corrida)\b/i,
  /\b(time\s*zone|date\s*line|calendar|clock)\b/i,
  /\b(capital\s*$|country\s*$|nation\s*$|continent\s*$)\b/i,
  /\b(world\s*$|global|international|universal)\b/i,
  /\b(tips|advice|guide|how.to|faq|diy|hack|trick|secret|hidden\s*gem)\b/i,
  /\b(day\s*trip|weekend|short\s*break|staycation|getaway|escape)\b/i,
  /\b(road\s*trip|round\s*trip|cross.?country|overland)\b/i,
  /\b(trek|expedition|adventure|explor|journey|voyage|odyssey|safari)\b/i,
  /\b(football|soccer|baseball|basketball|hockey|tennis|rugby|cricket|badminton|volleyball)\b/i,
  /\b(olympics|olympic|paralympic|world\s*cup|championship|tournament|league)\b/i,
  /\b(magic|circus|clown|illusion|performer|show|entertainment)\b/i,
  /\b(book|library|archive|document|manuscript|scroll|map|atlas)\b/i,
  /\b(in\s*\w+\s*(day|days|week|weeks|month|months))\b/i,
  /\b(top\s*\d+|10\s*|best\s*|greatest\s*|essential|ultimate)\b/i,
  /\b(european\s+art|european\s+literature|european\s+history)\b/i,
  /\b(sound\s*of|sights\s*of|smells\s*of)\b/i,
  /^(fortifications|textiles|lighthouses|judaism|signs|haciendas|micronations)\s*$/i,
  /\b(spies\s+and\s+secrets|biomes\s+and\s+ecosystems|prehistoric\s+europe|grand\s+houses)\b/i,
  /\b(buddhist\s+circuit|convict\s+sites|legacy\s+food\s+markets|workers.*assembly|regimental\s+museums)\b/i,
  /\b(korean\s+palaces|japanese\s+gardens|mexican\s+artesanias|australian\s+convict)\b/i,
  /\b(etruscans|20th.century|in\s+the\s+footsteps\s+of)\b/i,
  /leden\s*$/i,
  /\b(tourist\s+(drive|route))\b/i,
  /\b(sights?\s+of|secrets?\s+of|history\s+of)\b/i,
  /\b(nordic\s*monarchies|european\s*art)\b/i,
  /\b(stećci|medieval\s+tombstones)\b/i,
  /\b(via\s+egnatia)\b/i,
  /\b(geopark|national\s*park|nature\s*reserve|wildlife\s*refuge|conservation\s*area|provincial\s*park|state\s*park|marine\s*park|bird\s*sanctuary)\b/i,
  /\b(zec\s+(du|de|d'))/i,
  /\b(jökulsárlón|sprengisandur|huayna\s+potosí|pamirs|mývatn|kebnekaise|nordkapp|taberg)\b/i,
  /\b(archipelago\s*trail)\b/i,
  /\b(island|isle|peninsula|archipelago|atoll|reef)\b/i,
  /\b(coast|shore|beach|bay|gulf|sound|fjord|strait|channel|passage)\b/i,
  /\b(plateau|highland|lowland|cape|promontory|headland)\b/i,
  /\b(paradise|karst|geopark|cavern|cave|grotto)\b/i,
  /\b(waterfall|rapids|cascade|geyser|hot.?spring|fumarole)\b/i,
  /\b(e\d{2,3})\b/i,
];

const REGION_PATTERNS = [
  /\b(county|province|district|region|area|zone|sector|belt|coast|shore|beach)\b/i,
  /\b(countryside|highlands|lowlands|uplands|downs|plains|valley|basin|delta)\b/i,
  /\b(archipelago|islands?|isle|peninsula|cape|point|bay|gulf|fjord|sound)\b/i,
  /\b(forest|woods|jungle|swamp|marsh|wetland|heath|moor|tundra|desert|oasis)\b/i,
  /\b(park|reserve|sanctuary|refuge|monument|wilderness|garden|zoo|aquarium)\b/i,
  /\b(waterfall|river|lake|stream|creek|spring|geyser|falls|rapids)\b/i,
  /\b(mount|mountain|hill|peak|summit|ridge|cliff|gorge|canyon|cave|grotto)\b/i,
  /\b(volcano|crater|lava|caldera|hot.?spring|fumarole)\b/i,
  /\b(glacier|icefield|ice.?cap|snowfield|avalanche|permafrost)\b/i,
  /\b(city|town|village|hamlet|settlement|municipalit|borough|parish)\b/i,
  /\b(harbor|port|marina|quay|wharf|dock|pier|jetty)\b/i,
  /\b(route|trail|path|way|road|highway|freeway|motorway|autobahn|autoroute)\b/i,
  /\b(district|quarter|neighbo(u)?rhood|suburb|precinct|ward|block)\b/i,
  /\b(hill\s*station|hill\s*country|hill\s*region)\b/i,
  /\b(lake\s*district)\b/i,
  /\b(heritage\s*area|conservation\s*area|protected\s*area)\b/i,
  /\b(botanical\s*garden|national\s*garden|public\s*garden)\b/i,
  /\b(monument|memorial|statue|sculpture|obelisk|column|fountain|plaza|square)\b/i,
  /\b(cultural\s*landscape|cultural\s*route|wine\s*region|wine\s*route)\b/i,
  /\b(theme\s*park|amusement\s*park|water\s*park|funfair|fairground)\b/i,
  /\b(market|bazaar|souk|mercado|marketplace|fair|feria|expo)\b/i,
  /\b(temple|mosque|church|cathedral|basilica|chapel|monastery|abbey|convent|shrine|pagoda|stupa|gurdwara)\b/i,
  /\b(palace|castle|fort|fortress|citadel|tower|keep|wall|gate|bridge)\b/i,
  /\b(museum|gallery|exhibition|collection|display|showroom)\b/i,
  /\b(university|college|campus|school|academy|institute|research\s*center)\b/i,
  /\b(stadium|arena|field|court|track|velodrome|pool|gym|gymnasium)\b/i,
  /\b(airport|aerodrome|airstrip|airfield|heliport|helipad)\b/i,
  /\b(station|terminal|depot|stop|hub|interchange)\b/i,
  /\b(causeway|bridge|tunnel|pass|ferry)\b/i,
  /\b(plantation|estate|farm|ranch|orchard|vineyard|winery|brewery|distillery)\b/i,
  /\b(observatory|planetarium|museum|aquarium|zoo)\b/i,
  /\b(beach|coast|shore|seaside|waterfront|promenade|esplanade)\b/i,
  /\b(peninsula|cape|point|head|promontory|spit|isthmus|strait|channel)\b/i,
  /\b(atoll|reef|shoal|sandbar|mangrove|seagrass)\b/i,
  /\b(steppe|prairie|savanna|veldt|pampas|llanos|cerrado|caatinga|chaco|puna|altiplano)\b/i,
  /\b(taiga|boreal|coniferous|deciduous|rainforest)\b/i,
];

const REGION_GENERIC_SUFFIX = /\b(area|region|zone|district|province|county|parish|municipality|territory|sector)\s*$/i;
const REGION_GENERIC_PREFIX = /^(north|south|east|west|central|upper|lower|inner|outer|greater|little)\s+\w/i;

const COUNTRY_NAMES = new Set([
  'monaco', 'vietnam', 'seychelles', 'sweden', 'cuba', 'comoros', 'guam', 'barbados',
  'bermuda', 'bermudas', 'aruba', 'suriname', 'melilla', 'áustria', 'ática', 'escandinávia',
  'arábia saudita', 'china', 'laos',
]);

const GENERIC_PLURAL_TOPIC = /^(fortifications|lighthouses|textiles|signs|haciendas|micronations|etruscans)\s*$/i;

function isRealTown(nome, paisCode) {
  const n = nome.trim();
  const nL = n.toLowerCase();

  for (const pat of TOPIC_PATTERNS) {
    if (pat.test(nL)) return false;
  }
  for (const pat of REGION_PATTERNS) {
    if (pat.test(nL)) return false;
  }
  if (REGION_GENERIC_SUFFIX.test(nL) || REGION_GENERIC_PREFIX.test(nL)) return false;
  if (COUNTRY_NAMES.has(nL) || GENERIC_PLURAL_TOPIC.test(nL)) return false;
  if (n.includes('/')) return false;

  return true;
}

async function geocodeViaNominatim(name) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1&accept-language=en`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'BetaApp/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), type: data[0].type };
  } catch {
    return null;
  }
}

async function main() {
  const rows = await p.$queryRaw`
    SELECT d.id, d.nome, d.pais_code, d.pais, COUNT(h.id)::int AS hotel_cnt
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code != 'XX' AND d.latitude IS NULL
    GROUP BY d.id, d.nome, d.pais_code, d.pais
    ORDER BY hotel_cnt DESC
  `;

  const towns = [];
  for (const d of rows) {
    if (isRealTown(d.nome, d.pais_code)) {
      towns.push(d);
    }
  }

  console.log(`Filtered ${rows.length} → ${towns.length} town candidates\n`);

  // --- Step 1: Export to CSV ---
  const header = 'id,nome,pais_code,pais,hotelCount\n';
  const csvLines = towns.map(d =>
    `${d.id},"${(d.nome||'').replace(/"/g,'""')}",${d.pais_code},${(d.pais||'').replace(/"/g,'""')},${d.hotel_cnt}`
  ).join('\n');
  writeFileSync(CSV_PATH, header + csvLines, 'utf8');
  console.log(`Exported to ${CSV_PATH}`);

  // --- Step 2: Batch geocode via Nominatim (OSM) ---
  console.log(`\nGeocoding ${towns.length} towns via Nominatim (OSM)...\n`);
  let fixed = 0, failed = 0, skipped = 0;

  for (let i = 0; i < towns.length; i++) {
    const d = towns[i];
    const query = d.nome + (d.pais_code ? ', ' + d.pais_code : '');

    // Try with country
    let result = await geocodeViaNominatim(query);
    if (!result && d.pais_code) {
      result = await geocodeViaNominatim(d.nome);
    }

    if (result) {
      await p.$executeRaw`
        UPDATE wv_destinations
        SET latitude = ${result.lat}, longitude = ${result.lon}
        WHERE id = ${d.id}
      `;
      console.log(`  [${i+1}/${towns.length}] OK  "${(d.nome+'').slice(0,38).padEnd(40)}" ${d.pais_code} → (${result.lat.toFixed(4)}, ${result.lon.toFixed(4)}) ${result.type||'?'}`);
      fixed++;
    } else {
      console.log(`  [${i+1}/${towns.length}] FAIL "${(d.nome+'').slice(0,38).padEnd(40)}" ${d.pais_code}`);
      failed++;
    }

    // Rate limit: 1 req/sec (Nominatim usage policy)
    await new Promise(r => setTimeout(r, 1100));
  }

  console.log(`\nDone. Fixed: ${fixed}, Failed: ${failed}, Skipped: ${skipped}`);
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
