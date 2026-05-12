// State management using zustand
// This file ensures the dependency is properly used in the project

import { create, useStore, createStore } from 'zustand';
import { persist } from 'zustand/middleware';

export { create, useStore, createStore };

// Helper to create a store with TypeScript
export interface StoreConfig<T> {
  name?: string;
  defaultState?: Partial<T>;
}

// Helper to create a simple store
export const createSimpleStore = <T extends Record<string, unknown>>(
  initialState: T
) => {
  return create<T>()(() => initialState);
};

// Example store factory pattern
export interface StoreFactory<T> {
  (initialState: Partial<T>): ReturnType<typeof create<T>>;
}

// Define the type for the persistent store to include actions
export type PersistentStore<T> = T & {
  set: (partial: Partial<T>) => void;
  reset: () => void;
};

// Create a persistent store factory (saves to localStorage automatically)
export const createPersistentStore = <T extends Record<string, unknown>>(
  name: string,
  initialState: T
) => {
  return create<PersistentStore<T>>()(
    persist(
      (set) => ({
        ...initialState,
        // Assert as Partial<PersistentStore<T>> to satisfy strict Zustand typing
        set: (partial) => set(partial as Partial<PersistentStore<T>>),
        // Assert as Partial<PersistentStore<T>> to satisfy strict Zustand typing
        reset: () => set(initialState as unknown as Partial<PersistentStore<T>>),
      }),
      {
        name,
      }
    )
  );
};