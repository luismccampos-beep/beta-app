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
export declare const createAuthor: (overrides?: Partial<Author>) => Author;
export declare const createManyAuthors: (count: number) => Author[];
export declare const createCategory: (overrides?: Partial<Category>) => Category;
export declare const createManyCategories: (count: number) => Category[];
export declare const createBlogPost: (overrides?: Partial<BlogPost>) => BlogPost;
export declare const createManyBlogPosts: (count: number) => BlogPost[];
