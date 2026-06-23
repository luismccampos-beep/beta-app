import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchUnsplashPhotoUrl, sleep } from './lib/unsplash-client.mjs';
import { loadProjectEnv } from './lib/load-env.mjs';
import { logger, withErrorHandling } from './lib/logger.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');

loadProjectEnv(ROOT);

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY?.trim();
const HAS_UNSPLASH = Boolean(UNSPLASH_KEY);

const COMPANIES = [
  { id: 'hertz', name: 'Hertz' },
  { id: 'avis', name: 'Avis' },
  { id: 'europcar', name: 'Europcar' },
  { id: 'budget', name: 'Budget' },
  { id: 'sixt', name: 'Sixt' },
  { id: 'enterprise', name: 'Enterprise' },
  { id: 'alamo', name: 'Alamo' },
  { id: 'national', name: 'National' },
];

const CATEGORIES = ['Mini', 'Economy', 'Compact', 'Midsize', 'SUV', 'Luxury', 'Minivan', 'Pickup'];

const BASE_PRICES = {
  Mini: 25, Economy: 35, Compact: 45, Midsize: 55,
  SUV: 70, Luxury: 100, Minivan: 80, Pickup: 65,
};

var CAR_MODELS_BY_CATEGORY = {
  Mini: [
    { make: 'Fiat', model: '500', query: 'Fiat 500 city car', doors: 3, passengers: 4, bags: 1, transmission: 'Manual', fuel: 'Petrol' },
    { make: 'Volkswagen', model: 'up!', query: 'Volkswagen up city car', doors: 3, passengers: 4, bags: 1, transmission: 'Manual', fuel: 'Petrol' },
    { make: 'Smart', model: 'Fortwo', query: 'Smart Fortwo compact car', doors: 2, passengers: 2, bags: 1, transmission: 'Automatic', fuel: 'Petrol' },
    { make: 'Renault', model: 'Twingo', query: 'Renault Twingo city car', doors: 3, passengers: 4, bags: 1, transmission: 'Manual', fuel: 'Petrol' },
  ],
  Economy: [
    { make: 'Volkswagen', model: 'Polo', query: 'Volkswagen Polo hatchback', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Petrol' },
    { make: 'Ford', model: 'Fiesta', query: 'Ford Fiesta hatchback', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Petrol' },
    { make: 'Toyota', model: 'Yaris', query: 'Toyota Yaris hatchback', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Petrol' },
    { make: 'Hyundai', model: 'i20', query: 'Hyundai i20 hatchback', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Petrol' },
    { make: 'Renault', model: 'Clio', query: 'Renault Clio hatchback', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Petrol' },
    { make: 'Peugeot', model: '208', query: 'Peugeot 208 hatchback', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Petrol' },
  ],
  Compact: [
    { make: 'Volkswagen', model: 'Golf', query: 'Volkswagen Golf compact car', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Petrol' },
    { make: 'Toyota', model: 'Corolla', query: 'Toyota Corolla sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Petrol' },
    { make: 'Honda', model: 'Civic', query: 'Honda Civic sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Petrol' },
    { make: 'Ford', model: 'Focus', query: 'Ford Focus hatchback', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Petrol' },
    { make: 'Hyundai', model: 'Elantra', query: 'Hyundai Elantra sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Petrol' },
    { make: 'Kia', model: 'Ceed', query: 'Kia Ceed hatchback', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Petrol' },
  ],
  Midsize: [
    { make: 'Volkswagen', model: 'Passat', query: 'Volkswagen Passat sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Diesel' },
    { make: 'Toyota', model: 'Camry', query: 'Toyota Camry sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Petrol' },
    { make: 'Honda', model: 'Accord', query: 'Honda Accord sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Petrol' },
    { make: 'BMW', model: '3 Series', query: 'BMW 3 Series sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Diesel' },
    { make: 'Mercedes-Benz', model: 'C-Class', query: 'Mercedes-Benz C-Class sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Diesel' },
    { make: 'Audi', model: 'A4', query: 'Audi A4 sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Diesel' },
  ],
  SUV: [
    { make: 'Nissan', model: 'Qashqai', query: 'Nissan Qashqai SUV', doors: 4, passengers: 5, bags: 3, transmission: 'Manual', fuel: 'Diesel' },
    { make: 'Toyota', model: 'RAV4', query: 'Toyota RAV4 SUV', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Petrol' },
    { make: 'Volkswagen', model: 'Tiguan', query: 'Volkswagen Tiguan SUV', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Diesel' },
    { make: 'Ford', model: 'Kuga', query: 'Ford Kuga SUV', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Diesel' },
    { make: 'Jeep', model: 'Compass', query: 'Jeep Compass SUV', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Petrol' },
    { make: 'Honda', model: 'CR-V', query: 'Honda CR-V SUV', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Petrol' },
    { make: 'Hyundai', model: 'Tucson', query: 'Hyundai Tucson SUV', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Diesel' },
    { make: 'Kia', model: 'Sportage', query: 'Kia Sportage SUV', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Diesel' },
  ],
  Luxury: [
    { make: 'BMW', model: '5 Series', query: 'BMW 5 Series luxury sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Diesel' },
    { make: 'Mercedes-Benz', model: 'E-Class', query: 'Mercedes-Benz E-Class sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Diesel' },
    { make: 'Audi', model: 'A6', query: 'Audi A6 luxury sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Petrol' },
    { make: 'Lexus', model: 'ES', query: 'Lexus ES luxury sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Petrol' },
    { make: 'Jaguar', model: 'XF', query: 'Jaguar XF luxury sedan', doors: 4, passengers: 5, bags: 3, transmission: 'Automatic', fuel: 'Diesel' },
    { make: 'Porsche', model: 'Panamera', query: 'Porsche Panamera luxury car', doors: 4, passengers: 4, bags: 2, transmission: 'Automatic', fuel: 'Petrol' },
  ],
  Minivan: [
    { make: 'Volkswagen', model: 'Sharan', query: 'Volkswagen Sharan minivan', doors: 4, passengers: 7, bags: 3, transmission: 'Manual', fuel: 'Diesel' },
    { make: 'Toyota', model: 'Sienna', query: 'Toyota Sienna minivan', doors: 4, passengers: 7, bags: 4, transmission: 'Automatic', fuel: 'Petrol' },
    { make: 'Ford', model: 'Galaxy', query: 'Ford Galaxy minivan', doors: 4, passengers: 7, bags: 3, transmission: 'Manual', fuel: 'Diesel' },
    { make: 'Chrysler', model: 'Pacifica', query: 'Chrysler Pacifica minivan', doors: 4, passengers: 7, bags: 4, transmission: 'Automatic', fuel: 'Petrol' },
    { make: 'Renault', model: 'Espace', query: 'Renault Espace minivan', doors: 4, passengers: 7, bags: 3, transmission: 'Automatic', fuel: 'Diesel' },
  ],
  Pickup: [
    { make: 'Ford', model: 'Ranger', query: 'Ford Ranger pickup truck', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Diesel' },
    { make: 'Toyota', model: 'Hilux', query: 'Toyota Hilux pickup', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Diesel' },
    { make: 'Chevrolet', model: 'S10', query: 'Chevrolet S10 pickup truck', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Diesel' },
    { make: 'Volkswagen', model: 'Amarok', query: 'Volkswagen Amarok pickup', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Diesel' },
    { make: 'Nissan', model: 'Navara', query: 'Nissan Navara pickup', doors: 4, passengers: 5, bags: 2, transmission: 'Manual', fuel: 'Diesel' },
  ],
};

const COUNTRY_MULTIPLIERS = {
  BR: 0.85, DK: 1.40, RU: 0.60, EG: 0.50, PT: 0.90, UY: 0.70, ES: 1.10, TR: 0.55,
  AU: 1.30, FR: 1.20, MX: 0.65, PE: 0.50, JP: 1.50, MA: 0.50, PY: 0.45, GR: 0.95,
  IT: 1.15, AR: 0.55, US: 1.00, NL: 1.25, CL: 0.70, NZ: 1.20, DE: 1.20, AT: 1.20,
  TH: 0.50, GB: 1.30, CH: 1.50, IE: 1.25, NO: 1.50, CO: 0.50, BE: 1.15, HU: 0.80,
  KR: 1.10, CN: 0.70, ID: 0.45, HR: 0.85, SE: 1.30, MY: 0.50, FI: 1.25, IN: 0.40,
  IS: 1.60, IL: 1.10, PH: 0.40, UA: 0.50, PL: 0.80, SG: 1.40, VN: 0.40, CZ: 0.80,
  CA: 1.20, ZA: 0.55,
};

var ALL_MODELS = [];
for (const cat of CATEGORIES) {
  for (const m of CAR_MODELS_BY_CATEGORY[cat]) {
    ALL_MODELS.push({ ...m, category: cat });
  }
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatPrice(usd) {
  return Math.round(usd * 100) / 100;
}

function generateCarId(paisCode, companyId, make, model) {
  const safe = `${paisCode}-${companyId}-${make}-${model}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
  return safe;
}

async function fetchImageForModel(modelQuery, cache) {
  const existing = cache.get(modelQuery);
  if (existing) return existing;

  if (!HAS_UNSPLASH) {
    const fallback = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80`;
    cache.set(modelQuery, fallback);
    return fallback;
  }

  try {
    const result = await searchUnsplashPhotoUrl(UNSPLASH_KEY, modelQuery, {
      orientation: 'landscape',
      width: 800,
    });
    const url = result?.url ?? null;
    cache.set(modelQuery, url);
    if (url) logger.ok(`  ${modelQuery} -> image`);
    else logger.warn(`  ${modelQuery} -> no result`);
    return url;
  } catch (err) {
    if (err.name === 'UnsplashRateLimitError') {
      logger.warn(`Rate limited on "${modelQuery}". Using fallback.`);
      const fallback = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80`;
      cache.set(modelQuery, fallback);
      return fallback;
    }
    logger.warn(`  ${modelQuery} -> error: ${err.message}`);
    cache.set(modelQuery, null);
    return null;
  }
}

async function main() {
  const bundleRaw = readFileSync(BUNDLE, 'utf8');
  const bundle = JSON.parse(bundleRaw);
  const { destinos } = bundle;

  const countrySet = new Set();
  for (const d of destinos) {
    if (d.paisCode && d.paisCode !== 'XX') countrySet.add(d.paisCode);
  }
  const countryCodes = [...countrySet].sort();
  logger.info(`${countryCodes.length} countries with destinations`);

  const existingSize = bundle.aluguerCarros?.length ?? 0;
  if (existingSize > 0) {
    logger.info(`Existing cars in bundle: ${existingSize}`);
  }

  const imageCache = new Map();

  const TOTAL_API_CALLS = ALL_MODELS.length;
  logger.info(`Fetching ${TOTAL_API_CALLS} unique car images via Unsplash...`);

  let imagesFetched = 0;
  let rateLimited = false;

  for (let i = 0; i < ALL_MODELS.length; i++) {
    const m = ALL_MODELS[i];
    const query = `${m.make} ${m.model} car`;
    await fetchImageForModel(query, imageCache);
    imagesFetched++;

    if (i < ALL_MODELS.length - 1) {
      await sleep(1200);
    }
  }

  logger.info(`Images cached: ${imagesFetched} (${[...imageCache.values()].filter(Boolean).length} with photos)`);

  const cars = [];

  for (const paisCode of countryCodes) {
    const multiplier = COUNTRY_MULTIPLIERS[paisCode] ?? 0.85;

    for (const company of shuffle(COMPANIES).slice(0, 3 + Math.floor(Math.random() * 3))) {
      const numCategories = 2 + Math.floor(Math.random() * 4);
      const categoriesForCompany = shuffle(CATEGORIES).slice(0, numCategories);

      for (const cat of categoriesForCompany) {
        const catModels = CAR_MODELS_BY_CATEGORY[cat];
        const model = pick(catModels);
        const query = `${model.make} ${model.model} car`;
        const imageUrl = imageCache.get(query) ?? null;

        const basePrice = BASE_PRICES[cat];
        const companyVariation = 0.85 + Math.random() * 0.3;
        const price = formatPrice(basePrice * multiplier * companyVariation);

        const id = generateCarId(paisCode, company.id, model.make, model.model) + `-${cars.length}`;

        cars.push({
          id,
          paisCode,
          company: company.name,
          category: cat,
          modelName: `${model.make} ${model.model}`,
          imageUrl,
          pricePerDay: price,
          currency: 'USD',
          transmission: model.transmission,
          fuelType: model.fuel,
          doors: model.doors,
          passengers: model.passengers,
          bags: model.bags,
        });
      }
    }
  }

  bundle.aluguerCarros = cars;
  writeFileSync(BUNDLE, JSON.stringify(bundle, null, 2), 'utf8');

  const withImages = cars.filter((c) => c.imageUrl).length;
  const withoutImages = cars.filter((c) => !c.imageUrl).length;

  console.log(`\n--- Rental Cars Generated ---`);
  console.log(`Total cars: ${cars.length}`);
  console.log(`Countries covered: ${countryCodes.length}`);
  console.log(`With photos: ${withImages}`);
  console.log(`Without photos: ${withoutImages}`);
  console.log(`Rate limited: ${rateLimited}`);

  const byCat = {};
  for (const c of cars) {
    byCat[c.category] = (byCat[c.category] ?? 0) + 1;
  }
  console.log(`\nBy category:`);
  for (const [cat, count] of Object.entries(byCat)) {
    console.log(`  ${cat}: ${count}`);
  }

  console.log(`\nSaved to bundle-wikivoyage.json`);
}

withErrorHandling(main)();
