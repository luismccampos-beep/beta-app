"use client";
import { jsx as _jsx } from "react/jsx-runtime";
// ==========================================================================
// Auth Context - Simplified Provider Using Extracted Hooks
// ==========================================================================
import { createContext, useContext, useEffect, useMemo, useCallback, } from "react";
import { isValidUser } from "../utils/index";
import { useAuthState as useAuthStateHook, useAuthOperations, useAuthSession, useAuthProfile, useAuthPassword, useAuthPermissions, } from "../hooks/index";
// ==========================================================================
// Auth Context
// ==========================================================================
const AuthContext = createContext(null);
// ==========================================================================
// Auth Provider Component
// ==========================================================================
/**
 * Unified AuthProvider that works across all apps (web, admin, frontend)
 * Each app provides its own apiClient adapter for API communication
 * @public
 */
export function AuthProvider({ children, apiClient, onLogout, onLoginSuccess, onSessionExpired, }) {
    // State management hook
    const authState = useAuthStateHook();
    const { state, updateState, clearAuthData, setAuthData, getStoredAuth } = authState;
    // Callbacks wrapper
    const callbacks = useMemo(() => ({
        onLogout,
        onLoginSuccess,
        onSessionExpired,
    }), [onLogout, onLoginSuccess, onSessionExpired]);
    // Auth operations hook
    const { login, register, logout } = useAuthOperations(apiClient, authState, callbacks);
    // Session management hook
    const { refreshAccessToken, validateToken, checkSession, updateLastActivity } = useAuthSession(apiClient, authState, callbacks);
    // Profile operations hook
    const { updateProfile, getCurrentUser, deleteAccount } = useAuthProfile(apiClient, authState, callbacks);
    // Password operations hook
    const { changePassword, resetPassword, confirmResetPassword } = useAuthPassword(apiClient);
    // Permissions hook
    const { hasPermission, hasRole } = useAuthPermissions(state.user);
    // Initialize auth from storage on mount
    useEffect(() => {
        let mounted = true;
        const initializeAuth = async () => {
            try {
                const { token: storedToken, user: storedUser, refreshToken: storedRefreshToken } = getStoredAuth();
                if (storedToken && storedUser && isValidUser(storedUser)) {
                    // Verify session with API if possible
                    try {
                        const response = await apiClient.get("auth/me").json();
                        if (mounted && response && isValidUser(response)) {
                            const validatedUser = {
                                id: response.id,
                                name: response.name,
                                email: response.email,
                                role: response.role || "USER",
                                permissions: response.permissions || [],
                                profileImage: response.profileImage || response.profile_image,
                            };
                            setAuthData(validatedUser, storedToken, storedRefreshToken ?? undefined);
                        }
                        else if (mounted) {
                            // Token exists but session invalid
                            clearAuthData();
                            onSessionExpired?.();
                        }
                    }
                    catch {
                        // API check failed, use stored data if available
                        if (mounted) {
                            updateState({
                                user: storedUser,
                                token: storedToken,
                                refreshToken: storedRefreshToken,
                            });
                        }
                    }
                }
                else if (storedToken && storedUser) {
                    // Stored user is invalid, clear data
                    clearAuthData();
                }
            }
            catch (error) {
                console.error("Auth initialization error:", error);
                clearAuthData();
            }
            finally {
                if (mounted) {
                    updateState({ isLoading: false, isInitialized: true });
                }
            }
        };
        initializeAuth();
        return () => {
            mounted = false;
        };
    }, [apiClient, clearAuthData, setAuthData, updateState, getStoredAuth, onSessionExpired]);
    // Clear error helper
    const clearError = useCallback(() => {
        updateState({ error: null });
    }, [updateState]);
    // ==========================================================================
    // Context Value
    // ==========================================================================
    const contextValue = useMemo(() => ({
        // State
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: !!state.user && !!state.token,
        isLoading: state.isLoading,
        isInitialized: state.isInitialized,
        error: state.error,
        // Operations
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
        hasPermission,
        hasRole,
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
        hasPermission,
        hasRole,
    ]);
    return _jsx(AuthContext.Provider, { value: contextValue, children: children });
}
// ==========================================================================
// Auth Hooks
// ==========================================================================
/**
 * Main hook for accessing authentication context
 * @throws {Error} If used outside AuthProvider
 * @public
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider. " +
            "Make sure to wrap your app or component tree with <AuthProvider>.");
    }
    return context;
}
/**
 * Hook for accessing only authentication state (read-only)
 * More efficient than useAuth for components that only need state
 * @public
 */
export function useAuthState() {
    const auth = useAuth();
    return useMemo(() => ({
        user: auth.user,
        token: auth.token,
        refreshToken: auth.refreshToken,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        isInitialized: auth.isInitialized,
        error: auth.error,
    }), [auth]);
}
/**
 * Hook for checking permissions
 * @public
 */
export function usePermissions() {
    const { hasPermission, hasRole, user } = useAuth();
    return useMemo(() => ({
        hasPermission,
        hasRole,
        isAdmin: user?.role === "ADMIN",
        isUser: user?.role === "USER",
        isAgent: user?.role === "AGENT",
    }), [hasPermission, hasRole, user]);
}
//# sourceMappingURL=AuthContext.js.map