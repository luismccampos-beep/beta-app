import type { AIMessage } from './ai.types';

export interface AIChatSession {
  id: string;
  messages: AIMessage[];
}

export interface ChatMessageGroup {
  id: string;
  items: AIMessage[];
}
