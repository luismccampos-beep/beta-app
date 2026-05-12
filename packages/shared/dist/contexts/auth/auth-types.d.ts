import type { User, LoginCredentials, RegisterData, AuthResponse, AuthError } from '../../types/auth';
export type { User, LoginCredentials, RegisterData, AuthResponse, AuthError };
export interface UpdateProfileData {
    name?: string;
    email?: string;
    avatar?: string;
    preferences?: Record<string, string | number | boolean>;
}
export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export interface ResetPasswordData {
    email: string;
}
export interface ConfirmResetPasswordData {
    token: string;
    newPassword: string;
    confirmPassword: string;
}
export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    error: AuthError | null;
    lastActivity?: Date;
    sessionExpiry?: Date;
}
export interface AuthOperations {
    login: (emailOrCreds: LoginCredentials | string, password?: string) => Promise<AuthResponse>;
    register: (userData: RegisterData) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<string>;
    validateToken: () => Promise<boolean>;
    updateProfile: (updates: UpdateProfileData) => Promise<User>;
    getCurrentUser: () => Promise<User | null>;
    changePassword: (data: ChangePasswordData) => Promise<void>;
    resetPassword: (data: ResetPasswordData) => Promise<void>;
    confirmResetPassword: (data: ConfirmResetPasswordData) => Promise<void>;
    deleteAccount: () => Promise<void>;
    clearError: () => void;
    updateLastActivity: () => void;
    checkSession: () => Promise<boolean>;
}
export interface AuthContextType extends AuthState, AuthOperations {
}
export interface AuthConfig {
    apiBaseUrl: string;
    tokenStorageKey: string;
    refreshTokenStorageKey: string;
    autoRefreshEnabled: boolean;
    refreshThreshold: number;
    sessionTimeoutMinutes: number;
    enableRememberMe: boolean;
}
export type AuthEventType = 'login' | 'logout' | 'register' | 'token_refresh' | 'session_expired' | 'profile_updated' | 'password_changed';
export interface AuthEvent {
    type: AuthEventType;
    timestamp: Date;
    user?: User;
    metadata?: Record<string, unknown>;
}
export interface UseAuthOptions {
    redirectTo?: string;
    requireAuth?: boolean;
    allowedRoles?: string[];
}
export interface Permission {
    resource: string;
    action: string;
    conditions?: Record<string, string | number | boolean | string[] | number[] | boolean[] | null>;
}
export interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}
export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: Record<string, string[]>;
}
