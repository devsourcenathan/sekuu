import { apiGet, apiPut, apiPost, apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { InstructorEarnings, PayoutSettings } from '../types/settings.types';

export const instructorApi = {
    /**
     * Get instructor earnings summary
     */
    getEarnings: async (): Promise<InstructorEarnings> => {
        // const response = await apiGet<InstructorEarnings>(ENDPOINTS.INSTRUCTOR.EARNINGS);

        const response = await apiClient.get(ENDPOINTS.INSTRUCTOR.EARNINGS)

        return response.data;
    },

    /**
     * Update payout settings
     */
    updatePayoutSettings: async (data: PayoutSettings): Promise<void> => {
        return apiPut<void>(ENDPOINTS.INSTRUCTOR.PAYOUT_SETTINGS, data);
    },

    /**
     * Request a payout
     */
    requestPayout: async (): Promise<void> => {
        return apiPost<void>(ENDPOINTS.INSTRUCTOR.REQUEST_PAYOUT);
    },
};
