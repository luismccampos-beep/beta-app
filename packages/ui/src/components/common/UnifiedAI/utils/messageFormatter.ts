import type { AIMessage } from '../types/ai.types';

export function formatAIMessage(message: AIMessage): string {
  return message.content;
}
