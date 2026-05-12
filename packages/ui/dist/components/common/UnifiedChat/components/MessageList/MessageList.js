import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useCallback, useMemo } from 'react';
import { List, useListRef } from 'react-window';
import AutoSizer from '../../utils/AutoSizer';
import { MessageItem } from '../MessageItem/MessageItem';
import { TypingIndicator } from '../TypingIndicator/TypingIndicator';
const estimateItemSize = (content, type) => {
    const baseHeight = 60;
    const charsPerLine = 50;
    const lineHeight = 20;
    const cleanContent = content || '';
    const lines = Math.ceil(cleanContent.length / charsPerLine) + (cleanContent.split('\n').length - 1);
    let extra = 0;
    if (type === 'code')
        extra += 40;
    if (type === 'markdown')
        extra += 20;
    return Math.min(baseHeight + (lines * lineHeight) + extra, 800);
};
const Row = ({ index, style, ariaAttributes, messages, isAssistantTyping, sessionUser }) => {
    if (index === messages.length && isAssistantTyping) {
        return (_jsx("div", { style: style, className: "px-4", ...ariaAttributes, children: _jsx(TypingIndicator, {}) }));
    }
    // eslint-disable-next-line security/detect-object-injection -- index is controlled by react-window and is always a valid number
    const message = messages[index];
    const previousMessage = index > 0 ? messages[index - 1] : undefined;
    if (!message)
        return null;
    return (_jsx("div", { style: style, className: "px-4", ...ariaAttributes, children: _jsx(MessageItem, { message: message, ...(previousMessage ? { previousMessage } : {}), ...(sessionUser ? { sessionUser } : {}) }) }));
};
export const MessageList = React.memo(({ messages, isAssistantTyping, sessionUser }) => {
    const listRef = useListRef(null);
    useEffect(() => {
        if (listRef.current) {
            const lastIndex = messages.length + (isAssistantTyping ? 1 : 0) - 1;
            if (lastIndex >= 0) {
                listRef.current.scrollToRow({ index: lastIndex, align: 'end' });
            }
        }
    }, [messages, isAssistantTyping]);
    const getItemSize = useCallback((index) => {
        if (index === messages.length && isAssistantTyping)
            return 40;
        // eslint-disable-next-line security/detect-object-injection -- index is controlled by react-window and is always a valid number
        const msg = messages[index];
        if (!msg)
            return 60;
        return estimateItemSize(msg.content, msg.type);
    }, [messages, isAssistantTyping]);
    const rowProps = useMemo(() => ({
        messages,
        isAssistantTyping,
        sessionUser
    }), [messages, isAssistantTyping, sessionUser]);
    const itemCount = messages.length + (isAssistantTyping ? 1 : 0);
    return (_jsx("div", { className: "flex-1 w-full h-full bg-transparent", role: "log", "aria-live": "polite", children: _jsx(AutoSizer, { children: ({ height, width }) => (_jsx(List, { className: "scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent", defaultHeight: height, listRef: listRef, rowComponent: Row, rowCount: itemCount, rowHeight: (index) => getItemSize(index), rowProps: rowProps, style: { height, width } })) }) }));
});
MessageList.displayName = 'MessageList';
//# sourceMappingURL=MessageList.js.map