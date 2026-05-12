import {
  f
} from "./chunk-QUALQIBR.js";

// src/factories/package.factory.ts
var createReview = (overrides) => ({
  id: f.string.uuid(),
  name: f.person.fullName(),
  avatar: f.image.avatar(),
  verified: f.datatype.boolean(),
  rating: f.number.int({ min: 1, max: 5 }),
  date: f.date.recent().toISOString(),
  comment: f.lorem.paragraph(),
  helpful: f.number.int({ min: 0, max: 50 }),
  ...overrides
});
var createManyReviews = (count) => Array.from({ length: count }, () => createReview());
var createFAQ = (overrides) => ({
  id: f.string.uuid(),
  question: f.lorem.sentence() + "?",
  answer: f.lorem.paragraph(),
  order: f.number.int({ min: 0, max: 100 }),
  ...overrides
});
var createManyFAQs = (count) => Array.from({ length: count }, () => createFAQ());
var createTestimonial = (overrides) => ({
  name: f.person.fullName(),
  location: `${f.location.city()}, ${f.location.country()}`,
  text: f.lorem.sentences(2),
  rating: f.number.int({ min: 4, max: 5 }),
  ...overrides
});
var createManyTestimonials = (count) => Array.from({ length: count }, (_, i) => createTestimonial({ index: i }));
var categories = [
  "accommodation",
  "transportation",
  "activities",
  "dining",
  "insurance",
  "guides",
  "equipment"
];
var createServiceProvider = (overrides) => ({
  id: f.string.uuid(),
  name: f.company.name(),
  logo: f.image.url(),
  rating: f.number.float({ min: 3, max: 5, multipleOf: 0.1 }),
  verified: f.datatype.boolean(),
  description: f.company.catchPhrase(),
  ...overrides
});
var createServiceAvailability = (overrides) => ({
  date: f.date.future().toISOString(),
  availableSlots: f.number.int({ min: 0, max: 20 }),
  price: f.number.int({ min: 50, max: 500 }),
  timeSlots: Array.from(
    { length: 3 },
    () => `${f.number.int({ min: 8, max: 12 })}:00 - ${f.number.int({ min: 13, max: 17 })}:00`
  ),
  ...overrides
});
var createAddOnService = (overrides) => ({
  id: f.string.uuid(),
  name: f.commerce.productName(),
  price: f.number.int({ min: 10, max: 100 }),
  description: f.commerce.productDescription(),
  category: f.helpers.arrayElement(categories),
  ...overrides
});
var createPackageService = (overrides) => {
  const category = f.helpers.arrayElement(categories);
  return {
    id: f.string.uuid(),
    name: f.commerce.productName(),
    description: f.commerce.productDescription(),
    category,
    price: f.number.int({ min: 50, max: 1e3 }),
    currency: "EUR",
    duration: `${f.number.int({ min: 1, max: 8 })} hours`,
    location: `${f.location.city()}, ${f.location.country()}`,
    rating: f.number.float({ min: 3, max: 5, multipleOf: 0.1 }),
    reviews: f.number.int({ min: 0, max: 500 }),
    images: Array.from({ length: 3 }, () => f.image.url()),
    features: Array.from({ length: 3 }, () => f.lorem.word()),
    included: Array.from({ length: 3 }, () => f.lorem.sentence()),
    excluded: Array.from({ length: 2 }, () => f.lorem.sentence()),
    availability: Array.from({ length: 5 }, () => createServiceAvailability()),
    capacity: {
      min: 1,
      max: f.number.int({ min: 10, max: 50 })
    },
    difficulty: f.helpers.arrayElement(["easy", "moderate", "challenging"]),
    requirements: Array.from({ length: 2 }, () => f.lorem.sentence()),
    cancellationPolicy: f.lorem.sentence(),
    provider: createServiceProvider(),
    tags: Array.from({ length: 3 }, () => f.lorem.word()),
    isPopular: f.datatype.boolean(),
    isRecommended: f.datatype.boolean(),
    addOns: Array.from({ length: 2 }, () => createAddOnService()),
    ...overrides
  };
};
var createManyPackageServices = (count) => Array.from({ length: count }, () => createPackageService());

// src/factories/blog.factory.ts
var createAuthor = (overrides) => ({
  id: f.string.uuid(),
  name: f.person.fullName(),
  email: f.internet.email(),
  ...overrides
});
var createManyAuthors = (count) => Array.from({ length: count }, () => createAuthor());
var createCategory = (overrides) => {
  const name = f.commerce.department();
  return {
    id: f.string.uuid(),
    name,
    slug: f.helpers.slugify(name).toLowerCase(),
    ...overrides
  };
};
var createManyCategories = (count) => Array.from({ length: count }, () => createCategory());
var createBlogPost = (overrides) => {
  const title = f.lorem.sentence();
  return {
    id: f.string.uuid(),
    title,
    slug: f.helpers.slugify(title).toLowerCase(),
    excerpt: f.lorem.paragraph(),
    content: f.lorem.paragraphs(3),
    date: f.date.recent().toISOString().split("T")[0] ?? "",
    status: f.helpers.arrayElement(["draft", "published", "archived"]),
    author: f.person.fullName(),
    categories: [f.commerce.department()],
    ...overrides
  };
};
var createManyBlogPosts = (count) => Array.from({ length: count }, () => createBlogPost());

// src/factories/support.factory.ts
var createSupportArticle = (overrides) => ({
  id: f.string.uuid(),
  title: f.lorem.sentence(),
  description: f.lorem.paragraph(),
  category: f.helpers.arrayElement(["API", "Reservas", "Pagamentos", "Conta"]),
  readTime: f.number.int({ min: 1, max: 15 }),
  views: f.number.int({ min: 100, max: 5e3 }),
  lastUpdated: f.date.recent().toISOString(),
  difficulty: f.helpers.arrayElement(["beginner", "intermediate", "advanced"]),
  ...overrides
});
var createManySupportArticles = (count) => Array.from({ length: count }, () => createSupportArticle());
var createSupportAgent = (overrides) => ({
  id: f.string.uuid(),
  name: f.person.fullName(),
  avatar: f.image.avatar(),
  title: f.person.jobTitle(),
  specialties: f.helpers.arrayElements(["API", "Backend", "Frontend", "DevOps", "Security"], 3),
  rating: f.number.float({ min: 4, max: 5, multipleOf: 0.1 }),
  responseTime: `< ${f.number.int({ min: 1, max: 10 })} minutos`,
  languages: ["Portugu\xEAs", "Ingl\xEAs", f.helpers.arrayElement(["Espanhol", "Franc\xEAs", "Alem\xE3o"])],
  isOnline: f.datatype.boolean(),
  ...overrides
});
var createManySupportAgents = (count) => Array.from({ length: count }, () => createSupportAgent());

export {
  createReview,
  createManyReviews,
  createFAQ,
  createManyFAQs,
  createTestimonial,
  createManyTestimonials,
  createServiceProvider,
  createServiceAvailability,
  createAddOnService,
  createPackageService,
  createManyPackageServices,
  createAuthor,
  createManyAuthors,
  createCategory,
  createManyCategories,
  createBlogPost,
  createManyBlogPosts,
  createSupportArticle,
  createManySupportArticles,
  createSupportAgent,
  createManySupportAgents
};
//# sourceMappingURL=chunk-PVR633CW.js.map