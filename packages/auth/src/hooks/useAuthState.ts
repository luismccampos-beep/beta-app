// ==========================================================================
// useAuthState Hook - State Management for Authentication
// ==========================================================================

import { useState, useCallback } from "react";

import type { User, AuthError } from "../types/index";
import { storage, STORAGE_KEYS, isValidUser } from "../utils/index";
import { TokenManager } from "../utils/tokenManager";

// ==========================================================================
// Types
// ==========================================================================

/**
 * Internal authentication state
 * @internal
 */
export interface LocalAuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: AuthError | null;
}

/**
 * Initial state for authentication
 * @internal
 */
export const initialState: LocalAuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true,
  isInitialized: false,
  error: null,
};

// ==========================================================================
// Hook Return Type
// ==========================================================================

export interface UseAuthStateReturn {
  state: LocalAuthState;
  updateState: (updates: Partial<LocalAuthState>) => void;
  clearAuthData: () => void;
  setAuthData: (user: User, token: string, refreshToken?: string) => void;
  getStoredAuth: () => {
    token: string | null;
    user: Partial<User> | null;
    refreshToken: string | null;
  };
}

// ==========================================================================
// Hook Implementation
// ==========================================================================

/**
 * Hook for managing authentication state
 * @internal
 */
export function useAuthState(): UseAuthStateReturn {
  const [state, setState] = useState<LocalAuthState>(initialState);

  /**
   * Update state with partial updates
   */
  const updateState = useCallback((updates: Partial<LocalAuthState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Clear all authentication data from state and storage
   */
  const clearAuthData = useCallback(() => {
    storage.remove(STORAGE_KEYS.TOKEN);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    storage.remove(STORAGE_KEYS.USER);
    TokenManager.clearAll();
    updateState({
      user: null,
      token: null,
      refreshToken: null,
      error: null,
    });
  }, [updateState]);

  /**
   * Set authentication data in state and storage
   */
  const setAuthData = useCallback(
    (user: User, token: string, refreshToken?: string) => {
      storage.set(STORAGE_KEYS.TOKEN, token);
      storage.setJSON(STORAGE_KEYS.USER, user);
      TokenManager.setAccessToken(token);
      TokenManager.setUser(user);
      if (refreshToken) {
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        TokenManager.setRefreshToken(refreshToken);
      }
      updateState({
        user,
        token,
        refreshToken: refreshToken ?? null,
        error: null,
      });
    },
    [updateState]
  );

  /**
   * Get stored authentication data
   */
  const getStoredAuth = useCallback(() => {
    const token = TokenManager.getAccessToken();
    const user = TokenManager.getUser<User>();
    const refreshToken = TokenManager.getRefreshToken();
    return { token, user, refreshToken };
  }, []);

  return {
    state,
    updateState,
    clearAuthData,
    setAuthData,
    getStoredAuth,
  };
}

// Re-export isValidUser for use in other hooks
export { isValidUser };
