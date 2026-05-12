import { jsx as _jsx } from "react/jsx-runtime";
export function ChatMessageRenderer(props) {
    const { message, role = 'assistant' } = props;
    const isUser = role === 'user';
    const isSystem = role === 'system';
    return (_jsx("div", { className: `flex ${isUser ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[80%] rounded-lg px-3 py-2 text-sm ${isSystem
                ? 'bg-muted text-muted-foreground'
                : isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'}`, children: message }) }));
}
//# sourceMappingURL=ChatMessageRenderer.js.map