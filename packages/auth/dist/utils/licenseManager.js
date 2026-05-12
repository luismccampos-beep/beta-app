// ==========================================================================
// License Management System
// ==========================================================================
// ==========================================================================
// Constants
// ==========================================================================
const VALID_PLANS = ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'];
const VALID_BILLING_CYCLES = ['monthly', 'yearly'];
// ==========================================================================
// Default License Configuration
// ==========================================================================
export const DEFAULT_LICENSE_CONFIG = {
    plans: {
        STARTER: {
            name: 'Starter',
            price: {
                monthly: 49,
                yearly: 490,
            },
            limits: {
                maxUsers: 5,
                maxClients: 100,
                maxStorage: 1024, // 1GB
                maxApiCalls: 10000,
            },
            features: [
                'crm.clients',
                'crm.leads',
                'crm.bookings',
                'crm.flight_management',
                'crm.hotel_management',
                'basic_analytics',
                'email_support',
            ],
            permissions: [
                'read:clients',
                'write:clients',
                'read:leads',
                'write:leads',
                'read:bookings',
                'write:bookings',
                'read:flights',
                'write:flights',
                'read:hotels',
                'write:hotels',
            ],
        },
        PROFESSIONAL: {
            name: 'Professional',
            price: {
                monthly: 149,
                yearly: 1490,
            },
            limits: {
                maxUsers: 20,
                maxClients: 1000,
                maxStorage: 10240, // 10GB
                maxApiCalls: 100000,
            },
            features: [
                'crm.clients',
                'crm.leads',
                'crm.bookings',
                'crm.flight_management',
                'crm.hotel_management',
                'crm.cruise_management',
                'crm.custom_packages',
                'crm.ai_assistant',
                'crm.advanced_analytics',
                'crm.api_access',
                'priority_support',
                'custom_branding',
            ],
            permissions: [
                'read:clients',
                'write:clients',
                'read:leads',
                'write:leads',
                'read:bookings',
                'write:bookings',
                'read:flights',
                'write:flights',
                'read:hotels',
                'write:hotels',
                'read:cruises',
                'write:cruises',
                'read:analytics',
                'write:analytics',
                'api:access',
                'ai:access',
            ],
        },
        ENTERPRISE: {
            name: 'Enterprise',
            price: {
                monthly: 499,
                yearly: 4990,
            },
            limits: {
                maxUsers: -1, // unlimited
                maxClients: -1, // unlimited
                maxStorage: 102400, // 100GB
                maxApiCalls: 1000000,
            },
            features: [
                'crm.clients',
                'crm.leads',
                'crm.bookings',
                'crm.flight_management',
                'crm.hotel_management',
                'crm.cruise_management',
                'crm.custom_packages',
                'crm.ai_assistant',
                'crm.advanced_analytics',
                'crm.api_access',
                'crm.custom_integrations',
                'crm.white_label',
                'crm.priority_support',
                'custom_branding',
                'dedicated_account_manager',
                'custom_training',
            ],
            permissions: [
                'read:clients',
                'write:clients',
                'read:leads',
                'write:leads',
                'read:bookings',
                'write:bookings',
                'read:flights',
                'write:flights',
                'read:hotels',
                'write:hotels',
                'read:cruises',
                'write:cruises',
                'read:analytics',
                'write:analytics',
                'api:access',
                'ai:access',
                'integrations:custom',
                'white_label:access',
                'support:priority',
                'admin:users',
            ],
        },
    },
    stripe: {
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
        secretKey: process.env.STRIPE_SECRET_KEY ?? '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
        priceIds: {
            STARTER: {
                monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? '',
                yearly: process.env.STRIPE_PRICE_STARTER_YEARLY ?? '',
            },
            PROFESSIONAL: {
                monthly: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY ?? '',
                yearly: process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY ?? '',
            },
            ENTERPRISE: {
                monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY ?? '',
                yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY ?? '',
            },
        },
    },
};
// ==========================================================================
// License Manager Class
// ==========================================================================
export class LicenseManager {
    config;
    constructor(config = DEFAULT_LICENSE_CONFIG) {
        this.config = config;
    }
    // ==========================================================================
    // Private Helpers
    // ==========================================================================
    /**
     * Returns the Stripe price entry for a plan without dynamic bracket access.
     */
    getStripePriceEntry(plan) {
        switch (plan) {
            case 'STARTER': return this.config.stripe.priceIds.STARTER;
            case 'PROFESSIONAL': return this.config.stripe.priceIds.PROFESSIONAL;
            case 'ENTERPRISE': return this.config.stripe.priceIds.ENTERPRISE;
        }
    }
    /**
     * Returns the plan config for a validated plan key, or null if not found.
     * Uses an explicit switch to avoid dynamic property access (detect-object-injection).
     */
    getPlanConfig(plan) {
        switch (plan) {
            case 'STARTER': return this.config.plans.STARTER;
            case 'PROFESSIONAL': return this.config.plans.PROFESSIONAL;
            case 'ENTERPRISE': return this.config.plans.ENTERPRISE;
            default: return null;
        }
    }
    // ==========================================================================
    // Feature Access Methods
    // ==========================================================================
    hasFeature(agency, feature) {
        if (!validateFeatureFlag(feature)) {
            return false;
        }
        // Check if feature is explicitly enabled for agency
        if (agency.features.includes(feature)) {
            return true;
        }
        // Check plan-based features
        const planConfig = this.getPlanConfig(agency.plan);
        return planConfig?.features.includes(feature) ?? false;
    }
    hasPermission(agency, permission) {
        const planConfig = this.getPlanConfig(agency.plan);
        return planConfig?.permissions.includes(permission) ?? false;
    }
    canAccessResource(agency, resource, action) {
        const permission = `${action}:${resource}`;
        return this.hasPermission(agency, permission);
    }
    // ==========================================================================
    // Limit Checking Methods
    // ==========================================================================
    canAddUsers(agency, currentCount) {
        const planConfig = this.getPlanConfig(agency.plan);
        if (!planConfig)
            return false;
        const { maxUsers } = planConfig.limits;
        return maxUsers === -1 || currentCount < maxUsers;
    }
    canAddClients(agency, currentCount) {
        const planConfig = this.getPlanConfig(agency.plan);
        if (!planConfig)
            return false;
        const { maxClients } = planConfig.limits;
        return maxClients === -1 || currentCount < maxClients;
    }
    canUseStorage(agency, currentUsage) {
        const planConfig = this.getPlanConfig(agency.plan);
        if (!planConfig)
            return false;
        const { maxStorage } = planConfig.limits;
        return maxStorage === -1 || currentUsage < maxStorage;
    }
    canMakeApiCall(agency, currentUsage) {
        const planConfig = this.getPlanConfig(agency.plan);
        if (!planConfig)
            return false;
        const { maxApiCalls } = planConfig.limits;
        return maxApiCalls === -1 || currentUsage < maxApiCalls;
    }
    // ==========================================================================
    // Plan Information Methods
    // ==========================================================================
    getPlanInfo(plan) {
        return this.getPlanConfig(plan);
    }
    getAllPlans() {
        return [
            { id: 'STARTER', ...this.config.plans.STARTER },
            { id: 'PROFESSIONAL', ...this.config.plans.PROFESSIONAL },
            { id: 'ENTERPRISE', ...this.config.plans.ENTERPRISE },
        ];
    }
    getPlanLimits(plan) {
        return this.getPlanConfig(plan)?.limits ?? null;
    }
    getPlanFeatures(plan) {
        return this.getPlanConfig(plan)?.features ?? [];
    }
    getPlanPermissions(plan) {
        return this.getPlanConfig(plan)?.permissions ?? [];
    }
    // ==========================================================================
    // Upgrade/Downgrade Methods
    // ==========================================================================
    canUpgradePlan(currentPlan, targetPlan) {
        const currentIndex = VALID_PLANS.indexOf(currentPlan);
        const targetIndex = VALID_PLANS.indexOf(targetPlan);
        return targetIndex > currentIndex;
    }
    canDowngradePlan(currentPlan, targetPlan) {
        const currentIndex = VALID_PLANS.indexOf(currentPlan);
        const targetIndex = VALID_PLANS.indexOf(targetPlan);
        return targetIndex < currentIndex;
    }
    getUpgradePath(currentPlan) {
        const currentIndex = VALID_PLANS.indexOf(currentPlan);
        return [...VALID_PLANS].slice(currentIndex + 1);
    }
    // ==========================================================================
    // Usage Tracking Methods
    // ==========================================================================
    calculateUsagePercentage(agency, usage) {
        const empty = { users: 0, clients: 0, storage: 0, apiCalls: 0, overall: 0 };
        const limits = this.getPlanLimits(agency.plan);
        if (!limits)
            return empty;
        const pct = (value, max) => max === -1 ? 0 : Math.min((value / max) * 100, 100);
        const users = pct(usage.users, limits.maxUsers);
        const clients = pct(usage.clients, limits.maxClients);
        const storage = pct(usage.storage, limits.maxStorage);
        const apiCalls = pct(usage.apiCalls, limits.maxApiCalls);
        const overall = Math.min(Math.max(users, clients, storage, apiCalls), 100);
        return { users, clients, storage, apiCalls, overall };
    }
    isNearLimit(agency, usage, threshold = 0.9) {
        const percentages = this.calculateUsagePercentage(agency, usage);
        const limit = threshold * 100;
        const users = percentages.users >= limit;
        const clients = percentages.clients >= limit;
        const storage = percentages.storage >= limit;
        const apiCalls = percentages.apiCalls >= limit;
        const any = users || clients || storage || apiCalls;
        return { users, clients, storage, apiCalls, any };
    }
    // ==========================================================================
    // Subscription Methods
    // ==========================================================================
    createCheckoutSession(agency, plan, billingCycle) {
        const planConfig = this.getPlanConfig(plan);
        if (!planConfig) {
            throw new Error(`Invalid plan: ${plan}`);
        }
        const priceIdEntry = this.getStripePriceEntry(plan);
        const priceId = billingCycle === 'monthly' ? priceIdEntry.monthly : priceIdEntry.yearly;
        if (!priceId) {
            throw new Error(`No price ID found for ${plan} ${billingCycle}`);
        }
        const amount = billingCycle === 'monthly' ? planConfig.price.monthly : planConfig.price.yearly;
        return {
            priceId,
            amount,
            currency: 'usd',
            planName: planConfig.name,
            billingCycle,
        };
    }
    createCustomerPortalSession(agency) {
        return {
            customerId: agency.subscriptionId,
            returnUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'https://crm.akmleva.com',
        };
    }
    // ==========================================================================
    // Trial Methods
    // ==========================================================================
    isInTrial(agency) {
        if (!agency.trialEndsAt)
            return false;
        return new Date(agency.trialEndsAt) > new Date();
    }
    getTrialDaysRemaining(agency) {
        if (!agency.trialEndsAt)
            return 0;
        const diffMs = new Date(agency.trialEndsAt).getTime() - Date.now();
        return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }
    canExtendTrial(agency) {
        // Allow trial extension only when trial has expired and agency is on Starter
        return !this.isInTrial(agency) && agency.plan === 'STARTER';
    }
    // ==========================================================================
    // Validation Methods
    // ==========================================================================
    validateAgencyAccess(agency, requiredFeatures, requiredPermissions) {
        const missingFeatures = (requiredFeatures ?? []).filter((f) => !this.hasFeature(agency, f));
        const missingPermissions = (requiredPermissions ?? []).filter((p) => !this.hasPermission(agency, p));
        const limitsExceeded = [];
        const hasAccess = missingFeatures.length === 0 &&
            missingPermissions.length === 0 &&
            limitsExceeded.length === 0;
        return { hasAccess, missingFeatures, missingPermissions, limitsExceeded };
    }
}
// ==========================================================================
// Singleton Instance
// ==========================================================================
export const licenseManager = new LicenseManager(DEFAULT_LICENSE_CONFIG);
// ==========================================================================
// Utility Functions
// ==========================================================================
export function createLicenseManager(config) {
    return new LicenseManager(config);
}
export function validateFeatureFlag(feature) {
    const validFeaturePattern = /^[a-z_][a-z0-9_.]*$/;
    return validFeaturePattern.test(feature);
}
export function sanitizePlan(plan) {
    const validPlans = ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'];
    return validPlans.includes(plan) ? plan : null;
}
//# sourceMappingURL=licenseManager.js.map