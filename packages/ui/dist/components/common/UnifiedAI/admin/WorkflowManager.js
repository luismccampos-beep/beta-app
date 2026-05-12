"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '../../../ui/button';
import { runAdminAction } from './adminAIService';
export function WorkflowManager() {
    const [actionType, setActionType] = useState('');
    const [payload, setPayload] = useState('{}');
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const handleRun = async () => {
        setIsRunning(true);
        setError(null);
        setResult(null);
        try {
            const parsed = JSON.parse(payload || '{}');
            const action = {
                id: `admin-${Date.now()}`,
                type: actionType || 'workflow.run',
                payload: parsed,
            };
            const response = await runAdminAction(action);
            setResult(response);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Falha ao executar workflow');
        }
        finally {
            setIsRunning(false);
        }
    };
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Executar workflows administrativos." }), _jsx("input", { className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm", placeholder: "Tipo de a\u00E7\u00E3o (ex: workflow.run)", value: actionType, onChange: (event) => setActionType(event.target.value) }), _jsx("textarea", { className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", rows: 4, value: payload, onChange: (event) => setPayload(event.target.value) }), error && _jsx("div", { className: "text-sm text-destructive", children: error }), _jsx(Button, { type: "button", loading: isRunning, onClick: handleRun, children: "Executar" }), result && (_jsx("pre", { className: "rounded-md bg-muted p-3 text-xs overflow-auto", children: JSON.stringify(result, null, 2) }))] }));
}
//# sourceMappingURL=WorkflowManager.js.map