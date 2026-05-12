import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define the chat message structure
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
    indexes: { 'by-session': string };
  };
}

const DB_NAME = 'akmleva-shared-db';
const DB_VERSION = 1;

export class IndexedDBService {
  private static dbPromise: Promise<IDBPDatabase<AppDB>> | null = null;

  static async getDB(): Promise<IDBPDatabase<AppDB>> {
    if (!this.dbPromise) {
      this.dbPromise = openDB<AppDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('chat')) {
            const store = db.createObjectStore('chat', { keyPath: 'id' });
            store.createIndex('by-session', 'sessionId');
          }
        },
      });
    }
    return this.dbPromise;
  }

  static async put(storeName: 'chat', value: ChatMessage): Promise<string> {
    const db = await this.getDB();
    return db.put(storeName, value);
  }

  static async getAll(storeName: 'chat'): Promise<ChatMessage[]> {
    const db = await this.getDB();
    return db.getAll(storeName);
  }

  static async get(storeName: 'chat', key: string): Promise<ChatMessage | undefined> {
    const db = await this.getDB();
    return db.get(storeName, key);
  }

  static async delete(storeName: 'chat', key: string): Promise<void> {
    const db = await this.getDB();
    return db.delete(storeName, key);
  }

  static async clear(storeName: 'chat'): Promise<void> {
    const db = await this.getDB();
    return db.clear(storeName);
  }

  // Bonus: Type-safe method to get messages by session
  static async getBySession(sessionId: string): Promise<ChatMessage[]> {
    const db = await this.getDB();
    return db.getAllFromIndex('chat', 'by-session', sessionId);
  }
}