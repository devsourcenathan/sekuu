import { useAuthStore } from '@/store/authStore';

/**
 * Hook for checking user permissions
 */
export function usePermissions() {
  const { user } = useAuthStore();
  
  /**
   * Check if user has a specific permission or any of the provided permissions
   * @param permission - Single permission slug or array of permission slugs
   * @returns true if user has the permission(s)
   */
  const hasPermission = (permission: string | string[]): boolean => {
    if (!user?.permissions) return false;
    
    if (Array.isArray(permission)) {
      // User has permission if they have ANY of the provided permissions
      return permission.some(p => user.permissions?.includes(p));
    }
    
    return user.permissions.includes(permission);
  };
  
  /**
   * Check if user has all of the provided permissions
   * @param permissions - Array of permission slugs
   * @returns true if user has all permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user?.permissions) return false;
    return permissions.every(p => user.permissions?.includes(p));
  };
  
  /**
   * Check if user has a specific role
   * @param role - Role slug or array of role slugs
   * @returns true if user has the role(s)
   */
  const hasRole = (role: string | string[]): boolean => {
    if (!user?.roles) return false;
    
    if (Array.isArray(role)) {
      return role.some(r => user.roles?.some(userRole => userRole.slug === r));
    }
    
    return user.roles.some(userRole => userRole.slug === role);
  };
  
  return { 
    hasPermission, 
    hasAllPermissions,
    hasRole,
    permissions: user?.permissions || [],
  };
}
