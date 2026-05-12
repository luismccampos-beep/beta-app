import { faker } from '@faker-js/faker';

export interface MockMessage {
  id: number;
  subject: string;
  sender: string;
  email: string;
  date: string;
  status: 'unread' | 'read';
  priority: 'high' | 'medium' | 'low';
  excerpt: string;
}

export const createMessage = (overrides?: Partial<MockMessage>): MockMessage => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  subject: faker.lorem.sentence(),
  sender: faker.person.fullName(),
  email: faker.internet.email(),
  date: faker.date.recent().toISOString().replace('T', ' ').slice(0, 16),
  status: faker.helpers.arrayElement(['unread', 'read'] as const),
  priority: faker.helpers.arrayElement(['high', 'medium', 'low'] as const),
  excerpt: faker.lorem.sentence(),
  ...overrides,
});

export const createManyMessages = (count: number): MockMessage[] =>
  Array.from({ length: count }, () => createMessage());
