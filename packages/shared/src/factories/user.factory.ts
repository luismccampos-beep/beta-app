import { faker } from '@faker-js/faker';

import type { User, UserRole } from '../types/auth';

export const createUser = (overrides: Partial<User> = {}): User => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    role: (faker.helpers.arrayElement(['USER', 'ADMIN', 'AGENT']) as UserRole),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    emailVerified: faker.datatype.boolean(),
    isActive: true,
    phone: faker.phone.number(),
    preferences: {
      language: faker.helpers.arrayElement(['pt', 'en', 'es']),
      currency: faker.helpers.arrayElement(['EUR', 'USD', 'BRL']),
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      privacy: {
        profileVisibility: 'public',
        dataSharing: true,
      },
    },
    ...overrides,
  };
};

export const createManyUsers = (count: number = 5): User[] => {
  return Array.from({ length: count }, () => createUser());
};
