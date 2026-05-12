"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useMemo, useCallback } from 'react';
import { getRegisteredLinkComponent } from './LinkRegistry';
/**
 * Enhanced link component that intelligently routes between:
 * - Next.js (uses registered Link component or standard <a>)
 * - React Router (uses registered Link component or falls back to <a>)
 * - Standard navigation (falls back to <a> tag)
 *
 * Host applications should register their preferred Link component
 * using registerLinkComponent() from @akmleva/shared/components.
 */
function BaseLink(props) {
    return _jsx(BaseLinkWithRouter, { ...props });
}
function BaseLinkWithRouter({ to, children, state, external = false, replace, prefetch, onClick, target, rel, ...props }) {
    // Detect external URLs
    const isExternalUrl = useMemo(() => {
        if (external)
            return true;
        try {
            // Handle relative paths and protocol-relative paths
            if (to.startsWith('/') || to.startsWith('#') || to.startsWith('?'))
                return false;
            const url = new URL(to, typeof window !== 'undefined' ? window.location.href : 'http://localhost');
            return typeof window !== 'undefined' && url.origin !== window.location.origin;
        }
        catch {
            return false;
        }
    }, [to, external]);
    // Enhanced security for external links
    const secureRel = useMemo(() => {
        if (!isExternalUrl)
            return rel;
        const relParts = new Set(rel?.split(' ') || []);
        relParts.add('noopener');
        relParts.add('noreferrer');
        return Array.from(relParts).join(' ');
    }, [isExternalUrl, rel]);
    // Handle click events
    const handleClick = useCallback((e) => {
        onClick?.(e);
        if (isExternalUrl ||
            e.defaultPrevented ||
            e.button !== 0 ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey ||
            target === '_blank') {
            return;
        }
    }, [onClick, isExternalUrl, target]);
    // For external links, always use standard anchor
    if (isExternalUrl) {
        return (_jsx("a", { href: to, target: target, rel: secureRel, onClick: handleClick, ...props, children: children }));
    }
    // Use registered component if available (preferred for Next.js and custom routers)
    const RegisteredLink = getRegisteredLinkComponent();
    if (RegisteredLink) {
        return (_jsx(RegisteredLink, { href: to, to: to, replace: replace, prefetch: prefetch, state: state, target: target, rel: rel, onClick: handleClick, ...props, children: children }));
    }
    // Fallback to standard anchor tag
    return (_jsx("a", { href: to, target: target, rel: rel, onClick: handleClick, ...props, children: children }));
}
export default BaseLink;
//# sourceMappingURL=BaseLink.js.map