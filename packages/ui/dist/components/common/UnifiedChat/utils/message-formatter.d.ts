import type { Message } from '../UnifiedChat.types';
export declare const shouldShowAvatar: (message: Message, previousMessage?: Message) => boolean;
export declare const createSystemMessage: (content: string, id?: string) => Message;
