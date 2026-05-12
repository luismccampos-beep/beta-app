import { type ReactNode } from "react";

import { cn } from "../../utils/cn";

interface MobileSheetProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

function MobileSheet({
  open,
  onOpenChange,
  children,
  className,
  ariaLabel,
}: MobileSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={() => onOpenChange?.(false)}
      />
      <section
        className={cn(
          "relative z-10 w-full max-w-md rounded-t-2xl border border-border bg-background p-4 shadow-lg",
          "animate-in slide-in-from-bottom-4 duration-200",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted" />
        {children}
      </section>
    </div>
  );
}

export { MobileSheet };
export type { MobileSheetProps };
