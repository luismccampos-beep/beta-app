// ===================================
// AKMLEVA Shared Package
// Componentes, tipos e utilitários partilhados
// ===================================
// Core types and utilities
export * from './types/index';
export * from './utils/index';
// Hooks - re-export with alias to avoid conflict with UnifiedAI's useAIPreferences
export { useAIPreferences as useSharedAIPreferences } from './hooks/useAIPreferences';
// Also export with original name for backwards compatibility
export { useAIPreferences } from './hooks/useAIPreferences';
// export * from './validation/index'; // Commented out - creates duplicate exports (already in types & utils)
// Helpers and constants
export * from './constants/index';
export * from './helpers/index';
// Configuration
export * from './config/index';
// Logging utilities
export * from './logger/index';
// Factories for testing
export * from './factories/index';
export * from './factories/payment.factory';
// Theming system
export * from './themes/index';
// Localization
export * from './locales/index';
export { default as i18n } from './lib/i18n';
export { AuthProvider, useAuth, useAuthSafe, useAuthState, useIsAuthenticated, useUser } from './contexts/auth/AuthContext';
// Types are also partially in './types/index'
export { default as apiClient } from './lib/api-client';
export * from './lib/api-client';
export * from './services/auth-service';
export * from './services/aiService';
export * from './services/destinationService';
export * from './services/guidesService';
export * from './services/packageService';
export * from './services/sustainableService';
export * from './services/tripPlanningService';
// Auth Components
// React Components (framework-specific)
// Export components via subpath for tree-shaking and framework awareness
// Note: Using explicit re-exports to avoid naming conflicts
// Note: Common components moved to @akmleva/ui package
// Components moved to @akmleva/ui package
// Note: These are now available from @akmleva/ui package
// Business Components
export { FAQSection } from './components/business/FAQSection';
export { BookingDialog } from './components/business/BookingDialog';
export { PriceSummary } from './components/business/PriceSummary';
// New UI Components (moved to @akmleva/ui package)
// Note: These are now available from @akmleva/ui package
// Export other components with explicit naming to avoid conflicts
export { default as LanguageSwitcher, LanguageSwitcherSize, LanguageSwitcherVariant } from './components/LanguageSwitcher';
export { default as LanguageSwitcherNextIntl } from './components/LanguageSwitcherNextIntl';
export { default as BlogCard } from './components/BlogCard';
export { default as FeaturedDestinations } from './components/FeaturedDestinations';
export { default as ContactInfo } from './components/ContactInfo';
// Auth Components - DemoButtons exists in shared package
export { DemoButtons } from './components/auth/DemoButtons';
export { DashboardCard } from './components/admin/DashboardCard';
export { Sidebar } from './components/admin/Sidebar';
export { DateRangePicker } from './components/admin/DateRangePicker';
export { AdminBreadcrumbs } from './components/admin/AdminBreadcrumbs';
// Additional root-level type re-exports for convenience
// Note: Types for moved components are now available from @akmleva/ui package
// Note: React-specific components and hooks are exported via subpath
// This keeps the main package framework-agnostic while providing access to React components
// Models are also excluded to avoid type conflicts - import directly when needed.
// Tip: Prefer importing subpaths when tree-shaking is important, e.g.:
// import { logger } from '@akmleva/shared/logger';
// import { theme } from '@akmleva/shared/themes';
// import { ApiResponse } from '@akmleva/shared/types';
// import { cn } from '@akmleva/shared/utils';
// import { CustomerSupport } from '@akmleva/shared/components';
// Library utilities for dependencies
// These re-export popular libraries to ensure they're properly referenced
export * from './lib/date-picker';
export * from './lib/markdown';
export * from './lib/next';
export * from './lib/store';
export * from './lib/virtual-list';
//# sourceMappingURL=index.js.map