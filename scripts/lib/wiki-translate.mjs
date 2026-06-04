/**
 * Tradução opcional (LibreTranslate self-hosted ou público).
 * Env: LIBRETRANSLATE_URL=https://libretranslate.com
 */
const UA = 'beta-app-travel/1.0 (wiki translate; local dev)';

/**
 * @param {string} text
 * @param {string} source
 * @param {string} [target]
 */
export async function translateText(text, source, target = 'pt') {
  const base = process.env.LIBRETRANSLATE_URL?.trim().replace(/\/$/, '');
  if (!base || !text?.trim()) return null;

  try {
    const res = await fetch(`${base}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
      body: JSON.stringify({
        q: text.slice(0, 4500),
        source: source === 'auto' ? 'auto' : source,
        target,
        format: 'text',
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const out = data.translatedText?.trim();
    return out || null;
  } catch {
    return null;
  }
}
