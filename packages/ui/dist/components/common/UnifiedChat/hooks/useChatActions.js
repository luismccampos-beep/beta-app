import { useChatStore } from '../store/useChatStore';
export const useChatActions = ({ sessionId: _sessionId, }) => {
    const sendMessage = useChatStore((state) => state.sendMessage);
    const status = useChatStore((state) => state.status);
    // We can ignore `messages` and `setMessages` from props as we use the store now.
    // `sessionId` might be used for context, but the store handles it internally mostly.
    // If we need to pass sessionId to sendMessage, we might need to update the store action.
    return {
        isSending: status === 'sending',
        handleSendMessage: async (content) => {
            await sendMessage(content);
        }
    };
};
//# sourceMappingURL=useChatActions.js.map