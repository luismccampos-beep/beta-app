import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Page from '../../auth/page';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'auth' });
  return generatePageMetadata('auth', locale, {
    title: t('metaTitleLogin'),
    description: t('metaDescriptionLogin'),
    path: '/auth',
  });
}

export default Page;
