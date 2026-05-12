import type { AIMessage } from '../types/ai.types';

export function parseAIResponse(content: string): AIMessage {
  return {
    id: 'parsed',
    role: 'assistant',
    content,
    createdAt: Date.now(),
  };
}
