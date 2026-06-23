import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cities = JSON.parse(readFileSync(resolve(__dirname, '..', 'data/geonames-cache/cities5000-cities.json'), 'utf8'));

// Check how coordinates are stored
const agadir = cities.find(c => c.name === 'Agadir');
console.log('Agadir entry:', JSON.stringify(agadir, null, 2));

// Check the grid key for Agadir (30.43, -9.60) and Addis Ababa (9.03, 38.75)
console.log('Agadir grid key:', `${Math.floor(agadir.lon/1)},${Math.floor(agadir.lat/1)}`);

const clusone = cities.find(c => c.name === 'Clusone');
console.log('Clusone grid key:', clusone ? `${Math.floor(clusone.lon/1)},${Math.floor(clusone.lat/1)}` : 'not found');

// Check Addis Ababa
const addis = cities.find(c => c.name === 'Addis Abeba' || c.asciiName === 'Addis Ababa');
console.log('Addis Ababa:', addis ? JSON.stringify(addis) : 'not found');

// Check how many cities in same grid cell as Agadir
const agKey = `${Math.floor(agadir.lon/1)},${Math.floor(agadir.lat/1)}`;
const agGrid = {};
for (const c of cities) {
  const k = `${Math.floor(c.lon/1)},${Math.floor(c.lat/1)}`;
  if (k === agKey) {
    agGrid[c.name] = { lat: c.lat, lon: c.lon, cc: c.countryCode };
  }
}
console.log(`Cities in Agadir's grid cell (${agKey}):`, Object.keys(agGrid).length);

// The problem might be that many coords are 1dp in the cities file
const oneDp = cities.filter(c => c.lat && Math.abs(c.lat - Math.round(c.lat * 10) / 10) < 0.01);
console.log(`1dp-lat cities in GeoNames: ${oneDp.length}/${cities.length}`);
