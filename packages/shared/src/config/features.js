import { isEnvEnabled } from '../utils/env';
export const FEATURES = {
    UNIFIED_CHAT: {
        enabled: isEnvEnabled('NEXT_PUBLIC_UNIFIED_CHAT'),
        rollout: 0.1, // 10% of users
    },
};
//# sourceMappingURL=features.js.map