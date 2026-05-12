"use client";

import { type ReactNode } from "react";
import { ArrowLeft, Menu, Search, Settings } from "lucide-react";

import { Button } from "../Button";
import { MobileToolbar } from "../components-mobile/MobileToolbar";
import SharedThemeToggle from "./SharedThemeToggle";
import SharedUserMenu from "./SharedUserMenu";
import type { SharedUser } from "./navigation/types";
import { cn } from "../../utils/cn";

interface SharedMobileHeaderProps {
    title?: string;
    subtitle?: string;

    // Back button
    showBackButton?: boolean;
    onBackClick?: () => void;

    // Search
    showSearch?: boolean;
    onSearchClick?: () => void;

    // Settings
    showSettings?: boolean;
    onSettingsClick?: () => void;

    // Theme
    showTheme?: boolean;
    theme?: 'light' | 'dark' | 'system';
    isDark?: boolean;
    onThemeToggle?: () => void;

    // User
    user?: SharedUser;
    showUser?: boolean;
    onLogin?: () => void;
    onLogout?: () => void;
    onUserClick?: () => void;
    onNavigate?: (path: string) => void;

    // Menu
    showMenu?: boolean;
    onMenuClick?: () => void;

    className?: string;
    t?: (key: string, defaultValue?: string) => string;

    // Extra slots
    leading?: ReactNode;
    trailing?: ReactNode;
}

export default function SharedMobileHeader({
    title,
    subtitle,
    showBackButton = false,
    onBackClick,
    showSearch = false,
    onSearchClick,
    showSettings = false,
    onSettingsClick,
    showTheme = false,
    theme,
    isDark,
    onThemeToggle,
    user,
    showUser = false,
    onLogin,
    onLogout,
    onUserClick: _onUserClick,
    onNavigate,
    showMenu = false,
    onMenuClick,
    className,
    t,
    leading: customLeading,
    trailing: customTrailing,
}: SharedMobileHeaderProps) {

    const buttonClasses = "h-8 w-8 p-0";

    const leading = customLeading || (showBackButton ? (
        <Button
            variant="ghost"
            size="sm"
            onClick={onBackClick}
            className={buttonClasses}
            aria-label={t ? t('common.back', 'Voltar') : 'Voltar'}
        >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
    ) : null);

    const trailing = (
        <div className="flex items-center gap-1">
            {showSearch && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSearchClick}
                    className={buttonClasses}
                    aria-label={t ? t('common.search', 'Pesquisar') : 'Pesquisar'}
                >
                    <Search className="h-4 w-4" aria-hidden="true" />
                </Button>
            )}

            {showSettings && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSettingsClick}
                    className={buttonClasses}
                    aria-label={t ? t('common.settings', 'Definições') : 'Definições'}
                >
                    <Settings className="h-4 w-4" aria-hidden="true" />
                </Button>
            )}

            {showTheme && (
                <SharedThemeToggle
                    theme={theme}
                    isDark={isDark}
                    onToggleTheme={onThemeToggle}
                    t={t}
                />
            )}

            {showUser && (
                <SharedUserMenu
                    user={user}
                    onLogin={onLogin}
                    onLogout={onLogout}
                    onNavigate={onNavigate}
                    t={t}
                />
            )}

            {showMenu && onMenuClick && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMenuClick}
                    className={buttonClasses}
                    aria-label={t ? t('common.menu', 'Menu') : 'Menu'}
                >
                    <Menu className="h-4 w-4" aria-hidden="true" />
                </Button>
            )}

            {customTrailing}
        </div>
    );

    return (
        <MobileToolbar
            title={title}
            subtitle={subtitle}
            leading={leading}
            trailing={trailing}
            className={cn("sm:hidden", className)}
        />
    );
}
