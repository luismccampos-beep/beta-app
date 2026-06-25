import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n.config';

const siteUrl = 'https://www.akmleva.pt';

const legalTitles: Record<string, string> = {
  terms: 'termsTitle',
  privacy: 'privacyTitle',
  gdpr: 'gdprTitle',
  cancellations: 'cancellationsTitle',
  cookies: 'cookiesTitle',
};

export async function generatePageMetadata(
  namespace: string,
  locale: string,
  extra?: { title?: string; description?: string; path?: string },
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  const title = extra?.title ?? t('metaTitle');
  const description = extra?.description ?? t('metaDescription');

  const path = extra?.path ?? '';
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}${path}`]),
      ),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'AKMLEVA',
      locale: locale === 'pt' ? 'pt_PT' : locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export async function generateLegalMetadata(
  locale: string,
  pageType: string,
  path: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'legal' });
  const key = legalTitles[pageType] ?? 'termsTitle';
  const pageTitle = t(key);
  const title = t('metaTitle', { pageType: pageTitle });
  const description = t('metaDescription');
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}${path}`]),
      ),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'AKMLEVA',
      locale: locale === 'pt' ? 'pt_PT' : locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
