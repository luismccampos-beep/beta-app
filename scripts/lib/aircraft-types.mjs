/**
 * Mapeia códigos IATA de equipamento (OpenFlights) → nomes legíveis.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLANES_CSV = resolve(__dirname, '../../data/transportation/airplanes.csv');

/** @type {Map<string, string> | null} */
let codeToName = null;

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

export function loadAircraftNames() {
  if (codeToName) return codeToName;
  codeToName = new Map();
  if (!existsSync(PLANES_CSV)) return codeToName;

  const lines = readFileSync(PLANES_CSV, 'utf8').split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i] ?? '');
    const name = cols[0]?.trim();
    const iata = cols[1]?.trim().toUpperCase();
    if (name && iata && iata.length <= 4) codeToName.set(iata, name);
  }
  return codeToName;
}

export function equipmentLabel(code, names) {
  const c = String(code ?? '').toUpperCase();
  return names.get(c) ?? c;
}
