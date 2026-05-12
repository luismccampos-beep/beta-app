export function createChatActionHandlers(onSend) {
    return {
        onSend: async (content) => {
            if (!content.trim())
                return;
            if (onSend) {
                await onSend(content);
            }
        },
    };
}
//# sourceMappingURL=ChatActionHandlers.js.map