import * as React from "react";
export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    titleKey1?: string;
    titleKey2?: string;
    subtitleKey?: string;
    namespace?: string;
    accentVariant?: 'gradient' | 'underline' | 'highlight' | 'default';
    align?: 'left' | 'center' | 'right';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showRule?: boolean;
}
declare const SectionHeader: React.ForwardRefExoticComponent<SectionHeaderProps & React.RefAttributes<HTMLDivElement>>;
export { SectionHeader };
