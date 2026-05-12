"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '../../../ui/button';
import { runAdminAction } from './adminAIService';
export function PromptManager() {
    const [actionType, setActionType] = useState('prompt.update');
    const [prompt, setPrompt] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const handleSave = async () => {
        if (!prompt.trim()) {
            setError('Prompt vazio');
            return;
        }
        setIsSaving(true);
        setError(null);
        setResult(null);
        try {
            const action = {
                id: `prompt-${Date.now()}`,
                type: actionType,
                payload: { prompt: prompt.trim() },
            };
            const response = await runAdminAction(action);
            setResult(response);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Falha ao atualizar prompt');
        }
        finally {
            setIsSaving(false);
        }
    };
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Gest\u00E3o de prompts e instru\u00E7\u00F5es." }), _jsx("input", { className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm", value: actionType, onChange: (event) => setActionType(event.target.value), placeholder: "Tipo de a\u00E7\u00E3o" }), _jsx("textarea", { className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", rows: 6, value: prompt, onChange: (event) => setPrompt(event.target.value), placeholder: "Atualize o prompt do assistente" }), error && _jsx("div", { className: "text-sm text-destructive", children: error }), _jsx(Button, { type: "button", loading: isSaving, onClick: handleSave, children: "Guardar prompt" }), result && (_jsx("pre", { className: "rounded-md bg-muted p-3 text-xs overflow-auto", children: JSON.stringify(result, null, 2) }))] }));
}
//# sourceMappingURL=PromptManager.js.map