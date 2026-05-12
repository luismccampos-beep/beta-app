import { http, HttpResponse } from 'msw';

// Define proper types for your API payloads
interface ChatSession {
  id: string;
  status: 'active' | 'inactive' | 'archived';
}

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  sender: 'user' | 'assistant';
  sessionId: string;
}

interface SendMessageRequest {
  content: string;
  sessionId?: string;
}

interface SendMessageResponse {
  data: {
    aiMessage: ChatMessage;
    sessionId: string;
  };
}

interface SessionsResponse {
  data: ChatSession[];
}

interface MessagesResponse {
  data: ChatMessage[];
}

export const handlers = [
  http.get('/api/chat/sessions', (): HttpResponse<SessionsResponse> => {
    return HttpResponse.json({
      data: [
        { 
          id: 'session-123', 
          status: 'active' 
        }
      ]
    });
  }),

  http.get('/api/chat/sessions/:sessionId/messages', (): HttpResponse<MessagesResponse> => {
    return HttpResponse.json({
      data: [
        {
          id: 'msg-1',
          content: 'Hello from MSW!',
          timestamp: new Date().toISOString(),
          isRead: true,
          sender: 'assistant',
          sessionId: 'session-123'
        }
      ]
    });
  }),

  http.post('/api/chat/messages', async ({ request }): Promise<HttpResponse<SendMessageResponse>> => {
    const body = await request.json() as SendMessageRequest;
    
    return HttpResponse.json({
      data: {
        aiMessage: {
          id: `ai-${Date.now()}`,
          content: `Echo: ${body.content}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          sender: 'assistant',
          sessionId: body.sessionId || 'session-123'
        },
        sessionId: body.sessionId || 'session-123'
      }
    });
  })
];