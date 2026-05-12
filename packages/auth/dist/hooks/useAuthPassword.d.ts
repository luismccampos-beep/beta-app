import type { ChangePasswordData, ResetPasswordData, ConfirmResetPasswordData, AuthApiClient } from "../types/index";
export interface UseAuthPasswordReturn {
    changePassword: (data: ChangePasswordData) => Promise<void>;
    resetPassword: (data: ResetPasswordData) => Promise<void>;
    confirmResetPassword: (data: ConfirmResetPasswordData) => Promise<void>;
}
/**
 * Hook for password-related operations
 * @internal
 */
export declare function useAuthPassword(apiClient: AuthApiClient): UseAuthPasswordReturn;
//# sourceMappingURL=useAuthPassword.d.ts.map