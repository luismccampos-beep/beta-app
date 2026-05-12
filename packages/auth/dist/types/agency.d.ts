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
export interface AgencyContextType extends AgencyContextState, AgencyContextOperations {
}
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
export interface FeatureFlag {
    name: string;
    enabled: boolean;
    plans?: AgencyPlan[];
    conditions?: Record<string, unknown>;
}
export declare const DEFAULT_FEATURES: Record<string, FeatureFlag>;
//# sourceMappingURL=agency.d.ts.map