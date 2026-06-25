import { getLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Page from '../page';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return generatePageMetadata('landing', locale, { path: '' });
}

export default Page;
