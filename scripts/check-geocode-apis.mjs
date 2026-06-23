#!/usr/bin/env node
/**
 * Verifica quais APIs de geocode estão acessíveis.
 */
const APIS = [
  { name: 'Photon (komoot.io)', url: 'https://photon.komoot.io/api/?q=Berlin&limit=1' },
  { name: 'Nominatim', url: 'https://nominatim.openstreetmap.org/search?q=Berlin&format=json&limit=1' },
  { name: 'OpenCage', url: `https://api.opencagedata.com/geocode/v1/json?q=Berlin&key=${process.env.OPENCAGE_API_KEY || '0379bcc106f04698bf600f18a238adc6'}&limit=1` },
  { name: 'LocationIQ', url: `https://us1.locationiq.com/v1/search?q=Berlin&key=${process.env.LOCATIONIQ_API_KEY || 'pk.868882eaddc67cabf75aa28ed8ebee14'}&format=json&limit=1` },
];

async function check(name, url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    const ok = res.ok || res.status === 429;
    const status = res.status === 429 ? '429 (rate limited)' : `${res.status} OK`;
    console.log(`  ✅ ${name}: ${status}`);
    return true;
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('=== Verificar APIs de Geocode ===\n');
  const results = await Promise.all(APIS.map((a) => check(a.name, a.url)));
  const ok = results.filter(Boolean).length;
  console.log(`\n${ok}/${APIS.length} APIs acessíveis`);
}

main().catch(console.error);
