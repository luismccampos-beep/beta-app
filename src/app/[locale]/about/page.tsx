import { getLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Page from '../../about/page';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return generatePageMetadata('about', locale, { path: '/about' });
}

export default Page;
