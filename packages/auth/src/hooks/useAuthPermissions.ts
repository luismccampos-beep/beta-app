// ==========================================================================
// useAuthPermissions Hook - Permission Helpers
// ==========================================================================

import { useCallback } from "react";

import type { User } from "../types/index";

// ==========================================================================
// Hook Return Type
// ==========================================================================

export interface UseAuthPermissionsReturn {
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string | string[]) => boolean;
}

// ==========================================================================
// Hook Implementation
// ==========================================================================

/**
 * Hook for permission checking
 * @internal
 */
export function useAuthPermissions(user: User | null): UseAuthPermissionsReturn {
  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      if (user.role === "ADMIN") return true;
      return user.permissions?.includes(permission) || false;
    },
    [user]
  );

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (role: string | string[]): boolean => {
      if (!user) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(user.role);
    },
    [user]
  );

  return {
    hasPermission,
    hasRole,
  };
}
