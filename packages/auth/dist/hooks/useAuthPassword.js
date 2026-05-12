// ==========================================================================
// useAuthPassword Hook - Password Operations
// ==========================================================================
import { useCallback } from "react";
// ==========================================================================
// Hook Implementation
// ==========================================================================
/**
 * Hook for password-related operations
 * @internal
 */
export function useAuthPassword(apiClient) {
    /**
     * Change user password
     */
    const changePassword = useCallback(async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            throw new Error("Passwords do not match");
        }
        if (apiClient.changePassword) {
            await apiClient.changePassword(data);
        }
        else {
            console.warn("changePassword not implemented in apiClient");
        }
    }, [apiClient]);
    /**
     * Request password reset
     */
    const resetPassword = useCallback(async (data) => {
        if (apiClient.resetPassword) {
            await apiClient.resetPassword(data);
        }
        else {
            console.warn("resetPassword not implemented in apiClient");
        }
    }, [apiClient]);
    /**
     * Confirm password reset with token
     */
    const confirmResetPassword = useCallback(async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            throw new Error("Passwords do not match");
        }
        if (apiClient.confirmResetPassword) {
            await apiClient.confirmResetPassword(data);
        }
        else {
            console.warn("confirmResetPassword not implemented in apiClient");
        }
    }, [apiClient]);
    return {
        changePassword,
        resetPassword,
        confirmResetPassword,
    };
}
//# sourceMappingURL=useAuthPassword.js.map