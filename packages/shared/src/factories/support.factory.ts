import { faker } from '@faker-js/faker';

export interface SupportArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  views: number;
  lastUpdated: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface SupportAgent {
  id: string;
  name: string;
  avatar: string;
  title: string;
  specialties: string[];
  rating: number;
  responseTime: string;
  languages: string[];
  isOnline: boolean;
}

export const createSupportArticle = (overrides?: Partial<SupportArticle>): SupportArticle => ({
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

export const createManySupportArticles = (count: number): SupportArticle[] =>
  Array.from({ length: count }, () => createSupportArticle());

export const createSupportAgent = (overrides?: Partial<SupportAgent>): SupportAgent => ({
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

export const createManySupportAgents = (count: number): SupportAgent[] =>
  Array.from({ length: count }, () => createSupportAgent());
