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

let registeredLinkComponent: LinkComponent | null = null;

export const registerLinkComponent = (component: LinkComponent) => {
  registeredLinkComponent = component;
};

export const getRegisteredLinkComponent = () => registeredLinkComponent;
