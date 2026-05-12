import type { Agency, AgencyPlan } from '../types/agency';
export interface LicenseConfig {
    plans: {
        [key in AgencyPlan]: {
            name: string;
            price: {
                monthly: number;
                yearly: number;
            };
            limits: {
                maxUsers: number;
                maxClients: number;
                maxStorage: number;
                maxApiCalls: number;
            };
            features: string[];
            permissions: string[];
        };
    };
    stripe: {
        publishableKey: string;
        secretKey: string;
        webhookSecret: string;
        priceIds: {
            [key in AgencyPlan]: {
                monthly: string;
                yearly: string;
            };
        };
    };
}
export interface SubscriptionStatus {
    isActive: boolean;
    plan: AgencyPlan;
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    trialEnd?: Date;
    cancelAtPeriodEnd: boolean;
    subscriptionId?: string;
    customerId?: string;
}
export interface UsageMetrics {
    users: number;
    clients: number;
    storage: number;
    apiCalls: number;
    lastReset: Date;
}
declare const VALID_BILLING_CYCLES: readonly ["monthly", "yearly"];
type BillingCycle = typeof VALID_BILLING_CYCLES[number];
export declare const DEFAULT_LICENSE_CONFIG: LicenseConfig;
export declare class LicenseManager {
    private config;
    constructor(config?: LicenseConfig);
    /**
     * Returns the Stripe price entry for a plan without dynamic bracket access.
     */
    private getStripePriceEntry;
    /**
     * Returns the plan config for a validated plan key, or null if not found.
     * Uses an explicit switch to avoid dynamic property access (detect-object-injection).
     */
    private getPlanConfig;
    hasFeature(agency: Agency, feature: string): boolean;
    hasPermission(agency: Agency, permission: string): boolean;
    canAccessResource(agency: Agency, resource: string, action: string): boolean;
    canAddUsers(agency: Agency, currentCount: number): boolean;
    canAddClients(agency: Agency, currentCount: number): boolean;
    canUseStorage(agency: Agency, currentUsage: number): boolean;
    canMakeApiCall(agency: Agency, currentUsage: number): boolean;
    getPlanInfo(plan: AgencyPlan): {
        name: string;
        price: {
            monthly: number;
            yearly: number;
        };
        limits: {
            maxUsers: number;
            maxClients: number;
            maxStorage: number;
            maxApiCalls: number;
        };
        features: string[];
        permissions: string[];
    } | null;
    getAllPlans(): ({
        name: string;
        price: {
            monthly: number;
            yearly: number;
        };
        limits: {
            maxUsers: number;
            maxClients: number;
            maxStorage: number;
            maxApiCalls: number;
        };
        features: string[];
        permissions: string[];
        id: "STARTER";
    } | {
        name: string;
        price: {
            monthly: number;
            yearly: number;
        };
        limits: {
            maxUsers: number;
            maxClients: number;
            maxStorage: number;
            maxApiCalls: number;
        };
        features: string[];
        permissions: string[];
        id: "PROFESSIONAL";
    } | {
        name: string;
        price: {
            monthly: number;
            yearly: number;
        };
        limits: {
            maxUsers: number;
            maxClients: number;
            maxStorage: number;
            maxApiCalls: number;
        };
        features: string[];
        permissions: string[];
        id: "ENTERPRISE";
    })[];
    getPlanLimits(plan: AgencyPlan): {
        maxUsers: number;
        maxClients: number;
        maxStorage: number;
        maxApiCalls: number;
    } | null;
    getPlanFeatures(plan: AgencyPlan): string[];
    getPlanPermissions(plan: AgencyPlan): string[];
    canUpgradePlan(currentPlan: AgencyPlan, targetPlan: AgencyPlan): boolean;
    canDowngradePlan(currentPlan: AgencyPlan, targetPlan: AgencyPlan): boolean;
    getUpgradePath(currentPlan: AgencyPlan): AgencyPlan[];
    calculateUsagePercentage(agency: Agency, usage: UsageMetrics): {
        users: number;
        clients: number;
        storage: number;
        apiCalls: number;
        overall: number;
    };
    isNearLimit(agency: Agency, usage: UsageMetrics, threshold?: number): {
        users: boolean;
        clients: boolean;
        storage: boolean;
        apiCalls: boolean;
        any: boolean;
    };
    createCheckoutSession(agency: Agency, plan: AgencyPlan, billingCycle: BillingCycle): {
        priceId: string;
        amount: number;
        currency: string;
        planName: string;
        billingCycle: "monthly" | "yearly";
    };
    createCustomerPortalSession(agency: Agency): {
        customerId: string | undefined;
        returnUrl: string;
    };
    isInTrial(agency: Agency): boolean;
    getTrialDaysRemaining(agency: Agency): number;
    canExtendTrial(agency: Agency): boolean;
    validateAgencyAccess(agency: Agency, requiredFeatures?: string[], requiredPermissions?: string[]): {
        hasAccess: boolean;
        missingFeatures: string[];
        missingPermissions: string[];
        limitsExceeded: string[];
    };
}
export declare const licenseManager: LicenseManager;
export declare function createLicenseManager(config?: LicenseConfig): LicenseManager;
export declare function validateFeatureFlag(feature: string): boolean;
export declare function sanitizePlan(plan: string): AgencyPlan | null;
export {};
//# sourceMappingURL=licenseManager.d.ts.map