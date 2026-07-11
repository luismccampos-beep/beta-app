import { getLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Page from '../../faq/page';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return generatePageMetadata('faq', locale, { path: '/faq' });
}

export default Page;
