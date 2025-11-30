import { apiGet, apiPut } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { LegalPage, LegalPageFormData } from '../types/settings.types';

export const legalApi = {
    /**
     * Get a published legal page by slug (public)
     */
    getBySlug: async (slug: string): Promise<LegalPage> => {
        const response = await apiGet<{ page: LegalPage }>(
            ENDPOINTS.LEGAL.GET_BY_SLUG(slug)
        );
        return response.page;
    },

    /**
     * Get all legal pages (admin only)
     */
    getAll: async (): Promise<LegalPage[]> => {
        const response = await apiGet<{ pages: LegalPage[] }>(ENDPOINTS.LEGAL.ADMIN_LIST);
        return response.pages;
    },

    /**
     * Create or update a legal page (admin only)
     */
    upsert: async (slug: string, data: LegalPageFormData): Promise<LegalPage> => {
        const response = await apiPut<{ page: LegalPage }>(
            ENDPOINTS.LEGAL.ADMIN_UPSERT(slug),
            data
        );
        return response.page;
    },
};
