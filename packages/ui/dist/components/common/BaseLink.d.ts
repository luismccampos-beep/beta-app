import React from 'react';
interface BaseLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    to: string;
    state?: unknown;
    /** Force external link behavior (always use <a> tag with target="_blank") */
    external?: boolean;
    /** Replace instead of push to history */
    replace?: boolean;
    /** Next.js specific: whether to prefetch the linked page */
    prefetch?: boolean;
}
/**
 * Enhanced link component that intelligently routes between:
 * - Next.js (uses registered Link component or standard <a>)
 * - React Router (uses registered Link component or falls back to <a>)
 * - Standard navigation (falls back to <a> tag)
 *
 * Host applications should register their preferred Link component
 * using registerLinkComponent() from @akmleva/shared/components.
 */
declare function BaseLink(props: BaseLinkProps): import("react/jsx-runtime").JSX.Element;
export default BaseLink;
