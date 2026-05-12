import type { User } from "../types/index";
/**
 * Safe localStorage wrapper that handles SSR and errors gracefully
 * @internal
 */
export declare const storage: {
    /**
     * Get a string value from localStorage
     */
    get: (key: string) => string | null;
    /**
     * Set a string value in localStorage
     */
    set: (key: string, value: string) => void;
    /**
     * Remove a value from localStorage
     */
    remove: (key: string) => void;
    /**
     * Get and parse a JSON value from localStorage
     */
    getJSON: <T>(key: string) => T | null;
    /**
     * Stringify and set a JSON value in localStorage
     */
    setJSON: <T>(key: string, value: T) => void;
    /**
     * Clear all localStorage
     */
    clear: () => void;
    /**
     * Clear all auth-related storage keys
     */
    clearAuth: () => void;
};
export { STORAGE_KEYS } from "./constants";
/**
 * Type guard to verify if a Partial<User> is a complete User
 * @internal
 */
export declare const isValidUser: (user: Partial<User>) => user is User;
//# sourceMappingURL=storage.d.ts.map