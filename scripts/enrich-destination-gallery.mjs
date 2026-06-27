import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const flags: Record<string, string | boolean> = {};
for (const a of args) {
  if (a.startsWith('--')) {
    const [k, v] = a.replace(/^--/, '').split('=');
    flags[k] = v ?? true;
  }
}

const dryRun = flags['dry-run'] as boolean;
const limit = flags.limit ? parseInt(flags.limit as string, 10) : undefined;
const concurrency = parseInt((flags.concurrency as string) || '3', 10);

async function getCommonsCategory(wikidataId: string): Promise<string | null> {
  try {
    const wd = await fetch(
      `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`
    ).then(r => r.json());
    const claims = wd.entities?.[wikidataId]?.claims;
    return claims?.P373?.[0]?.mainsnak?.datavalue?.value as string | undefined ?? null;
  } catch { return null; }
}

async function getCategoryImages(commonsCat: string, limit = 10): Promise<Array<{ title: string }>> {
  const cat = await fetch(
    `https://commons.wikimedia.org/w/api.php?` +
    new URLSearchParams({
      action: 'query',
      list: 'categorymembers',
      cmtitle: `Category:${commonsCat}`,
      cmtype: 'file',
      cmlimit: '50',
      format: 'json',
      origin: '*',
    })
  ).then(r => r.json());

  return (cat.query?.categorymembers ?? [])
    .filter((f: { title: string }) => /\.(jpe?g)$/i.test(f.title))
    .filter((f: { title: string }) => !/(map|flag|coat|logo|icon|symbol)/i.test(f.title))
    .slice(0, limit);
}

async function main() {
  const dests = await prisma.wvDestination.findMany({
    where: { wikidataId: { not: null } },
    take: limit ?? 500,
    orderBy: { id: 'asc' },
  });

  console.log(`Enriching gallery for ${dests.length} destinations`);

  let done = 0;
  for (let i = 0; i < dests.length; i += concurrency) {
    const batch = dests.slice(i, i + concurrency);
    await Promise.all(batch.map(async (dest) => {
      if (!dest.wikidataId) return;
      const cat = await getCommonsCategory(dest.wikidataId);
      if (!cat) {
        console.log(`Dest ${dest.id} (${dest.nome}): no Commons category`);
        return;
      }
      const images = await getCategoryImages(cat);
      if (images.length === 0) {
        console.log(`Dest ${dest.id} (${dest.nome}): no images in Commons category`);
        return;
      }
      console.log(`Dest ${dest.id} (${dest.nome}): ${images.length} images from Commons`);

      if (!dryRun) {
        for (let idx = 0; idx < images.length; idx++) {
          const f = images[idx];
          const filename = f.title.replace(/^File:/, '');
          await prisma.wvDestinationImage.upsert({
            where: { id: `commons-${dest.id}-${idx}` },
            update: { sortOrder: idx },
            create: {
              id: `commons-${dest.id}-${idx}`,
              destinoId: dest.id,
              url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1200`,
              thumbUrl: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=400`,
              source: 'wikimedia',
              license: 'CC BY-SA',
              sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(f.title)}`,
              sortOrder: idx,
              isPrimary: idx === 0,
            },
          });
        }
      }
    }));
    done += batch.length;
    console.log(`Progress: ${done}/${dests.length}`);
  }

  console.log('Done');
  await prisma.$disconnect();
}

main().catch(console.error);
