// shared/src/types/chat.ts
import type { ApiError } from './api';

export interface MessageMetadata {
  tokens?: number;
  processingTime?: number;
  model?: string;
  confidence?: number;
}

export interface BackendMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  isRead: boolean;
  metadata?: MessageMetadata;
}

export interface BackendChatSession {
  id: string;
  userId: string;
  messages: BackendMessage[];
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
  metadata?: {
    totalMessages: number;
    totalTokens: number;
    averageResponseTime: number;
  };
}

export interface BackendSendMessageResponse {
  sessionId: string;
  userMessage: BackendMessage;
  aiMessage: BackendMessage;
}

export interface BackendApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | object;
  metadata?: {
    timestamp: string;
    requestId: string;
    pagination?: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

export interface SendMessageRequest {
  sessionId?: string;
  content: string;
  model?: string;
  temperature?: number;
  tags?: string[];
  room?: string; // Adiciona suporte a canais públicos
}

export interface SendMessageResponse {
  data: SendMessageResponse | PromiseLike<SendMessageResponse>;
  message: {
    id: string;
    sender: string;
    content: string;
    channel?: string;
    type: 'system' | 'user' | 'assistant' | 'user_system';
    timestamp: string;
    metadata?: Record<string, unknown>;
  };
  session: {
    id: string;
    title?: string;
    messages: ChatSessionMessage[];
    users: string[];
    channel: string;
    createdAt: string;
    updatedAt: string;
  };
  userId: string;
}

export interface ChatSession {
  id: string;
  title: string;
  status: 'active' | 'archived' | 'deleted' | 'new';
  createdAt: string;
  updatedAt: string;
  users: {
    id: string;
    username: string;
    avatarUrl?: string;
  }[];
  queryFilters: {
    since: string;
    limit: number;
    orderBy: 'asc' | 'desc' | 'none';
  };
  temp: number;
}

export interface ChatSessionMessage {
  id: string;
  channel?: string;
  sessionId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface ChatHistoryRequest {
  page?: number;
  pageSize?: number;
  offset?: number; // Conveniente para paginação baseada em offset
  limitReason?: string; // 'query', 'offset', 'fetch_metadata', etc.
}

// User in chat context
export interface ChatUser {
  id: string;
  username: string;
  avatarUrl?: string;
  joinTimestamp?: string;
  status: 'active' | 'away' | 'offline';
}

// Chat error types
export interface ChatError extends ApiError {
  status: 'client_error' | 'server_error' | 'authentication_error';
  source?: {
    originalError: unknown;
  };
}

// Generic chat response wrapper
export interface ChatResponse<T = unknown> {
  data: T;
  metadata?: Record<string, unknown>;
  total?: number;
  hasMore?: boolean;
  error?: ChatError | null;
}
