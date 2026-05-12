"use client";

import React from 'react';
import { Search, X } from 'lucide-react';

import { cn } from '../../../utils';
import { SidebarSearchProps, NavigationItem } from './types';

export const SidebarSearch: React.FC<SidebarSearchProps> = ({
  query,
  onQueryChange,
  results,
  isCollapsed = false,
  placeholder = 'Search...',
  onSelectResult
}) => {
  const handleClear = () => {
    onQueryChange('');
  };

  const handleSelect = (item: NavigationItem) => {
    if (onSelectResult) {
      onSelectResult(item);
    }
  };

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-2 bg-muted/50 border border-border rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'text-sm placeholder:text-muted-foreground'
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {query && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-2">
            {results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
              >
                {item.icon && <item.icon className="w-4 h-4 text-muted-foreground" />}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

