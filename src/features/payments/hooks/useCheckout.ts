import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { type ApiResponse } from '@/types';

interface CheckoutSession {
    session_id: string;
    url: string;
    payment_intent?: string;
}

interface PromoCode {
    code: string;
    discount_percent: number;
    discount_amount: number;
    is_valid: boolean;
}

export function useCreateCheckoutSession(courseId: string) {
    return useMutation({
        mutationFn: async (data: { promo_code?: string }) => {
            const response = await apiClient.post<ApiResponse<CheckoutSession>>(
                `/courses/${courseId}/checkout`,
                data
            );
            return response.data.data;
        },
    });
}

export function useValidatePromoCode(courseId: string) {
    return useMutation({
        mutationFn: async (code: string) => {
            const response = await apiClient.post<ApiResponse<PromoCode>>(
                `/courses/${courseId}/validate-promo`,
                { code }
            );
            return response.data.data;
        },
    });
}

export function useFreeEnrollment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (courseId: string) => {
            const response = await apiClient.post<ApiResponse<any>>(
                `/courses/${courseId}/enroll-free`
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-courses'] });
            queryClient.invalidateQueries({ queryKey: ['enrollments'] });
        },
    });
}
