import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from '../../../ui/button';
export function SuggestionsRenderer(props) {
    const { suggestions, isLoading, error, onSelect } = props;
    if (isLoading) {
        return (_jsx("div", { className: "flex flex-wrap gap-2", children: Array.from({ length: 4 }).map((_, index) => (_jsx("div", { className: "h-8 w-24 rounded-md bg-muted" }, index))) }));
    }
    if (error) {
        return _jsx("div", { className: "text-sm text-destructive", children: error });
    }
    if (!suggestions.length) {
        return _jsx("div", { className: "text-sm text-muted-foreground", children: "Sem sugest\u00F5es dispon\u00EDveis." });
    }
    return (_jsx("div", { className: "flex flex-wrap gap-2", children: suggestions.map((suggestion) => (_jsx(Button, { type: "button", size: "sm", variant: "secondary", onClick: () => onSelect?.(suggestion), children: suggestion.label }, suggestion.id))) }));
}
//# sourceMappingURL=SuggestionsRenderer.js.map