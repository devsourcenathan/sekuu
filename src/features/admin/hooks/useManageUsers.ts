import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { type User, type ApiResponse, type PaginationMeta } from '@/types';

interface UsersResponse {
    data: User[];
    meta: PaginationMeta;
}

export function useManageUsers(page = 1, search = '', role = '') {
    return useQuery({
        queryKey: ['admin-users', page, search, role],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                search,
                role,
            });
            const response = await apiClient.get<ApiResponse<UsersResponse>>(
                `/admin/dashboard/users?${params}`
            );
            return response.data.data;
        },
    });
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
            await apiClient.put(`/admin/users/${userId}/role`, { role });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
    });
}

export function useToggleUserStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, isActive }: { userId: number; isActive: boolean }) => {
            await apiClient.put(`/admin/users/${userId}/status`, { is_active: isActive });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
    });
}
