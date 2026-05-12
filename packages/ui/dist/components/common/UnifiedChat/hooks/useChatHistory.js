import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl'; // 1. Replaced import
import { WELCOME_MESSAGE_ID } from '../UnifiedChat.constants';
import { useChatStore } from '../store/useChatStore';
export const useChatHistory = (userId) => {
    const t = useTranslations('chat'); // 2. Updated hook with "chat" namespace
    const messages = useChatStore((state) => state.messages);
    const loadHistory = useChatStore((state) => state.loadHistory);
    // We don't have explicit loading/error state in the store exposed yet in the same way,
    // but let's assume 'status' or derive it.
    // For now, let's mock it or add it to store if needed.
    // The store has `loadHistory` which is async.
    const welcomeMessage = useMemo(() => ({
        id: WELCOME_MESSAGE_ID,
        content: t('welcome'), // 3. Simplified the t() call
        role: 'assistant',
        timestamp: Date.now(),
        isRead: true,
        status: 'delivered',
        type: 'text',
    }), [t]);
    useEffect(() => {
        loadHistory().then(() => {
            // Check for welcome message
            const currentMessages = useChatStore.getState().messages;
            const hasWelcome = currentMessages.some((msg) => msg.id === WELCOME_MESSAGE_ID);
            if (!hasWelcome && currentMessages.length === 0) {
                // We can't easily "prepend" without an action, but `sendMessage` adds to end.
                // Let's rely on the store's initial state or just let the UI handle empty state if we want strict store adherence.
                // But to keep behavior consistent:
                // Actually `useChatStore` should probably handle welcome message or initial load logic.
                // For now, let's just return what's in the store.
            }
        });
    }, [loadHistory, userId]);
    // Compatibility return to match previous interface
    // We can't return setMessages directly from store as it's not exposed, 
    // but we can expose a wrapper if needed or just empty function if we want to force store usage.
    // However, `UnifiedChat.tsx` uses it. 
    // Let's try to deprecate `useChatHistory` logic in favor of direct store usage in components,
    // but since we are refactoring *to use* the store, we can make this hook a wrapper.
    return {
        messages: messages.length === 0 ? [welcomeMessage] : messages,
        setMessages: () => { }, // No-op, state is managed by store
        isLoading: false, // Todo: Add loading state to store
        error: null,
        ...(messages.length > 0 && messages[0]?.sessionId ? { sessionId: messages[0].sessionId } : {})
    };
};
//# sourceMappingURL=useChatHistory.js.map