import { CHAT_STORAGE_KEY } from '../UnifiedChat.constants';
import { IndexedDBService } from '../../../../lib/db';
export class ChatStorageService {
    static async save(messages) {
        if (messages.length === 0)
            return;
        try {
            if (typeof window === 'undefined')
                return;
            // Save to localStorage as backup
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
            // Save to IndexedDB (convert Message to ChatMessage format)
            const chatMessages = messages.map(msg => {
                const chatMessage = {
                    id: msg.id,
                    content: msg.content,
                    role: msg.role,
                    timestamp: msg.timestamp,
                    sessionId: msg.sessionId || '', // Ensure sessionId is always a string
                };
                // Only add metadata if it exists and has content
                if (msg.metadata || msg.type !== 'text' || msg.attachments) {
                    chatMessage.metadata = {
                        type: msg.type,
                        attachments: msg.attachments,
                        ...msg.metadata,
                    };
                }
                return chatMessage;
            });
            await Promise.all(chatMessages.map(msg => IndexedDBService.put('chat', msg)));
        }
        catch (error) {
            console.error('Failed to save chat history:', error);
        }
    }
    static loadSync() {
        try {
            if (typeof window === 'undefined')
                return [];
            const storedHistory = localStorage.getItem(CHAT_STORAGE_KEY);
            if (!storedHistory)
                return [];
            const parsed = JSON.parse(storedHistory);
            return this.parseMessages(parsed);
        }
        catch (error) {
            console.error('Failed to load chat history (sync):', error);
            return [];
        }
    }
    static async load() {
        try {
            if (typeof window === 'undefined')
                return [];
            // Try IndexedDB first
            try {
                const chatMessages = await IndexedDBService.getAll('chat');
                if (chatMessages && chatMessages.length > 0) {
                    // Convert ChatMessage back to Message format
                    const messages = chatMessages
                        .map(this.convertChatMessageToMessage)
                        .filter((msg) => msg !== null)
                        .sort((a, b) => a.timestamp - b.timestamp);
                    if (messages.length > 0) {
                        return messages;
                    }
                }
            }
            catch (e) {
                console.warn('IndexedDB load failed, falling back to localStorage', e);
            }
            // Fallback to localStorage
            return this.loadSync();
        }
        catch (error) {
            console.error('Failed to load chat history:', error);
            return [];
        }
    }
    static convertChatMessageToMessage(chatMsg) {
        try {
            const metadata = chatMsg.metadata;
            const message = {
                id: chatMsg.id,
                content: chatMsg.content,
                role: chatMsg.role,
                timestamp: chatMsg.timestamp,
                type: metadata?.type || 'text',
            };
            // Add optional properties only if they exist
            if (chatMsg.sessionId) {
                message.sessionId = chatMsg.sessionId;
            }
            if (metadata) {
                const messageMetadata = {};
                if (typeof metadata.tokens === 'number') {
                    messageMetadata.tokens = metadata.tokens;
                }
                if (typeof metadata.model === 'string') {
                    messageMetadata.model = metadata.model;
                }
                if (typeof metadata.cost === 'number') {
                    messageMetadata.cost = metadata.cost;
                }
                if (typeof metadata.confidence === 'number') {
                    messageMetadata.confidence = metadata.confidence;
                }
                if (Object.keys(messageMetadata).length > 0) {
                    message.metadata = messageMetadata;
                }
            }
            if (Array.isArray(metadata?.attachments)) {
                message.attachments = metadata.attachments;
            }
            return message;
        }
        catch (error) {
            console.error('Failed to convert ChatMessage to Message:', error);
            return null;
        }
    }
    static parseMessages(parsed) {
        if (!Array.isArray(parsed))
            return [];
        const mapStoredMessage = (data) => {
            if (!data || typeof data !== 'object')
                return null;
            const msg = data;
            const id = typeof msg.id === 'string' ? msg.id : null;
            const content = typeof msg.content === 'string' ? msg.content : null;
            if (!id || !content)
                return null;
            // Migration: sender -> role
            let role = msg.role;
            if (!role && msg.sender) {
                role = msg.sender;
            }
            if (!['user', 'assistant', 'system'].includes(role || '')) {
                role = 'user'; // Default fallback
            }
            // Migration: timestamp -> number
            let timestamp;
            if (typeof msg.timestamp === 'number') {
                timestamp = msg.timestamp;
            }
            else if (typeof msg.timestamp === 'string') {
                timestamp = new Date(msg.timestamp).getTime();
            }
            else {
                timestamp = Date.now();
            }
            if (isNaN(timestamp) || timestamp === 0) {
                timestamp = Date.now();
            }
            // Construct the message with proper types
            const message = {
                id,
                content,
                role: role,
                timestamp,
                type: msg.type || 'text',
            };
            // Add optional properties only if they exist
            if (typeof msg.sessionId === 'string') {
                message.sessionId = msg.sessionId;
            }
            if (msg.metadata && typeof msg.metadata === 'object') {
                message.metadata = msg.metadata;
            }
            if (Array.isArray(msg.attachments)) {
                message.attachments = msg.attachments;
            }
            return message;
        };
        return parsed
            .map(mapStoredMessage)
            .filter((msg) => msg !== null);
    }
    static async clear() {
        try {
            if (typeof window === 'undefined')
                return;
            // Clear localStorage
            localStorage.removeItem(CHAT_STORAGE_KEY);
            // Clear IndexedDB
            await IndexedDBService.clear('chat');
        }
        catch (error) {
            console.error('Failed to clear chat history:', error);
        }
    }
    static async deleteMessage(messageId) {
        try {
            if (typeof window === 'undefined')
                return;
            // Delete from IndexedDB
            await IndexedDBService.delete('chat', messageId);
            // Update localStorage
            const messages = this.loadSync();
            const updatedMessages = messages.filter(msg => msg.id !== messageId);
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updatedMessages));
        }
        catch (error) {
            console.error('Failed to delete message:', error);
        }
    }
}
//# sourceMappingURL=ChatStorageService.js.map