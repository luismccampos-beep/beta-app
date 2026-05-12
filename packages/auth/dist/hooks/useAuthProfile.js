// ==========================================================================
// useAuthProfile Hook - Profile Operations
// ==========================================================================
import { useCallback } from "react";
import { storage, STORAGE_KEYS, isValidUser } from "../utils/index";
import { TokenManager } from "../utils/tokenManager";
// ==========================================================================
// Hook Implementation
// ==========================================================================
/**
 * Hook for profile-related operations
 * @internal
 */
export function useAuthProfile(apiClient, authState, callbacks) {
    const { state, updateState, clearAuthData } = authState;
    /**
     * Update user profile
     */
    const updateProfile = useCallback(async (updates) => {
        if (!state.user) {
            throw new Error("No authenticated user");
        }
        updateState({ isLoading: true, error: null });
        try {
            if (apiClient.updateProfile) {
                const response = await apiClient.updateProfile(updates);
                if (response && isValidUser(response)) {
                    const updatedUser = {
                        ...state.user,
                        ...response,
                        updatedAt: new Date().toISOString(),
                    };
                    storage.setJSON(STORAGE_KEYS.USER, updatedUser);
                    TokenManager.setUser(updatedUser);
                    updateState({ user: updatedUser, isLoading: false });
                    return updatedUser;
                }
            }
            // Fallback: update locally
            const updatedUser = {
                ...state.user,
                ...updates,
                updatedAt: new Date().toISOString(),
            };
            storage.setJSON(STORAGE_KEYS.USER, updatedUser);
            TokenManager.setUser(updatedUser);
            updateState({ user: updatedUser, isLoading: false });
            return updatedUser;
        }
        catch (error) {
            const authError = {
                message: error instanceof Error ? error.message : "Profile update failed",
                code: "UPDATE_ERROR",
            };
            updateState({ isLoading: false, error: authError });
            throw error;
        }
    }, [state.user, apiClient, updateState]);
    /**
     * Get current user
     */
    const getCurrentUser = useCallback(async () => {
        return state.user;
    }, [state.user]);
    /**
     * Delete user account
     */
    const deleteAccount = useCallback(async () => {
        updateState({ isLoading: true });
        try {
            if (apiClient.deleteAccount) {
                await apiClient.deleteAccount();
            }
            clearAuthData();
            callbacks?.onLogout?.();
        }
        catch (error) {
            updateState({ isLoading: false });
            throw error;
        }
    }, [apiClient, clearAuthData, updateState, callbacks]);
    return {
        updateProfile,
        getCurrentUser,
        deleteAccount,
    };
}
//# sourceMappingURL=useAuthProfile.js.map