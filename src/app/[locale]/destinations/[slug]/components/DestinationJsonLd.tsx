export function DestinationJsonLd({
  data,
}: {
  data: {
    nome: string;
    slug: string;
    imageUrl: string;
    resumo?: string | null;
    descricao?: string | null;
    pais?: string | null;
    paisCode?: string | null;
    continente?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
}) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: data.nome,
    description: data.resumo || data.descricao?.slice(0, 200) || '',
    image: data.imageUrl,
    url: `https://www.akmleva.pt/destinations/${data.slug}`,
  };

  if (data.paisCode || data.pais) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      addressCountry: data.paisCode || data.pais,
    };
  }

  if (data.latitude && data.longitude) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: data.latitude,
      longitude: data.longitude,
    };
  }

  if (data.continente) {
    jsonLd.containedInPlace = {
      '@type': 'Continent',
      name: data.continente,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
