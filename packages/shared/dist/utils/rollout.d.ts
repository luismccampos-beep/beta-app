import { FeatureKey } from '../config/features';
/**
 * Determines if a feature is enabled for a given user
 * Uses consistent hash-based rollout for gradual feature deployment
 *
 * @param feature - The feature key to check
 * @param userId - Optional user identifier for rollout bucketing
 * @returns true if the feature is enabled for this user
 */
export declare function isFeatureEnabled(feature: FeatureKey, userId?: string): boolean;
/**
 * Alternative: Get feature config safely
 * Useful if you need to access config properties elsewhere
 */
export declare function getFeatureConfig(feature: FeatureKey): {
    readonly enabled: boolean;
    readonly rollout: 0.1;
};
