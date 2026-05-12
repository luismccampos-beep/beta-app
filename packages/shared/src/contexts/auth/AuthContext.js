"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from 'react';

import { AuthService } from '../../services/auth-service';
const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'auth_refresh_token',
    USER: 'auth_user',
    LAST_ACTIVITY: 'auth_last_activity',
};
const storage = {
    get: (key) => {
        if (typeof window === 'undefined')
            return null;
        try {
            return localStorage.getItem(key);
        }
        catch (error) {
            console.error(`Failed to read ${key} from localStorage:`, error);
            return null;
        }
    },
    set: (key, value) => {
        if (typeof window === 'undefined')
            return;
        try {
            localStorage.setItem(key, value);
        }
        catch (error) {
            console.error(`Failed to set ${key} in localStorage:`, error);
        }
    },
    remove: (key) => {
        if (typeof window === 'undefined')
            return;
        try {
            localStorage.removeItem(key);
        }
        catch (error) {
            console.error(`Failed to remove ${key} from localStorage:`, error);
        }
    },
    getJSON: (key) => {
        const value = storage.get(key);
        if (!value)
            return null;
        try {
            return JSON.parse(value);
        }
        catch (error) {
            console.error(`Failed to parse ${key} from localStorage:`, error);
            return null;
        }
    },
    setJSON: (key, value) => {
        try {
            storage.set(key, JSON.stringify(value));
        }
        catch (error) {
            console.error(`Failed to serialize ${key}:`, error);
        }
    },
    clear: () => {
        if (typeof window === 'undefined')
            return;
        try {
            localStorage.clear();
        }
        catch (error) {
            console.error('Failed to clear localStorage:', error);
        }
    },
};
const initialState = {
    user: null,
    token: null,
    refreshToken: null,
    isLoading: true,
    isInitialized: false,
    error: null,
};
const AuthContext = createContext(null);
const authService = new AuthService();
export function AuthProvider({ children }) {
    const navigate = useCallback((href) => {
        if (typeof window === 'undefined')
            return;
        window.location.assign(href);
    }, []);
    const [state, setState] = useState(initialState);
    const updateState = useCallback((updates) => {
        setState((prev) => ({ ...prev, ...updates }));
    }, []);
    const clearAuthData = useCallback(() => {
        storage.remove(STORAGE_KEYS.TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        storage.remove(STORAGE_KEYS.USER);
        updateState({
            user: null,
            token: null,
            refreshToken: null,
            error: null,
        });
    }, [updateState]);
    const setAuthData = useCallback((user, token, refreshToken) => {
        storage.set(STORAGE_KEYS.TOKEN, token);
        storage.setJSON(STORAGE_KEYS.USER, user);
        if (refreshToken) {
            storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }
        updateState({
            user,
            token,
            refreshToken: refreshToken ?? null,
            error: null,
        });
    }, [updateState]);
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = storage.get(STORAGE_KEYS.TOKEN);
                const storedUser = storage.getJSON(STORAGE_KEYS.USER);
                const storedRefreshToken = storage.get(STORAGE_KEYS.REFRESH_TOKEN);
                if (storedToken && storedUser) {
                    updateState({
                        user: storedUser,
                        token: storedToken,
                        refreshToken: storedRefreshToken,
                    });
                }
            }
            catch (error) {
                console.error('Auth initialization error:', error);
                clearAuthData();
            }
            finally {
                updateState({ isLoading: false, isInitialized: true });
            }
        };
        initializeAuth();
    }, [clearAuthData, updateState]);
    const login = useCallback(async (emailOrCreds, password) => {
        updateState({ isLoading: true, error: null });
        try {
            const credentials = typeof emailOrCreds === 'string'
                ? { email: emailOrCreds, password: password ?? '' }
                : emailOrCreds;
            if (!credentials.email || !credentials.password) {
                const error = {
                    message: 'Email and password are required',
                    code: 'INVALID_CREDENTIALS',
                };
                updateState({ isLoading: false, error });
                return { success: false, message: error.message, error };
            }
            const response = await authService.login(credentials);
            if (response.user && response.token) {
                setAuthData(response.user, response.token, response.refreshToken);
            }
            updateState({ isLoading: false });
            return response;
        }
        catch (error) {
            const authError = {
                message: error instanceof Error ? error.message : 'Login failed',
                code: 'LOGIN_ERROR',
            };
            updateState({ isLoading: false, error: authError });
            return { success: false, message: authError.message, error: authError };
        }
    }, [setAuthData, updateState]);
    const register = useCallback(async (userData) => {
        updateState({ isLoading: true, error: null });
        try {
            const response = await authService.register(userData);
            if (response.user && response.token) {
                setAuthData(response.user, response.token, response.refreshToken);
            }
            updateState({ isLoading: false });
            return response;
        }
        catch (error) {
            const authError = {
                message: error instanceof Error ? error.message : 'Registration failed',
                code: 'REGISTER_ERROR',
            };
            updateState({ isLoading: false, error: authError });
            return { success: false, message: authError.message, error: authError };
        }
    }, [setAuthData, updateState]);
    const logout = useCallback(async () => {
        updateState({ isLoading: true });
        try {
            await authService.logout();
        }
        catch (error) {
            console.error('Logout API call failed:', error);
        }
        finally {
            clearAuthData();
            updateState({ isLoading: false });
            navigate('/login');
        }
    }, [clearAuthData, navigate, updateState]);
    const refreshAccessToken = useCallback(async () => {
        if (!state.refreshToken) {
            throw new Error('No refresh token available');
        }
        try {
            const newToken = await authService.refreshAccessToken(state.refreshToken);
            storage.set(STORAGE_KEYS.TOKEN, newToken);
            updateState({ token: newToken });
            return newToken;
        }
        catch (error) {
            console.error('Token refresh failed:', error);
            clearAuthData();
            navigate('/login');
            throw error;
        }
    }, [state.refreshToken, clearAuthData, navigate, updateState]);
    const validateToken = useCallback(async () => {
        if (!state.token)
            return false;
        try {
            return true;
        }
        catch {
            return false;
        }
    }, [state.token]);
    const updateProfile = useCallback(async (updates) => {
        if (!state.user) {
            throw new Error('No authenticated user');
        }
        updateState({ isLoading: true, error: null });
        try {
            const updatedUser = {
                ...state.user,
                ...updates,
                updatedAt: new Date().toISOString(),
            };
            storage.setJSON(STORAGE_KEYS.USER, updatedUser);
            updateState({ user: updatedUser, isLoading: false });
            return updatedUser;
        }
        catch (error) {
            const authError = {
                message: error instanceof Error ? error.message : 'Profile update failed',
                code: 'UPDATE_ERROR',
            };
            updateState({ isLoading: false, error: authError });
            throw error;
        }
    }, [state.user, updateState]);
    const getCurrentUser = useCallback(async () => {
        return state.user;
    }, [state.user]);
    const changePassword = useCallback(async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            throw new Error('Passwords do not match');
        }
    }, []);
    const resetPassword = useCallback(async (data) => {
        console.log('Password reset requested for:', data.email);
    }, []);
    const confirmResetPassword = useCallback(async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            throw new Error('Passwords do not match');
        }
    }, []);
    const deleteAccount = useCallback(async () => {
        updateState({ isLoading: true });
        try {
            clearAuthData();
            navigate('/');
        }
        catch (error) {
            updateState({ isLoading: false });
            throw error;
        }
    }, [clearAuthData, navigate, updateState]);
    const clearError = useCallback(() => {
        updateState({ error: null });
    }, [updateState]);
    const updateLastActivity = useCallback(() => {
        storage.set(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
    }, []);
    const checkSession = useCallback(async () => {
        if (!state.token)
            return false;
        const isValid = await validateToken();
        if (!isValid && state.refreshToken) {
            try {
                await refreshAccessToken();
                return true;
            }
            catch {
                return false;
            }
        }
        return isValid;
    }, [state.token, state.refreshToken, validateToken, refreshAccessToken]);
    const contextValue = useMemo(() => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: !!state.user && !!state.token,
        isLoading: state.isLoading,
        isInitialized: state.isInitialized,
        error: state.error,
        login,
        register,
        logout,
        refreshAccessToken,
        validateToken,
        updateProfile,
        getCurrentUser,
        changePassword,
        resetPassword,
        confirmResetPassword,
        deleteAccount,
        clearError,
        updateLastActivity,
        checkSession,
    }), [
        state,
        login,
        register,
        logout,
        refreshAccessToken,
        validateToken,
        updateProfile,
        getCurrentUser,
        changePassword,
        resetPassword,
        confirmResetPassword,
        deleteAccount,
        clearError,
        updateLastActivity,
        checkSession,
    ]);
    return _jsx(AuthContext.Provider, { value: contextValue, children: children });
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider. ' +
            'Make sure to wrap your app or component tree with <AuthProvider>.');
    }
    return context;
}
export function useAuthState() {
    const auth = useAuth();
    return useMemo(() => ({
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        isInitialized: auth.isInitialized,
        error: auth.error,
        token: auth.token,
        isEmailVerified: auth.user?.emailVerified ?? false,
        isAdmin: auth.user?.role === 'ADMIN',
        displayName: auth.user?.name ?? auth.user?.email?.split('@')[0] ?? 'User',
        avatarUrl: auth.user?.profileImage,
        permissions: auth.user?.permissions ?? [],
    }), [auth.user, auth.isAuthenticated, auth.isLoading, auth.isInitialized, auth.error, auth.token]);
}
export function useUser() {
    return useAuthState().user;
}
export function useIsAuthenticated() {
    return useAuthState().isAuthenticated;
}
export function useAuthSafe() {
    return useContext(AuthContext);
}
//# sourceMappingURL=AuthContext.js.map