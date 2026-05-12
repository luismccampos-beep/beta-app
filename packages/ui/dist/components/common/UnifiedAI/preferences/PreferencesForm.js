import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../../../ui/button';
export function PreferencesForm(props) {
    const { formId, value, onChange, onSave, onReset, isLoading, error } = props;
    return (_jsxs("form", { id: formId, className: "space-y-3", onSubmit: (event) => {
            event.preventDefault();
            onSave();
        }, children: [_jsx("textarea", { className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", rows: 6, value: value, onChange: (event) => onChange(event.target.value) }), error && _jsx("div", { className: "text-sm text-destructive", children: error }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Button, { type: "submit", loading: Boolean(isLoading), children: "Guardar prefer\u00EAncias" }), _jsx(Button, { type: "button", variant: "ghost", onClick: onReset, children: "Repor" })] })] }));
}
//# sourceMappingURL=PreferencesForm.js.map