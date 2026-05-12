// ==========================================================================
// Safe Storage Wrapper for SSR
// ==========================================================================
import { STORAGE_KEYS } from "./constants";
/**
 * Safe localStorage wrapper that handles SSR and errors gracefully
 * @internal
 */
export const storage = {
    /**
     * Get a string value from localStorage
     */
    get: (key) => {
        if (typeof window === "undefined")
            return null;
        try {
            return localStorage.getItem(key);
        }
        catch (error) {
            console.error(`Failed to read ${key} from localStorage:`, error);
            return null;
        }
    },
    /**
     * Set a string value in localStorage
     */
    set: (key, value) => {
        if (typeof window === "undefined")
            return;
        try {
            localStorage.setItem(key, value);
        }
        catch (error) {
            console.error(`Failed to set ${key} in localStorage:`, error);
        }
    },
    /**
     * Remove a value from localStorage
     */
    remove: (key) => {
        if (typeof window === "undefined")
            return;
        try {
            localStorage.removeItem(key);
        }
        catch (error) {
            console.error(`Failed to remove ${key} from localStorage:`, error);
        }
    },
    /**
     * Get and parse a JSON value from localStorage
     */
    getJSON: (key) => {
        const value = storage.get(key);
        if (!value)
            return null;
        try {
            return JSON.parse(value);
        }
        catch (error) {
            console.error(`Failed to parse ${key} from localStorage:`, error);
            return null;
        }
    },
    /**
     * Stringify and set a JSON value in localStorage
     */
    setJSON: (key, value) => {
        try {
            storage.set(key, JSON.stringify(value));
        }
        catch (error) {
            console.error(`Failed to serialize ${key}:`, error);
        }
    },
    /**
     * Clear all localStorage
     */
    clear: () => {
        if (typeof window === "undefined")
            return;
        try {
            localStorage.clear();
        }
        catch (error) {
            console.error("Failed to clear localStorage:", error);
        }
    },
    /**
     * Clear all auth-related storage keys
     */
    clearAuth: () => {
        storage.remove(STORAGE_KEYS.TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        storage.remove(STORAGE_KEYS.USER);
        storage.remove(STORAGE_KEYS.LAST_ACTIVITY);
    },
};
// Re-export STORAGE_KEYS for convenience
export { STORAGE_KEYS } from "./constants";
/**
 * Type guard to verify if a Partial<User> is a complete User
 * @internal
 */
export const isValidUser = (user) => {
    return (typeof user.id === "string" &&
        typeof user.name === "string" &&
        typeof user.email === "string");
};
//# sourceMappingURL=storage.js.map