// Main component
export { UnifiedChat } from './UnifiedChat';

// Types
export type {
  UnifiedChatProps,
  UnifiedChatConfig,
  ChatState,
  Message,
  ChatStatus,
  MessageType,
  ChatMessageStatus,
  ChatRole,
  ChatPosition,
  ChatTheme,
  ChatMode,
  ChatSession,
  PaginatedResponse,
  ChatHistoryRequest,
  SendMessageResponse,
  SendMessageRequest,
  LocalChatTopic,
  UIConfig,
  FeaturesConfig,
  BehaviorConfig,
  ContentConfig,
  BackendConfig,
  AIConfig,
  LocalizationConfig,
  AnalyticsConfig,
  A11yConfig,
  AdvancedConfig,
  AnalyticsEvent,
  ChatWindowProps,
  TopicsSectionProps,
  MessageListProps,
  MessageInputProps,
  ChatMessageItemProps,
  ChatBubbleProps,
  SessionUser,
  UseChatHistoryReturn,
  UseChatActionsProps,
  UseChatActionsReturn,
} from './UnifiedChat.types';

// Constants
export {
  CHAT_STORAGE_KEY,
  WELCOME_MESSAGE_ID,
  MESSAGE_GROUP_TIME_THRESHOLD,
  CHAT_TOPICS,
} from './UnifiedChat.constants';

// Schema
export { MessageSchema, UnifiedChatConfigSchema } from './UnifiedChat.types';

// Store
export { useChatStore } from './store/useChatStore';

// Services
export { ChatApiService } from './services/ChatApiService';
export { ChatStorageService } from './services/ChatStorageService';

// Hooks
export { useChatHistory } from './hooks/useChatHistory';
export { useChatActions } from './hooks/useChatActions';

// Components
export { ChatBubble } from './components/ChatBubble/ChatBubble';
export { ChatWindow } from './components/ChatWindow/ChatWindow';
export { ChatHeader } from './components/ChatHeader/ChatHeader';
export { MessageList } from './components/MessageList/MessageList';
export { MessageItem } from './components/MessageItem/MessageItem';
export { MessageInput } from './components/MessageInput/MessageInput';
export { TopicsSection } from './components/TopicsSection/TopicsSection';
export { TypingIndicator } from './components/TypingIndicator/TypingIndicator';
export { StatusIndicator } from './components/StatusIndicator/StatusIndicator';

// Utils
export {
  shouldShowAvatar,
  createSystemMessage,
} from './utils/message-formatter';
export { validateMessage } from './utils/validators';
