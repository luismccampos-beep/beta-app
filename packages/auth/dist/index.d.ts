export type { User, UserRole, AuthState, AuthResponse, AuthError, AuthResult, LoginCredentials, RegisterData, UpdateProfileData, ChangePasswordData, ResetPasswordData, ConfirmResetPasswordData, AuthContextType, AuthOperations, AuthConfig, AuthApiClient, AuthProviderProps, AuthEventType, AuthEvent, UseAuthOptions, Permission, Role, ValidationResult, } from "./types/index";
export type { Agency, AgencyPlan, AgencyStatus, AgencyContextState, AgencyContextOperations, AgencyContextType, AgencyProviderProps, AgencyTheme, AgencyDetectionResult, AgencyUser, FeatureFlag, } from "./types/agency";
export { DEFAULT_FEATURES } from "./types/agency";
export { TokenManager } from "./utils/tokenManager";
export { AuthProvider, useAuth, useAuthState, usePermissions, } from "./contexts/AuthContext";
export { AgencyProvider, useAgency, useAgencyFeature, useAgencyTheme, useAgencyLimits, } from "./contexts/AgencyContext";
export { useAgencyApi, createAgencyQueryKey, createAgencyMutation, } from "./hooks/useAgencyApi";
export { LicenseManager, licenseManager, createLicenseManager, validateFeatureFlag, sanitizePlan, } from "./utils/licenseManager";
export type { LicenseConfig, SubscriptionStatus, UsageMetrics, } from "./utils/licenseManager";
//# sourceMappingURL=index.d.ts.map