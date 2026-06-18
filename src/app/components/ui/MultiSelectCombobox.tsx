'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface MultiSelectComboboxProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelectCombobox({
  options,
  selected,
  onChange,
  placeholder = 'Select options',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found',
  className,
  disabled = false,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          open && 'ring-2 ring-ring ring-offset-2'
        )}
      >
        <span className="truncate text-left">
          {selectedLabels.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <span className="truncate">
              {selectedLabels.length === 1
                ? selectedLabels[0]
                : `${selectedLabels.length} selected`}
            </span>
          )}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-0 text-popover-foreground shadow-md">
          <div className="flex items-center border-b px-3">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="max-h-60 overflow-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredOptions.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                        'hover:bg-accent hover:text-accent-foreground',
                        isSelected && 'bg-accent'
                      )}
                    >
                      <div className="flex h-4 w-4 items-center justify-center">
                        {isSelected && <Check className="h-4 w-4" />}
                      </div>
                      <span className="ml-2 flex-1">{option.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            if (!option) return null;
            return (
              <span
                key={value}
                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs"
              >
                {option.label}
                <button
                  type="button"
                  onClick={(e) => handleRemove(value, e)}
                  className="rounded-full hover:bg-secondary-foreground/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}