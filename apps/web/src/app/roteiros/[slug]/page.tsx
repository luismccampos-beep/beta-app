import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { ItineraryPage } from '@/app/components/pages/ItineraryPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = 'pt'; // Default to Portuguese, can be extended
  return generatePageMetadata('itinerary', locale, { path: `roteiros/${slug}` });
}

export default async function ItineraryRoute({ params }: PageProps) {
  const { slug } = await params;
  return <ItineraryPage slug={slug} />;
}