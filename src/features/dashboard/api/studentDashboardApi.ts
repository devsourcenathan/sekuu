import { apiGet } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { StudentDashboardStats } from '@/types';

/**
 * API pour le dashboard étudiant
 */
export const studentDashboardApi = {
    /**
     * Récupérer les statistiques du dashboard étudiant
     */
    getOverview: async (): Promise<StudentDashboardStats> => {
        return apiGet<StudentDashboardStats>(ENDPOINTS.STUDENT.OVERVIEW);
    },
};