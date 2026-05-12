import { useContext } from 'react';
import { AIContext } from '../UnifiedAI';
const fallbackState = {
    mode: 'user',
    isOnline: true,
    userContext: {},
    suggestions: {
        items: [],
        isLoading: false,
        error: null,
    },
    tripGenerator: {
        isLoading: false,
        error: null,
    },
    search: {
        isLoading: false,
        error: null,
    },
    preferences: {
        isLoading: false,
        error: null,
    },
    admin: {
        isLoading: false,
        error: null,
    },
    chat: {
        isSending: false,
        error: null,
        messages: [],
    },
};
export function useAIState() {
    const context = useContext(AIContext);
    return context?.state ?? fallbackState;
}
//# sourceMappingURL=useAIState.js.map