"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UNIFIED_AI_DEFAULTS, UNIFIED_AI_STORAGE_KEY } from './UnifiedAI.constants';
import { aiRequest, configureAIClient } from './services/aiApiClient';
import { trackAIEvent } from './services/aiAnalyticsService';
import { loadAIState, saveAIState } from './services/aiStorageService';
import { ChatInterface } from './chat/ChatInterface';
import { SuggestionsRenderer } from './suggestions/SuggestionsRenderer';
import { TripGeneratorChat } from './trip-generator/TripGeneratorChat';
import { SearchInterface } from './search/SearchInterface';
import { PreferencesManager } from './preferences/PreferencesManager';
import { AIAdminInterface } from './admin/AIAdminInterface';
import { PromptManager } from './admin/PromptManager';
import { WorkflowManager } from './admin/WorkflowManager';
import { fetchSuggestions } from './suggestions/suggestionsService';
import { createTripDraft } from './trip-generator/tripGeneratorService';
import { runAISearch } from './search/searchService';
import { logger } from '../../../logger';
const buildDefaultState = (mode) => ({
    mode,
    isOnline: true,
    userContext: {},
    suggestions: {
        items: [],
        isLoading: false,
        error: null,
    },
    tripGenerator: {
        isLoading: false,
        error: null,
    },
    search: {
        isLoading: false,
        error: null,
    },
    preferences: {
        isLoading: false,
        error: null,
    },
    admin: {
        isLoading: false,
        error: null,
    },
    chat: {
        sessionId: undefined,
        isSending: false,
        error: null,
        messages: [],
    },
});
const normalizeState = (base, stored, features) => {
    if (!stored)
        return base;
    const newState = {
        ...base,
        ...stored,
        // Always preserve structural integrity of sub-states
        suggestions: { ...base.suggestions, ...(stored.suggestions ?? {}) },
        tripGenerator: { ...base.tripGenerator, ...(stored.tripGenerator ?? {}) },
        search: { ...base.search, ...(stored.search ?? {}) },
        preferences: { ...base.preferences, ...(stored.preferences ?? {}) },
        admin: { ...base.admin, ...(stored.admin ?? {}) },
        chat: { ...base.chat, ...(stored.chat ?? {}), messages: stored.chat?.messages ?? base.chat.messages },
    };
    // Explicitly decouple features that are disabled
    if (features) {
        if (!features.suggestions) {
            newState.suggestions = base.suggestions;
        }
        if (!features.tripGenerator) {
            newState.tripGenerator = base.tripGenerator;
        }
        if (!features.search) {
            newState.search = base.search;
        }
        if (!features.preferences) {
            newState.preferences = base.preferences;
        }
        if (!features.admin) {
            newState.admin = base.admin;
        }
    }
    return newState;
};
export const AIContext = React.createContext(null);
function UnifiedAI(props) {
    const { config, className, onReady } = props;
    const mergedConfig = useMemo(() => ({
        ...UNIFIED_AI_DEFAULTS,
        ...config,
        features: {
            ...UNIFIED_AI_DEFAULTS.features,
            ...(config?.features ?? {}),
        },
        behavior: {
            ...UNIFIED_AI_DEFAULTS.behavior,
            ...(config?.behavior ?? {}),
        },
        ui: {
            ...UNIFIED_AI_DEFAULTS.ui,
            ...(config?.ui ?? {}),
        },
        backend: {
            ...UNIFIED_AI_DEFAULTS.backend,
            ...(config?.backend ?? {}),
        },
    }), [config]);
    const [state, setState] = useState(() => buildDefaultState(mergedConfig.mode));
    useEffect(() => {
        if (!mergedConfig.behavior.persistentContext)
            return;
        const stored = loadAIState();
        if (stored) {
            setState((prev) => normalizeState(prev, stored, mergedConfig.features));
        }
    }, [mergedConfig.behavior.persistentContext, mergedConfig.features]);
    useEffect(() => {
        const headers = {};
        if (mergedConfig.backend.apiKey) {
            headers.Authorization = `Bearer ${mergedConfig.backend.apiKey}`;
        }
        configureAIClient({
            baseUrl: mergedConfig.backend.apiEndpoint,
            ...(mergedConfig.backend.timeout ? { timeoutMs: mergedConfig.backend.timeout } : {}),
            headers,
        });
    }, [mergedConfig.backend.apiEndpoint, mergedConfig.backend.apiKey, mergedConfig.backend.timeout]);
    useEffect(() => {
        if (!mergedConfig.behavior.persistentContext)
            return;
        saveAIState(state);
    }, [mergedConfig.behavior.persistentContext, state]);
    useEffect(() => {
        if (onReady) {
            onReady();
        }
    }, [onReady]);
    useEffect(() => {
        if (!mergedConfig.features.suggestions)
            return;
        let active = true;
        setState((prev) => ({
            ...prev,
            suggestions: { ...prev.suggestions, isLoading: true, error: null },
        }));
        fetchSuggestions()
            .then((items) => {
            if (!active)
                return;
            setState((prev) => ({
                ...prev,
                suggestions: { ...prev.suggestions, items, isLoading: false, error: null },
            }));
        })
            .catch((error) => {
            if (!active)
                return;
            setState((prev) => ({
                ...prev,
                suggestions: { ...prev.suggestions, isLoading: false, error: 'Falha ao carregar sugestões' },
            }));
            logger.warn('Failed to load UnifiedAI suggestions', { error: error instanceof Error ? error.message : error });
        });
        return () => {
            active = false;
        };
    }, [mergedConfig.features.suggestions]);
    useEffect(() => {
        setState((prev) => ({ ...prev, mode: mergedConfig.mode }));
    }, [mergedConfig.mode]);
    useEffect(() => {
        if (mergedConfig.behavior.persistentContext)
            return;
        setState(buildDefaultState(mergedConfig.mode));
    }, [mergedConfig.behavior.persistentContext, mergedConfig.mode]);
    useEffect(() => {
        // Initial check for online status
        if (typeof navigator !== 'undefined') {
            setState((prev) => ({ ...prev, isOnline: navigator.onLine }));
        }
        if (typeof window === 'undefined')
            return;
        const handleOnline = () => setState((prev) => ({ ...prev, isOnline: true }));
        const handleOffline = () => setState((prev) => ({ ...prev, isOnline: false }));
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    useEffect(() => {
        if (typeof window === 'undefined' || !mergedConfig.behavior.crossTabSync)
            return;
        const handler = (event) => {
            if (event.key !== UNIFIED_AI_STORAGE_KEY)
                return;
            const base = buildDefaultState(mergedConfig.mode);
            setState(normalizeState(base, loadAIState(), mergedConfig.features));
        };
        window.addEventListener('storage', handler);
        return () => {
            window.removeEventListener('storage', handler);
        };
    }, [mergedConfig.behavior.crossTabSync, mergedConfig.mode, mergedConfig.features]);
    const setMode = useCallback((mode) => {
        setState((prev) => ({ ...prev, mode }));
    }, []);
    const updateUserContext = useCallback((context) => {
        setState((prev) => ({
            ...prev,
            userContext: { ...prev.userContext, ...context },
        }));
    }, []);
    const loadSuggestionsAction = useCallback(async (_query) => {
        setState((prev) => ({
            ...prev,
            suggestions: { ...prev.suggestions, isLoading: true, error: null },
        }));
        try {
            const items = await fetchSuggestions();
            setState((prev) => ({
                ...prev,
                suggestions: { ...prev.suggestions, items, isLoading: false, error: null },
            }));
        }
        catch (error) {
            setState((prev) => ({
                ...prev,
                suggestions: { ...prev.suggestions, isLoading: false, error: 'Falha ao carregar sugestões' },
            }));
            throw error;
        }
    }, []);
    const generateTrip = useCallback(async (preferences) => {
        setState((prev) => ({
            ...prev,
            tripGenerator: { ...prev.tripGenerator, isLoading: true, error: null },
        }));
        try {
            const draft = await createTripDraft(preferences);
            setState((prev) => ({
                ...prev,
                tripGenerator: { ...prev.tripGenerator, isLoading: false, error: null, draft: draft },
            }));
        }
        catch (error) {
            setState((prev) => ({
                ...prev,
                tripGenerator: { ...prev.tripGenerator, isLoading: false, error: 'Falha ao gerar roteiro' },
            }));
            throw error;
        }
    }, []);
    const performSearch = useCallback(async (params) => {
        const query = typeof params === 'object' && params && 'query' in params ? String(params.query ?? '') : '';
        setState((prev) => ({
            ...prev,
            search: { ...prev.search, isLoading: true, error: null },
        }));
        try {
            const results = await runAISearch(query);
            setState((prev) => ({
                ...prev,
                search: { ...prev.search, isLoading: false, error: null, results },
            }));
        }
        catch (error) {
            setState((prev) => ({
                ...prev,
                search: { ...prev.search, isLoading: false, error: 'Falha ao buscar' },
            }));
            throw error;
        }
    }, []);
    const sendMessage = useCallback(async (message, context) => {
        const userMessage = {
            id: `ai-${Date.now()}`,
            role: 'user',
            content: message,
            createdAt: Date.now(),
        };
        const sessionId = state.chat.sessionId;
        setState((prev) => ({
            ...prev,
            chat: {
                ...prev.chat,
                isSending: true,
                error: null,
                messages: [...prev.chat.messages, userMessage],
            },
        }));
        try {
            const response = await aiRequest('/chat/messages', {
                method: 'POST',
                body: {
                    content: message,
                    ...(sessionId ? { sessionId } : {}),
                    ...(context ? { context } : {}),
                },
            });
            if (!response?.success || !response.data) {
                throw new Error(response?.message || 'Falha ao enviar mensagem');
            }
            const aiMessage = response.data.aiMessage;
            const createdAt = aiMessage.timestamp ? Date.parse(aiMessage.timestamp) : Date.now();
            setState((prev) => ({
                ...prev,
                chat: {
                    ...prev.chat,
                    sessionId: response.data?.sessionId ?? prev.chat.sessionId,
                    isSending: false,
                    error: null,
                    messages: [
                        ...prev.chat.messages,
                        {
                            id: aiMessage.id,
                            role: aiMessage.sender,
                            content: aiMessage.content,
                            createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
                        },
                    ],
                },
            }));
            trackAIEvent({ name: 'ai.message.sent', payload: { length: message.length } });
            trackAIEvent({ name: 'ai.message.received' });
        }
        catch (error) {
            setState((prev) => ({
                ...prev,
                chat: {
                    ...prev.chat,
                    isSending: false,
                    error: error instanceof Error ? error.message : 'Falha ao enviar mensagem',
                },
            }));
            throw error;
        }
    }, [state.chat.sessionId]);
    const processCommand = useCallback(async (_command) => {
        return;
    }, []);
    const clearSession = useCallback(() => {
        setState((prev) => ({
            ...prev,
            chat: {
                ...prev.chat,
                sessionId: undefined,
                messages: [],
                error: null,
            },
        }));
        trackAIEvent({ name: 'ai.session.cleared' });
    }, []);
    const contextValue = useMemo(() => ({
        state,
        actions: {
            setMode,
            updateUserContext,
            loadSuggestions: loadSuggestionsAction,
            generateTrip,
            performSearch,
            sendMessage,
            processCommand,
            clearSession,
        },
    }), [state, setMode, updateUserContext, loadSuggestionsAction, generateTrip, performSearch, sendMessage, processCommand, clearSession]);
    return (_jsx(AIContext.Provider, { value: contextValue, children: _jsxs("div", { className: className, "data-ai-mode": mergedConfig.mode, children: [(mergedConfig.mode === 'user' || mergedConfig.mode === 'hybrid') && (_jsx(ChatInterface, { uiConfig: mergedConfig.ui })), mergedConfig.features.suggestions && mergedConfig.ui.showSuggestionsUI !== false && (_jsx(SuggestionsRenderer, { suggestions: state.suggestions.items, isLoading: state.suggestions.isLoading, error: state.suggestions.error })), mergedConfig.features.search && mergedConfig.ui.showSearchUI !== false && _jsx(SearchInterface, {}), mergedConfig.features.tripGenerator && mergedConfig.ui.showTripGeneratorUI !== false && _jsx(TripGeneratorChat, {}), mergedConfig.features.preferences && mergedConfig.ui.showPreferencesUI !== false && _jsx(PreferencesManager, {}), mergedConfig.features.admin && _jsx(AIAdminInterface, {}), !mergedConfig.features.admin && mergedConfig.features.promptManagement && _jsx(PromptManager, {}), !mergedConfig.features.admin && mergedConfig.features.workflowManagement && _jsx(WorkflowManager, {})] }) }));
}
export { UnifiedAI };
export default UnifiedAI;
//# sourceMappingURL=UnifiedAI.js.map