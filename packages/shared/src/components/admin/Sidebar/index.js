"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut } from 'lucide-react';

import { cn } from '../../../utils';
import { NavItem } from './NavItem';
import { SidebarSearch } from './SidebarSearch';
export const Sidebar = ({ navigation, isCollapsed = false, onToggleCollapse, className, user, searchPlaceholder = 'Search...', showSearch = true, showUser = true, variant = 'default' }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    // Search functionality
    const searchResults = useMemo(() => {
        if (!searchQuery.trim())
            return [];
        const results = [];
        navigation.forEach(section => {
            section.items.forEach(item => {
                const searchLower = searchQuery.toLowerCase();
                const labelMatch = item.label.toLowerCase().includes(searchLower);
                const descMatch = item.description?.toLowerCase().includes(searchLower);
                if (labelMatch || descMatch) {
                    results.push(item);
                }
                // Also search in children
                if (item.children) {
                    item.children.forEach(child => {
                        const childLabelMatch = child.label.toLowerCase().includes(searchLower);
                        const childDescMatch = child.description?.toLowerCase().includes(searchLower);
                        if (childLabelMatch || childDescMatch) {
                            results.push(child);
                        }
                    });
                }
            });
        });
        return results.slice(0, 8); // Limit results
    }, [navigation, searchQuery]);
    const handleNavigate = useCallback((item) => {
        if (item.external) {
            window.open(item.href, '_blank', 'noopener,noreferrer');
        }
        else {
            window.location.href = item.href;
        }
        setSearchQuery(''); // Clear search after navigation
    }, []);
    const handleSearchSelect = useCallback((item) => {
        handleNavigate(item);
    }, [handleNavigate]);
    const handleUserAction = useCallback((action) => {
        if (action === 'logout') {
            // Handle logout logic here
            window.location.href = '/logout';
        }
        else if (action === 'profile') {
            window.location.href = '/profile';
        }
        setIsUserMenuOpen(false);
    }, []);
    const renderNavigationSection = useCallback((section) => (_jsxs("div", { className: "mb-6", children: [!isCollapsed && section.title && (_jsx("h3", { className: "px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: section.title })), _jsx("div", { className: cn('space-y-1', isCollapsed && 'space-y-2'), children: section.items.map((item) => (_jsx(NavItem, { item: item, isCollapsed: isCollapsed, onClick: handleNavigate }, item.id))) })] }, section.id)), [isCollapsed, handleNavigate]);
    return (_jsxs(motion.aside, { initial: false, animate: {
            width: isCollapsed ? (variant === 'minimal' ? 60 : 80) : 280,
        }, className: cn('relative flex flex-col bg-card border-r border-border h-full', 'transition-all duration-300 ease-in-out', className), children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border", children: [!isCollapsed && (_jsx(motion.h2, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-lg font-semibold text-foreground", children: variant === 'minimal' ? '' : 'Admin' })), _jsx("button", { onClick: onToggleCollapse, className: "p-1.5 rounded-lg hover:bg-muted transition-colors", "aria-label": isCollapsed ? 'Expand sidebar' : 'Collapse sidebar', children: isCollapsed ? _jsx(Menu, { className: "w-4 h-4" }) : _jsx(X, { className: "w-4 h-4" }) })] }), showSearch && (_jsx("div", { className: "p-4 border-b border-border", children: _jsx(SidebarSearch, { query: searchQuery, onQueryChange: setSearchQuery, results: searchResults, isCollapsed: isCollapsed, placeholder: searchPlaceholder, onSelectResult: handleSearchSelect }) })), _jsx("nav", { className: "flex-1 overflow-y-auto p-4", "aria-label": "Main navigation", children: _jsx(AnimatePresence, { mode: "wait", children: navigation.map(renderNavigationSection) }) }), showUser && user && (_jsx("div", { className: "p-4 border-t border-border", children: _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setIsUserMenuOpen(!isUserMenuOpen), className: cn('w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors', isCollapsed && 'justify-center'), "aria-label": "User menu", "aria-expanded": isUserMenuOpen, children: [_jsx("div", { className: "w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0", children: user.avatar ? (_jsx("img", { src: user.avatar, alt: user.name, className: "w-full h-full rounded-full object-cover" })) : (_jsx(User, { className: "w-4 h-4 text-primary" })) }), !isCollapsed && (_jsxs("div", { className: "flex-1 text-left min-w-0", children: [_jsx("div", { className: "text-sm font-medium text-foreground truncate", children: user.name }), _jsx("div", { className: "text-xs text-muted-foreground truncate", children: user.email })] }))] }), _jsx(AnimatePresence, { children: isUserMenuOpen && !isCollapsed && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, className: "absolute bottom-full left-0 right-0 mb-2 bg-popover border rounded-lg shadow-lg z-50", role: "menu", children: _jsxs("div", { className: "p-1", children: [_jsxs("button", { onClick: () => handleUserAction('profile'), className: "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors", role: "menuitem", children: [_jsx(User, { className: "w-4 h-4" }), "Profile"] }), _jsxs("button", { onClick: () => handleUserAction('logout'), className: "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors text-red-600", role: "menuitem", children: [_jsx(LogOut, { className: "w-4 h-4" }), "Logout"] })] }) })) })] }) }))] }));
};
/** @alias */
export default Sidebar;
//# sourceMappingURL=index.js.map