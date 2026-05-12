import type { Message, ChatMessageStatus } from '../UnifiedChat.types';
import { MESSAGE_GROUP_TIME_THRESHOLD } from '../UnifiedChat.constants';

export const shouldShowAvatar = (message: Message, previousMessage?: Message): boolean => {
  if (!previousMessage) return true;
  if (previousMessage.role !== message.role) return true;

  const messageTime = new Date(message.timestamp).getTime();
  const prevTime = new Date(previousMessage.timestamp).getTime();

  return messageTime - prevTime > MESSAGE_GROUP_TIME_THRESHOLD;
};

export const createSystemMessage = (content: string, id?: string): Message => ({
  id: id || `system-${Date.now()}`,
  content,
  role: 'system',
  timestamp: Date.now(),
  isRead: true,
  status: 'delivered' as ChatMessageStatus,
  type: 'text',
});
