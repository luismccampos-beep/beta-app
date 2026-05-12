import type { User, UpdateProfileData, AuthApiClient } from "../types/index";
import type { UseAuthStateReturn } from "./useAuthState";
export interface UseAuthProfileReturn {
    updateProfile: (updates: UpdateProfileData) => Promise<User>;
    getCurrentUser: () => Promise<User | null>;
    deleteAccount: () => Promise<void>;
}
/**
 * Hook for profile-related operations
 * @internal
 */
export declare function useAuthProfile(apiClient: AuthApiClient, authState: UseAuthStateReturn, callbacks?: {
    onLogout?: () => void;
}): UseAuthProfileReturn;
//# sourceMappingURL=useAuthProfile.d.ts.map