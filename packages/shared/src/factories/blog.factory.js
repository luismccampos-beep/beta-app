import { faker } from '@faker-js/faker';
export const createAuthor = (overrides) => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    ...overrides,
});
export const createManyAuthors = (count) => Array.from({ length: count }, () => createAuthor());
export const createCategory = (overrides) => {
    const name = faker.commerce.department();
    return {
        id: faker.string.uuid(),
        name,
        slug: faker.helpers.slugify(name).toLowerCase(),
        ...overrides,
    };
};
export const createManyCategories = (count) => Array.from({ length: count }, () => createCategory());
export const createBlogPost = (overrides) => {
    const title = faker.lorem.sentence();
    return {
        id: faker.string.uuid(),
        title,
        slug: faker.helpers.slugify(title).toLowerCase(),
        excerpt: faker.lorem.paragraph(),
        content: faker.lorem.paragraphs(3),
        date: faker.date.recent().toISOString().split('T')[0] ?? '',
        status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
        author: faker.person.fullName(),
        categories: [faker.commerce.department()],
        ...overrides,
    };
};
export const createManyBlogPosts = (count) => Array.from({ length: count }, () => createBlogPost());
//# sourceMappingURL=blog.factory.js.map