import type { ComponentType, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from '@akmleva/ui';
import LanguageSwitcher, { LanguageSwitcherSize, LanguageSwitcherVariant } from '@akmleva/shared/components/LanguageSwitcher';

import type { SharedNavItem, SharedUser } from './navigation/types';
import SharedThemeToggle from './SharedThemeToggle';

interface SharedMobileMenuProps {
  open: boolean;
  items: SharedNavItem[];
  currentPath: string;
  onNavigate: (href: string) => void;
  LinkComponent: ComponentType<{ href: string; children: ReactNode }>;
  user?: SharedUser;
  theme?: 'light' | 'dark' | 'system';
  onThemeToggle?: () => void;
}

function isActivePath(currentPath: string, href: string) {
  if (!href || !currentPath) return false;
  if (currentPath === href) return true;
  if (href === '/') return currentPath === '/';
  return currentPath.startsWith(href + '/');
}

const menuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
      when: 'afterChildren',
    },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
      when: 'afterChildren',
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
};

export default function SharedMobileMenu({
  open,
  items,
  currentPath,
  onNavigate,
  LinkComponent,
  user,
  theme,
  onThemeToggle,
}: SharedMobileMenuProps) {
  const hasItems = items.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-md shadow-lg overflow-hidden"
        >
          <div className="px-4 py-4 space-y-4">
            {user ? (
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 p-2 rounded-lg bg-accent/50"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || user.email || ''}
                    className="h-10 w-10 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold border border-border">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user.name || user.email}
                  </span>
                  {user.role ? (
                    <span className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </span>
                  ) : null}
                </div>
              </motion.div>
            ) : null}

            <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm font-medium text-muted-foreground">Aparência</span>
              <div className="flex items-center gap-2">
                <LanguageSwitcher
                  showLabel={true}
                  variant={LanguageSwitcherVariant.GHOST}
                  size={LanguageSwitcherSize.SMALL}
                  Button={Button}
                  DropdownMenu={DropdownMenu}
                  DropdownMenuContent={DropdownMenuContent}
                  DropdownMenuItem={DropdownMenuItem}
                  DropdownMenuTrigger={DropdownMenuTrigger}
                />
                <SharedThemeToggle
                  {...(theme ? { theme } : {})}
                  {...(onThemeToggle ? { onToggleTheme: onThemeToggle } : {})}
                />
              </div>
            </motion.div>

            {hasItems ? (
              <nav className="flex flex-col gap-1">
                {items.map((item) => {
                  const active = isActivePath(currentPath, item.href);
                  const Icon = item.icon;

                  return (
                    <LinkComponent key={item.href} href={item.href}>
                      <motion.button
                        variants={itemVariants}
                        type="button"
                        onClick={() => onNavigate(item.href)}
                        className={[
                          'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                        ].join(' ')}
                      >
                        <span className="flex items-center gap-3">
                          {Icon ? <Icon className="h-4 w-4" /> : null}
                          {item.label}
                        </span>
                        {item.badge ? (
                          <Badge
                            variant="secondary"
                            className="ml-2 px-1.5 py-0 text-[10px]"
                          >
                            {item.badge}
                          </Badge>
                        ) : null}
                      </motion.button>
                    </LinkComponent>
                  );
                })}
              </nav>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
