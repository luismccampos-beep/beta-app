/**
 * Wikivoyage wikitext → cartão de destino (resumo, veja, faça, coma, dicas práticas).
 */

const SECTION_MAP = {
  entenda: [/^entenda$/i, /^understand$/i, /^sobre$/i, /^about$/i],
  veja: [/^veja$/i, /^see$/i, /^ver$/i],
  faca: [/^fa[cç]a$/i, /^do$/i, /^fazer$/i],
  coma: [/^coma$/i, /^eat$/i, /^comer$/i],
  beba: [/^beba$/i, /^drink$/i, /^beber$/i],
};

/** Secções nível 2 → chave interna (PT + EN Wikivoyage). */
const ADVANCED_SECTION_PATTERNS = {
  seguranca: [
    /mantenha[- ]se seguro/i,
    /fique seguro/i,
    /seguran[cç]a/i,
    /stay safe/i,
    /safety/i,
    /crime/i,
  ],
  respeite: [/respeite/i, /respect/i, /etiquette/i, /costumes/i, /customs/i, /cultural/i],
  comunique: [
    /comunique/i,
    /^fale$/i,
    /^talk$/i,
    /idioma/i,
    /communicate/i,
    /cope.*language/i,
    /phrasebook/i,
  ],
  beba: [/^beba$/i, /^drink$/i, /bebidas/i, /water/i],
  dinheiro: [/dinheiro/i, /^money$/i, /custo de vida/i, /cost of living/i, /budget/i, /costs/i],
  saude: [/sa[uú]de/i, /mantenha[- ]se saud[aá]vel/i, /stay healthy/i, /^health$/i],
  transporte: [
    /^chegue$/i,
    /^chegar$/i,
    /get in/i,
    /^circule$/i,
    /get around/i,
    /transporte/i,
    /transport/i,
    /by plane/i,
    /by train/i,
  ],
  horarios: [/hor[aá]rios/i, /^hours$/i, /when to go/i, /quando ir/i, /opening hours/i],
  compre: [/^compre$/i, /^buy$/i, /comprar/i, /shopping/i, /souvenirs/i],
  clima: [/^clima$/i, /^climate$/i, /weather/i, /temperatura/i],
};

const LISTING_KIND = {
  see: 'veja',
  ver: 'veja',
  do: 'faca',
  fazer: 'faca',
  eat: 'coma',
  comer: 'coma',
  drink: 'beba',
  beber: 'beba',
};

const LISTING_RE = /\{\{(see|do|eat|drink|ver|fazer|comer|beber|listing)\b([^}]*)\}\}/gi;

/**
 * @param {string} texto
 */
export function limparWikitext(texto) {
  if (!texto) return '';
  return (
    texto
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\{\{[^}]*\}\}/g, ' ')
      .replace(/\[\[(?:[^\]|]*\|)?([^\]]+?)\]\]/g, '$1')
      .replace(/'{2,}/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim()
  );
}

/**
 * @param {string} name
 */
function mapSectionKey(name) {
  const n = name.trim().replace(/\s+/g, ' ');
  for (const [key, patterns] of Object.entries(SECTION_MAP)) {
    if (patterns.some((re) => re.test(n))) return key;
  }
  return null;
}

/**
 * @param {string} title
 */
function mapAdvancedSectionKey(title) {
  const n = title.trim().replace(/\s+/g, ' ');
  for (const [key, patterns] of Object.entries(ADVANCED_SECTION_PATTERNS)) {
    if (patterns.some((re) => re.test(n))) return key;
  }
  return null;
}

/**
 * All level-2 sections by canonical key (entenda, veja, … + dicas).
 * @param {string} wikitext
 */
