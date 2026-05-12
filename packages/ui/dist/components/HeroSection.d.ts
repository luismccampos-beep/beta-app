import * as React from 'react';
export interface HeroSectionProps {
    title: string | React.ReactNode;
    subtitle?: string;
    primaryAction?: {
        label: string;
        onClick?: () => void;
        href?: string;
    };
    secondaryAction?: {
        label: string;
        onClick?: () => void;
        href?: string;
    };
    backgroundImage?: string;
    backgroundVideo?: string;
    backgroundGradient?: string;
    textColor?: string;
    subtitleColor?: string;
    stats?: Array<{
        value: string;
        label: string;
    }>;
    badge?: {
        text: string;
        icon?: React.ReactNode;
    };
    className?: string;
    children?: React.ReactNode;
}
declare const HeroSection: React.FC<HeroSectionProps>;
export default HeroSection;
