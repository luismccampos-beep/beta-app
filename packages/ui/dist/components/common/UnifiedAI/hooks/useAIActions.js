import { useContext } from 'react';
import { AIContext } from '../UnifiedAI';
const fallbackActions = {
    setMode: () => { },
    updateUserContext: () => { },
    loadSuggestions: async () => { },
    generateTrip: async () => { },
    performSearch: async () => { },
    sendMessage: async () => { },
    processCommand: async () => { },
    clearSession: () => { },
};
export function useAIActions() {
    const context = useContext(AIContext);
    return context?.actions ?? fallbackActions;
}
//# sourceMappingURL=useAIActions.js.map