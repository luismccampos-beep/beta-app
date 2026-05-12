export interface ChatActionHandlers {
  onSend: (content: string) => Promise<void>;
}

export function createChatActionHandlers(onSend?: (content: string) => Promise<void>): ChatActionHandlers {
  return {
    onSend: async (content: string) => {
      if (!content.trim()) return;
      if (onSend) {
        await onSend(content);
      }
    },
  };
}
