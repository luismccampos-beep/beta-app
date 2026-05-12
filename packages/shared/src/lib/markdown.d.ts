import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
export { ReactMarkdown };
export { remarkGfm };
export declare const Markdown: ({ children, ...props }: React.ComponentProps<typeof ReactMarkdown>) => import("react/jsx-runtime").JSX.Element;
export declare const defaultMarkdownComponents: {
    h1: ({ children }: {
        children?: React.ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
    h2: ({ children }: {
        children?: React.ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
    h3: ({ children }: {
        children?: React.ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
    p: ({ children }: {
        children?: React.ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
    ul: ({ children }: {
        children?: React.ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
    ol: ({ children }: {
        children?: React.ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
    a: ({ href, children }: {
        href?: string;
        children?: React.ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
    code: ({ children }: {
        children?: React.ReactNode;
    }) => import("react/jsx-runtime").JSX.Element;
};
