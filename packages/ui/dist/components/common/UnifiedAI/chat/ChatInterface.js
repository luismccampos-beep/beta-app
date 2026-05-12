"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { MessageCircle, X, Send, Trash2 } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { useAIActions } from '../hooks/useAIActions';
import { useAIState } from '../hooks/useAIState';
import { ChatMessageRenderer } from './ChatMessageRenderer';
const DEFAULT_POSITION = 'bottom-right';
/**
 * Get position class safely with validation
 * Uses explicit checks to satisfy security linting
 */
function getPositionClass(position) {
    if (position === 'bottom-right')
        return 'bottom-4 right-4';
    if (position === 'bottom-left')
        return 'bottom-4 left-4';
    if (position === 'top-right')
        return 'top-4 right-4';
    if (position === 'top-left')
        return 'top-4 left-4';
    // Fallback to default (should never reach here due to TypeScript)
    return 'bottom-4 right-4';
}
/**
 * Validate and cast role to MessageRole type
 */
function validateRole(role) {
    const validRoles = ['user', 'assistant', 'system'];
    return validRoles.includes(role) ? role : 'user';
}
export function ChatInterface({ uiConfig }) {
    const { chat } = useAIState();
    const { sendMessage, clearSession } = useAIActions();
    const [draft, setDraft] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const position = uiConfig?.position ?? DEFAULT_POSITION;
    const positionClass = getPositionClass(position);
    const handleSend = async (event) => {
        event.preventDefault();
        const trimmedDraft = draft.trim();
        if (!trimmedDraft)
            return;
        setIsSending(true);
        try {
            await sendMessage(trimmedDraft);
            setDraft('');
        }
        catch (error) {
            console.error('Failed to send message:', error);
            // Optionally show error toast/notification here
        }
        finally {
            setIsSending(false);
        }
    };
    const handleClearSession = async () => {
        if (chat.messages.length === 0)
            return;
        // Optionally add confirmation dialog
        await clearSession();
    };
    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };
    return (_jsxs("div", { className: cn("fixed z-50 flex flex-col items-end gap-4", positionClass), children: [isOpen && (_jsxs("div", { className: cn("w-[380px] h-[600px] max-h-[80vh] flex flex-col bg-background border rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300", "dark:bg-slate-900 dark:border-slate-800"), children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b bg-muted/50 dark:bg-slate-900/50", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "p-2 bg-primary/10 rounded-lg", children: _jsx(MessageCircle, { className: "w-5 h-5 text-primary" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-sm", children: "Assistente AI" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Sempre aqui para ajudar" })] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 hover:bg-destructive/10 hover:text-destructive", onClick: handleClearSession, title: "Limpar conversa", disabled: chat.messages.length === 0, children: _jsx(Trash2, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: handleToggle, title: "Fechar chat", children: _jsx(X, { className: "w-4 h-4" }) })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: chat.messages.length === 0 ? (_jsx(EmptyState, {})) : (_jsx(MessageList, { messages: chat.messages })) }), _jsx("div", { className: "p-4 border-t bg-background dark:bg-slate-900", children: _jsxs("form", { onSubmit: handleSend, className: "flex items-end gap-2", children: [_jsx(Input, { placeholder: "Escreva sua mensagem...", value: draft, onChange: (event) => setDraft(event.target.value), className: "flex-1 min-h-[44px] max-h-32 resize-none", autoFocus: true, disabled: isSending }), _jsx(Button, { type: "submit", size: "icon", disabled: !draft.trim() || isSending, className: cn("h-11 w-11 shrink-0 transition-all", isSending && "opacity-80"), title: "Enviar mensagem", children: isSending ? (_jsx(LoadingSpinner, {})) : (_jsx(Send, { className: "w-4 h-4" })) })] }) })] })), _jsx(Button, { onClick: handleToggle, size: "icon", className: cn("h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105", isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90"), title: isOpen ? "Fechar chat" : "Abrir chat", children: isOpen ? (_jsx(X, { className: "w-6 h-6" })) : (_jsx(MessageCircle, { className: "w-6 h-6" })) })] }));
}
// Sub-components for better organization and reusability
function EmptyState() {
    return (_jsxs("div", { className: "h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground space-y-2 opacity-60", children: [_jsx(MessageCircle, { className: "w-12 h-12" }), _jsx("p", { className: "text-sm", children: "Como posso ajudar voc\u00EA hoje?" })] }));
}
function MessageList({ messages }) {
    return (_jsx(_Fragment, { children: messages.map((message) => (_jsx(ChatMessageRenderer, { message: message.content, role: validateRole(message.role) }, message.id))) }));
}
function LoadingSpinner() {
    return (_jsx("div", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" }));
}
//# sourceMappingURL=ChatInterface.js.map