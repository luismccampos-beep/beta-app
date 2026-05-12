import { type ReactNode } from "react";
interface MobileToolbarProps {
    title?: string;
    subtitle?: string;
    leading?: ReactNode;
    trailing?: ReactNode;
    className?: string;
}
declare function MobileToolbar({ title, subtitle, leading, trailing, className, }: MobileToolbarProps): import("react/jsx-runtime").JSX.Element;
export { MobileToolbar };
export type { MobileToolbarProps };
