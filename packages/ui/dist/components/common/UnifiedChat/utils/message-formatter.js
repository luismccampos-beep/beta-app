import { MESSAGE_GROUP_TIME_THRESHOLD } from '../UnifiedChat.constants';
export const shouldShowAvatar = (message, previousMessage) => {
    if (!previousMessage)
        return true;
    if (previousMessage.role !== message.role)
        return true;
    const messageTime = new Date(message.timestamp).getTime();
    const prevTime = new Date(previousMessage.timestamp).getTime();
    return messageTime - prevTime > MESSAGE_GROUP_TIME_THRESHOLD;
};
export const createSystemMessage = (content, id) => ({
    id: id || `system-${Date.now()}`,
    content,
    role: 'system',
    timestamp: Date.now(),
    isRead: true,
    status: 'delivered',
    type: 'text',
});
//# sourceMappingURL=message-formatter.js.map