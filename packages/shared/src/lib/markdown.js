import { jsx as _jsx } from "react/jsx-runtime";
// Markdown renderer using react-markdown and remark-gfm
// This file ensures the dependencies are properly used in the project
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
export { ReactMarkdown };
export { remarkGfm };
// Re-export with GFM plugin enabled by default
export const Markdown = ({ children, ...props }) => (_jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], ...props, children: children }));
// Default markdown components for common HTML elements
export const defaultMarkdownComponents = {
    h1: ({ children }) => _jsx("h1", { className: "text-2xl font-bold mb-4", children: children }),
    h2: ({ children }) => _jsx("h2", { className: "text-xl font-bold mb-3", children: children }),
    h3: ({ children }) => _jsx("h3", { className: "text-lg font-bold mb-2", children: children }),
    p: ({ children }) => _jsx("p", { className: "mb-4", children: children }),
    ul: ({ children }) => _jsx("ul", { className: "list-disc pl-6 mb-4", children: children }),
    ol: ({ children }) => _jsx("ol", { className: "list-decimal pl-6 mb-4", children: children }),
    a: ({ href, children }) => (_jsx("a", { href: href, className: "text-blue-600 hover:underline", children: children })),
    code: ({ children }) => (_jsx("code", { className: "bg-gray-100 rounded px-1 py-0.5 text-sm", children: children })),
};
//# sourceMappingURL=markdown.js.map