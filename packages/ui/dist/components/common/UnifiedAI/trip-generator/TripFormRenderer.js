"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Button } from '../../../Button';
import { Input } from '../../../Input';
const defaultPreferences = {
    name: '',
    email: '',
    budget: 1500,
    duration: 5,
    interests: [],
    sustainability: 3,
    travelers: 2,
    destination: '',
    additionalComments: '',
};
export function TripFormRenderer(props) {
    const { formId, onSubmit } = props;
    const [formState, setFormState] = useState(defaultPreferences);
    const isValid = useMemo(() => formState.budget > 0 && formState.duration > 0 && formState.travelers > 0, [formState]);
    const handleChange = (key, value) => {
        setFormState((prev) => ({ ...prev, [key]: value }));
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!isValid)
            return;
        onSubmit?.(formState);
    };
    return (_jsxs("form", { id: formId, onSubmit: handleSubmit, className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: [_jsx(Input, { placeholder: "Nome", value: formState.name ?? '', onChange: (event) => handleChange('name', event.target.value) }), _jsx(Input, { placeholder: "Email", type: "email", value: formState.email ?? '', onChange: (event) => handleChange('email', event.target.value) }), _jsx(Input, { placeholder: "Destino desejado", value: formState.destination ?? '', onChange: (event) => handleChange('destination', event.target.value) }), _jsx(Input, { placeholder: "Interesses (separados por v\u00EDrgula)", value: formState.interests.join(', '), onChange: (event) => handleChange('interests', event.target.value.split(',').map((item) => item.trim()).filter(Boolean)) }), _jsx(Input, { placeholder: "Or\u00E7amento", type: "number", min: 0, value: formState.budget, onChange: (event) => handleChange('budget', Number(event.target.value)) }), _jsx(Input, { placeholder: "Dura\u00E7\u00E3o (dias)", type: "number", min: 1, value: formState.duration, onChange: (event) => handleChange('duration', Number(event.target.value)) }), _jsx(Input, { placeholder: "Viajantes", type: "number", min: 1, value: formState.travelers, onChange: (event) => handleChange('travelers', Number(event.target.value)) }), _jsx(Input, { placeholder: "Sustentabilidade (1-5)", type: "number", min: 1, max: 5, value: formState.sustainability, onChange: (event) => handleChange('sustainability', Number(event.target.value)) })] }), _jsx("textarea", { className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", rows: 3, placeholder: "Coment\u00E1rios adicionais", value: formState.additionalComments ?? '', onChange: (event) => handleChange('additionalComments', event.target.value) }), _jsx(Button, { type: "submit", disabled: !isValid, children: "Gerar viagem" })] }));
}
//# sourceMappingURL=TripFormRenderer.js.map