// Components
export * from './components/shadcn-ui-barrel'
export { default as apiClient } from './services/apiClient';
export { default as FeaturesSection } from './components/api/FeaturesSection';
export { default as CodeExamplesSection } from './components/api/CodeExamplesSection';
export { default as DocumentationSection } from './components/api/DocumentationSection';
export { default as HeroSection } from './components/api/HeroSection';
export { default as PricingSection } from './components/api/PricingSection';
export { default as AppHeader } from './components/layout/AppHeader';
export type {
  AppHeaderProps,
  AppHeaderUser,
  NavItem,
  HeaderVariant,
} from './components/layout/AppHeader';
export { default as AppFooter } from './components/layout/AppFooter';
export * from './components/Terms';

// Features
export { useFlights } from './features/flights';
export { useHotels } from './features/hotels';
export { useGuides } from './features/guides';
export { usePlaces } from './features/places';
export { usePackages } from './features/packages';
export * from './components/home/hooks/useHomeDestinations';

// Hooks
export * from './hooks'

// Utils
export * from './utils'

// Types
export * from './types'

// Contexts
export * from './contexts'

