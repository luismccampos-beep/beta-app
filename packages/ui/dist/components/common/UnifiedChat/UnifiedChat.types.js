import { z } from 'zod';
// ===== Message Schema =====
export const MessageSchema = z.object({
    id: z.string(),
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    type: z.enum(['text', 'image', 'file', 'code', 'markdown']).default('text'),
    timestamp: z.number(),
    metadata: z.object({
        tokens: z.number().optional(),
        model: z.string().optional(),
        cost: z.number().optional(),
        confidence: z.number().optional(),
    }).optional(),
    attachments: z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        size: z.number(),
        url: z.string(),
    })).optional(),
    // Extended properties for UI state (keeping compatibility with existing features)
    status: z.enum(['sending', 'delivered', 'read', 'failed']).optional(),
    isRead: z.boolean().optional(),
    sessionId: z.string().optional(),
});
// ===== UI Config Schema =====
const UIConfigSchema = z.object({
    position: z.enum(['bottom-right', 'bottom-left', 'top-right', 'top-left']).default('bottom-right'),
    theme: z.enum(['default', 'minimal', 'compact', 'full']).default('default'),
    primaryColor: z.string().default('#007bff'),
    accentColor: z.string().default('#28a745'),
    borderRadius: z.number().min(0).max(24).default(12),
    showAvatar: z.boolean().default(true),
    showTimestamp: z.boolean().default(true),
    showStatus: z.boolean().default(true),
    compactMode: z.boolean().default(false),
    darkMode: z.enum(['auto', 'light', 'dark']).default('auto'),
});
// ===== Features Config Schema =====
const FeaturesConfigSchema = z.object({
    topics: z.boolean().default(true),
    quickReplies: z.boolean().default(true),
    fileUpload: z.boolean().default(false),
    voiceInput: z.boolean().default(false),
    codeHighlight: z.boolean().default(true),
    markdown: z.boolean().default(true),
    typingIndicator: z.boolean().default(true),
    readReceipts: z.boolean().default(false),
    messagePersistence: z.boolean().default(true),
    exportChat: z.boolean().default(true),
    searchMessages: z.boolean().default(false),
});
// ===== Behavior Config Schema =====
const BehaviorConfigSchema = z.object({
    autoOpen: z.boolean().default(false),
    autoFocus: z.boolean().default(true),
    closeOnEscape: z.boolean().default(true),
    minimizable: z.boolean().default(true),
    draggable: z.boolean().default(false),
    soundEnabled: z.boolean().default(false),
    notificationsEnabled: z.boolean().default(true),
    maxMessages: z.number().min(10).max(1000).default(100),
    messageRetention: z.number().min(1).max(365).default(30), // dias
});
// ===== Error Messages Schema =====
const ErrorMessagesSchema = z.object({
    network: z.string().default('Erro de conexão. Tente novamente.'),
    server: z.string().default('Erro no servidor. Tente mais tarde.'),
    validation: z.string().default('Mensagem inválida.'),
});
// ===== Topic Schema =====
const TopicSchema = z.object({
    id: z.string(),
    label: z.string(),
    icon: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
});
// ===== Content Config Schema =====
const ContentConfigSchema = z.object({
    welcomeMessage: z.string().default('Olá! Como posso ajudar?'),
    placeholderText: z.string().default('Digite sua mensagem...'),
    quickReplies: z.array(z.string()).default([]),
    topics: z.array(TopicSchema).default([]),
    errorMessages: ErrorMessagesSchema.optional(),
}).transform((data) => ({
    ...data,
    errorMessages: data.errorMessages ?? ErrorMessagesSchema.parse({}),
}));
// ===== Backend Config Schema =====
const BackendConfigSchema = z.object({
    enabled: z.boolean().default(true),
    apiEndpoint: z.string().url().optional(),
    wsEndpoint: z.string().url().optional(),
    apiKey: z.string().optional(),
    headers: z.record(z.string(), z.string()).optional(),
    timeout: z.number().min(1000).max(60000).default(30000),
    retryAttempts: z.number().min(0).max(5).default(3),
    retryDelay: z.number().min(100).max(5000).default(1000),
});
// ===== AI Config Schema =====
const AIConfigSchema = z.object({
    enabled: z.boolean().default(true),
    provider: z.enum(['openai', 'anthropic', 'custom']).default('openai'),
    model: z.string().default('gpt-4'),
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().min(1).max(32000).default(2000),
    systemPrompt: z.string().optional(),
    contextWindow: z.number().min(1).max(20).default(10),
    streaming: z.boolean().default(true),
});
// ===== Localization Config Schema =====
const LocalizationConfigSchema = z.object({
    locale: z.string().default('pt-BR'),
    customTranslations: z.record(z.string(), z.string()).optional(),
    dateFormat: z.string().default('dd/MM/yyyy HH:mm'),
});
// ===== Analytics Events =====
const AnalyticsEventSchema = z.enum([
    'chat_open',
    'chat_close',
    'message_sent',
    'message_received',
    'topic_selected',
    'file_uploaded',
    'error_occurred',
]);
// ===== Analytics Config Schema =====
const AnalyticsConfigSchema = z.object({
    enabled: z.boolean().default(false),
    provider: z.enum(['google', 'mixpanel', 'custom', 'none']).default('none'),
    trackEvents: z.array(AnalyticsEventSchema).default([]),
    customHandler: z.function().optional(),
});
// ===== Accessibility Config Schema =====
const A11yConfigSchema = z.object({
    ariaLabel: z.string().default('Chat de suporte'),
    announceMessages: z.boolean().default(true),
    keyboardNavigation: z.boolean().default(true),
    highContrastMode: z.boolean().default(false),
});
// ===== Advanced Config Schema =====
const AdvancedConfigSchema = z.object({
    debug: z.boolean().default(false),
    logLevel: z.enum(['none', 'error', 'warn', 'info', 'debug']).default('error'),
    customRenderers: z.record(z.string(), z.function()).optional(),
    middleware: z.array(z.function()).default([]),
    onMessageSent: z.function().optional(),
    onMessageReceived: z.function().optional(),
    onError: z.function().optional(),
    onStateChange: z.function().optional(),
});
// ===== Main Configuration Schema =====
export const UnifiedChatConfigSchema = z.object({
    // ===== Core Settings =====
    mode: z.enum(['support', 'ai', 'hybrid']).default('ai'),
    enabled: z.boolean().default(true),
    // ===== Nested Configs =====
    ui: UIConfigSchema.optional(),
    features: FeaturesConfigSchema.optional(),
    behavior: BehaviorConfigSchema.optional(),
    content: ContentConfigSchema.optional(),
    backend: BackendConfigSchema.optional(),
    ai: AIConfigSchema.optional(),
    localization: LocalizationConfigSchema.optional(),
    analytics: AnalyticsConfigSchema.optional(),
    a11y: A11yConfigSchema.optional(),
    advanced: AdvancedConfigSchema.optional(),
}).transform((data) => ({
    mode: data.mode,
    enabled: data.enabled,
    ui: data.ui ?? UIConfigSchema.parse({}),
    features: data.features ?? FeaturesConfigSchema.parse({}),
    behavior: data.behavior ?? BehaviorConfigSchema.parse({}),
    content: data.content ?? ContentConfigSchema.parse({}),
    backend: data.backend ?? BackendConfigSchema.parse({}),
    ai: data.ai ?? AIConfigSchema.parse({}),
    localization: data.localization ?? LocalizationConfigSchema.parse({}),
    analytics: data.analytics ?? AnalyticsConfigSchema.parse({}),
    a11y: data.a11y ?? A11yConfigSchema.parse({}),
    advanced: data.advanced ?? AdvancedConfigSchema.parse({}),
}));
//# sourceMappingURL=UnifiedChat.types.js.map