export function parseWikiSections(wikitext, skipAdvanced = false) {
  /** @type {Record<string, string>} */
  const sections = {};
  if (!wikitext) return sections;

  const headerRe = /^={2,}\s*([^=\n]+?)\s*={2,}\s*$/gm;
  /** @type {{ title: string; headerEnd: number; start: number }[]} */
  const headers = [];
  let m;
  while ((m = headerRe.exec(wikitext)) !== null) {
    headers.push({
      title: m[1].trim(),
      start: m.index,
      headerEnd: m.index + m[0].length,
    });
  }

  for (let i = 0; i < headers.length; i++) {
    const bodyStart = headers[i].headerEnd;
    const bodyEnd = i + 1 < headers.length ? headers[i + 1].start : wikitext.length;
    const body = wikitext.slice(bodyStart, bodyEnd);
    const title = headers[i].title;

    const basic = mapSectionKey(title);
    if (basic) sections[basic] = sections[basic] ? `${sections[basic]}\n${body}` : body;

    // Saltar mapeamento de secções avançadas se já vierem pré-extraídas do Python
    if (!skipAdvanced) {
      const advanced = mapAdvancedSectionKey(title);
      if (advanced) sections[advanced] = sections[advanced] ? `${sections[advanced]}\n${body}` : body;
    }
  }

  return sections;
}

/**
 * @param {string} sectionText
 * @param {number} [max]
 */
