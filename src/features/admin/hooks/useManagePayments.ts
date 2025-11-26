import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { type Payment, type ApiResponse, type PaginationMeta } from '@/types';

interface PaymentsResponse {
    data: Payment[];
    meta: PaginationMeta;
}

export function useManagePayments(page = 1, search = '', status = '') {
    return useQuery({
        queryKey: ['admin-payments', page, search, status],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                search,
                status,
            });
            const response = await apiClient.get<ApiResponse<PaymentsResponse>>(
                `/admin/dashboard/payments?${params}`
            );
            return response.data.data;
        },
    });
}

export function useRefundPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ paymentId, reason }: { paymentId: number; reason: string }) => {
            await apiClient.post(`/admin/payments/${paymentId}/refund`, { reason });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
        },
    });
}
