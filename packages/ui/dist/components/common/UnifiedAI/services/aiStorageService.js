import { UNIFIED_AI_STORAGE_KEY } from '../UnifiedAI.constants';
const memoryStore = new Map();
const getStorage = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage;
    }
    return null;
};
const readItem = (key) => {
    const storage = getStorage();
    if (storage) {
        return storage.getItem(key);
    }
    return memoryStore.get(key) ?? null;
};
const writeItem = (key, value) => {
    const storage = getStorage();
    if (storage) {
        storage.setItem(key, value);
        return;
    }
    memoryStore.set(key, value);
};
const removeItem = (key) => {
    const storage = getStorage();
    if (storage) {
        storage.removeItem(key);
        return;
    }
    memoryStore.delete(key);
};
const parseJson = (raw) => {
    if (!raw)
        return null;
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
};
export function loadAIState() {
    const raw = readItem(UNIFIED_AI_STORAGE_KEY);
    const parsed = parseJson(raw);
    if (!parsed)
        return null;
    if (typeof parsed === 'object' && parsed && 'state' in parsed) {
        return parsed.state ?? null;
    }
    return parsed;
}
export function saveAIState(state) {
    writeItem(UNIFIED_AI_STORAGE_KEY, JSON.stringify({ state, savedAt: new Date().toISOString() }));
}
export function getAIValue(key) {
    const raw = readItem(key);
    const parsed = parseJson(raw);
    if (!parsed)
        return null;
    if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
        removeItem(key);
        return null;
    }
    return parsed.value;
}
export function setAIValue(key, value, ttlMs) {
    const payload = {
        value,
        ...(ttlMs ? { expiresAt: Date.now() + ttlMs } : {}),
    };
    writeItem(key, JSON.stringify(payload));
}
export function removeAIValue(key) {
    removeItem(key);
}
//# sourceMappingURL=aiStorageService.js.map