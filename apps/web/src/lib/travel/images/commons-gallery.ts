import type { ResolvedImage } from './resolve-destination-image';

export async function getCommonsGallery(
  wikidataId: string,
  limit = 8
): Promise<ResolvedImage[]> {
  const wd = await fetch(
    `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`,
    { next: { revalidate: 86400 * 30 } }
  ).then(r => r.json());

  const claims = wd.entities?.[wikidataId]?.claims;
  const commonsCat = claims?.P373?.[0]?.mainsnak?.datavalue?.value as string | undefined;

  if (!commonsCat) return [];

  const cat = await fetch(
    `https://commons.wikimedia.org/w/api.php?` +
    new URLSearchParams({
      action: 'query',
      list: 'categorymembers',
      cmtitle: `Category:${commonsCat}`,
      cmtype: 'file',
      cmlimit: '40',
      format: 'json',
      origin: '*',
    })
  ).then(r => r.json());

  const files = (cat.query?.categorymembers ?? [])
    .filter((f: { title: string }) => /\.(jpe?g)$/i.test(f.title))
    .filter((f: { title: string }) => !/(map|flag|coat|logo|icon|symbol)/i.test(f.title))
    .slice(0, limit);

  return files.map((f: { title: string }) => {
    const filename = f.title.replace(/^File:/, '');
    return {
      url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1200`,
      thumbUrl: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=400`,
      source: 'wikimedia' as const,
      attribution: {
        license: 'CC BY-SA',
        sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(f.title)}`,
      },
      isVerified: true,
    };
  });
}
