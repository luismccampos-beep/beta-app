/**
 * Preço indicativo de voo (EUR) — heurística distância + amostra CSV Índia (escala).
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { haversineKm } from './transport-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRICE_CSV = resolve(__dirname, '../../data/transportation/Flight Price Prediction.csv');

/** INR → EUR (ordem de grandeza). */
const INR_EUR = 0.011;

let csvMedians = null;

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      q = !q;
      continue;
    }
    if (c === ',' && !q) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

/** Medianas da amostra Kaggle (economy, 0 stops). */
function loadCsvMedians() {
  if (csvMedians) return csvMedians;
  csvMedians = { economyZeroStopsInr: 5955, economyOneStopInr: 6500 };
  if (!existsSync(PRICE_CSV)) return csvMedians;

  const lines = readFileSync(PRICE_CSV, 'utf8').split(/\r?\n/).slice(1, 8000);
  const zero = [];
  const one = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = parseCsvLine(line);
    const stops = cols[5]?.toLowerCase() ?? '';
    const price = parseFloat(cols[11] ?? '');
    if (!Number.isFinite(price)) continue;
    if (stops === 'zero' || stops === '0') zero.push(price);
    else if (stops.includes('one') || stops === '1') one.push(price);
  }
  const med = (arr) => {
    if (!arr.length) return null;
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  };
  const z = med(zero);
  const o = med(one);
  if (z != null) csvMedians.economyZeroStopsInr = z;
  if (o != null) csvMedians.economyOneStopInr = o;
  return csvMedians;
}

/**
 * @param {{ lat: number; lon: number } | null} originAp
 * @param {{ lat: number; lon: number } | null} destAp
 * @param {{ direct?: boolean; cabin?: string }} [opts]
 */
export function estimateFlightPriceEur(originAp, destAp, opts = {}) {
  const med = loadCsvMedians();
  const baseInr = opts.direct !== false ? med.economyZeroStopsInr : med.economyOneStopInr;
  let eur = baseInr * INR_EUR;

  if (originAp?.lat != null && destAp?.lat != null) {
    const km = haversineKm(originAp.lat, originAp.lon, destAp.lat, destAp.lon);
    eur = Math.max(eur, 35 + km * 0.065);
    if (km > 3500) eur *= 1.12;
    if (km < 400) eur = Math.min(eur, 95);
  }

  const cabin = opts.cabin ?? 'economy';
  if (cabin === 'premium_economy') eur *= 1.45;
  if (cabin === 'business') eur *= 2.6;
  if (cabin === 'first') eur *= 4;

  return Math.round(Math.max(29, eur));
}
