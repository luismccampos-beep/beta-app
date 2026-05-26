/** URL de imagem no Wikimedia Commons a partir do nome do ficheiro (P18). */
export function commonsImageUrl(fileName: string, width = 800): string {
  const encoded = encodeURIComponent(fileName.replace(/ /g, '_'));
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}?width=${width}`;
}

/** ID Wikidata normalizado (Q123). */
export function normalizeWikidataId(id: string): string | null {
  const t = id.trim();
  if (!t) return null;
  const m = t.match(/Q\d+/i);
  if (m) return m[0].toUpperCase();
  if (/^\d+$/.test(t)) return `Q${t}`;
  return null;
}

type WikidataEntityResponse = {
  entities?: Record<
    string,
    {
      claims?: {
        P18?: { mainsnak?: { datavalue?: { value?: string } } }[];
      };
    }
  >;
};

/** Obtém URL de imagem via propriedade P18 (imagem). */
export async function fetchCommonsImageUrlFromWikidata(
  wikidataId: string,
): Promise<string | null> {
  const qid = normalizeWikidataId(wikidataId);
  if (!qid) return null;

  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;

  const json = (await res.json()) as WikidataEntityResponse;
  const entity = json.entities?.[qid];
  const claims = entity?.claims?.P18;
  if (!claims?.length) return null;

  const fileName = claims[0]?.mainsnak?.datavalue?.value;
  if (!fileName || typeof fileName !== 'string') return null;

  return commonsImageUrl(fileName);
}

/** Enriquece lugar OSM com imagem Wikidata quando disponível. */
export async function enrichPlaceWithWikidataImage<T extends { wikidata_id?: string; image_url?: string }>(
  place: T,
): Promise<T> {
  if (place.image_url || !place.wikidata_id) return place;
  const image_url = await fetchCommonsImageUrlFromWikidata(place.wikidata_id);
  if (!image_url) return place;
  return { ...place, image_url };
}
