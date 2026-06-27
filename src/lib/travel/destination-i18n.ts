import { prisma } from '../prisma';

export async function getDestinationLocalized(
  destinoId: number,
  locale: string
): Promise<{ nome: string; descricao: string; resumo: string; fonte: string }> {
  const native = await prisma.wvDestination.findFirst({
    where: { id: destinoId, lang: locale }
  });
  if (native) return {
    nome: native.nome,
    descricao: native.descricao ?? '',
    resumo: native.resumo ?? '',
    fonte: 'wikivoyage'
  };

  const tr = await prisma.destinationTranslation.findUnique({
    where: { destinoId_lang: { destinoId, lang: locale } }
  });
  if (tr) return {
    nome: tr.nome ?? '',
    descricao: tr.descricao ?? '',
    resumo: tr.resumo ?? '',
    fonte: tr.fonte
  };

  const base = await prisma.wvDestination.findUnique({ where: { id: destinoId } });
  if (base?.wikipediaUrl) {
    try {
      const match = base.wikipediaUrl.match(/\/\/(\w+)\.wikipedia\.org\/wiki\/(.+)/);
      if (match && base.wikidataId) {
        const [, lang] = match;
        const wd = await fetch(
          `https://www.wikidata.org/wiki/Special:EntityData/${base.wikidataId}.json`,
          { next: { revalidate: 86400 * 30 } }
        ).then(r => r.json()).catch(() => null);

        if (wd) {
          const entities = (wd as Record<string, Record<string, { sitelinks?: Record<string, { title?: string }> }>>).entities;
          const siteLinks = entities?.[base.wikidataId as string]?.sitelinks;
          const target = siteLinks?.[`${locale}wiki`]?.title;
          if (target) {
            const sum = await fetch(
              `https://${locale}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(target)}`,
              { next: { revalidate: 86400 * 7 } }
            ).then(r => r.json()).catch(() => null);

            if (sum?.extract) {
              await prisma.destinationTranslation.upsert({
                where: { destinoId_lang: { destinoId, lang: locale } },
                update: { nome: sum.title, descricao: sum.extract, resumo: sum.extract, fonte: 'wikipedia', verificado: true },
                create: { destinoId, lang: locale, nome: sum.title, descricao: sum.extract, resumo: sum.extract, fonte: 'wikipedia', verificado: true },
              });

              return { nome: sum.title, descricao: sum.extract, resumo: sum.extract, fonte: 'wikipedia' };
            }
          }
        }
      }
    } catch {}
  }

  return { nome: base?.nome ?? '', descricao: base?.descricao ?? '', resumo: base?.resumo ?? '', fonte: 'original' };
}
