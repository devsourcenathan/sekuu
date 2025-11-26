import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { type Payment, type ApiResponse, type PaginationMeta } from '@/types';

interface PaymentsResponse {
    data: Payment[];
    meta: PaginationMeta;
}

export function useMyPayments(page = 1, status?: string) {
    return useQuery({
        queryKey: ['my-payments', page, status],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                ...(status && { status }),
            });
            const response = await apiClient.get<ApiResponse<PaymentsResponse>>(
                `/student/payments?${params}`
            );
            return response.data.data;
        },
    });
}

export function useDownloadInvoice() {
    return async (paymentId: number) => {
        try {
            const response = await apiClient.get(`/student/payments/${paymentId}/invoice`, {
                responseType: 'blob',
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${paymentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            throw error;
        }
    };
}
