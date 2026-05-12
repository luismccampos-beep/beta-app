export type UserRole = "ADMIN" | "USER" | "AGENT";
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    permissions?: string[];
    profileImage?: string;
    profile_image?: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms?: boolean;
}
export interface UpdateProfileData {
    name?: string;
    email?: string;
    avatar?: string;
    profileImage?: string;
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
export interface AuthError {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
}
export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
    refreshToken?: string;
    error?: AuthError;
}
export interface AuthResult {
    success: boolean;
    message?: string;
    user?: User;
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
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string | string[]) => boolean;
}
/**
 * Complete authentication context type
 * Combines state and operations
 */
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
/**
 * Interface for API client that must be provided by the consuming app
 * This allows each app to implement its own API communication
 */
export interface AuthApiClient {
    login: (email: string, password: string) => Promise<{
        success: boolean;
        data?: {
            accessToken: string;
            refreshToken: string;
            user: Partial<User>;
        };
        message?: string;
    }>;
    register: (data: RegisterData) => Promise<{
        success: boolean;
        data?: {
            accessToken: string;
            refreshToken: string;
            user: Partial<User>;
        };
        message?: string;
    }>;
    logout: () => Promise<void>;
    get: (path: string) => {
        json: () => Promise<Partial<User>>;
    };
    refresh?: (refreshToken: string) => Promise<{
        accessToken: string;
        refreshToken?: string;
    }>;
    updateProfile?: (updates: UpdateProfileData) => Promise<Partial<User>>;
    changePassword?: (data: ChangePasswordData) => Promise<void>;
    resetPassword?: (data: ResetPasswordData) => Promise<void>;
    confirmResetPassword?: (data: ConfirmResetPasswordData) => Promise<void>;
    deleteAccount?: () => Promise<void>;
    validateToken?: (token: string) => Promise<boolean>;
}
export interface AuthProviderProps {
    children: React.ReactNode;
    apiClient: AuthApiClient;
    onLogout?: () => void;
    onLoginSuccess?: (user: User) => void;
    onSessionExpired?: () => void;
    redirectAfterLogout?: string;
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
//# sourceMappingURL=index.d.ts.map