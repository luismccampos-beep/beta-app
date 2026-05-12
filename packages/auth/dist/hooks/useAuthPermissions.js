// ==========================================================================
// useAuthPermissions Hook - Permission Helpers
// ==========================================================================
import { useCallback } from "react";
// ==========================================================================
// Hook Implementation
// ==========================================================================
/**
 * Hook for permission checking
 * @internal
 */
export function useAuthPermissions(user) {
    /**
     * Check if user has a specific permission
     */
    const hasPermission = useCallback((permission) => {
        if (!user)
            return false;
        if (user.role === "ADMIN")
            return true;
        return user.permissions?.includes(permission) || false;
    }, [user]);
    /**
     * Check if user has a specific role
     */
    const hasRole = useCallback((role) => {
        if (!user)
            return false;
        const roles = Array.isArray(role) ? role : [role];
        return roles.includes(user.role);
    }, [user]);
    return {
        hasPermission,
        hasRole,
    };
}
//# sourceMappingURL=useAuthPermissions.js.map