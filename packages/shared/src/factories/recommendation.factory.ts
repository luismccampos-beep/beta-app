import { faker } from '@faker-js/faker';

export interface Candidate {
  destinationId: number;
  destinationName: string;
  score: number;
  reasons: string[];
  budgetCategory: 'low' | 'medium' | 'high';
  tags: string[];
  travelDates?: { start: string; end: string };
}

export const createCandidate = (overrides: Partial<Candidate> = {}): Candidate => {
  return {
    destinationId: faker.number.int({ min: 1, max: 1000 }),
    destinationName: faker.location.city(),
    score: faker.number.float({ min: 0.1, max: 1, fractionDigits: 2 }),
    reasons: Array.from({ length: 3 }, () => faker.lorem.word()),
    budgetCategory: faker.helpers.arrayElement(['low', 'medium', 'high']),
    tags: Array.from({ length: 3 }, () => faker.lorem.word()),
    ...overrides,
  };
};

export const createManyCandidates = (count: number = 5): Candidate[] => {
  return Array.from({ length: count }, () => createCandidate());
};