export function extrairItensLista(sectionText, max = 3) {
  if (!sectionText?.trim()) return [];

  const raw = sectionText
    .replace(/\{\{[^}]*\}\}/g, ' ')
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]+?)\]\]/g, '$1')
    .replace(/'{2,}/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/==+[^=]+==+/g, ' ')
    .replace(/^\*+\s*$/gm, '')
    .replace(/^\#+\s*$/gm, '')
    .replace(/^\*+\s+/gm, '• ')
    .replace(/^\#+\s+/gm, '• ');

  const items = [];
  const seen = new Set();

  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.length < 3) continue;

    let item = null;
    const bullet = t.match(/^[•*#:;]+\s*(.+)$/);
    if (bullet) item = bullet[1].trim();
    else if (/^[-–—]\s+/.test(t)) item = t.replace(/^[-–—]\s+/, '').trim();
    else if (t.length <= 120 && /^[\p{Lu}0-9"']/u.test(t) && !/^\d+\./.test(t)) item = t;

    if (!item || item.length < 3 || item.length > 200) continue;
    if (/^[•*#:;.\s]+$/.test(item)) continue;
    const norm = item.toLowerCase();
    if (seen.has(norm)) continue;
    seen.add(norm);
    items.push(item);
    if (items.length >= max) break;
  }

  return items;
}

/**
 * @param {string} sectionText
 * @param {number} [maxItems]
 * @param {number} [maxChars]
 */
export function sectionToTips(sectionText, maxItems = 4, maxChars = 480) {
  if (!sectionText?.trim()) return [];

  const bullets = extrairItensLista(sectionText, maxItems);
  if (bullets.length >= 2) return bullets;

  const clean = limparWikitext(sectionText);
  if (!clean) return bullets;

  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 25 && s.length <= 200);

  if (sentences.length >= 2) return sentences.slice(0, maxItems);

  if (clean.length > 40) {
    const excerpt = clean.slice(0, maxChars).trim();
    const last = excerpt.lastIndexOf('.');
    const chunk = last > 60 ? excerpt.slice(0, last + 1) : excerpt;
    return [chunk + (clean.length > maxChars ? '…' : '')];
  }

  return bullets;
}

/**
 * @param {string} wikitext
 * @param {number} [maxPer]
 */
export function extrairListingsPorTipo(wikitext, maxPer = 3) {
  /** @type {Record<'veja'|'faca'|'coma', string[]>} */
  const out = { veja: [], faca: [], coma: [] };
  if (!wikitext) return out;

  let m;
  while ((m = LISTING_RE.exec(wikitext)) !== null) {
    const kind = LISTING_KIND[m[1].toLowerCase()];
    if (!kind || kind === 'beba') continue;
    const block = m[2] ?? '';
    const nameMatch = block.match(/\|\s*(?:name|nome|alt)\s*=\s*([^|{}]+)/i);
    const nome = (nameMatch?.[1] ?? '').trim().replace(/\[\[|\]\]/g, '');
    if (!nome || nome.length < 2) continue;
    if (out[kind].length < maxPer && !out[kind].includes(nome)) {
      out[kind].push(nome);
    }
  }

  return out;
}

/**
 * @param {string} text
 * @param {number} [max]
 */
export function excerptResumo(text, max = 300) {
  const clean = limparWikitext(text);
  if (!clean) return '';
  const cut = clean.slice(0, max);
  const last = cut.lastIndexOf('.');
  const body = last > 60 ? cut.slice(0, last + 1) : cut;
  return body.trim() + (clean.length > max ? '…' : '');
}

/**
 * Dicas práticas (segurança, respeite, dinheiro, …).
 * @param {Record<string, string>} sections
 * @param {{ maxPerSection?: number }} [opts]
 */
export function extractAdvancedSections(sections, opts = {}) {
  const max = opts.maxPerSection ?? 4;
  /** @type {Record<string, string[]>} */
  const dicas = {};

  for (const key of Object.keys(ADVANCED_SECTION_PATTERNS)) {
    const body = sections[key];
    if (!body?.trim()) continue;
    const tips = sectionToTips(body, max);
    if (tips.length) dicas[key] = tips;
  }

  if (!dicas.clima && sections.entenda) {
    const entenda = sections.entenda;
    const climaChunk =
      entenda.match(/(?:clima|climate|weather|temperatura)[^.]*\./gi)?.slice(0, 3).join(' ') ??
      '';
    if (climaChunk) {
      const tips = sectionToTips(climaChunk, 3, 320);
      if (tips.length) dicas.clima = tips;
    }
  }

  return Object.keys(dicas).length ? dicas : undefined;
}

/**
 * @param {{ text?: string; title?: string; tipo?: string; clima?: string; lang?: string; preParsedSections?: Record<string, string> }} dest
 * @param {{ resumoMax?: number; itemsMax?: number; tipsMax?: number }} [opts]
 */
export function buildDestinationCard(dest, opts = {}) {
  const resumoMax = opts.resumoMax ?? 300;
  const itemsMax = opts.itemsMax ?? 3;
  const tipsMax = opts.tipsMax ?? 4;
  const text = dest.text ?? '';
  // Secções básicas: entenda, veja, faca, coma (sempre do wikitext).
  // Secções avançadas: se preParsedSections tem dados, salta o mapeamento caro aqui.
  const hasAdvanced = dest.preParsedSections && Object.keys(dest.preParsedSections).length > 0;
  const sections = parseWikiSections(text, hasAdvanced);
  const fromListings = extrairListingsPorTipo(text, itemsMax);

  // Complementar com secções avançadas pré-extraídas do parser Python.
  // Só preenche lacunas (skip se o parseWikiSections já capturou a secção).
  if (dest.preParsedSections) {
    for (const [key, body] of Object.entries(dest.preParsedSections)) {
      if (body?.trim() && ADVANCED_SECTION_PATTERNS[key] && !sections[key]) {
        sections[key] = body;
      }
    }
  }

  const veja =
    extrairItensLista(sections.veja ?? '', itemsMax).length > 0
      ? extrairItensLista(sections.veja ?? '', itemsMax)
      : fromListings.veja;
  const faca =
    extrairItensLista(sections.faca ?? '', itemsMax).length > 0
      ? extrairItensLista(sections.faca ?? '', itemsMax)
      : fromListings.faca;
  const coma =
    extrairItensLista(sections.coma ?? '', itemsMax).length > 0
      ? extrairItensLista(sections.coma ?? '', itemsMax)
      : fromListings.coma;

  const resumoRaw = sections.entenda ?? text.slice(0, 4000);
  const resumo = excerptResumo(resumoRaw, resumoMax);
  const dicas = extractAdvancedSections(sections, { maxPerSection: tipsMax });

  /** @type {string[]} */
  const tags = [];
  if (dest.tipo) tags.push(dest.tipo);
  if (dest.clima) tags.push(dest.clima);
  if (dest.lang) tags.push(dest.lang);
  if (dicas?.seguranca) tags.push('dicas-segurança');

  return {
    resumo: resumo || undefined,
    veja: veja.length ? veja : undefined,
    faca: faca.length ? faca : undefined,
    coma: coma.length ? coma : undefined,
    dicas,
    tags: tags.length ? [...new Set(tags)] : undefined,
  };
}
