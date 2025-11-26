import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { type ApiResponse } from '@/types';

export interface Notification {
    id: number;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    read: boolean;
    created_at: string;
    action_url?: string;
}

export function useNotifications() {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const response = await apiClient.get<ApiResponse<Notification[]>>('/notifications');
            return response.data.data;
        },
        refetchInterval: 60000, // Refetch every minute
    });
}

export function useMarkAsRead() {
    return async (notificationId: number) => {
        await apiClient.put(`/notifications/${notificationId}/read`);
    };
}

export function useMarkAllAsRead() {
    return async () => {
        await apiClient.put('/notifications/mark-all-read');
    };
}
