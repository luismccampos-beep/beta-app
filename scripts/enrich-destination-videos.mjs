import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MIN_DURATION = 3;
const MAX_DURATION = 120;
const MAX_FILESIZE_KB = 50 * 1024;
const MIN_WIDTH = 640;

function validateVideoAsset(v, destName) {
  const reasons = [];
  if (v.durationSec && (v.durationSec < MIN_DURATION || v.durationSec > MAX_DURATION))
    reasons.push(`duration=${v.durationSec}s`);
  if (v.width && v.height && v.width < v.height)
    reasons.push('portrait');
  if (v.width && v.width < MIN_WIDTH)
    reasons.push(`width=${v.width}px`);
  if (v.fileSizeKb && v.fileSizeKb > MAX_FILESIZE_KB)
    reasons.push(`size=${Math.round(v.fileSizeKb / 1024)}MB`);

  const fn = (v.sourceUrl ?? '').toLowerCase();
  if (/(logo|icon|map|flag|intro|outro)/.test(fn))
    reasons.push('generic_filename');

  return { valid: reasons.length === 0, reasons };
}

async function getVideoInfo(filename) {
  try {
    const resp = await fetch(
      `https://commons.wikimedia.org/w/api.php?` +
      new URLSearchParams({
        action: 'query',
        titles: `File:${filename}`,
        prop: 'videoinfo',
        viprop: 'size|dimensions|duration|mediatype',
        format: 'json',
        origin: '*',
      })
    ).then(r => r.json());

    const pages = resp.query?.pages ?? {};
    const page = Object.values(pages)[0];
    if (!page?.videoinfo?.[0]) return null;

    const vi = page.videoinfo[0];
    return {
      durationSec: vi.duration ? Math.round(vi.duration) : null,
      width: vi.width ?? null,
      height: vi.height ?? null,
      fileSizeKb: vi.size ? Math.round(vi.size / 1024) : null,
      sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename)}`,
    };
  } catch {
    return null;
  }
}

async function main() {
  const dests = await prisma.wvDestination.findMany({
    where: { wikidataId: { not: null } },
    take: 200,
    orderBy: { id: 'asc' },
  });

  console.log(`Enriching videos for ${dests.length} destinations`);
  let found = 0;
  let rejected = 0;

  for (const dest of dests) {
    if (!dest.wikidataId) continue;
    try {
      const wd = await fetch(
        `https://www.wikidata.org/wiki/Special:EntityData/${dest.wikidataId}.json`
      ).then(r => r.json());
      const claims = wd.entities?.[dest.wikidataId]?.claims;
      const commonsCat = claims?.P373?.[0]?.mainsnak?.datavalue?.value;
      if (!commonsCat) continue;

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

      const videoFiles = (cat.query?.categorymembers ?? [])
        .filter((f) => /\.(webm|ogv|mp4)$/i.test(f.title))
        .slice(0, 5);

      if (videoFiles.length === 0) continue;

      for (let idx = 0; idx < videoFiles.length; idx++) {
        const v = videoFiles[idx];
        const filename = v.title.replace(/^File:/, '');

        const info = await getVideoInfo(filename);
        if (!info) {
          rejected++;
          continue;
        }

        const check = validateVideoAsset(info, dest.nome);
        if (!check.valid) {
          console.log(`  reject ${filename}: ${check.reasons.join(', ')}`);
          rejected++;
          continue;
        }

        const fileExt = filename.split('.').pop()?.toLowerCase();
        const mimeType = fileExt === 'mp4' ? 'video/mp4' : fileExt === 'webm' ? 'video/webm' : 'video/ogg';

        await prisma.wvDestinationVideo.upsert({
          where: { id: `video-${dest.id}-${idx}` },
          update: {
            url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`,
            width: info.width,
            height: info.height,
            durationSec: info.durationSec,
            fileSizeKb: info.fileSizeKb,
          },
          create: {
            id: `video-${dest.id}-${idx}`,
            destinoId: dest.id,
            url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`,
            thumbUrl: null,
            posterUrl: null,
            width: info.width,
            height: info.height,
            durationSec: info.durationSec,
            fileSizeKb: info.fileSizeKb,
            author: null,
            license: 'CC BY-SA',
            source: 'wikimedia',
            sourceUrl: info.sourceUrl,
            isVerified: true,
            sortOrder: idx,
          },
        });
        found++;
      }

      console.log(`Dest ${dest.id} (${dest.nome}): ${videoFiles.length} candidates, accepted so far: ${found}`);
    } catch {
      // skip on error
    }
  }

  console.log(`\nDone. Accepted: ${found}, Rejected: ${rejected}`);
  await prisma.$disconnect();
}

main().catch(console.error);
