import { faker } from '@faker-js/faker';
export const createSupportArticle = (overrides) => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    category: faker.helpers.arrayElement(['API', 'Reservas', 'Pagamentos', 'Conta']),
    readTime: faker.number.int({ min: 1, max: 15 }),
    views: faker.number.int({ min: 100, max: 5000 }),
    lastUpdated: faker.date.recent().toISOString(),
    difficulty: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced']),
    ...overrides,
});
export const createManySupportArticles = (count) => Array.from({ length: count }, () => createSupportArticle());
export const createSupportAgent = (overrides) => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    title: faker.person.jobTitle(),
    specialties: faker.helpers.arrayElements(['API', 'Backend', 'Frontend', 'DevOps', 'Security'], 3),
    rating: faker.number.float({ min: 4, max: 5, multipleOf: 0.1 }),
    responseTime: `< ${faker.number.int({ min: 1, max: 10 })} minutos`,
    languages: ['Português', 'Inglês', faker.helpers.arrayElement(['Espanhol', 'Francês', 'Alemão'])],
    isOnline: faker.datatype.boolean(),
    ...overrides,
});
export const createManySupportAgents = (count) => Array.from({ length: count }, () => createSupportAgent());
//# sourceMappingURL=support.factory.js.map