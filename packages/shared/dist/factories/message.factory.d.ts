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
export declare const createMessage: (overrides?: Partial<MockMessage>) => MockMessage;
export declare const createManyMessages: (count: number) => MockMessage[];
