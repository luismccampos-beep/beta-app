import { faker } from '@faker-js/faker';

import type { DestinationDetail } from '../types/trip';

export const createDestination = (overrides: Partial<DestinationDetail> = {}): DestinationDetail => {
  const id = faker.string.uuid();
  const priceValue = faker.number.int({ min: 500, max: 5000 });

  return {
    id,
    name: faker.location.city(),
    country: faker.location.country(),
    continent: faker.helpers.arrayElement(['Europe', 'Asia', 'Africa', 'Americas', 'Oceania']),
    image: faker.image.urlLoremFlickr({ category: 'travel' }),
    gallery: Array.from({ length: 4 }, () => faker.image.urlLoremFlickr({ category: 'travel' })),
    price: `€ ${priceValue.toLocaleString()}`,
    originalPrice: `€ ${Math.floor(priceValue * 1.2).toLocaleString()}`,
    rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
    reviews: faker.number.int({ min: 10, max: 1000 }),
    duration: `${faker.number.int({ min: 3, max: 14 })} dias`,
    maxGuests: faker.number.int({ min: 2, max: 20 }),
    description: faker.lorem.paragraph(),
    highlights: Array.from({ length: 3 }, () => faker.lorem.words(2)),
    included: ['Voo ida e volta', 'Hospedagem', 'Café da manhã'],
    notIncluded: ['Almoço e jantar', 'Seguro viagem'],
    itinerary: [
      { day: 1, title: 'Chegada', activities: [faker.lorem.sentence(), faker.lorem.sentence()] },
      { day: 2, title: 'Exploração', activities: [faker.lorem.sentence(), faker.lorem.sentence()] },
    ],
    amenities: [
      { icon: 'Wifi', name: 'WiFi Gratuito' },
      { icon: 'Utensils', name: 'Café da Manhã' },
    ],
    virtualTourLink: '#',
    bookingLink: `/bookings/new?destinationId=${id}`,
    ...overrides,
  };
};

export const createManyDestinations = (count: number = 5): DestinationDetail[] => {
  return Array.from({ length: count }, () => createDestination());
};
