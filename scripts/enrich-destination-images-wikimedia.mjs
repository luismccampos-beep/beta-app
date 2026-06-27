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

const source = (flags.source as string) || 'all';
const onlyMissing = flags['only-missing'] as boolean;
const dryRun = flags['dry-run'] as boolean;
const concurrency = parseInt((flags.concurrency as string) || '5', 10);
const limit = flags.limit ? parseInt(flags.limit as string, 10) : undefined;
const country = flags.country as string | undefined;

async function main() {
  const where: Record<string, unknown> = {};
  if (onlyMissing) where.imagemVerificada = false;
  if (country) where.paisCode = country;

  const total = await prisma.wvDestination.count({ where });
  const dests = await prisma.wvDestination.findMany({ where, take: limit ?? 500, orderBy: { id: 'asc' } });

  console.log(`Enriching ${dests.length} destinations (total matching: ${total})`);

  let done = 0;
  const batchSize = concurrency;

  for (let i = 0; i < dests.length; i += batchSize) {
    const batch = dests.slice(i, i + batchSize);
    await Promise.all(batch.map(async (dest) => {
      try {
        await enrichOne(dest);
      } catch (e) {
        console.error(`Error on dest ${dest.id} (${dest.nome}):`, e);
      }
    }));
    done += batch.length;
    console.log(`Progress: ${done}/${dests.length}`);
  }

  console.log('Done');
  await prisma.$disconnect();
}

async function enrichOne(dest: { id: number; nome: string; wikidataId: string | null; wikipediaUrl: string | null; paisCode: string | null }) {
  if (source === 'all' || source === 'wikidata') {
    if (!dest.wikidataId) {
      console.log(`Dest ${dest.id} (${dest.nome}): no wikidataId, skipping wikidata`);
    } else {
      try {
        const wd = await fetch(
          `https://www.wikidata.org/wiki/Special:EntityData/${dest.wikidataId}.json`
        ).then(r => r.json());

        const claims = wd.entities?.[dest.wikidataId]?.claims;
        const p18 = claims?.P18?.[0]?.mainsnak?.datavalue?.value as string | undefined;

        if (p18) {
          const filename = p18.replace(/ /g, '_');
          const data: Record<string, unknown> = {
            imagemUrl: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=1600`,
            imagemFonte: 'wikidata',
            imagemSourceUrl: `https://commons.wikimedia.org/wiki/File:${filename}`,
            imagemLicenca: 'CC BY-SA',
            imagemVerificada: true,
          };

          if (!dryRun) {
            await prisma.wvDestination.update({ where: { id: dest.id }, data });
            console.log(`Dest ${dest.id} (${dest.nome}): wikidata P18 image set`);
          } else {
            console.log(`[DRY-RUN] Dest ${dest.id} (${dest.nome}): would set wikidata image`);
          }
          return;
        }
      } catch {}
      console.log(`Dest ${dest.id} (${dest.nome}): no P18 from wikidata`);
    }
  }

  if (source === 'all' || source === 'wikipedia') {
    if (!dest.wikipediaUrl) {
      console.log(`Dest ${dest.id} (${dest.nome}): no wikipediaUrl, skipping wikipedia`);
    } else {
      try {
        const match = dest.wikipediaUrl.match(/\/\/(\w+)\.wikipedia\.org\/wiki\/(.+)/);
        if (match) {
          const [, lang, title] = match;
          const sum = await fetch(
            `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${title}`
          ).then(r => r.json()).catch(() => null);

          if (sum?.thumbnail?.source) {
            const data: Record<string, unknown> = {
              imagemUrl: sum.thumbnail.source.replace(/\/\d+px-/, '/1200px-'),
              imagemFonte: 'wikipedia',
              imagemSourceUrl: sum.content_urls?.desktop?.page ?? dest.wikipediaUrl,
              imagemLicenca: 'CC BY-SA',
              imagemVerificada: true,
              imagemLargura: sum.thumbnail.width,
              imagemAltura: sum.thumbnail.height,
            };

            if (!dryRun) {
              await prisma.wvDestination.update({ where: { id: dest.id }, data });
              console.log(`Dest ${dest.id} (${dest.nome}): wikipedia lead image set`);
            } else {
              console.log(`[DRY-RUN] Dest ${dest.id} (${dest.nome}): would set wikipedia image`);
            }
            return;
          }
        }
      } catch {}
    }
  }

  if (source === 'all' || source === 'openverse') {
    try {
      const ov = await fetch(
        `https://api.openverse.org/v1/images/?` +
        new URLSearchParams({
          q: `${dest.nome} ${dest.paisCode}`,
          license: 'cc0,by,by-sa',
          category: 'photograph',
          mature: 'false',
          page_size: '1',
        })
      ).then(r => r.json()).catch(() => null);

      if (ov?.results?.[0]) {
        const img = ov.results[0];
        const data: Record<string, unknown> = {
          imagemUrl: img.url,
          imagemFonte: 'openverse',
          imagemAutor: img.creator,
          imagemLicenca: img.license,
          imagemSourceUrl: img.foreign_landing_url,
          imagemVerificada: false,
        };

        if (!dryRun) {
          await prisma.wvDestination.update({ where: { id: dest.id }, data });
          console.log(`Dest ${dest.id} (${dest.nome}): openverse image set`);
        } else {
          console.log(`[DRY-RUN] Dest ${dest.id} (${dest.nome}): would set openverse image`);
        }
      }
    } catch {}
  }
}

main().catch(console.error);
