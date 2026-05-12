"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { PreferencesForm } from './PreferencesForm';
import { useAIPreferences } from './useAIPreferences';
export function PreferencesManager() {
    const { data, isLoading, error, save, reset } = useAIPreferences();
    const [rawValue, setRawValue] = useState('{}');
    const [parseError, setParseError] = useState(null);
    useEffect(() => {
        setRawValue(JSON.stringify(data ?? {}, null, 2));
    }, [data]);
    const handleSave = async () => {
        try {
            const parsed = JSON.parse(rawValue);
            setParseError(null);
            await save(parsed);
        }
        catch (err) {
            setParseError(err instanceof Error ? err.message : 'JSON inválido');
        }
    };
    const handleReset = async () => {
        await reset();
    };
    return (_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "text-sm text-muted-foreground", children: "Prefer\u00EAncias em formato JSON." }), _jsx(PreferencesForm, { value: rawValue, onChange: setRawValue, onSave: handleSave, onReset: handleReset, isLoading: isLoading, error: parseError ?? error })] }));
}
//# sourceMappingURL=PreferencesManager.js.map