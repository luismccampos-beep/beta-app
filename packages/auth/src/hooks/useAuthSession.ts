// ==========================================================================
// useAuthSession Hook - Token and Session Management
// ==========================================================================

import { useCallback } from "react";

import type { AuthApiClient } from "../types/index";
import { storage, STORAGE_KEYS } from "../utils/index";
import { TokenManager } from "../utils/tokenManager";
import type { UseAuthStateReturn } from "./useAuthState";

// ==========================================================================
// Hook Return Type
// ==========================================================================

export interface UseAuthSessionReturn {
  refreshAccessToken: () => Promise<string>;
  validateToken: () => Promise<boolean>;
  checkSession: () => Promise<boolean>;
  updateLastActivity: () => void;
}

// ==========================================================================
// Hook Implementation
// ==========================================================================

/**
 * Hook for session and token management
 * @internal
 */
export function useAuthSession(
  apiClient: AuthApiClient,
  authState: UseAuthStateReturn,
  callbacks?: {
    onSessionExpired?: () => void;
  }
): UseAuthSessionReturn {
  const { state, updateState, clearAuthData } = authState;

  /**
   * Refresh the access token using refresh token
   */
  const refreshAccessToken = useCallback(async (): Promise<string> => {
    const refreshToken = state.refreshToken || TokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      if (apiClient.refresh) {
        const result = await apiClient.refresh(refreshToken);
        storage.set(STORAGE_KEYS.TOKEN, result.accessToken);
        TokenManager.setAccessToken(result.accessToken);
        if (result.refreshToken) {
          storage.set(STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken);
          TokenManager.setRefreshToken(result.refreshToken);
          updateState({
            token: result.accessToken,
            refreshToken: result.refreshToken,
          });
        } else {
          updateState({ token: result.accessToken });
        }
        return result.accessToken;
      }

      // Fallback: return current token if no refresh method
      const currentToken = state.token || TokenManager.getAccessToken();
      if (!currentToken) {
        throw new Error("No token available");
      }
      return currentToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthData();
      callbacks?.onSessionExpired?.();
      throw error;
    }
  }, [state.refreshToken, state.token, apiClient, clearAuthData, updateState, callbacks]);

  /**
   * Validate the current token
   */
  const validateToken = useCallback(async (): Promise<boolean> => {
    const token = state.token || TokenManager.getAccessToken();
    if (!token) return false;

    try {
      if (apiClient.validateToken) {
        return await apiClient.validateToken(token);
      }
      // Fallback: check if token exists and isn't expired
      return TokenManager.hasValidToken();
    } catch {
      return false;
    }
  }, [state.token, apiClient]);

  /**
   * Update last activity timestamp
   */
  const updateLastActivity = useCallback(() => {
    storage.set(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
  }, []);

  /**
   * Check if session is valid, attempt refresh if needed
   */
  const checkSession = useCallback(async (): Promise<boolean> => {
    const token = state.token || TokenManager.getAccessToken();
    if (!token) return false;

    const isValid = await validateToken();
    if (!isValid) {
      const refreshToken = state.refreshToken || TokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          await refreshAccessToken();
          return true;
        } catch {
          return false;
        }
      }
    }

    return isValid;
  }, [state.token, state.refreshToken, validateToken, refreshAccessToken]);

  return {
    refreshAccessToken,
    validateToken,
    checkSession,
    updateLastActivity,
  };
}
