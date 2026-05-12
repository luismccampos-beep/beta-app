import { type ReactNode } from "react";

import { cn } from "../../utils/cn";

interface MobileToolbarProps {
  title?: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}

function MobileToolbar({
  title,
  subtitle,
  leading,
  trailing,
  className,
}: MobileToolbarProps) {
  const hasText = Boolean(title || subtitle);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden",
        className,
      )}
    >
      {leading && (
        <div className="flex h-9 w-9 items-center justify-center">
          {leading}
        </div>
      )}

      {hasText && (
        <div className="flex min-w-0 flex-1 flex-col">
          {title && (
            <div className="truncate text-sm font-semibold leading-tight">
              {title}
            </div>
          )}
          {subtitle && (
            <div className="truncate text-xs text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>
      )}

      {trailing && (
        <div className="ml-auto flex items-center gap-1">
          {trailing}
        </div>
      )}
    </header>
  );
}

export { MobileToolbar };
export type { MobileToolbarProps };
