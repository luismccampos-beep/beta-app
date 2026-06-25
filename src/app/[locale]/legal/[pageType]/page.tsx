import { getLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { generateLegalMetadata } from '@/lib/seo';
import Page from '../../../legal/[pageType]/page';

export async function generateMetadata({ params }: { params: Promise<{ pageType: string }> }): Promise<Metadata> {
  const locale = await getLocale();
  const { pageType } = await params;
  return generateLegalMetadata(locale, pageType, `/legal/${pageType}`);
}

export default Page;
