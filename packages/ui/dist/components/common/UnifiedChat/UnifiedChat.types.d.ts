import type { ReactNode, CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import { z } from 'zod';
export type ChatRole = 'user' | 'assistant' | 'system';
export type ChatStatus = 'idle' | 'typing' | 'sending' | 'error';
export type MessageType = 'text' | 'image' | 'file' | 'code' | 'markdown';
export type ChatPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type ChatTheme = 'default' | 'minimal' | 'compact' | 'full';
export type ChatMode = 'support' | 'ai' | 'hybrid';
export type ChatMessageStatus = 'sending' | 'delivered' | 'read' | 'failed';
export interface LocalChatTopic {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
}
export interface ChatSession {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    title?: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export interface ChatHistoryRequest {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}
export interface SendMessageResponse {
    aiMessage: Message;
    sessionId: string;
}
export interface SendMessageRequest {
    content: string;
    sessionId?: string;
}
export declare const MessageSchema: z.ZodObject<{
    id: z.ZodString;
    role: z.ZodEnum<["user", "assistant", "system"]>;
    content: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["text", "image", "file", "code", "markdown"]>>;
    timestamp: z.ZodNumber;
    metadata: z.ZodOptional<z.ZodObject<{
        tokens: z.ZodOptional<z.ZodNumber>;
        model: z.ZodOptional<z.ZodString>;
        cost: z.ZodOptional<z.ZodNumber>;
        confidence: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        tokens?: number | undefined;
        model?: string | undefined;
        cost?: number | undefined;
        confidence?: number | undefined;
    }, {
        tokens?: number | undefined;
        model?: string | undefined;
        cost?: number | undefined;
        confidence?: number | undefined;
    }>>;
    attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodString;
        size: z.ZodNumber;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        url: string;
        name: string;
        type: string;
        size: number;
    }, {
        id: string;
        url: string;
        name: string;
        type: string;
        size: number;
    }>, "many">>;
    status: z.ZodOptional<z.ZodEnum<["sending", "delivered", "read", "failed"]>>;
    isRead: z.ZodOptional<z.ZodBoolean>;
    sessionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: "user" | "system" | "assistant";
    content: string;
    type: "code" | "image" | "text" | "file" | "markdown";
    timestamp: number;
    metadata?: {
        tokens?: number | undefined;
        model?: string | undefined;
        cost?: number | undefined;
        confidence?: number | undefined;
    } | undefined;
    status?: "sending" | "delivered" | "read" | "failed" | undefined;
    attachments?: {
        id: string;
        url: string;
        name: string;
        type: string;
        size: number;
    }[] | undefined;
    isRead?: boolean | undefined;
    sessionId?: string | undefined;
}, {
    id: string;
    role: "user" | "system" | "assistant";
    content: string;
    timestamp: number;
    metadata?: {
        tokens?: number | undefined;
        model?: string | undefined;
        cost?: number | undefined;
        confidence?: number | undefined;
    } | undefined;
    status?: "sending" | "delivered" | "read" | "failed" | undefined;
    type?: "code" | "image" | "text" | "file" | "markdown" | undefined;
    attachments?: {
        id: string;
        url: string;
        name: string;
        type: string;
        size: number;
    }[] | undefined;
    isRead?: boolean | undefined;
    sessionId?: string | undefined;
}>;
export type Message = z.infer<typeof MessageSchema>;
declare const UIConfigSchema: z.ZodObject<{
    position: z.ZodDefault<z.ZodEnum<["bottom-right", "bottom-left", "top-right", "top-left"]>>;
    theme: z.ZodDefault<z.ZodEnum<["default", "minimal", "compact", "full"]>>;
    primaryColor: z.ZodDefault<z.ZodString>;
    accentColor: z.ZodDefault<z.ZodString>;
    borderRadius: z.ZodDefault<z.ZodNumber>;
    showAvatar: z.ZodDefault<z.ZodBoolean>;
    showTimestamp: z.ZodDefault<z.ZodBoolean>;
    showStatus: z.ZodDefault<z.ZodBoolean>;
    compactMode: z.ZodDefault<z.ZodBoolean>;
    darkMode: z.ZodDefault<z.ZodEnum<["auto", "light", "dark"]>>;
}, "strip", z.ZodTypeAny, {
    accentColor: string;
    position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    borderRadius: number;
    theme: "default" | "full" | "compact" | "minimal";
    primaryColor: string;
    showAvatar: boolean;
    showTimestamp: boolean;
    showStatus: boolean;
    compactMode: boolean;
    darkMode: "auto" | "dark" | "light";
}, {
    accentColor?: string | undefined;
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | undefined;
    borderRadius?: number | undefined;
    theme?: "default" | "full" | "compact" | "minimal" | undefined;
    primaryColor?: string | undefined;
    showAvatar?: boolean | undefined;
    showTimestamp?: boolean | undefined;
    showStatus?: boolean | undefined;
    compactMode?: boolean | undefined;
    darkMode?: "auto" | "dark" | "light" | undefined;
}>;
declare const FeaturesConfigSchema: z.ZodObject<{
    topics: z.ZodDefault<z.ZodBoolean>;
    quickReplies: z.ZodDefault<z.ZodBoolean>;
    fileUpload: z.ZodDefault<z.ZodBoolean>;
    voiceInput: z.ZodDefault<z.ZodBoolean>;
    codeHighlight: z.ZodDefault<z.ZodBoolean>;
    markdown: z.ZodDefault<z.ZodBoolean>;
    typingIndicator: z.ZodDefault<z.ZodBoolean>;
    readReceipts: z.ZodDefault<z.ZodBoolean>;
    messagePersistence: z.ZodDefault<z.ZodBoolean>;
    exportChat: z.ZodDefault<z.ZodBoolean>;
    searchMessages: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    markdown: boolean;
    topics: boolean;
    quickReplies: boolean;
    fileUpload: boolean;
    voiceInput: boolean;
    codeHighlight: boolean;
    typingIndicator: boolean;
    readReceipts: boolean;
    messagePersistence: boolean;
    exportChat: boolean;
    searchMessages: boolean;
}, {
    markdown?: boolean | undefined;
    topics?: boolean | undefined;
    quickReplies?: boolean | undefined;
    fileUpload?: boolean | undefined;
    voiceInput?: boolean | undefined;
    codeHighlight?: boolean | undefined;
    typingIndicator?: boolean | undefined;
    readReceipts?: boolean | undefined;
    messagePersistence?: boolean | undefined;
    exportChat?: boolean | undefined;
    searchMessages?: boolean | undefined;
}>;
declare const BehaviorConfigSchema: z.ZodObject<{
    autoOpen: z.ZodDefault<z.ZodBoolean>;
    autoFocus: z.ZodDefault<z.ZodBoolean>;
    closeOnEscape: z.ZodDefault<z.ZodBoolean>;
    minimizable: z.ZodDefault<z.ZodBoolean>;
    draggable: z.ZodDefault<z.ZodBoolean>;
    soundEnabled: z.ZodDefault<z.ZodBoolean>;
    notificationsEnabled: z.ZodDefault<z.ZodBoolean>;
    maxMessages: z.ZodDefault<z.ZodNumber>;
    messageRetention: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    autoFocus: boolean;
    draggable: boolean;
    autoOpen: boolean;
    closeOnEscape: boolean;
    minimizable: boolean;
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    maxMessages: number;
    messageRetention: number;
}, {
    autoFocus?: boolean | undefined;
    draggable?: boolean | undefined;
    autoOpen?: boolean | undefined;
    closeOnEscape?: boolean | undefined;
    minimizable?: boolean | undefined;
    soundEnabled?: boolean | undefined;
    notificationsEnabled?: boolean | undefined;
    maxMessages?: number | undefined;
    messageRetention?: number | undefined;
}>;
declare const TopicSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    keywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    label: string;
    id: string;
    icon?: string | undefined;
    keywords?: string[] | undefined;
    description?: string | undefined;
}, {
    label: string;
    id: string;
    icon?: string | undefined;
    keywords?: string[] | undefined;
    description?: string | undefined;
}>;
export type ConfigTopic = z.infer<typeof TopicSchema>;
declare const ContentConfigSchema: z.ZodEffects<z.ZodObject<{
    welcomeMessage: z.ZodDefault<z.ZodString>;
    placeholderText: z.ZodDefault<z.ZodString>;
    quickReplies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    topics: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        icon: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        keywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        label: string;
        id: string;
        icon?: string | undefined;
        keywords?: string[] | undefined;
        description?: string | undefined;
    }, {
        label: string;
        id: string;
        icon?: string | undefined;
        keywords?: string[] | undefined;
        description?: string | undefined;
    }>, "many">>;
    errorMessages: z.ZodOptional<z.ZodObject<{
        network: z.ZodDefault<z.ZodString>;
        server: z.ZodDefault<z.ZodString>;
        validation: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        validation: string;
        network: string;
        server: string;
    }, {
        validation?: string | undefined;
        network?: string | undefined;
        server?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    topics: {
        label: string;
        id: string;
        icon?: string | undefined;
        keywords?: string[] | undefined;
        description?: string | undefined;
    }[];
    quickReplies: string[];
    welcomeMessage: string;
    placeholderText: string;
    errorMessages?: {
        validation: string;
        network: string;
        server: string;
    } | undefined;
}, {
    topics?: {
        label: string;
        id: string;
        icon?: string | undefined;
        keywords?: string[] | undefined;
        description?: string | undefined;
    }[] | undefined;
    quickReplies?: string[] | undefined;
    welcomeMessage?: string | undefined;
    placeholderText?: string | undefined;
    errorMessages?: {
        validation?: string | undefined;
        network?: string | undefined;
        server?: string | undefined;
    } | undefined;
}>, {
    errorMessages: {
        validation: string;
        network: string;
        server: string;
    };
    topics: {
        label: string;
        id: string;
        icon?: string | undefined;
        keywords?: string[] | undefined;
        description?: string | undefined;
    }[];
    quickReplies: string[];
    welcomeMessage: string;
    placeholderText: string;
}, {
    topics?: {
        label: string;
        id: string;
        icon?: string | undefined;
        keywords?: string[] | undefined;
        description?: string | undefined;
    }[] | undefined;
    quickReplies?: string[] | undefined;
    welcomeMessage?: string | undefined;
    placeholderText?: string | undefined;
    errorMessages?: {
        validation?: string | undefined;
        network?: string | undefined;
        server?: string | undefined;
    } | undefined;
}>;
declare const BackendConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    apiEndpoint: z.ZodOptional<z.ZodString>;
    wsEndpoint: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    timeout: z.ZodDefault<z.ZodNumber>;
    retryAttempts: z.ZodDefault<z.ZodNumber>;
    retryDelay: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
    headers?: Record<string, string> | undefined;
    apiEndpoint?: string | undefined;
    wsEndpoint?: string | undefined;
    apiKey?: string | undefined;
}, {
    enabled?: boolean | undefined;
    headers?: Record<string, string> | undefined;
    apiEndpoint?: string | undefined;
    wsEndpoint?: string | undefined;
    apiKey?: string | undefined;
    timeout?: number | undefined;
    retryAttempts?: number | undefined;
    retryDelay?: number | undefined;
}>;
declare const AIConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    provider: z.ZodDefault<z.ZodEnum<["openai", "anthropic", "custom"]>>;
    model: z.ZodDefault<z.ZodString>;
    temperature: z.ZodDefault<z.ZodNumber>;
    maxTokens: z.ZodDefault<z.ZodNumber>;
    systemPrompt: z.ZodOptional<z.ZodString>;
    contextWindow: z.ZodDefault<z.ZodNumber>;
    streaming: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    model: string;
    provider: "custom" | "openai" | "anthropic";
    temperature: number;
    maxTokens: number;
    contextWindow: number;
    streaming: boolean;
    systemPrompt?: string | undefined;
}, {
    enabled?: boolean | undefined;
    model?: string | undefined;
    provider?: "custom" | "openai" | "anthropic" | undefined;
    temperature?: number | undefined;
    maxTokens?: number | undefined;
    systemPrompt?: string | undefined;
    contextWindow?: number | undefined;
    streaming?: boolean | undefined;
}>;
declare const LocalizationConfigSchema: z.ZodObject<{
    locale: z.ZodDefault<z.ZodString>;
    customTranslations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    dateFormat: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    locale: string;
    dateFormat: string;
    customTranslations?: Record<string, string> | undefined;
}, {
    locale?: string | undefined;
    customTranslations?: Record<string, string> | undefined;
    dateFormat?: string | undefined;
}>;
declare const AnalyticsEventSchema: z.ZodEnum<["chat_open", "chat_close", "message_sent", "message_received", "topic_selected", "file_uploaded", "error_occurred"]>;
declare const AnalyticsConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    provider: z.ZodDefault<z.ZodEnum<["google", "mixpanel", "custom", "none"]>>;
    trackEvents: z.ZodDefault<z.ZodArray<z.ZodEnum<["chat_open", "chat_close", "message_sent", "message_received", "topic_selected", "file_uploaded", "error_occurred"]>, "many">>;
    customHandler: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    provider: "none" | "custom" | "google" | "mixpanel";
    trackEvents: ("chat_open" | "chat_close" | "message_sent" | "message_received" | "topic_selected" | "file_uploaded" | "error_occurred")[];
    customHandler?: ((...args: unknown[]) => unknown) | undefined;
}, {
    enabled?: boolean | undefined;
    provider?: "none" | "custom" | "google" | "mixpanel" | undefined;
    trackEvents?: ("chat_open" | "chat_close" | "message_sent" | "message_received" | "topic_selected" | "file_uploaded" | "error_occurred")[] | undefined;
    customHandler?: ((...args: unknown[]) => unknown) | undefined;
}>;
declare const A11yConfigSchema: z.ZodObject<{
    ariaLabel: z.ZodDefault<z.ZodString>;
    announceMessages: z.ZodDefault<z.ZodBoolean>;
    keyboardNavigation: z.ZodDefault<z.ZodBoolean>;
    highContrastMode: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    ariaLabel: string;
    announceMessages: boolean;
    keyboardNavigation: boolean;
    highContrastMode: boolean;
}, {
    ariaLabel?: string | undefined;
    announceMessages?: boolean | undefined;
    keyboardNavigation?: boolean | undefined;
    highContrastMode?: boolean | undefined;
}>;
declare const AdvancedConfigSchema: z.ZodObject<{
    debug: z.ZodDefault<z.ZodBoolean>;
    logLevel: z.ZodDefault<z.ZodEnum<["none", "error", "warn", "info", "debug"]>>;
    customRenderers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>>;
    middleware: z.ZodDefault<z.ZodArray<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>, "many">>;
    onMessageSent: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    onMessageReceived: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    onError: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    onStateChange: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    debug: boolean;
    logLevel: "none" | "info" | "error" | "debug" | "warn";
    middleware: ((...args: unknown[]) => unknown)[];
    onError?: ((...args: unknown[]) => unknown) | undefined;
    customRenderers?: Record<string, (...args: unknown[]) => unknown> | undefined;
    onMessageSent?: ((...args: unknown[]) => unknown) | undefined;
    onMessageReceived?: ((...args: unknown[]) => unknown) | undefined;
    onStateChange?: ((...args: unknown[]) => unknown) | undefined;
}, {
    onError?: ((...args: unknown[]) => unknown) | undefined;
    debug?: boolean | undefined;
    logLevel?: "none" | "info" | "error" | "debug" | "warn" | undefined;
    customRenderers?: Record<string, (...args: unknown[]) => unknown> | undefined;
    middleware?: ((...args: unknown[]) => unknown)[] | undefined;
    onMessageSent?: ((...args: unknown[]) => unknown) | undefined;
    onMessageReceived?: ((...args: unknown[]) => unknown) | undefined;
    onStateChange?: ((...args: unknown[]) => unknown) | undefined;
}>;
export declare const UnifiedChatConfigSchema: z.ZodEffects<z.ZodObject<{
    mode: z.ZodDefault<z.ZodEnum<["support", "ai", "hybrid"]>>;
    enabled: z.ZodDefault<z.ZodBoolean>;
    ui: z.ZodOptional<z.ZodObject<{
        position: z.ZodDefault<z.ZodEnum<["bottom-right", "bottom-left", "top-right", "top-left"]>>;
        theme: z.ZodDefault<z.ZodEnum<["default", "minimal", "compact", "full"]>>;
        primaryColor: z.ZodDefault<z.ZodString>;
        accentColor: z.ZodDefault<z.ZodString>;
        borderRadius: z.ZodDefault<z.ZodNumber>;
        showAvatar: z.ZodDefault<z.ZodBoolean>;
        showTimestamp: z.ZodDefault<z.ZodBoolean>;
        showStatus: z.ZodDefault<z.ZodBoolean>;
        compactMode: z.ZodDefault<z.ZodBoolean>;
        darkMode: z.ZodDefault<z.ZodEnum<["auto", "light", "dark"]>>;
    }, "strip", z.ZodTypeAny, {
        accentColor: string;
        position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
        borderRadius: number;
        theme: "default" | "full" | "compact" | "minimal";
        primaryColor: string;
        showAvatar: boolean;
        showTimestamp: boolean;
        showStatus: boolean;
        compactMode: boolean;
        darkMode: "auto" | "dark" | "light";
    }, {
        accentColor?: string | undefined;
        position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | undefined;
        borderRadius?: number | undefined;
        theme?: "default" | "full" | "compact" | "minimal" | undefined;
        primaryColor?: string | undefined;
        showAvatar?: boolean | undefined;
        showTimestamp?: boolean | undefined;
        showStatus?: boolean | undefined;
        compactMode?: boolean | undefined;
        darkMode?: "auto" | "dark" | "light" | undefined;
    }>>;
    features: z.ZodOptional<z.ZodObject<{
        topics: z.ZodDefault<z.ZodBoolean>;
        quickReplies: z.ZodDefault<z.ZodBoolean>;
        fileUpload: z.ZodDefault<z.ZodBoolean>;
        voiceInput: z.ZodDefault<z.ZodBoolean>;
        codeHighlight: z.ZodDefault<z.ZodBoolean>;
        markdown: z.ZodDefault<z.ZodBoolean>;
        typingIndicator: z.ZodDefault<z.ZodBoolean>;
        readReceipts: z.ZodDefault<z.ZodBoolean>;
        messagePersistence: z.ZodDefault<z.ZodBoolean>;
        exportChat: z.ZodDefault<z.ZodBoolean>;
        searchMessages: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        markdown: boolean;
        topics: boolean;
        quickReplies: boolean;
        fileUpload: boolean;
        voiceInput: boolean;
        codeHighlight: boolean;
        typingIndicator: boolean;
        readReceipts: boolean;
        messagePersistence: boolean;
        exportChat: boolean;
        searchMessages: boolean;
    }, {
        markdown?: boolean | undefined;
        topics?: boolean | undefined;
        quickReplies?: boolean | undefined;
        fileUpload?: boolean | undefined;
        voiceInput?: boolean | undefined;
        codeHighlight?: boolean | undefined;
        typingIndicator?: boolean | undefined;
        readReceipts?: boolean | undefined;
        messagePersistence?: boolean | undefined;
        exportChat?: boolean | undefined;
        searchMessages?: boolean | undefined;
    }>>;
    behavior: z.ZodOptional<z.ZodObject<{
        autoOpen: z.ZodDefault<z.ZodBoolean>;
        autoFocus: z.ZodDefault<z.ZodBoolean>;
        closeOnEscape: z.ZodDefault<z.ZodBoolean>;
        minimizable: z.ZodDefault<z.ZodBoolean>;
        draggable: z.ZodDefault<z.ZodBoolean>;
        soundEnabled: z.ZodDefault<z.ZodBoolean>;
        notificationsEnabled: z.ZodDefault<z.ZodBoolean>;
        maxMessages: z.ZodDefault<z.ZodNumber>;
        messageRetention: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        autoFocus: boolean;
        draggable: boolean;
        autoOpen: boolean;
        closeOnEscape: boolean;
        minimizable: boolean;
        soundEnabled: boolean;
        notificationsEnabled: boolean;
        maxMessages: number;
        messageRetention: number;
    }, {
        autoFocus?: boolean | undefined;
        draggable?: boolean | undefined;
        autoOpen?: boolean | undefined;
        closeOnEscape?: boolean | undefined;
        minimizable?: boolean | undefined;
        soundEnabled?: boolean | undefined;
        notificationsEnabled?: boolean | undefined;
        maxMessages?: number | undefined;
        messageRetention?: number | undefined;
    }>>;
    content: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        welcomeMessage: z.ZodDefault<z.ZodString>;
        placeholderText: z.ZodDefault<z.ZodString>;
        quickReplies: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        topics: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            icon: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            keywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            label: string;
            id: string;
            icon?: string | undefined;
            keywords?: string[] | undefined;
            description?: string | undefined;
        }, {
            label: string;
            id: string;
            icon?: string | undefined;
            keywords?: string[] | undefined;
            description?: string | undefined;
        }>, "many">>;
        errorMessages: z.ZodOptional<z.ZodObject<{
            network: z.ZodDefault<z.ZodString>;
            server: z.ZodDefault<z.ZodString>;
            validation: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            validation: string;
            network: string;
            server: string;
        }, {
            validation?: string | undefined;
            network?: string | undefined;
            server?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        topics: {
            label: string;
            id: string;
            icon?: string | undefined;
            keywords?: string[] | undefined;
            description?: string | undefined;
        }[];
        quickReplies: string[];
        welcomeMessage: string;
        placeholderText: string;
        errorMessages?: {
            validation: string;
            network: string;
            server: string;
        } | undefined;
    }, {
        topics?: {
            label: string;
            id: string;
            icon?: string | undefined;
            keywords?: string[] | undefined;
            description?: string | undefined;
        }[] | undefined;
        quickReplies?: string[] | undefined;
        welcomeMessage?: string | undefined;
        placeholderText?: string | undefined;
        errorMessages?: {
            validation?: string | undefined;
            network?: string | undefined;
            server?: string | undefined;
        } | undefined;
    }>, {
        errorMessages: {
            validation: string;
            network: string;
            server: string;
        };
        topics: {
            label: string;
            id: string;
            icon?: string | undefined;
            keywords?: string[] | undefined;
            description?: string | undefined;
        }[];
        quickReplies: string[];
        welcomeMessage: string;
        placeholderText: string;
    }, {
        topics?: {
            label: string;
            id: string;
            icon?: string | undefined;
            keywords?: string[] | undefined;
            description?: string | undefined;
        }[] | undefined;
        quickReplies?: string[] | undefined;
        welcomeMessage?: string | undefined;
        placeholderText?: string | undefined;
        errorMessages?: {
            validation?: string | undefined;
            network?: string | undefined;
            server?: string | undefined;
        } | undefined;
    }>>;
    backend: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        apiEndpoint: z.ZodOptional<z.ZodString>;
        wsEndpoint: z.ZodOptional<z.ZodString>;
        apiKey: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        timeout: z.ZodDefault<z.ZodNumber>;
        retryAttempts: z.ZodDefault<z.ZodNumber>;
        retryDelay: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        timeout: number;
        retryAttempts: number;
        retryDelay: number;
        headers?: Record<string, string> | undefined;
        apiEndpoint?: string | undefined;
        wsEndpoint?: string | undefined;
        apiKey?: string | undefined;
    }, {
        enabled?: boolean | undefined;
        headers?: Record<string, string> | undefined;
        apiEndpoint?: string | undefined;
        wsEndpoint?: string | undefined;
        apiKey?: string | undefined;
        timeout?: number | undefined;
        retryAttempts?: number | undefined;
        retryDelay?: number | undefined;
    }>>;
    ai: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        provider: z.ZodDefault<z.ZodEnum<["openai", "anthropic", "custom"]>>;
        model: z.ZodDefault<z.ZodString>;
        temperature: z.ZodDefault<z.ZodNumber>;
        maxTokens: z.ZodDefault<z.ZodNumber>;
        systemPrompt: z.ZodOptional<z.ZodString>;
        contextWindow: z.ZodDefault<z.ZodNumber>;
        streaming: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        model: string;
        provider: "custom" | "openai" | "anthropic";
        temperature: number;
        maxTokens: number;
        contextWindow: number;
        streaming: boolean;
        systemPrompt?: string | undefined;
    }, {
        enabled?: boolean | undefined;
        model?: string | undefined;
        provider?: "custom" | "openai" | "anthropic" | undefined;
        temperature?: number | undefined;
        maxTokens?: number | undefined;
        systemPrompt?: string | undefined;
        contextWindow?: number | undefined;
        streaming?: boolean | undefined;
    }>>;
    localization: z.ZodOptional<z.ZodObject<{
        locale: z.ZodDefault<z.ZodString>;
        customTranslations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        dateFormat: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        locale: string;
        dateFormat: string;
        customTranslations?: Record<string, string> | undefined;
    }, {
        locale?: string | undefined;
        customTranslations?: Record<string, string> | undefined;
        dateFormat?: string | undefined;
    }>>;
    analytics: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        provider: z.ZodDefault<z.ZodEnum<["google", "mixpanel", "custom", "none"]>>;
        trackEvents: z.ZodDefault<z.ZodArray<z.ZodEnum<["chat_open", "chat_close", "message_sent", "message_received", "topic_selected", "file_uploaded", "error_occurred"]>, "many">>;
        customHandler: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        provider: "none" | "custom" | "google" | "mixpanel";
        trackEvents: ("chat_open" | "chat_close" | "message_sent" | "message_received" | "topic_selected" | "file_uploaded" | "error_occurred")[];
        customHandler?: ((...args: unknown[]) => unknown) | undefined;
    }, {
        enabled?: boolean | undefined;
        provider?: "none" | "custom" | "google" | "mixpanel" | undefined;
        trackEvents?: ("chat_open" | "chat_close" | "message_sent" | "message_received" | "topic_selected" | "file_uploaded" | "error_occurred")[] | undefined;
        customHandler?: ((...args: unknown[]) => unknown) | undefined;
    }>>;
    a11y: z.ZodOptional<z.ZodObject<{
        ariaLabel: z.ZodDefault<z.ZodString>;
        announceMessages: z.ZodDefault<z.ZodBoolean>;
        keyboardNavigation: z.ZodDefault<z.ZodBoolean>;
        highContrastMode: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        ariaLabel: string;
        announceMessages: boolean;
        keyboardNavigation: boolean;
        highContrastMode: boolean;
    }, {
        ariaLabel?: string | undefined;
        announceMessages?: boolean | undefined;
        keyboardNavigation?: boolean | undefined;
        highContrastMode?: boolean | undefined;
    }>>;
    advanced: z.ZodOptional<z.ZodObject<{
        debug: z.ZodDefault<z.ZodBoolean>;
        logLevel: z.ZodDefault<z.ZodEnum<["none", "error", "warn", "info", "debug"]>>;
        customRenderers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>>;
        middleware: z.ZodDefault<z.ZodArray<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>, "many">>;
        onMessageSent: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
        onMessageReceived: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
        onError: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
        onStateChange: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        debug: boolean;
        logLevel: "none" | "info" | "error" | "debug" | "warn";
        middleware: ((...args: unknown[]) => unknown)[];
        onError?: ((...args: unknown[]) => unknown) | undefined;
        customRenderers?: Record<string, (...args: unknown[]) => unknown> | undefined;
        onMessageSent?: ((...args: unknown[]) => unknown) | undefined;
        onMessageReceived?: ((...args: unknown[]) => unknown) | undefined;
        onStateChange?: ((...args: unknown[]) => unknown) | undefined;
    }, {
        onError?: ((...args: unknown[]) => unknown) | undefined;
        debug?: boolean | undefined;
        logLevel?: "none" | "info" | "error" | "debug" | "warn" | undefined;
        customRenderers?: Record<string, (...args: unknown[]) => unknown> | undefined;
        middleware?: ((...args: unknown[]) => unknown)[] | undefined;
        onMessageSent?: ((...args: unknown[]) => unknown) | undefined;
        onMessageReceived?: ((...args: unknown[]) => unknown) | undefined;
        onStateChange?: ((...args: unknown[]) => unknown) | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    mode: "support" | "ai" | "hybrid";
    enabled: boolean;
    content?: {
        errorMessages: {
            validation: string;
            network: string;
            server: string;
        };
        topics: {
            label: string;
            id: string;
            icon?: string | undefined;
            keywords?: string[] | undefined;
            description?: string | undefined;
        }[];
        quickReplies: string[];
        welcomeMessage: string;
        placeholderText: string;
    } | undefined;
    features?: {
        markdown: boolean;
        topics: boolean;
        quickReplies: boolean;
        fileUpload: boolean;
        voiceInput: boolean;
        codeHighlight: boolean;
        typingIndicator: boolean;
        readReceipts: boolean;
        messagePersistence: boolean;
        exportChat: boolean;
        searchMessages: boolean;
    } | undefined;
    ai?: {
        enabled: boolean;
        model: string;
        provider: "custom" | "openai" | "anthropic";
        temperature: number;
        maxTokens: number;
        contextWindow: number;
        streaming: boolean;
        systemPrompt?: string | undefined;
    } | undefined;
    ui?: {
        accentColor: string;
        position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
        borderRadius: number;
        theme: "default" | "full" | "compact" | "minimal";
        primaryColor: string;
        showAvatar: boolean;
        showTimestamp: boolean;
        showStatus: boolean;
        compactMode: boolean;
        darkMode: "auto" | "dark" | "light";
    } | undefined;
    behavior?: {
        autoFocus: boolean;
        draggable: boolean;
        autoOpen: boolean;
        closeOnEscape: boolean;
        minimizable: boolean;
        soundEnabled: boolean;
        notificationsEnabled: boolean;
        maxMessages: number;
        messageRetention: number;
    } | undefined;
    backend?: {
        enabled: boolean;
        timeout: number;
        retryAttempts: number;
        retryDelay: number;
        headers?: Record<string, string> | undefined;
        apiEndpoint?: string | undefined;
        wsEndpoint?: string | undefined;
        apiKey?: string | undefined;
    } | undefined;
    localization?: {
        locale: string;
        dateFormat: string;
        customTranslations?: Record<string, string> | undefined;
    } | undefined;
    analytics?: {
        enabled: boolean;
        provider: "none" | "custom" | "google" | "mixpanel";
        trackEvents: ("chat_open" | "chat_close" | "message_sent" | "message_received" | "topic_selected" | "file_uploaded" | "error_occurred")[];
        customHandler?: ((...args: unknown[]) => unknown) | undefined;
    } | undefined;
    a11y?: {
        ariaLabel: string;
        announceMessages: boolean;
        keyboardNavigation: boolean;
        highContrastMode: boolean;
    } | undefined;
    advanced?: {
        debug: boolean;
        logLevel: "none" | "info" | "error" | "debug" | "warn";
        middleware: ((...args: unknown[]) => unknown)[];
        onError?: ((...args: unknown[]) => unknown) | undefined;
        customRenderers?: Record<string, (...args: unknown[]) => unknown> | undefined;
        onMessageSent?: ((...args: unknown[]) => unknown) | undefined;
        onMessageReceived?: ((...args: unknown[]) => unknown) | undefined;
        onStateChange?: ((...args: unknown[]) => unknown) | undefined;
    } | undefined;
}, {
    content?: {
        topics?: {
            label: string;
            id: string;
            icon?: string | undefined;
            keywords?: string[] | undefined;
            description?: string | undefined;
        }[] | undefined;
        quickReplies?: string[] | undefined;
        welcomeMessage?: string | undefined;
        placeholderText?: string | undefined;
        errorMessages?: {
            validation?: string | undefined;
            network?: string | undefined;
            server?: string | undefined;
        } | undefined;
    } | undefined;
    mode?: "support" | "ai" | "hybrid" | undefined;
    enabled?: boolean | undefined;
    features?: {
        markdown?: boolean | undefined;
        topics?: boolean | undefined;
        quickReplies?: boolean | undefined;
        fileUpload?: boolean | undefined;
        voiceInput?: boolean | undefined;
        codeHighlight?: boolean | undefined;
        typingIndicator?: boolean | undefined;
        readReceipts?: boolean | undefined;
        messagePersistence?: boolean | undefined;
        exportChat?: boolean | undefined;
        searchMessages?: boolean | undefined;
    } | undefined;
    ai?: {
        enabled?: boolean | undefined;
        model?: string | undefined;
        provider?: "custom" | "openai" | "anthropic" | undefined;
        temperature?: number | undefined;
        maxTokens?: number | undefined;
        systemPrompt?: string | undefined;
        contextWindow?: number | undefined;
        streaming?: boolean | undefined;
    } | undefined;
    ui?: {
        accentColor?: string | undefined;
        position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | undefined;
        borderRadius?: number | undefined;
        theme?: "default" | "full" | "compact" | "minimal" | undefined;
        primaryColor?: string | undefined;
        showAvatar?: boolean | undefined;
        showTimestamp?: boolean | undefined;
        showStatus?: boolean | undefined;
        compactMode?: boolean | undefined;
        darkMode?: "auto" | "dark" | "light" | undefined;
    } | undefined;
    behavior?: {
        autoFocus?: boolean | undefined;
        draggable?: boolean | undefined;
        autoOpen?: boolean | undefined;
        closeOnEscape?: boolean | undefined;
        minimizable?: boolean | undefined;
        soundEnabled?: boolean | undefined;
        notificationsEnabled?: boolean | undefined;
        maxMessages?: number | undefined;
        messageRetention?: number | undefined;
    } | undefined;
    backend?: {
        enabled?: boolean | undefined;
        headers?: Record<string, string> | undefined;
        apiEndpoint?: string | undefined;
        wsEndpoint?: string | undefined;
        apiKey?: string | undefined;
        timeout?: number | undefined;
        retryAttempts?: number | undefined;
        retryDelay?: number | undefined;
    } | undefined;
    localization?: {
        locale?: string | undefined;
        customTranslations?: Record<string, string> | undefined;
        dateFormat?: string | undefined;
    } | undefined;
    analytics?: {
        enabled?: boolean | undefined;
        provider?: "none" | "custom" | "google" | "mixpanel" | undefined;
        trackEvents?: ("chat_open" | "chat_close" | "message_sent" | "message_received" | "topic_selected" | "file_uploaded" | "error_occurred")[] | undefined;
        customHandler?: ((...args: unknown[]) => unknown) | undefined;
    } | undefined;
    a11y?: {
        ariaLabel?: string | undefined;
        announceMessages?: boolean | undefined;
        keyboardNavigation?: boolean | undefined;
        highContrastMode?: boolean | undefined;
    } | undefined;
    advanced?: {
        onError?: ((...args: unknown[]) => unknown) | undefined;
        debug?: boolean | undefined;
        logLevel?: "none" | "info" | "error" | "debug" | "warn" | undefined;
        customRenderers?: Record<string, (...args: unknown[]) => unknown> | undefined;
        middleware?: ((...args: unknown[]) => unknown)[] | undefined;
        onMessageSent?: ((...args: unknown[]) => unknown) | undefined;
        onMessageReceived?: ((...args: unknown[]) => unknown) | undefined;
        onStateChange?: ((...args: unknown[]) => unknown) | undefined;
    } | undefined;
}>, {
    mode: "support" | "ai" | "hybrid";
    enabled: boolean;
    ui: {
        accentColor: string;
        position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
        borderRadius: number;
        theme: "default" | "full" | "compact" | "minimal";
        primaryColor: string;
        showAvatar: boolean;
        showTimestamp: boolean;
        showStatus: boolean;
        compactMode: boolean;
        darkMode: "auto" | "dark" | "light";
    };
    features: {
        markdown: boolean;
        topics: boolean;
        quickReplies: boolean;
        fileUpload: boolean;
        voiceInput: boolean;
        codeHighlight: boolean;
        typingIndicator: boolean;
        readReceipts: boolean;
        messagePersistence: boolean;
        exportChat: boolean;
        searchMessages: boolean;
    };
    behavior: {
        autoFocus: boolean;
        draggable: boolean;
        autoOpen: boolean;
        closeOnEscape: boolean;
        minimizable: boolean;
        soundEnabled: boolean;
        notificationsEnabled: boolean;
        maxMessages: number;
        messageRetention: number;
    };
    content: {
        errorMessages: {
            validation: string;
            network: string;
            server: string;
        };
        topics: {
            label: string;
            id: string;
            icon?: string | undefined;
            keywords?: string[] | undefined;
            description?: string | undefined;
        }[];
        quickReplies: string[];
        welcomeMessage: string;
        placeholderText: string;
    };
    backend: {
        enabled: boolean;
        timeout: number;
        retryAttempts: number;
        retryDelay: number;
        headers?: Record<string, string> | undefined;
        apiEndpoint?: string | undefined;
        wsEndpoint?: string | undefined;
        apiKey?: string | undefined;
    };
    ai: {
        enabled: boolean;
        model: string;
        provider: "custom" | "openai" | "anthropic";
        temperature: number;
        maxTokens: number;
        contextWindow: number;
        streaming: boolean;
        systemPrompt?: string | undefined;
    };
    localization: {
        locale: string;
        dateFormat: string;
        customTranslations?: Record<string, string> | undefined;
    };
    analytics: {
        enabled: boolean;
        provider: "none" | "custom" | "google" | "mixpanel";
        trackEvents: ("chat_open" | "chat_close" | "message_sent" | "message_received" | "topic_selected" | "file_uploaded" | "error_occurred")[];
        customHandler?: ((...args: unknown[]) => unknown) | undefined;
    };
    a11y: {
        ariaLabel: string;
        announceMessages: boolean;
        keyboardNavigation: boolean;
        highContrastMode: boolean;
    };
    advanced: {
        debug: boolean;
        logLevel: "none" | "info" | "error" | "debug" | "warn";
        middleware: ((...args: unknown[]) => unknown)[];
        onError?: ((...args: unknown[]) => unknown) | undefined;
        customRenderers?: Record<string, (...args: unknown[]) => unknown> | undefined;
        onMessageSent?: ((...args: unknown[]) => unknown) | undefined;
        onMessageReceived?: ((...args: unknown[]) => unknown) | undefined;
        onStateChange?: ((...args: unknown[]) => unknown) | undefined;
    };
}, {
    content?: {
        topics?: {
            label: string;
            id: string;
            icon?: string | undefined;
            keywords?: string[] | undefined;
            description?: string | undefined;
        }[] | undefined;
        quickReplies?: string[] | undefined;
        welcomeMessage?: string | undefined;
        placeholderText?: string | undefined;
        errorMessages?: {
            validation?: string | undefined;
            network?: string | undefined;
            server?: string | undefined;
        } | undefined;
    } | undefined;
    mode?: "support" | "ai" | "hybrid" | undefined;
    enabled?: boolean | undefined;
    features?: {
        markdown?: boolean | undefined;
        topics?: boolean | undefined;
        quickReplies?: boolean | undefined;
        fileUpload?: boolean | undefined;
        voiceInput?: boolean | undefined;
        codeHighlight?: boolean | undefined;
        typingIndicator?: boolean | undefined;
        readReceipts?: boolean | undefined;
        messagePersistence?: boolean | undefined;
        exportChat?: boolean | undefined;
        searchMessages?: boolean | undefined;
    } | undefined;
    ai?: {
        enabled?: boolean | undefined;
        model?: string | undefined;
        provider?: "custom" | "openai" | "anthropic" | undefined;
        temperature?: number | undefined;
        maxTokens?: number | undefined;
        systemPrompt?: string | undefined;
        contextWindow?: number | undefined;
        streaming?: boolean | undefined;
    } | undefined;
    ui?: {
        accentColor?: string | undefined;
        position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | undefined;
        borderRadius?: number | undefined;
        theme?: "default" | "full" | "compact" | "minimal" | undefined;
        primaryColor?: string | undefined;
        showAvatar?: boolean | undefined;
        showTimestamp?: boolean | undefined;
        showStatus?: boolean | undefined;
        compactMode?: boolean | undefined;
        darkMode?: "auto" | "dark" | "light" | undefined;
    } | undefined;
    behavior?: {
        autoFocus?: boolean | undefined;
        draggable?: boolean | undefined;
        autoOpen?: boolean | undefined;
        closeOnEscape?: boolean | undefined;
        minimizable?: boolean | undefined;
        soundEnabled?: boolean | undefined;
        notificationsEnabled?: boolean | undefined;
        maxMessages?: number | undefined;
        messageRetention?: number | undefined;
    } | undefined;
    backend?: {
        enabled?: boolean | undefined;
        headers?: Record<string, string> | undefined;
        apiEndpoint?: string | undefined;
        wsEndpoint?: string | undefined;
        apiKey?: string | undefined;
        timeout?: number | undefined;
        retryAttempts?: number | undefined;
        retryDelay?: number | undefined;
    } | undefined;
    localization?: {
        locale?: string | undefined;
        customTranslations?: Record<string, string> | undefined;
        dateFormat?: string | undefined;
    } | undefined;
    analytics?: {
        enabled?: boolean | undefined;
        provider?: "none" | "custom" | "google" | "mixpanel" | undefined;
        trackEvents?: ("chat_open" | "chat_close" | "message_sent" | "message_received" | "topic_selected" | "file_uploaded" | "error_occurred")[] | undefined;
        customHandler?: ((...args: unknown[]) => unknown) | undefined;
    } | undefined;
    a11y?: {
        ariaLabel?: string | undefined;
        announceMessages?: boolean | undefined;
        keyboardNavigation?: boolean | undefined;
        highContrastMode?: boolean | undefined;
    } | undefined;
    advanced?: {
        onError?: ((...args: unknown[]) => unknown) | undefined;
        debug?: boolean | undefined;
        logLevel?: "none" | "info" | "error" | "debug" | "warn" | undefined;
        customRenderers?: Record<string, (...args: unknown[]) => unknown> | undefined;
        middleware?: ((...args: unknown[]) => unknown)[] | undefined;
        onMessageSent?: ((...args: unknown[]) => unknown) | undefined;
        onMessageReceived?: ((...args: unknown[]) => unknown) | undefined;
        onStateChange?: ((...args: unknown[]) => unknown) | undefined;
    } | undefined;
}>;
export type UnifiedChatConfig = z.infer<typeof UnifiedChatConfigSchema>;
export type UIConfig = z.infer<typeof UIConfigSchema>;
export type FeaturesConfig = z.infer<typeof FeaturesConfigSchema>;
export type BehaviorConfig = z.infer<typeof BehaviorConfigSchema>;
export type ContentConfig = z.infer<typeof ContentConfigSchema>;
export type BackendConfig = z.infer<typeof BackendConfigSchema>;
export type AIConfig = z.infer<typeof AIConfigSchema>;
export type LocalizationConfig = z.infer<typeof LocalizationConfigSchema>;
export type AnalyticsConfig = z.infer<typeof AnalyticsConfigSchema>;
export type A11yConfig = z.infer<typeof A11yConfigSchema>;
export type AdvancedConfig = z.infer<typeof AdvancedConfigSchema>;
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;
export interface UnifiedChatProps {
    config?: Partial<UnifiedChatConfig>;
    className?: string;
    style?: CSSProperties;
    onReady?: () => void;
    onDestroy?: () => void;
    userId?: string;
    userName?: string;
    userAvatar?: string;
}
export interface ChatState {
    isOpen: boolean;
    isMinimized: boolean;
    status: ChatStatus;
    messages: Message[];
    unreadCount: number;
    open: () => void;
    close: () => void;
    minimize: () => void;
    maximize: () => void;
    sendMessage: (content: string, type?: MessageType) => Promise<void>;
    clearMessages: () => void;
    deleteMessage: (id: string) => void;
    loadHistory: () => Promise<void>;
    setTyping: (isTyping: boolean) => void;
    markAsRead: () => void;
}
export interface UseChatHistoryReturn {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    isLoading: boolean;
    error: string | null;
    sessionId?: string;
}
export interface UseChatActionsProps {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    sessionId?: string;
}
export interface UseChatActionsReturn {
    isSending: boolean;
    handleSendMessage: (content: string) => Promise<void>;
}
export interface ChatWindowProps {
    isMinimized?: boolean;
    children?: ReactNode;
    onMinimizeToggle: () => void;
    onClose: () => void;
    status?: ChatStatus;
}
export interface TopicsSectionProps {
    isMinimized: boolean;
    onToggleMinimize: () => void;
    onTopicSelect: (topic: string) => void;
    topics?: Array<ConfigTopic | LocalChatTopic> | undefined;
}
export interface MessageListProps {
    messages: Message[];
    isAssistantTyping: boolean;
    sessionUser?: SessionUser;
}
export interface MessageInputProps {
    onSendMessage: (message: string) => void;
    isSending: boolean;
}
export interface ChatMessageItemProps {
    message: Message;
    previousMessage?: Message;
    sessionUser?: SessionUser;
}
export interface ChatBubbleProps {
    unreadCount?: number;
    onClick?: () => void;
}
export interface SessionUser {
    id?: string;
    name?: string;
    image?: string;
}
export {};
