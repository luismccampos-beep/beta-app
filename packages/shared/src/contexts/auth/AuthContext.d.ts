import { type ReactNode } from 'react';

import type { AuthContextType, AuthError } from './auth-types';
import type { User } from '../../types';
interface AuthProviderProps {
    children: ReactNode;
}
export declare function AuthProvider({ children }: AuthProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useAuth(): AuthContextType;
export declare function useAuthState(): {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    error: AuthError | null;
    token: string | null;
    isEmailVerified: boolean;
    isAdmin: boolean;
    displayName: string;
    avatarUrl: string | undefined;
    permissions: string[];
};
export declare function useUser(): User | null;
export declare function useIsAuthenticated(): boolean;
export declare function useAuthSafe(): AuthContextType | null;
export {};
