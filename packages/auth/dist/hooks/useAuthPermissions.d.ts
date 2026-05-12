import type { User } from "../types/index";
export interface UseAuthPermissionsReturn {
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string | string[]) => boolean;
}
/**
 * Hook for permission checking
 * @internal
 */
export declare function useAuthPermissions(user: User | null): UseAuthPermissionsReturn;
//# sourceMappingURL=useAuthPermissions.d.ts.map