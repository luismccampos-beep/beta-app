import type { ComponentType, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@akmleva/ui';

import type { SharedNavItem } from './navigation/types';

interface SharedDesktopMenuProps {
  items: SharedNavItem[];
  currentPath: string;
  onNavigate: (href: string) => void;
  LinkComponent: ComponentType<{ href: string; children: ReactNode }>;
}

function isActivePath(currentPath: string, href: string) {
  if (!href || !currentPath) return false;
  if (currentPath === href) return true;
  if (href === '/') return currentPath === '/';
  return currentPath.startsWith(href + '/');
}

export default function SharedDesktopMenu({
  items,
  currentPath,
  onNavigate,
  LinkComponent,
}: SharedDesktopMenuProps) {
  if (!items.length) return null;

  return (
    <nav className="hidden md:flex items-center gap-1">
      {items.map((item) => {
        const active = isActivePath(currentPath, item.href);
        const Icon = item.icon;

        return (
          <LinkComponent key={item.href} href={item.href}>
            <button
              type="button"
              onClick={() => onNavigate(item.href)}
              className={[
                'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                'hover:text-foreground',
                active ? 'text-foreground' : 'text-muted-foreground',
              ].join(' ')}
            >
              {active && (
                <motion.div
                  layoutId="activeNavBoundingBox"
                  className="absolute inset-0 bg-accent/60 rounded-lg -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {Icon ? <Icon className="h-4 w-4 relative z-10" /> : null}
              <span className="relative z-10">{item.label}</span>
              {item.badge ? (
                <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0 relative z-10">
                  {item.badge}
                </Badge>
              ) : null}
            </button>
          </LinkComponent>
        );
      })}
    </nav>
  );
}

