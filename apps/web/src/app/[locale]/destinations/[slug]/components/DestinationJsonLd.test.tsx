import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { DestinationJsonLd } from './DestinationJsonLd';

describe('DestinationJsonLd', () => {
  const baseData = {
    nome: 'Lisboa',
    slug: 'pt-123',
    imageUrl: 'https://example.com/lisboa.jpg',
  };

  it('renders a script tag with JSON-LD', () => {
    const { container } = render(<DestinationJsonLd data={baseData} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();

    const parsed = JSON.parse(script!.textContent!);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('TouristDestination');
    expect(parsed.name).toBe('Lisboa');
  });

  it('includes description from resumo when available', () => {
    const { container } = render(
      <DestinationJsonLd data={{ ...baseData, resumo: 'Capital de Portugal' }} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.description).toBe('Capital de Portugal');
  });

  it('falls back to descricao when resumo is not available', () => {
    const { container } = render(
      <DestinationJsonLd
        data={{ ...baseData, descricao: 'Uma cidade linda à beira do Tejo' }}
      />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.description).toBe('Uma cidade linda à beira do Tejo');
  });

  it('truncates descricao to 200 characters', () => {
    const longDesc = 'A'.repeat(300);
    const { container } = render(
      <DestinationJsonLd data={{ ...baseData, descricao: longDesc }} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.description).toHaveLength(200);
  });

  it('includes postal address when paisCode is provided', () => {
    const { container } = render(
      <DestinationJsonLd data={{ ...baseData, paisCode: 'PT' }} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.address).toEqual({
      '@type': 'PostalAddress',
      addressCountry: 'PT',
    });
  });

  it('falls back to pais string for address when paisCode is missing', () => {
    const { container } = render(
      <DestinationJsonLd data={{ ...baseData, pais: 'Portugal' }} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.address).toEqual({
      '@type': 'PostalAddress',
      addressCountry: 'Portugal',
    });
  });

  it('includes geo coordinates when latitude and longitude are provided', () => {
    const { container } = render(
      <DestinationJsonLd data={{ ...baseData, latitude: 38.7223, longitude: -9.1393 }} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: 38.7223,
      longitude: -9.1393,
    });
  });

  it('includes containedInPlace when continente is provided', () => {
    const { container } = render(
      <DestinationJsonLd data={{ ...baseData, continente: 'Europa' }} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.containedInPlace).toEqual({
      '@type': 'Continent',
      name: 'Europa',
    });
  });

  it('omits geo when latitude is missing', () => {
    const { container } = render(
      <DestinationJsonLd data={{ ...baseData, latitude: null, longitude: -9.1393 }} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.geo).toBeUndefined();
  });

  it('omits geo when longitude is missing', () => {
    const { container } = render(
      <DestinationJsonLd data={{ ...baseData, latitude: 38.7223, longitude: null }} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.geo).toBeUndefined();
  });

  it('includes correct url', () => {
    const { container } = render(<DestinationJsonLd data={baseData} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.url).toBe('https://www.akmleva.pt/destinations/pt-123');
  });

  it('uses empty description when neither resumo nor descricao are provided', () => {
    const { container } = render(<DestinationJsonLd data={baseData} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.description).toBe('');
  });
});
