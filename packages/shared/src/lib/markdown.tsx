// Markdown renderer using react-markdown and remark-gfm
// This file ensures the dependencies are properly used in the project

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export { ReactMarkdown };
export { remarkGfm };

// Re-export with GFM plugin enabled by default
export const Markdown = ({ children, ...props }: React.ComponentProps<typeof ReactMarkdown>) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} {...props}>
    {children}
  </ReactMarkdown>
);

// Default markdown components for common HTML elements
export const defaultMarkdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
  h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
  h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
  p: ({ children }: { children?: React.ReactNode }) => <p className="mb-4">{children}</p>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} className="text-blue-600 hover:underline">{children}</a>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="bg-gray-100 rounded px-1 py-0.5 text-sm">{children}</code>
  ),
};
