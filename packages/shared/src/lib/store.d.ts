import { create, useStore, createStore } from 'zustand';
export { create, useStore, createStore };
export interface StoreConfig<T> {
    name?: string;
    defaultState?: Partial<T>;
}
export declare const createSimpleStore: <T extends Record<string, unknown>>(initialState: T) => import("zustand").UseBoundStore<import("zustand").StoreApi<T>>;
export interface StoreFactory<T> {
    (initialState: Partial<T>): ReturnType<typeof create<T>>;
}
export type PersistentStore<T> = T & {
    set: (partial: Partial<T>) => void;
    reset: () => void;
};
export declare const createPersistentStore: <T extends Record<string, unknown>>(name: string, initialState: T) => import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<PersistentStore<T>>, "setState" | "persist"> & {
    setState(partial: PersistentStore<T> | Partial<PersistentStore<T>> | ((state: PersistentStore<T>) => PersistentStore<T> | Partial<PersistentStore<T>>), replace?: false | undefined): unknown;
    setState(state: PersistentStore<T> | ((state: PersistentStore<T>) => PersistentStore<T>), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<PersistentStore<T>, PersistentStore<T>, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: PersistentStore<T>) => void) => () => void;
        onFinishHydration: (fn: (state: PersistentStore<T>) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<PersistentStore<T>, PersistentStore<T>, unknown>>;
    };
}>;
