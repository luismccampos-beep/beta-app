// State management using zustand
// This file ensures the dependency is properly used in the project
import { create, useStore, createStore } from 'zustand';
import { persist } from 'zustand/middleware';
export { create, useStore, createStore };
// Helper to create a simple store
export const createSimpleStore = (initialState) => {
    return create()(() => initialState);
};
// Create a persistent store factory (saves to localStorage automatically)
export const createPersistentStore = (name, initialState) => {
    return create()(persist((set) => ({
        ...initialState,
        // Assert as Partial<PersistentStore<T>> to satisfy strict Zustand typing
        set: (partial) => set(partial),
        // Assert as Partial<PersistentStore<T>> to satisfy strict Zustand typing
        reset: () => set(initialState),
    }), {
        name,
    }));
};
//# sourceMappingURL=store.js.map