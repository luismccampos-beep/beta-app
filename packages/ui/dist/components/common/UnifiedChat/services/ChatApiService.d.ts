import type { Message } from '../UnifiedChat.types';
interface BackendMessage {
    id: string;
    content: string;
    timestamp: string;
    isRead: boolean;
    sender: string;
    sessionId?: string;
}
interface SendMessageRequest {
    content: string;
    sessionId?: string;
}
interface BackendSendMessageResponse {
    aiMessage: BackendMessage;
    sessionId: string;
}
export declare class ChatApiService {
    private static baseUrl;
    static setBaseUrl(url: string): void;
    static getMessages(sessionId?: string): Promise<Message[]>;
    static sendMessage(payload: SendMessageRequest): Promise<BackendSendMessageResponse>;
}
export {};
