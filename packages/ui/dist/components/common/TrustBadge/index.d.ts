import React from 'react';
export interface TrustBadgeProps {
    icon: React.ComponentType<{
        className?: string;
    }>;
    title: string;
    description: string;
    className?: string;
}
export declare const TrustBadge: React.FC<TrustBadgeProps>;
/** @alias */
export default TrustBadge;
