import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { type AdminDashboardStats, type ApiResponse } from '@/types';

export function useAdminDashboard() {
    return useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: async () => {
            const response = await apiClient.get<ApiResponse<AdminDashboardStats>>(
                '/admin/dashboard/overview'
            );
            return response.data.data;
        },
    });
}
