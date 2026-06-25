import { getLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Page from '../../results/page';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return generatePageMetadata('results', locale, { path: '/results' });
}

export default Page;
