import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Exemplo de uso do FooterLandscape com o Footer principal
 *
 * O FooterLandscape é um componente decorativo que cria um paisagem SVG
 * animada e pode ser combinado com o Footer principal.
 */
import { Footer } from '../index';
import { FooterLandscape } from './components/FooterLandscape';
// Exemplo 1: Usando FooterLandscape sozinho (apenas decorativo)
export function DecorativeLandscapeExample() {
    return (_jsxs("div", { children: [_jsxs("main", { children: [_jsx("h1", { children: "P\u00E1gina com Paisagem Decorativa" }), _jsx("p", { children: "Conte\u00FAdo da p\u00E1gina aqui..." })] }), _jsx(FooterLandscape, { className: "mt-8" })] }));
}
// Exemplo 2: Combinando FooterLandscape com Footer principal
export function CombinedFooterExample() {
    return (_jsxs("div", { children: [_jsxs("main", { children: [_jsx("h1", { children: "P\u00E1gina Completa" }), _jsx("p", { children: "Conte\u00FAdo da p\u00E1gina aqui..." })] }), _jsxs("div", { className: "relative", children: [_jsx(FooterLandscape, {}), _jsx("div", { className: "absolute bottom-0 left-0 right-0", children: _jsx(Footer, { showNewsletter: true }) })] })] }));
}
// Exemplo 3: FooterLandscape como background para Footer
export function FooterWithBackgroundExample() {
    return (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 -z-10", children: _jsx(FooterLandscape, {}) }), _jsx(Footer, { compactMode: true, showNewsletter: false })] }));
}
// Exemplo 4: Uso em página de landing
export function LandingPageExample() {
    return (_jsxs("div", { children: [_jsx("section", { className: "min-h-screen flex items-center justify-center", children: _jsx("h1", { className: "text-6xl font-bold", children: "Bem-vindo!" }) }), _jsx("section", { className: "py-20", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsx("h2", { className: "text-4xl font-bold mb-8", children: "Nossos Servi\u00E7os" }), _jsx("p", { children: "Conte\u00FAdo sobre servi\u00E7os..." })] }) }), _jsxs("footer", { children: [_jsx(FooterLandscape, {}), _jsx(Footer, {})] })] }));
}
//# sourceMappingURL=examples.js.map