import { create } from 'zustand';

import type { ChatState, Message, MessageType } from '../UnifiedChat.types';
import { ChatApiService } from '../services/ChatApiService';
import { ChatStorageService } from '../services/ChatStorageService';

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  isMinimized: false,
  status: 'idle',
  messages: [],
  unreadCount: 0,

  open: () => set({ isOpen: true, unreadCount: 0 }),
  
  close: () => set({ isOpen: false }),
  
  minimize: () => set({ isMinimized: true }),
  
  maximize: () => set({ isMinimized: false }),
  
  sendMessage: async (content: string, type: MessageType = 'text') => {
    const { messages } = get();
    
    // Optimistic update
    const userMessage: Message = {
      id: `local-${Date.now()}`,
      content,
      role: 'user',
      type,
      timestamp: Date.now(),
      status: 'sending',
      isRead: true,
    };
    
    set({ 
      messages: [...messages, userMessage],
      status: 'sending' 
    });

    try {
      const response = await ChatApiService.sendMessage({ content });
      
      const aiMessage: Message = {
        id: response.aiMessage.id,
        role: 'assistant',
        content: response.aiMessage.content,
        timestamp: new Date(response.aiMessage.timestamp).getTime(),
        type: 'text',
        isRead: false,
        status: 'delivered',
        sessionId: response.sessionId
      };

      set((state) => {
        const updatedMessages = state.messages.map(m => 
          m.id === userMessage.id ? { ...m, status: 'delivered' as const } : m
        );
        return {
          messages: [...updatedMessages, aiMessage],
          status: 'idle'
        };
      });
      
      // Persist (placeholder for now, should use middleware or listener)
      ChatStorageService.save(get().messages);
      
    } catch {
      set((state) => ({
        status: 'error',
        messages: state.messages.map(m => 
          m.id === userMessage.id ? { ...m, status: 'failed' as const } : m
        )
      }));
    }
  },

  clearMessages: () => {
    set({ messages: [] });
    ChatStorageService.save([]);
  },

  deleteMessage: (id: string) => {
    set((state) => {
      const newMessages = state.messages.filter(m => m.id !== id);
      ChatStorageService.save(newMessages);
      return { messages: newMessages };
    });
  },

  loadHistory: async () => {
    try {
      // Try API first
      const messages = await ChatApiService.getMessages();
      set({ messages });
      ChatStorageService.save(messages);
    } catch {
      // Fallback to local storage
      const messages = await ChatStorageService.load();
      set({ messages });
    }
  },

  setTyping: (isTyping: boolean) => {
    set({ status: isTyping ? 'typing' : 'idle' });
  },

  markAsRead: () => {
    set({ unreadCount: 0 });
  }
}));
