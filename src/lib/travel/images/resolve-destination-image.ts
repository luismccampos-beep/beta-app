export type ImageSource = 'wikidata' | 'wikivoyage' | 'wikipedia' | 'openverse' | 'unsplash' | 'flickr';

export type ResolvedImage = {
  url: string;
  thumbUrl?: string;
  width?: number;
  height?: number;
  source: ImageSource;
  attribution: {
    author?: string;
    license: string;
    sourceUrl: string;
  };
  isVerified: boolean;
};

export async function resolveDestinationImage(
  dest: {
    nome: string;
    paisCode: string;
    wikidataId?: string | null;
    wikipediaUrl?: string | null;
  }
): Promise<ResolvedImage | null> {
  if (dest.wikidataId) {
    try {
      const wd = await fetch(
        `https://www.wikidata.org/wiki/Special:EntityData/${dest.wikidataId}.json`,
        { next: { revalidate: 86400 * 30 } }
      ).then(r => r.json());

      const claims = wd.entities?.[dest.wikidataId]?.claims;
      const p18 = claims?.P18?.[0]?.mainsnak?.datavalue?.value as string | undefined;

      if (p18) {
        const filename = p18.replace(/ /g, '_');
        return {
          url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1600`,
          thumbUrl: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=400`,
          source: 'wikidata',
          attribution: {
            license: 'CC BY-SA',
            sourceUrl: `https://commons.wikimedia.org/wiki/File:${filename}`,
          },
          isVerified: true,
        };
      }
    } catch {}
  }

  if (dest.wikipediaUrl) {
    try {
      const match = dest.wikipediaUrl.match(/\/\/(\w+)\.wikipedia\.org\/wiki\/(.+)/);
      if (match) {
        const [, lang, title] = match;
        const sum = await fetch(
          `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${title}`,
          { next: { revalidate: 86400 * 7 } }
        ).then(r => r.json()).catch(() => null);

        if (sum?.thumbnail?.source) {
          return {
            url: sum.thumbnail.source.replace(/\/\d+px-/, '/1200px-'),
            thumbUrl: sum.thumbnail.source,
            width: sum.thumbnail.width,
            height: sum.thumbnail.height,
            source: 'wikipedia',
            attribution: {
              license: 'CC BY-SA',
              sourceUrl: sum.content_urls?.desktop?.page ?? dest.wikipediaUrl,
            },
            isVerified: true,
          };
        }
      }
    } catch {}
  }

  try {
    const ov = await fetch(
      `https://api.openverse.org/v1/images/?` +
      new URLSearchParams({
        q: `${dest.nome} ${dest.paisCode}`,
        license: 'cc0,by,by-sa',
        category: 'photograph',
        mature: 'false',
        page_size: '1',
      }),
      { next: { revalidate: 86400 * 7 } }
    ).then(r => r.json()).catch(() => null);

    if (ov?.results?.[0]) {
      const img = ov.results[0];
      return {
        url: img.url,
        thumbUrl: img.thumbnail,
        source: 'openverse',
        attribution: {
          author: img.creator,
          license: img.license,
          sourceUrl: img.foreign_landing_url,
        },
        isVerified: false,
      };
    }
  } catch {}

  return unsplashFallback(dest);
}

async function unsplashFallback(dest: { nome: string; paisCode: string }): Promise<ResolvedImage | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(dest.nome + ' ' + dest.paisCode + ' city')}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` }, next: { revalidate: 86400 * 7 } }
    ).then(r => r.json());
    const p = res?.results?.[0];
    if (!p) return null;
    return {
      url: p.urls.regular,
      thumbUrl: p.urls.small,
      width: p.width,
      height: p.height,
      source: 'unsplash',
      attribution: {
        author: p.user?.name,
        license: 'Unsplash License',
        sourceUrl: p.links?.html,
      },
      isVerified: false,
    };
  } catch { return null; }
}
