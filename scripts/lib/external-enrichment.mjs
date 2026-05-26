/**
 * Enriquecimento offline: Wikipedia, geocoding, OpenWeather.
 */

const WIKI_LANG = { pt: 'pt', en: 'en' };

/** @param {string} nome */
export function wikipediaTitleFromDestination(nome) {
  const leaf = nome.split('/')[0]?.trim() || nome;
  return leaf.replace(/ /g, '_');
}

/**
 * @param {string} title
 * @param {string} [lang]
 */
export async function fetchWikipediaSummary(title, lang = 'pt') {
  const wikiLang = WIKI_LANG[lang] ?? 'en';
  const encoded = encodeURIComponent(title);
  const url = `https://${wikiLang}.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AkmlevaTravelDemo/1.0 (travel demo; contact@example.com)' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const extract = data.extract?.trim();
    if (!extract || extract.length < 40) return null;
    return {
      resumo: extract.length > 600 ? `${extract.slice(0, 597)}…` : extract,
      url: data.content_urls?.desktop?.page ?? data.content_urls?.mobile?.page,
    };
  } catch {
    return null;
  }
}

/**
 * @param {string} query
 */
export async function geocodeDestination(query) {
  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
    q: query,
    format: 'json',
    limit: '1',
  })}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AkmlevaTravelDemo/1.0 (travel demo)' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const hit = data?.[0];
    if (!hit?.lat || !hit?.lon) return null;
    return { lat: parseFloat(hit.lat), lon: parseFloat(hit.lon), displayName: hit.display_name };
  } catch {
    return null;
  }
}

/**
 * @param {number} lat
 * @param {number} lon
 * @param {string} apiKey
 */
export async function fetchOpenWeatherSnapshot(lat, lon, apiKey) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid: apiKey,
    units: 'metric',
    lang: 'pt',
  });
  const url = `https://api.openweathermap.org/data/2.5/weather?${params}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const w = data.weather?.[0];
    return {
      descricao: w?.description ?? null,
      temperatura_c: data.main?.temp ?? null,
      sensacao_c: data.main?.feels_like ?? null,
      humidade_pct: data.main?.humidity ?? null,
      atualizado: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
