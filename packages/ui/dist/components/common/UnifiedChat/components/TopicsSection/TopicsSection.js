import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useCallback } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl'; // 1. Replaced import
import { Button } from '../../../Button';
import { cn } from '../../../../../utils/cn';
import { CHAT_TOPICS } from '../../UnifiedChat.constants';
// Icon mapping for string icon names
const iconMap = {
    HelpCircle,
    ChevronDown,
    ChevronUp,
    // Add more icon mappings as needed
};
const isConfigTopic = (topic) => {
    return 'label' in topic;
};
const convertToTopic = (topic) => {
    if (!isConfigTopic(topic)) {
        return topic;
    }
    return {
        id: topic.id,
        title: topic.label,
        description: topic.description ?? '',
        icon: topic.icon ? (iconMap[topic.icon] ?? HelpCircle) : HelpCircle,
    };
};
export const TopicsSection = React.memo(({ isMinimized, onToggleMinimize, onTopicSelect, topics }) => {
    const t = useTranslations('chat'); // 2. Updated hook with "chat" namespace
    // 1. Memoize filtered topics to prevent recalculation
    // Convert ConfigTopic[] to LocalChatTopic[] format
    const activeTopics = useMemo(() => {
        if (topics && topics.length > 0) {
            return topics.map(convertToTopic);
        }
        return CHAT_TOPICS;
    }, [topics]);
    // 2. Optimized click handler
    const handleHeaderClick = useCallback(() => {
        onToggleMinimize();
    }, [onToggleMinimize]);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleHeaderClick();
        }
    };
    // 3. Updated all t() calls to remove default values
    return (_jsxs("section", { className: "flex flex-col border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-300 shrink-0", "aria-labelledby": "topics-title", children: [_jsxs("div", { className: cn("flex items-center justify-between p-3 cursor-pointer group select-none", "hover:bg-gray-100/80 dark:hover:bg-gray-800/50 transition-colors"), onClick: handleHeaderClick, onKeyDown: handleKeyDown, role: "button", tabIndex: 0, "aria-expanded": !isMinimized, children: [_jsx("h4", { id: "topics-title", className: "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest", children: t('selectTopic') }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-gray-400", children: isMinimized ? t('expand') : t('collapse') }), isMinimized ? (_jsx(ChevronDown, { className: "h-4 w-4 text-gray-400" })) : (_jsx(ChevronUp, { className: "h-4 w-4 text-gray-400" }))] })] }), _jsx("div", { className: cn("grid transition-all duration-300 ease-in-out overflow-hidden", isMinimized ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"), children: _jsx("div", { className: "min-h-0", children: _jsx("div", { className: "grid grid-cols-2 gap-2 p-3 pt-0 max-h-[220px] overflow-y-auto custom-scrollbar", children: activeTopics.map((topic) => {
                            const IconComponent = topic.icon;
                            return (_jsxs(Button, { variant: "outline", className: cn("flex flex-col items-center gap-2 p-3 h-auto min-h-[80px]", "bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700", "hover:border-blue-500 dark:hover:border-blue-500", "hover:bg-blue-50/50 dark:hover:bg-blue-900/10", "rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group/item"), onClick: () => onTopicSelect(topic.title), type: "button", children: [_jsx("div", { className: "p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-900/40 transition-colors", children: _jsx(IconComponent, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" }) }), _jsxs("div", { className: "flex flex-col items-center text-center w-full", children: [_jsx("span", { className: "text-xs font-semibold leading-tight text-gray-900 dark:text-gray-100", children: topic.title }), topic.description && (_jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-1", children: topic.description }))] })] }, topic.id));
                        }) }) }) })] }));
});
TopicsSection.displayName = 'TopicsSection';
//# sourceMappingURL=TopicsSection.js.map