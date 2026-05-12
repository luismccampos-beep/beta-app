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
export declare const createSupportArticle: (overrides?: Partial<SupportArticle>) => SupportArticle;
export declare const createManySupportArticles: (count: number) => SupportArticle[];
export declare const createSupportAgent: (overrides?: Partial<SupportAgent>) => SupportAgent;
export declare const createManySupportAgents: (count: number) => SupportAgent[];
