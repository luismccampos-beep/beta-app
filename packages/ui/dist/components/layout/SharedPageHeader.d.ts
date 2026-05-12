import type { ReactNode } from 'react';
interface SharedPageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    meta?: ReactNode;
    actions?: ReactNode;
    align?: 'left' | 'center';
    className?: string;
}
export default function SharedPageHeader({ title, subtitle, icon, meta, actions, align, className, }: SharedPageHeaderProps): import("react/jsx-runtime").JSX.Element;
export {};
