import { type ReactNode } from 'react';
import type { AuthContextType, AuthError } from './auth-types';
import type { User } from '../../types';
interface AuthProviderProps {
    children: ReactNode;
}
export declare function AuthProvider({ children }: AuthProviderProps): import("react").JSX.Element;
export declare function useAuth(): AuthContextType;
export declare function useAuthState(): {
    user: User;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    error: AuthError;
    token: string;
    isEmailVerified: boolean;
    isAdmin: boolean;
    displayName: string;
    avatarUrl: string;
    permissions: string[];
};
export declare function useUser(): User;
export declare function useIsAuthenticated(): boolean;
export declare function useAuthSafe(): AuthContextType | null;
export {};
