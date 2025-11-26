import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type {
    Pack,
    PackFormValues,
    PackCourseConfigFormValues,
    PackEnrollment,
    PackStatistics,
    PackProgress,
    PaginatedResponse,
} from '@/types';

/**
 * API pour la gestion des packs
 */
export const packsApi = {
    /**
     * Récupérer la liste des packs avec filtres
     */
    getPacks: async (filters?: {
        instructor_id?: number;
        search?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
        per_page?: number;
    }): Promise<PaginatedResponse<Pack>> => {
        const params = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }

        return apiGet<PaginatedResponse<Pack>>(
            '/packs',
            Object.fromEntries(params)
        );
    },

    /**
     * Récupérer les détails d'un pack
     */
    getPackDetails: async (id: number | string): Promise<Pack> => {
        return apiGet<Pack>(`/packs/${id}`);
    },

    /**
     * Créer un nouveau pack
     */
    createPack: async (data: PackFormValues): Promise<Pack> => {
        return apiPost<Pack>('/packs', data);
    },

    /**
     * Mettre à jour un pack
     */
    updatePack: async (
        id: number | string,
        data: Partial<PackFormValues>
    ): Promise<Pack> => {
        return apiPut<Pack>(`/packs/${id}`, data);
    },

    /**
     * Supprimer un pack
     */
    deletePack: async (id: number | string): Promise<void> => {
        return apiDelete<void>(`/packs/${id}`);
    },

    /**
     * Publier un pack
     */
    publishPack: async (id: number | string): Promise<Pack> => {
        return apiPost<Pack>(`/packs/${id}/publish`);
    },

    /**
     * Dépublier un pack
     */
    unpublishPack: async (id: number | string): Promise<Pack> => {
        return apiPost<Pack>(`/packs/${id}/unpublish`);
    },

    /**
     * Ajouter un cours à un pack
     */
    addCourseToPack: async (
        packId: number | string,
        data: PackCourseConfigFormValues
    ): Promise<Pack> => {
        return apiPost<Pack>(`/packs/${packId}/courses`, data);
    },

    /**
     * Retirer un cours d'un pack
     */
    removeCourseFromPack: async (
        packId: number | string,
        courseId: number | string
    ): Promise<Pack> => {
        return apiDelete<Pack>(`/packs/${packId}/courses/${courseId}`);
    },

    /**
     * Mettre à jour la configuration d'un cours dans un pack
     */
    updatePackCourseConfig: async (
        packId: number | string,
        courseId: number | string,
        data: Partial<PackCourseConfigFormValues>
    ): Promise<Pack> => {
        return apiPut<Pack>(`/packs/${packId}/courses/${courseId}`, data);
    },

    /**
     * Récupérer mes packs (instructeur)
     */
    getInstructorPacks: async (): Promise<PaginatedResponse<Pack>> => {
        return apiGet<PaginatedResponse<Pack>>('/instructor/packs');
    },

    /**
     * Récupérer les statistiques d'un pack
     */
    getPackStatistics: async (id: number | string): Promise<PackStatistics> => {
        return apiGet<PackStatistics>(`/packs/${id}/statistics`);
    },

    /**
     * S'inscrire à un pack
     */
    enrollInPack: async (id: number | string): Promise<PackEnrollment> => {
        return apiPost<PackEnrollment>(`/packs/${id}/enroll`);
    },

    /**
     * Récupérer mes inscriptions aux packs (étudiant)
     */
    getMyPackEnrollments: async (): Promise<PaginatedResponse<PackEnrollment>> => {
        return apiGet<PaginatedResponse<PackEnrollment>>('/student/pack-enrollments');
    },

    /**
     * Récupérer les détails d'une inscription à un pack
     */
    getPackEnrollmentDetails: async (id: number | string): Promise<PackEnrollment> => {
        return apiGet<PackEnrollment>(`/student/pack-enrollments/${id}`);
    },

    /**
     * Récupérer la progression dans un pack
     */
    getPackProgress: async (id: number | string): Promise<PackProgress> => {
        return apiGet<PackProgress>(`/student/pack-enrollments/${id}/progress`);
    },

    /**
     * Annuler une inscription à un pack
     */
    cancelPackEnrollment: async (id: number | string): Promise<void> => {
        return apiPost<void>(`/student/pack-enrollments/${id}/cancel`);
    },
};
