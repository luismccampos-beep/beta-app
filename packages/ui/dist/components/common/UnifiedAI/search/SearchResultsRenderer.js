import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function SearchResultsRenderer(props) {
    const { query, results } = props;
    if (!query) {
        return _jsx("div", { className: "text-sm text-muted-foreground", children: "Digite um termo para pesquisar." });
    }
    if (!results) {
        return _jsx("div", { className: "text-sm text-muted-foreground", children: "Aguardando resultados." });
    }
    if (!results.suggestions.length) {
        return _jsx("div", { className: "text-sm text-muted-foreground", children: "Nenhum resultado encontrado." });
    }
    return (_jsx("div", { className: "space-y-2", children: results.suggestions.map((item) => (_jsxs("div", { className: "rounded-md border border-border p-3", children: [_jsx("div", { className: "font-medium", children: item.title }), item.description && _jsx("div", { className: "text-sm text-muted-foreground", children: item.description }), _jsxs("div", { className: "mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground", children: [item.category && _jsx("span", { children: item.category }), item.country && _jsx("span", { children: item.country }), item.tags?.map((tag) => (_jsxs("span", { children: ["#", tag] }, tag)))] })] }, item.id))) }));
}
//# sourceMappingURL=SearchResultsRenderer.js.map