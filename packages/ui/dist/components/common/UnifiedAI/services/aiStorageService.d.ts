export declare function loadAIState<T>(): T | null;
export declare function saveAIState<T>(state: T): void;
export declare function getAIValue<T>(key: string): T | null;
export declare function setAIValue<T>(key: string, value: T, ttlMs?: number): void;
export declare function removeAIValue(key: string): void;
