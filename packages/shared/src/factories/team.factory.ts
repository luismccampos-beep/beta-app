import { faker } from '@faker-js/faker';

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  linkedin: string;
  email: string;
}

export const createTeamMember = (overrides?: Partial<TeamMember>): TeamMember => ({
  name: faker.person.fullName(),
  role: faker.person.jobTitle(),
  bio: faker.lorem.paragraph(),
  avatar: faker.image.avatar(),
  linkedin: 'https://linkedin.com/in/' + faker.helpers.slugify(faker.person.fullName().toLowerCase()),
  email: faker.internet.email(),
  ...overrides,
});

export const createManyTeamMembers = (count: number = 3): TeamMember[] => {
  return Array.from({ length: count }, () => createTeamMember());
};

export interface Partnership {
  name: string;
  logo: string;
  description: string;
}

export const createPartnership = (overrides?: Partial<Partnership>): Partnership => ({
  name: faker.company.name(),
  logo: faker.image.urlPlaceholder({ width: 200, height: 100, text: faker.company.name() }),
  description: faker.company.catchPhrase(),
  ...overrides,
});

export const createManyPartnerships = (count: number = 6): Partnership[] => {
  return Array.from({ length: count }, () => createPartnership());
};
