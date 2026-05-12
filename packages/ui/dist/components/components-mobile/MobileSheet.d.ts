import { type ReactNode } from "react";
interface MobileSheetProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
    className?: string;
    ariaLabel?: string;
}
declare function MobileSheet({ open, onOpenChange, children, className, ariaLabel, }: MobileSheetProps): import("react/jsx-runtime").JSX.Element | null;
export { MobileSheet };
export type { MobileSheetProps };
