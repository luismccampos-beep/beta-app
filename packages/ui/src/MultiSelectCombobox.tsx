'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  label?: string;
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
  label,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxId = `listbox-${Math.random().toString(36).slice(2, 9)}`;
  const labelId = `label-${Math.random().toString(36).slice(2, 9)}`;

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = useCallback(
    (value: string) => {
      if (selected.includes(value)) {
        onChange(selected.filter((item) => item !== value));
      } else {
        onChange([...selected, value]);
      }
    },
    [selected, onChange],
  );

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  const openListbox = () => {
    if (!disabled) {
      setOpen(true);
      setActiveIndex(-1);
    }
  };

  const closeListbox = () => {
    setOpen(false);
    setSearch('');
    setActiveIndex(-1);
  };

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeListbox();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          openListbox();
        } else {
          setActiveIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0,
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (open) {
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1,
          );
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (open && activeIndex >= 0 && activeIndex < filteredOptions.length) {
          handleSelect(filteredOptions[activeIndex].value);
        } else if (!open) {
          openListbox();
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeListbox();
        break;
    }
  };

  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);

  const listbox = open && (
    <div
      className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-0 text-popover-foreground shadow-md"
      role="listbox"
      aria-label={label || placeholder}
      id={listboxId}
    >
      <div className="flex items-center border-b px-3">
        <input
          ref={searchInputRef}
          type="text"
          role="searchbox"
          aria-label={searchPlaceholder}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `option-${filteredOptions[activeIndex]?.value}` : undefined
          }
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="max-h-60 overflow-auto p-1">
        {filteredOptions.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground" role="status">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredOptions.map((option, index) => {
              const isSelected = selected.includes(option.value);
              const isFocused = index === activeIndex;
              return (
                <div
                  key={option.value}
                  id={`option-${option.value}`}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isFocused ? 0 : -1}
                  onClick={() => handleSelect(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(option.value);
                    }
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                    'hover:bg-accent hover:text-accent-foreground',
                    isSelected && 'bg-accent',
                    isFocused && 'bg-accent/50',
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
  );

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <span id={labelId} className="sr-only">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => (open ? closeListbox() : openListbox())}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label || placeholder}
        aria-controls={open ? listboxId : undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          open && 'ring-2 ring-ring ring-offset-2',
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

      {listbox}

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1" role="group" aria-label="Selected items">
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
                  aria-label={`Remove ${option.label}`}
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
