import { openDB } from 'idb';
const DB_NAME = 'akmleva-shared-db';
const DB_VERSION = 1;
export class IndexedDBService {
    static async getDB() {
        if (!this.dbPromise) {
            this.dbPromise = openDB(DB_NAME, DB_VERSION, {
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
    static async put(storeName, value) {
        const db = await this.getDB();
        return db.put(storeName, value);
    }
    static async getAll(storeName) {
        const db = await this.getDB();
        return db.getAll(storeName);
    }
    static async get(storeName, key) {
        const db = await this.getDB();
        return db.get(storeName, key);
    }
    static async delete(storeName, key) {
        const db = await this.getDB();
        return db.delete(storeName, key);
    }
    static async clear(storeName) {
        const db = await this.getDB();
        return db.clear(storeName);
    }
    // Bonus: Type-safe method to get messages by session
    static async getBySession(sessionId) {
        const db = await this.getDB();
        return db.getAllFromIndex('chat', 'by-session', sessionId);
    }
}
IndexedDBService.dbPromise = null;
//# sourceMappingURL=index.js.map