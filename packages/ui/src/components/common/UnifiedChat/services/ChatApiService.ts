import type { Message } from '../UnifiedChat.types';

interface BackendApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface BackendMessage {
  id: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  sender: string;
  sessionId?: string;
}

interface BackendChatSession {
  id: string;
  status: string;
}

interface SendMessageRequest {
  content: string;
  sessionId?: string;
}

interface BackendSendMessageResponse {
  aiMessage: BackendMessage;
  sessionId: string;
}

export class ChatApiService {
  private static baseUrl: string = '/api';

  static setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  static async getMessages(sessionId?: string): Promise<Message[]> {
    try {
      let targetSessionId = sessionId;

      if (!targetSessionId) {
        const sessionsResponse = await fetch(`${this.baseUrl}/chat/sessions`);
        if (!sessionsResponse.ok) throw new Error('Failed to fetch sessions');
        
        const sessionsData: BackendApiResponse<BackendChatSession[]> = await sessionsResponse.json();
        if (sessionsData.data && sessionsData.data.length > 0) {
          const firstSession = sessionsData.data[0];
          if (firstSession) {
            targetSessionId = firstSession.id;
          }
        }
      }

      if (!targetSessionId) return [];

      const response = await fetch(`${this.baseUrl}/chat/sessions/${targetSessionId}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');

      const data: BackendApiResponse<BackendMessage[]> = await response.json();
      
      if (Array.isArray(data.data)) {
        return data.data.map((msg: BackendMessage) => ({
          id: msg.id,
          content: msg.content,
          timestamp: new Date(msg.timestamp).getTime(),
          isRead: msg.isRead,
          role: msg.sender as 'user' | 'assistant' | 'system',
          sessionId: targetSessionId,
          status: 'delivered',
          type: 'text',
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  static async sendMessage(payload: SendMessageRequest): Promise<BackendSendMessageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data: BackendApiResponse<BackendSendMessageResponse> = await response.json();
      if (data.data) {
        return data.data;
      }
      throw new Error('No data in response');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
