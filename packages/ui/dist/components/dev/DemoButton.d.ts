import React from 'react';
export interface DemoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    sublabel?: string;
    icon?: React.ReactNode;
    variant?: 'full' | 'compact';
    isLoading?: boolean;
}
export declare const DemoButton: React.FC<DemoButtonProps>;
