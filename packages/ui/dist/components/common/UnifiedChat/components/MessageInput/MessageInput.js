import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Paperclip, SendHorizontal as SendIcon } from 'lucide-react';
import { useTranslations } from 'next-intl'; // 1. Replaced import
import { Button } from '../../../Button';
import { Input } from '../../../../Input';
const COMMANDS = ['/clear', '/help', '/support', '/reset'];
export const MessageInput = React.memo(({ onSendMessage, isSending }) => {
    const t = useTranslations('chat'); // 2. Updated hook with "chat" namespace
    const [inputValue, setInputValue] = useState('');
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [filteredCommands, setFilteredCommands] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    useEffect(() => {
        if (!isSending) {
            inputRef.current?.focus();
        }
    }, [isSending]);
    const updateAutocomplete = (value) => {
        if (value.startsWith('/')) {
            const query = value.toLowerCase();
            const matches = COMMANDS.filter((cmd) => cmd.startsWith(query));
            setFilteredCommands(matches);
            setShowAutocomplete(matches.length > 0);
            setSelectedIndex(0);
        }
        else {
            setFilteredCommands([]);
            setShowAutocomplete(false);
            setSelectedIndex(0);
        }
    };
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        updateAutocomplete(value);
    };
    const selectCommand = (cmd) => {
        setInputValue(cmd + ' ');
        setShowAutocomplete(false);
        inputRef.current?.focus();
        inputRef.current?.setSelectionRange(cmd.length + 1, cmd.length + 1);
    };
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const trimmedValue = inputValue.trim();
        if (!trimmedValue)
            return;
        onSendMessage(trimmedValue);
        setInputValue('');
        setShowAutocomplete(false);
    }, [inputValue, onSendMessage]);
    const handleKeyDown = useCallback((e) => {
        if (showAutocomplete && filteredCommands.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
                return;
            }
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                // eslint-disable-next-line security/detect-object-injection
                const selectedCmd = filteredCommands[selectedIndex];
                if (selectedCmd)
                    selectCommand(selectedCmd);
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                setShowAutocomplete(false);
                return;
            }
        }
        if (e.key === 'Enter' && !e.shiftKey && !showAutocomplete) {
            e.preventDefault();
            handleSubmit(e);
        }
    }, [handleSubmit, showAutocomplete, filteredCommands, selectedIndex]);
    // 3. Updated all t() calls to remove default values
    return (_jsxs("form", { onSubmit: handleSubmit, className: "p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-xl pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shrink-0 relative", children: [showAutocomplete && filteredCommands.length > 0 && (_jsx("div", { className: "absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-10", children: _jsx("ul", { className: "py-1 max-h-60 overflow-y-auto", children: filteredCommands.map((cmd, index) => (_jsx("li", { className: `px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${index === selectedIndex
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : ''}`, onMouseDown: (e) => e.preventDefault(), onClick: () => selectCommand(cmd), children: cmd }, cmd))) }) })), _jsxs("div", { className: "flex gap-2 items-center", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Input, { ref: inputRef, type: "text", placeholder: t('inputPlaceholder'), value: inputValue, onChange: handleInputChange, onKeyDown: handleKeyDown, className: "w-full h-10 text-sm bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 rounded-lg px-3 pr-11 transition-all focus:ring-2 focus:ring-[#0088fe]/10 focus:border-[#0088fe] disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-500", disabled: isSending, "aria-label": t('messageInput'), maxLength: 1000, autoComplete: "off" }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md", "aria-label": t('attachFile'), disabled: isSending, children: _jsx(Paperclip, { className: "h-4 w-4" }) })] }), _jsxs(Button, { type: "submit", size: "sm", className: "h-10 w-10 p-0 bg-[#0088fe] hover:bg-blue-600 text-white rounded-lg transition-all flex items-center justify-center disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500", disabled: !inputValue.trim() || isSending, "aria-label": t('sendMessage'), children: [isSending ? _jsx(Loader2, { className: "h-5 w-5 animate-spin" }) : _jsx(SendIcon, { className: "h-5 w-5" }), _jsx("span", { className: "sr-only", children: t('sendMessage') })] })] })] }));
});
MessageInput.displayName = 'MessageInput';
//# sourceMappingURL=MessageInput.js.map