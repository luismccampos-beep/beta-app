import { faker } from '@faker-js/faker';

export interface Author {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  categories: string[];
}

export const createAuthor = (overrides?: Partial<Author>): Author => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  ...overrides,
});

export const createManyAuthors = (count: number): Author[] =>
  Array.from({ length: count }, () => createAuthor());

export const createCategory = (overrides?: Partial<Category>): Category => {
  const name = faker.commerce.department();
  return {
    id: faker.string.uuid(),
    name,
    slug: faker.helpers.slugify(name).toLowerCase(),
    ...overrides,
  };
};

export const createManyCategories = (count: number): Category[] =>
  Array.from({ length: count }, () => createCategory());

export const createBlogPost = (overrides?: Partial<BlogPost>): BlogPost => {
  const title = faker.lorem.sentence();
  return {
    id: faker.string.uuid(),
    title,
    slug: faker.helpers.slugify(title).toLowerCase(),
    excerpt: faker.lorem.paragraph(),
    content: faker.lorem.paragraphs(3),
    date: faker.date.recent().toISOString().split('T')[0] ?? '',
    status: faker.helpers.arrayElement(['draft', 'published', 'archived'] as const),
    author: faker.person.fullName(),
    categories: [faker.commerce.department()],
    ...overrides,
  };
};

export const createManyBlogPosts = (count: number): BlogPost[] =>
  Array.from({ length: count }, () => createBlogPost());
