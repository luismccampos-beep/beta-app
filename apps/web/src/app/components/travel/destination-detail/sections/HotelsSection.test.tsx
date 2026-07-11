import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HotelsSection } from './HotelsSection';

vi.mock('../../../travel/HotelTypeBadge', () => ({
  HotelTypeBadge: ({ tipo, count, label }: { tipo: string; count: number; label: string }) => (
    <span data-testid={`hotel-type-${tipo}`}>
      {label} ({count})
    </span>
  ),
}));

const t = (key: string): string => key;

const sampleHotel = {
  id: 1,
  nome: 'Pestana Vintage Porto Hotel',
  estrelas: 5,
  preco_por_noite: 210,
  comodidades: ['Wi-Fi', 'Vista Rio Douro', 'Restaurante'],
};

const sampleHotels = [sampleHotel];

describe('HotelsSection', () => {
  it('returns null when hotels is empty and no hotelTypes', () => {
    const { container } = render(
      <HotelsSection hotels={[]} hotelTypes={null} t={t} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when hotels is undefined (regression: undefined.length crash)', () => {
    const { container } = render(
      <HotelsSection hotels={undefined} hotelTypes={null} t={t} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders hotels when hotelTypes is provided even with empty hotels', () => {
    const { container } = render(
      <HotelsSection hotels={[]} hotelTypes={{ hotel: 5, hostel: 2 }} t={t} />,
    );
    // Should render because hotelTypes has entries
    expect(container.firstChild).not.toBeNull();
  });

  it('renders hotel names and star ratings', () => {
    render(<HotelsSection hotels={sampleHotels} hotelTypes={null} t={t} />);
    expect(screen.getByText('Pestana Vintage Porto Hotel')).toBeInTheDocument();
    expect(screen.getByText(/EUR 210/)).toBeInTheDocument();
    expect(screen.getByText(/noite/)).toBeInTheDocument();
  });

  it('renders hotel amenities', () => {
    render(<HotelsSection hotels={sampleHotels} hotelTypes={null} t={t} />);
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('Vista Rio Douro')).toBeInTheDocument();
  });

  it('renders hotel type badges when hotelTypes are provided', () => {
    render(
      <HotelsSection
        hotels={sampleHotels}
        hotelTypes={{ hotel: 5, hostel: 2 }}
        t={t}
      />,
    );
    expect(screen.getByTestId('hotel-type-hotel')).toBeInTheDocument();
    expect(screen.getByTestId('hotel-type-hostel')).toBeInTheDocument();
  });

  it('handles hotels with no amenities gracefully', () => {
    const hotelNoAmenities = [{ ...sampleHotel, comodidades: [] }];
    render(
      <HotelsSection hotels={hotelNoAmenities} hotelTypes={null} t={t} />,
    );
    expect(screen.getByText('Pestana Vintage Porto Hotel')).toBeInTheDocument();
  });

  it('renders the hotels title', () => {
    render(<HotelsSection hotels={sampleHotels} hotelTypes={null} t={t} />);
    expect(screen.getByText('hotels')).toBeInTheDocument();
  });
});
