// ==========================================================================
// useAuthOperations Hook - Login, Register, Logout Operations
// ==========================================================================

import { useCallback } from "react";

import type {
  User,
  AuthResponse,
  AuthError,
  LoginCredentials,
  RegisterData,
  AuthApiClient,
} from "../types/index";
import { isValidUser, type UseAuthStateReturn } from "./useAuthState";

// ==========================================================================
// Hook Return Type
// ==========================================================================

export interface UseAuthOperationsReturn {
  login: (
    emailOrCreds: LoginCredentials | string,
    password?: string
  ) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

// ==========================================================================
// Hook Implementation
// ==========================================================================

/**
 * Hook for authentication operations (login, register, logout)
 * @internal
 */
export function useAuthOperations(
  apiClient: AuthApiClient,
  authState: UseAuthStateReturn,
  callbacks?: {
    onLogout?: () => void;
    onLoginSuccess?: (user: User) => void;
  }
): UseAuthOperationsReturn {
  const { updateState, clearAuthData, setAuthData } = authState;

  /**
   * Login user with credentials
   */
  const login = useCallback(
    async (
      emailOrCreds: LoginCredentials | string,
      password?: string
    ): Promise<AuthResponse> => {
      updateState({ isLoading: true, error: null });

      try {
        const credentials: LoginCredentials =
          typeof emailOrCreds === "string"
            ? { email: emailOrCreds, password: password ?? "" }
            : emailOrCreds;

        if (!credentials.email || !credentials.password) {
          const error: AuthError = {
            message: "Email and password are required",
            code: "INVALID_CREDENTIALS",
          };
          updateState({ isLoading: false, error });
          return { success: false, message: error.message, error };
        }

        const response = await apiClient.login(
          credentials.email,
          credentials.password
        );

        if (response.success && response.data?.user) {
          const rawUser = response.data.user;

          if (!isValidUser(rawUser)) {
            throw new Error("Invalid user data received from server.");
          }

          const userData: User = {
            id: rawUser.id,
            name: rawUser.name,
            email: rawUser.email,
            role: rawUser.role || "USER",
            permissions: rawUser.permissions || [],
            profileImage: rawUser.profileImage || rawUser.profile_image,
          };

          setAuthData(
            userData,
            response.data.accessToken,
            response.data.refreshToken
          );

          callbacks?.onLoginSuccess?.(userData);

          return {
            success: true,
            message: "Login successful",
            user: userData,
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          };
        }

        const message = response.message || "Login failed";
        const error: AuthError = { message, code: "LOGIN_FAILED" };
        updateState({ isLoading: false, error });
        return { success: false, message, error };
      } catch (error) {
        const authError: AuthError = {
          message: error instanceof Error ? error.message : "Login failed",
          code: "LOGIN_ERROR",
        };
        updateState({ isLoading: false, error: authError });
        return {
          success: false,
          message: authError.message,
          error: authError,
        };
      }
    },
    [apiClient, setAuthData, updateState, callbacks]
  );

  /**
   * Register new user
   */
  const register = useCallback(
    async (userData: RegisterData): Promise<AuthResponse> => {
      updateState({ isLoading: true, error: null });

      try {
        const response = await apiClient.register(userData);

        if (response.success && response.data?.user) {
          const rawUser = response.data.user;

          if (!isValidUser(rawUser)) {
            throw new Error("Invalid user data received from server.");
          }

          const user: User = {
            id: rawUser.id,
            name: rawUser.name,
            email: rawUser.email,
            role: rawUser.role || "USER",
            permissions: rawUser.permissions || [],
            profileImage: rawUser.profileImage || rawUser.profile_image,
          };

          setAuthData(
            user,
            response.data.accessToken,
            response.data.refreshToken
          );

          return {
            success: true,
            message: "Registration successful",
            user,
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          };
        }

        const message = response.message || "Registration failed";
        const error: AuthError = { message, code: "REGISTER_FAILED" };
        updateState({ isLoading: false, error });
        return { success: false, message, error };
      } catch (error) {
        const authError: AuthError = {
          message:
            error instanceof Error ? error.message : "Registration failed",
          code: "REGISTER_ERROR",
        };
        updateState({ isLoading: false, error: authError });
        return {
          success: false,
          message: authError.message,
          error: authError,
        };
      }
    },
    [apiClient, setAuthData, updateState]
  );

  /**
   * Logout user
   */
  const logout = useCallback(async (): Promise<void> => {
    updateState({ isLoading: true });
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      clearAuthData();
      updateState({ isLoading: false });
      callbacks?.onLogout?.();
    }
  }, [apiClient, clearAuthData, updateState, callbacks]);

  return {
    login,
    register,
    logout,
  };
}
