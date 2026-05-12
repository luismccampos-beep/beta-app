/**
 * AKMLEVA UI Library
 * 
 * A modern, accessible React component library built with:
 * - Radix UI primitives for accessibility
 * - Tailwind CSS for styling
 * - TypeScript for type safety
 * - Class Variance Authority for variants
 */

// Export all components and their types
export * from './components';

// Export theme context
export {
  ThemeProvider,
  useTheme,
  useAgencyColors,
  useThemeClasses,
} from './contexts/ThemeContext';

export type {
  ThemeColors,
  AgencyTheme,
  ThemeContextType,
  ThemeProviderProps,
} from './contexts/ThemeContext';

// Export tokens
export * from './tokens';

// Export types (excluding duplicates from components)
export type {
    BaseComponentProps,
    InteractiveComponentProps,
    FormComponentProps,
    SizeVariant,
    ColorVariant,
    ButtonVariant,
    AlertVariant,
    BadgeVariant,
    PositionVariant,
    SideVariant,
    AlignVariant,
    AnimationVariant,
    ResponsiveValue,
    PolymorphicProps,
    LinkProps,
    IconProps,
    LoadingState,
    AsyncState,
    AriaProps,
    KeyboardEventHandler,
    MouseEventHandler,
    TouchEventHandler,
    FocusEventHandler,
    ChangeEventHandler,
    ForwardedRef,
    SlotProps,
    WithRequired,
    WithOptional,
    VariantProps,
} from './types';

// Export utilities
export { cn } from './utils/cn';
