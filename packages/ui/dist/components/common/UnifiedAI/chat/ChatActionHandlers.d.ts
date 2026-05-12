export interface ChatActionHandlers {
    onSend: (content: string) => Promise<void>;
}
export declare function createChatActionHandlers(onSend?: (content: string) => Promise<void>): ChatActionHandlers;
