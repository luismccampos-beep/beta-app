import React, { type HTMLAttributes } from 'react';
type LogoVariant = 'default' | 'inverted' | 'gradient';
type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
interface LogoProps extends HTMLAttributes<HTMLDivElement> {
    variant?: LogoVariant;
    size?: LogoSize;
    withIcon?: boolean;
    withText?: boolean;
    animateOnHover?: boolean;
    glowEffect?: boolean;
    withParticles?: boolean;
    pulseOnIdle?: boolean;
    label?: string;
    imageSrc?: string;
    className?: string;
}
export declare const Logo: React.FC<LogoProps>;
export {};
