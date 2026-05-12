import { AuthResponse, ChangePasswordData, ConfirmResetPasswordData, LoginCredentials, RegisterData, ResetPasswordData, UpdateProfileData } from '../../contexts/auth/auth-types';
import { User } from '../../types';
export declare class AuthService {
    private baseUrl;
    constructor(baseUrl?: string);
    private makeRequest;
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    register(userData: RegisterData): Promise<AuthResponse>;
    logout(): Promise<void>;
    refreshAccessToken(refreshToken: string): Promise<string>;
    validateToken(token: string): Promise<boolean>;
    getCurrentUser(): Promise<User>;
    updateProfile(updates: UpdateProfileData): Promise<User>;
    changePassword(data: ChangePasswordData): Promise<void>;
    resetPassword(data: ResetPasswordData): Promise<void>;
    confirmResetPassword(data: ConfirmResetPasswordData): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    deleteAccount(): Promise<void>;
    checkSession(): Promise<boolean>;
    private getStoredToken;
    private setStoredToken;
    private clearStoredAuthData;
    persistAuthData(response: AuthResponse): void;
    getStoredUser(): User | null;
    getStoredRefreshToken(): string | null;
    isTokenExpired(): boolean;
}
export declare const authService: AuthService;
