import React from 'react';
export type LinkComponentProps = {
    href?: string | undefined;
    to?: string | undefined;
    replace?: boolean | undefined;
    prefetch?: boolean | undefined;
    state?: unknown | undefined;
    target?: string | undefined;
    rel?: string | undefined;
    onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
    children?: React.ReactNode | undefined;
    className?: string | undefined;
    [key: string]: unknown;
};
export type LinkComponent = React.ComponentType<LinkComponentProps>;
export declare const registerLinkComponent: (component: LinkComponent) => void;
export declare const getRegisteredLinkComponent: () => LinkComponent | null;
