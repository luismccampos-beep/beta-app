import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../../../../../utils';
import { formatMessageTime, shouldShowAvatar } from '../../utils/index';
import { StatusIndicator } from '../StatusIndicator/StatusIndicator';
const Avatar = ({ className, children }) => (_jsx("div", { className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className), children: children }));
const AvatarImage = ({ src, alt }) => (src ? _jsx("img", { src: src, alt: alt, className: "aspect-square h-full w-full" }) : null);
const AvatarFallback = ({ className, children }) => (_jsx("div", { className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className), children: children }));
export const MessageItem = React.memo(({ message, previousMessage, sessionUser }) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    const senderAvatar = sessionUser?.image;
    const fallbackAvatar = isUser ? sessionUser?.name?.charAt(0) || 'U' : 'AK';
    const showAvatar = shouldShowAvatar(message, previousMessage);
    if (isSystem) {
        return (_jsx("div", { className: "flex justify-center mb-2 animate-in fade-in-up duration-300", children: _jsx("div", { className: "bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 text-gray-500 dark:text-gray-400 border border-slate-300 dark:border-slate-700 rounded-xl text-center text-[13px] italic px-3 py-2 max-w-[80%] mx-auto shadow-sm", children: _jsx("div", { className: "opacity-80 leading-tight", children: message.content }) }) }));
    }
    return (_jsxs("div", { className: cn("flex gap-2.5 mb-4 animate-in fade-in-up duration-300", isUser ? "justify-end" : "justify-start"), children: [!isUser && (_jsxs(Avatar, { className: cn("w-7 h-7 self-end border-2 border-white/50", !showAvatar ? 'invisible' : ''), children: [senderAvatar ? _jsx(AvatarImage, { src: senderAvatar, alt: "Avatar do suporte" }) : null, _jsx(AvatarFallback, { className: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold flex items-center justify-center", children: fallbackAvatar })] })), _jsxs("div", { className: cn("max-w-[70%] md:max-w-[65%] p-3 rounded-2xl shadow-sm overflow-wrap-break-word relative", isUser
                    ? "bg-[#0088fe] text-white rounded-br-none"
                    : "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 rounded-bl-none"), children: [_jsx("div", { className: "text-[13px] md:text-sm break-words leading-relaxed markdown-content", children: message.type === 'markdown' || !isUser ? (_jsx(Markdown, { remarkPlugins: [remarkGfm], components: {
                                p: ({ children }) => _jsx("p", { className: "mb-1 last:mb-0", children: children }),
                                a: ({ href, children }) => _jsx("a", { href: href, target: "_blank", rel: "noopener noreferrer", className: "underline underline-offset-2", children: children }),
                                code: ({ children }) => _jsx("code", { className: "bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded font-mono text-xs", children: children }),
                                pre: ({ children }) => _jsx("pre", { className: "bg-black/10 dark:bg-white/10 p-2 rounded-lg overflow-x-auto my-2 text-xs font-mono", children: children }),
                                ul: ({ children }) => _jsx("ul", { className: "list-disc pl-4 mb-2", children: children }),
                                ol: ({ children }) => _jsx("ol", { className: "list-decimal pl-4 mb-2", children: children }),
                            }, children: message.content })) : (_jsx("span", { className: "whitespace-pre-wrap", children: message.content })) }), _jsx("p", { className: cn("text-[10px] mt-1.5 opacity-70", isUser ? "text-right" : "text-left"), children: formatMessageTime(message.timestamp) }), isUser && message.status && _jsx(StatusIndicator, { status: message.status })] }), isUser && (_jsxs(Avatar, { className: cn("w-7 h-7 self-end border-2 border-white/50", !showAvatar ? 'invisible' : ''), children: [senderAvatar ? _jsx(AvatarImage, { src: senderAvatar, alt: "Avatar do usu\u00E1rio" }) : null, _jsx(AvatarFallback, { className: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold flex items-center justify-center", children: fallbackAvatar })] }))] }));
}, (prev, next) => {
    return (prev.message.id === next.message.id &&
        prev.message.content === next.message.content &&
        prev.message.status === next.message.status &&
        prev.previousMessage?.id === next.previousMessage?.id &&
        prev.sessionUser?.image === next.sessionUser?.image);
});
MessageItem.displayName = 'MessageItem';
//# sourceMappingURL=MessageItem.js.map