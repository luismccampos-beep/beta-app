import { type ReactNode } from "react";

import { cn } from "../../utils/cn";

type BottomNavItemKey = string;

interface BottomNavItem {
  key: BottomNavItemKey;
  icon: ReactNode;
  label: string;
  badgeCount?: number;
  disabled?: boolean;
}

interface BottomNavProps {
  items: BottomNavItem[];
  activeKey?: BottomNavItemKey;
  onChange?: (key: BottomNavItemKey) => void;
  className?: string;
}

function BottomNav({
  items,
  activeKey,
  onChange,
  className,
}: BottomNavProps) {
  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-border bg-background/95 px-2 py-1.5 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden",
        className,
      )}
      aria-label="Bottom navigation"
    >
      <ul className="flex w-full items-center justify-around gap-1">
        {items.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <li key={item.key} className="flex-1">
              <button
                type="button"
                className={cn(
                  "relative mx-auto flex w-full max-w-[90px] flex-col items-center justify-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-medium transition-colors",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-muted/40",
                  item.disabled && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => {
                  if (item.disabled) return;
                  onChange?.(item.key);
                }}
                aria-current={isActive ? "page" : undefined}
                aria-disabled={item.disabled || undefined}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-[18px]",
                    isActive && "bg-primary text-primary-foreground",
                  )}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {typeof item.badgeCount === "number" && item.badgeCount > 0 && (
                  <span className="absolute -top-0.5 right-4 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                    {item.badgeCount > 99 ? "99+" : item.badgeCount}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { BottomNav };
export type { BottomNavItem, BottomNavProps, BottomNavItemKey };

