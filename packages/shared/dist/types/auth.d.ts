export type UserRole = 'USER' | 'ADMIN' | 'AGENT';
export type ProfileVisibility = 'public' | 'private' | 'friends';
export type TokenType = 'Bearer';
export interface BaseUser {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    lastLogin?: string | null;
}
export interface UserAddress {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
}
export interface SocialMedia {
    twitter?: string | null;
    linkedin?: string | null;
    github?: string | null;
    facebook?: string | null;
    instagram?: string | null;
}
export interface UserPreferences {
    language: string;
    currency: string;
    theme?: 'light' | 'dark' | 'system';
    timezone?: string;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        inApp?: boolean;
    };
    privacy: {
        profileVisibility: ProfileVisibility;
        dataSharing: boolean;
        showOnlineStatus?: boolean;
    };
}
export interface User extends BaseUser {
    avatar?: string;
    profileImage?: string;
    role: UserRole;
    phone?: string | null;
    phoneVerified?: boolean;
    secondaryEmail?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    preferredName?: string | null;
    bio?: string | null;
    website?: string | null;
    socialMedia?: SocialMedia | null;
    address?: UserAddress | null;
    preferences?: UserPreferences;
    permissions?: string[];
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: TokenType;
    expiresAt?: string;
}
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export interface RegisterApiData {
    name: string;
    email: string;
    password: string;
    phone?: string;
}
export interface RegisterData extends RegisterApiData {
    confirmPassword: string;
    acceptTerms: boolean;
}
export interface ProfileUpdateRequest {
    name?: string;
    phone?: string;
    preferences?: Partial<UserPreferences>;
}
export interface PasswordChangeRequest {
    currentPassword: string;
    newPassword: string;
}
export interface PasswordResetRequest {
    email: string;
}
export interface PasswordResetConfirmApi {
    token: string;
    newPassword: string;
}
export interface PasswordResetConfirm extends PasswordResetConfirmApi {
    confirmPassword: string;
}
export interface EmailVerificationRequest {
    token: string;
}
export interface AuthError {
    message: string;
    code?: string;
    field?: string;
    details?: Record<string, string[]>;
}
export interface AuthResponse {
    message: string;
    success: boolean;
    error?: AuthError;
    user?: User;
    token?: string;
    refreshToken?: string;
    expiresIn?: number;
}
export interface AuthResponseData {
    user: User;
    tokens: AuthTokens;
}
export interface AuthApiResponse {
    success: boolean;
    message?: string;
    data: AuthResponseData;
}
export interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
export interface AuthContextType extends AuthState {
    login: (_credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (_data: RegisterData) => Promise<AuthResponse>;
    logout: () => void;
    refreshToken: () => Promise<AuthTokens>;
    updateProfile: (_data: ProfileUpdateRequest) => Promise<User>;
    resetPassword: (data: PasswordResetRequest) => Promise<void>;
    changePassword: (_data: PasswordChangeRequest) => Promise<void>;
    verifyEmail: () => Promise<void>;
    resendVerification: () => Promise<void>;
    clearError: () => void;
}
export interface ProtectedRouteProps {
    children: import('react').ReactNode;
    requiredRole?: UserRole;
    fallback?: import('react').ReactNode;
}
