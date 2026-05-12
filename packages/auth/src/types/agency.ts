// ==========================================================================
// Multi-Tenancy Agency Types
// ==========================================================================

import type { UserRole } from './index';

export interface Agency {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  plan: AgencyPlan;
  status: AgencyStatus;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  trialEndsAt?: string;
  subscriptionId?: string;
  maxUsers: number;
  maxClients: number;
  features: string[];
}

export type AgencyPlan = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
export type AgencyStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface AgencyContextState {
  agency: Agency | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  domain: string | null;
  isSubdomain: boolean;
  isCustomDomain: boolean;
}

export interface AgencyContextOperations {
  setAgency: (agency: Agency) => void;
  clearAgency: () => void;
  updateAgencySettings: (settings: Record<string, unknown>) => void;
  hasFeature: (feature: string) => boolean;
  canAddUsers: (currentCount: number) => boolean;
  canAddClients: (currentCount: number) => boolean;
  getTheme: () => AgencyTheme;
  refreshAgency: () => Promise<void>;
}

export interface AgencyTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  cssVariables: Record<string, string>;
}

export interface AgencyContextType extends AgencyContextState, AgencyContextOperations {}

export interface AgencyProviderProps {
  children: React.ReactNode;
  domain?: string;
  autoDetect?: boolean;
  onAgencyChange?: (agency: Agency | null) => void;
}

export interface AgencyDetectionResult {
  agency: Agency | null;
  isSubdomain: boolean;
  isCustomDomain: boolean;
  domain: string | null;
}

// ==========================================================================
// Enhanced User Types with Agency
// ==========================================================================

export interface AgencyUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions?: string[];
  agencyId?: string;
  agency?: Agency;
  profileImage?: string;
  profile_image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================================================
// Feature Flags
// ==========================================================================

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  plans?: AgencyPlan[];
  conditions?: Record<string, unknown>;
}

export const DEFAULT_FEATURES: Record<string, FeatureFlag> = {
  // Core CRM features
  'crm.clients': {
    name: 'Client Management',
    enabled: true,
    plans: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
  },
  'crm.leads': {
    name: 'Lead Management',
    enabled: true,
    plans: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
  },
  'crm.bookings': {
    name: 'Booking Management',
    enabled: true,
    plans: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
  },
  
  // Advanced features
  'crm.ai_assistant': {
    name: 'AI Assistant',
    enabled: false,
    plans: ['PROFESSIONAL', 'ENTERPRISE'],
  },
  'crm.advanced_analytics': {
    name: 'Advanced Analytics',
    enabled: false,
    plans: ['PROFESSIONAL', 'ENTERPRISE'],
  },
  'crm.custom_integrations': {
    name: 'Custom Integrations',
    enabled: false,
    plans: ['ENTERPRISE'],
  },
  'crm.white_label': {
    name: 'White Label (Custom Domain)',
    enabled: false,
    plans: ['ENTERPRISE'],
  },
  'crm.api_access': {
    name: 'API Access',
    enabled: false,
    plans: ['PROFESSIONAL', 'ENTERPRISE'],
  },
  'crm.priority_support': {
    name: 'Priority Support',
    enabled: false,
    plans: ['ENTERPRISE'],
  },
  
  // Content management
  'crm.custom_packages': {
    name: 'Custom Package Creation',
    enabled: false,
    plans: ['PROFESSIONAL', 'ENTERPRISE'],
  },
  'crm.flight_management': {
    name: 'Flight Management',
    enabled: true,
    plans: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
  },
  'crm.hotel_management': {
    name: 'Hotel Management',
    enabled: true,
    plans: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'],
  },
  'crm.cruise_management': {
    name: 'Cruise Management',
    enabled: true,
    plans: ['PROFESSIONAL', 'ENTERPRISE'],
  },
};
