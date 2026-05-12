import { DBSchema, IDBPDatabase } from 'idb';
export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    timestamp: number;
    sessionId?: string;
    metadata?: Record<string, unknown>;
}
interface AppDB extends DBSchema {
    chat: {
        key: string;
        value: ChatMessage;
        indexes: {
            'by-session': string;
        };
    };
}
export declare class IndexedDBService {
    private static dbPromise;
    static getDB(): Promise<IDBPDatabase<AppDB>>;
    static put(storeName: 'chat', value: ChatMessage): Promise<string>;
    static getAll(storeName: 'chat'): Promise<ChatMessage[]>;
    static get(storeName: 'chat', key: string): Promise<ChatMessage | undefined>;
    static delete(storeName: 'chat', key: string): Promise<void>;
    static clear(storeName: 'chat'): Promise<void>;
    static getBySession(sessionId: string): Promise<ChatMessage[]>;
}
export {};
