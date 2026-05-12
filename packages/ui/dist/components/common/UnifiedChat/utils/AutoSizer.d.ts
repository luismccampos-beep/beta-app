import React from 'react';
export type Size = {
    height: number;
    width: number;
};
export type AutoSizerProps = {
    children: (size: Size) => React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};
declare const AutoSizer: ({ children, className, style }: AutoSizerProps) => import("react/jsx-runtime").JSX.Element;
export default AutoSizer;
