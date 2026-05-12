"use client";

import React, { useMemo, useCallback } from 'react';

import { getRegisteredLinkComponent } from './LinkRegistry';

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
function BaseLink(props: BaseLinkProps) {
  return <BaseLinkWithRouter {...props} />;
}

function BaseLinkWithRouter({
  to,
  children,
  state,
  external = false,
  replace,
  prefetch,
  onClick,
  target,
  rel,
  ...props
}: BaseLinkProps) {
  // Detect external URLs
  const isExternalUrl = useMemo(() => {
    if (external) return true;
    try {
      // Handle relative paths and protocol-relative paths
      if (to.startsWith('/') || to.startsWith('#') || to.startsWith('?')) return false;
      const url = new URL(to, typeof window !== 'undefined' ? window.location.href : 'http://localhost');
      return typeof window !== 'undefined' && url.origin !== window.location.origin;
    } catch {
      return false;
    }
  }, [to, external]);

  // Enhanced security for external links
  const secureRel = useMemo(() => {
    if (!isExternalUrl) return rel;
    const relParts = new Set(rel?.split(' ') || []);
    relParts.add('noopener');
    relParts.add('noreferrer');
    return Array.from(relParts).join(' ');
  }, [isExternalUrl, rel]);

  // Handle click events
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    
    if (
      isExternalUrl ||
      e.defaultPrevented ||
      e.button !== 0 || 
      e.metaKey || 
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      target === '_blank'
    ) {
      return;
    }
  }, [onClick, isExternalUrl, target]);

  // For external links, always use standard anchor
  if (isExternalUrl) {
    return (
      <a
        href={to}
        target={target}
        rel={secureRel}
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Use registered component if available (preferred for Next.js and custom routers)
  const RegisteredLink = getRegisteredLinkComponent();
  if (RegisteredLink) {
    return (
      <RegisteredLink
        href={to}
        to={to}
        replace={replace}
        prefetch={prefetch}
        state={state}
        target={target}
        rel={rel}
        onClick={handleClick}
        {...props}
      >
        {children}
      </RegisteredLink>
    );
  }

  // Fallback to standard anchor tag
  return (
    <a
      href={to}
      target={target}
      rel={rel}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}

export default BaseLink;
