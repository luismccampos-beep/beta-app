import { UNIFIED_AI_STORAGE_KEY } from '../UnifiedAI.constants';

type StoredValue<T> = {
  value: T;
  expiresAt?: number;
};

const memoryStore = new Map<string, string>();

const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

const readItem = (key: string): string | null => {
  const storage = getStorage();
  if (storage) {
    return storage.getItem(key);
  }
  return memoryStore.get(key) ?? null;
};

const writeItem = (key: string, value: string): void => {
  const storage = getStorage();
  if (storage) {
    storage.setItem(key, value);
    return;
  }
  memoryStore.set(key, value);
};

const removeItem = (key: string): void => {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(key);
    return;
  }
  memoryStore.delete(key);
};

const parseJson = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export function loadAIState<T>(): T | null {
  const raw = readItem(UNIFIED_AI_STORAGE_KEY);
  const parsed = parseJson<{ state?: T } | T>(raw);
  if (!parsed) return null;
  if (typeof parsed === 'object' && parsed && 'state' in parsed) {
    return (parsed as { state?: T }).state ?? null;
  }
  return parsed as T;
}

export function saveAIState<T>(state: T): void {
  writeItem(UNIFIED_AI_STORAGE_KEY, JSON.stringify({ state, savedAt: new Date().toISOString() }));
}

export function getAIValue<T>(key: string): T | null {
  const raw = readItem(key);
  const parsed = parseJson<StoredValue<T>>(raw);
  if (!parsed) return null;
  if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
    removeItem(key);
    return null;
  }
  return parsed.value;
}

export function setAIValue<T>(key: string, value: T, ttlMs?: number): void {
  const payload: StoredValue<T> = {
    value,
    ...(ttlMs ? { expiresAt: Date.now() + ttlMs } : {}),
  };
  writeItem(key, JSON.stringify(payload));
}

export function removeAIValue(key: string): void {
  removeItem(key);
}
