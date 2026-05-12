interface CompactFooterProps {
    showSocialLinks?: boolean;
    className?: string;
    /** Versão simplificada para modais ou checkouts */
    minimal?: boolean;
}
declare function getFallback(key: string): string;
export declare function CompactFooter({ className, minimal }: CompactFooterProps): import("react/jsx-runtime").JSX.Element;
export { getFallback };
