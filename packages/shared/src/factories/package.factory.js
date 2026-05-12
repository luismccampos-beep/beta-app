import { faker } from '@faker-js/faker';
export const createReview = (overrides) => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    verified: faker.datatype.boolean(),
    rating: faker.number.int({ min: 1, max: 5 }),
    date: faker.date.recent().toISOString(),
    comment: faker.lorem.paragraph(),
    helpful: faker.number.int({ min: 0, max: 50 }),
    ...overrides,
});
export const createManyReviews = (count) => Array.from({ length: count }, () => createReview());
export const createFAQ = (overrides) => ({
    id: faker.string.uuid(),
    question: faker.lorem.sentence() + '?',
    answer: faker.lorem.paragraph(),
    order: faker.number.int({ min: 0, max: 100 }),
    ...overrides,
});
export const createManyFAQs = (count) => Array.from({ length: count }, () => createFAQ());
export const createTestimonial = (overrides) => ({
    name: faker.person.fullName(),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    text: faker.lorem.sentences(2),
    rating: faker.number.int({ min: 4, max: 5 }),
    ...overrides,
});
export const createManyTestimonials = (count) => Array.from({ length: count }, (_, i) => createTestimonial({ index: i }));
// PackageService Factories
const categories = [
    'accommodation',
    'transportation',
    'activities',
    'dining',
    'insurance',
    'guides',
    'equipment',
];
export const createServiceProvider = (overrides) => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    logo: faker.image.url(),
    rating: faker.number.float({ min: 3, max: 5, multipleOf: 0.1 }),
    verified: faker.datatype.boolean(),
    description: faker.company.catchPhrase(),
    ...overrides,
});
export const createServiceAvailability = (overrides) => ({
    date: faker.date.future().toISOString(),
    availableSlots: faker.number.int({ min: 0, max: 20 }),
    price: faker.number.int({ min: 50, max: 500 }),
    timeSlots: Array.from({ length: 3 }, () => `${faker.number.int({ min: 8, max: 12 })}:00 - ${faker.number.int({ min: 13, max: 17 })}:00`),
    ...overrides,
});
export const createAddOnService = (overrides) => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: faker.number.int({ min: 10, max: 100 }),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(categories),
    ...overrides,
});
export const createPackageService = (overrides) => {
    const category = faker.helpers.arrayElement(categories);
    return {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category,
        price: faker.number.int({ min: 50, max: 1000 }),
        currency: 'EUR',
        duration: `${faker.number.int({ min: 1, max: 8 })} hours`,
        location: `${faker.location.city()}, ${faker.location.country()}`,
        rating: faker.number.float({ min: 3, max: 5, multipleOf: 0.1 }),
        reviews: faker.number.int({ min: 0, max: 500 }),
        images: Array.from({ length: 3 }, () => faker.image.url()),
        features: Array.from({ length: 3 }, () => faker.lorem.word()),
        included: Array.from({ length: 3 }, () => faker.lorem.sentence()),
        excluded: Array.from({ length: 2 }, () => faker.lorem.sentence()),
        availability: Array.from({ length: 5 }, () => createServiceAvailability()),
        capacity: {
            min: 1,
            max: faker.number.int({ min: 10, max: 50 }),
        },
        difficulty: faker.helpers.arrayElement(['easy', 'moderate', 'challenging']),
        requirements: Array.from({ length: 2 }, () => faker.lorem.sentence()),
        cancellationPolicy: faker.lorem.sentence(),
        provider: createServiceProvider(),
        tags: Array.from({ length: 3 }, () => faker.lorem.word()),
        isPopular: faker.datatype.boolean(),
        isRecommended: faker.datatype.boolean(),
        addOns: Array.from({ length: 2 }, () => createAddOnService()),
        ...overrides,
    };
};
export const createManyPackageServices = (count) => Array.from({ length: count }, () => createPackageService());
//# sourceMappingURL=package.factory.js.map