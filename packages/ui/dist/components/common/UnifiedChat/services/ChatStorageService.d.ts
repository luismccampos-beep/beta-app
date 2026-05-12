import type { Message } from '../UnifiedChat.types';
export declare class ChatStorageService {
    static save(messages: Message[]): Promise<void>;
    static loadSync(): Message[];
    static load(): Promise<Message[]>;
    private static convertChatMessageToMessage;
    private static parseMessages;
    static clear(): Promise<void>;
    static deleteMessage(messageId: string): Promise<void>;
}
