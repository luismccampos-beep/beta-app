import { FEATURES } from '../config/features';
/**
 * Generates a stable hash code from a string
 * Using DJB2 algorithm for better distribution
 */
function hashCode(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) + hash) + char; // hash * 33 + char
    }
    // Ensure positive 32-bit integer
    return (hash >>> 0);
}
/**
 * Determines if a feature is enabled for a given user
 * Uses consistent hash-based rollout for gradual feature deployment
 *
 * @param feature - The feature key to check
 * @param userId - Optional user identifier for rollout bucketing
 * @returns true if the feature is enabled for this user
 */
export function isFeatureEnabled(feature, userId) {
    // FeatureKey type ensures this is a valid key from FEATURES
    // eslint-disable-next-line security/detect-object-injection
    const config = FEATURES[feature];
    // Extra safety check
    if (!config) {
        return false;
    }
    // Feature must be globally enabled
    if (!config.enabled) {
        return false;
    }
    // If no userId provided, return based on 100% rollout only
    if (!userId || userId.trim() === '') {
        return config.rollout >= 1;
    }
    // Hash-based consistent rollout
    const hash = hashCode(userId);
    const bucket = hash % 100;
    const rolloutPercentage = Math.floor(config.rollout * 100);
    return bucket < rolloutPercentage;
}
/**
 * Alternative: Get feature config safely
 * Useful if you need to access config properties elsewhere
 */
export function getFeatureConfig(feature) {
    // FeatureKey type ensures this is a valid key from FEATURES
    // eslint-disable-next-line security/detect-object-injection
    return FEATURES[feature] ?? null;
}
//# sourceMappingURL=rollout.js.map