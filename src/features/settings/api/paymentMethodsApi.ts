import { apiGet, apiPost, apiPut, apiDelete, apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { PaymentMethod, AddPaymentMethodData } from '../types/settings.types';

export const paymentMethodsApi = {
    /**
     * Get all payment methods for the current user
     */
    list: async (): Promise<PaymentMethod[]> => {
        const { data } = await apiClient.get<{ payment_methods: PaymentMethod[] }>(
            ENDPOINTS.PAYMENT_METHODS.LIST
        );

        return data.payment_methods;
    },

    /**
     * Add a new payment method
     */
    add: async (data: AddPaymentMethodData): Promise<PaymentMethod> => {
        const {
            data: { payment_method },
        } = await apiClient.post<{ payment_method: PaymentMethod }>(
            ENDPOINTS.PAYMENT_METHODS.CREATE,
            data
        );
        return payment_method;
    },

    /**
     * Delete a payment method
     */
    delete: async (id: number): Promise<void> => {
        return apiDelete<void>(ENDPOINTS.PAYMENT_METHODS.DELETE(id));
    },

    /**
     * Set a payment method as default
     */
    setDefault: async (id: number): Promise<void> => {
        return apiPut<void>(ENDPOINTS.PAYMENT_METHODS.SET_DEFAULT(id));
    },
};
