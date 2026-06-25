import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Page from '../../../auth/reset-password/page';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'auth' });
  return generatePageMetadata('auth', locale, {
    title: t('metaTitleForgot'),
    description: t('metaDescriptionForgot'),
    path: '/auth/reset-password',
  });
}

export default Page;
