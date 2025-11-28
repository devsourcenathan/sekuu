import { apiClient } from './client';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    is_active: boolean;
    roles: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    permissions: Array<{
        id: number;
        name: string;
        slug: string;
        module: string;
    }>;
}

export interface UserPermissionsResponse {
    user: User;
    role_permissions: Array<{
        id: number;
        name: string;
        slug: string;
        module: string;
    }>;
    direct_permissions: Array<{
        id: number;
        name: string;
        slug: string;
        module: string;
    }>;
}

export const usersApi = {
    /**
     * Get all users with pagination and search
     */
    getUsers: (params?: { per_page?: number; search?: string }) =>
        apiClient.get('/users', { params }),

    /**
     * Get user's permissions (role-based and direct)
     */
    getUserPermissions: (userId: number) =>
        apiClient.get<{ success: boolean; data: UserPermissionsResponse }>(`/users/${userId}/permissions`),

    /**
     * Get user's effective permissions (merged)
     */
    getEffectivePermissions: (userId: number) =>
        apiClient.get(`/users/${userId}/effective-permissions`),

    /**
     * Assign a direct permission to a user
     */
    assignPermission: (userId: number, permissionId: number) =>
        apiClient.post(`/users/${userId}/permissions`, { permission_id: permissionId }),

    /**
     * Revoke a direct permission from a user
     */
    revokePermission: (userId: number, permissionId: number) =>
        apiClient.delete(`/users/${userId}/permissions/${permissionId}`),
};
