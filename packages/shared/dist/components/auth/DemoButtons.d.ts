import React from 'react';
export interface DemoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    sublabel?: string;
    icon?: React.ReactNode;
    variant?: 'full' | 'compact';
    isLoading?: boolean;
    credentials?: {
        email: string;
        password: string;
    };
    appUrl?: string;
    emailSelector?: string;
    passwordSelector?: string;
    submitSelector?: string;
}
export interface DemoButtonsProps {
    variant?: 'full' | 'compact';
    onDemoLogin?: (role: 'admin' | 'user' | 'builder') => void | Promise<void>;
    roles?: Array<{
        id: 'admin' | 'user' | 'builder';
        label: string;
        sublabel?: string;
    }>;
}
export declare const DemoButton: React.FC<DemoButtonProps>;
export declare const DemoButtons: React.FC<DemoButtonsProps>;
