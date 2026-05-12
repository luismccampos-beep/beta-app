"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut } from 'lucide-react';

import { cn } from '../../../utils';
import type { SidebarProps, NavigationItem, NavigationSection } from './types';
import { NavItem } from './NavItem';
import { SidebarSearch } from './SidebarSearch';

export const Sidebar: React.FC<SidebarProps> = ({
  navigation,
  isCollapsed = false,
  onToggleCollapse,
  className,
  user,
  searchPlaceholder = 'Search...',
  showSearch = true,
  showUser = true,
  variant = 'default'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const results: NavigationItem[] = [];
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

  const handleNavigate = useCallback((item: NavigationItem) => {
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = item.href;
    }
    setSearchQuery(''); // Clear search after navigation
  }, []);

  const handleSearchSelect = useCallback((item: NavigationItem) => {
    handleNavigate(item);
  }, [handleNavigate]);

  const handleUserAction = useCallback((action: 'profile' | 'logout') => {
    if (action === 'logout') {
      // Handle logout logic here
      window.location.href = '/logout';
    } else if (action === 'profile') {
      window.location.href = '/profile';
    }
    setIsUserMenuOpen(false);
  }, []);

  const renderNavigationSection = useCallback((section: NavigationSection) => (
    <div key={section.id} className="mb-6">
      {!isCollapsed && section.title && (
        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {section.title}
        </h3>
      )}
      <div className={cn('space-y-1', isCollapsed && 'space-y-2')}>
        {section.items.map((item: NavigationItem) => (
          <NavItem
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            onClick={handleNavigate}
          />
        ))}
      </div>
    </div>
  ), [isCollapsed, handleNavigate]);

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? (variant === 'minimal' ? 60 : 80) : 280,
      }}
      className={cn(
        'relative flex flex-col bg-card border-r border-border h-full',
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-semibold text-foreground"
          >
            {variant === 'minimal' ? '' : 'Admin'}
          </motion.h2>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </button>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="p-4 border-b border-border">
          <SidebarSearch
            query={searchQuery}
            onQueryChange={setSearchQuery}
            results={searchResults}
            isCollapsed={isCollapsed}
            placeholder={searchPlaceholder}
            onSelectResult={handleSearchSelect}
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4" aria-label="Main navigation">
        <AnimatePresence mode="wait">
          {navigation.map(renderNavigationSection)}
        </AnimatePresence>
      </nav>

      {/* User Section */}
      {showUser && user && (
        <div className="p-4 border-t border-border">
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={cn(
                'w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors',
                isCollapsed && 'justify-center'
              )}
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-primary" />
                )}
              </div>
              {!isCollapsed && (
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                </div>
              )}
            </button>

            {/* User Menu */}
            <AnimatePresence>
              {isUserMenuOpen && !isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-popover border rounded-lg shadow-lg z-50"
                  role="menu"
                >
                  <div className="p-1">
                    <button
                      onClick={() => handleUserAction('profile')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                      role="menuitem"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => handleUserAction('logout')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors text-red-600"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.aside>
  );
};

/** @alias */
export default Sidebar;
