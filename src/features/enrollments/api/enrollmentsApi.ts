import { apiGet, apiPost, apiPut } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type {
    EnrollmentDetails,
    EnrollmentFilters,
    UpdateLessonProgress,
    ProgressStats,
} from '../types/enrollment.types';
import type { PaginatedResponse } from '@/types';

/**
 * API pour la gestion des inscriptions et progression
 */
export const enrollmentsApi = {
    /**
     * Récupérer mes inscriptions (étudiant)
     */
    getMyEnrollments: async (
        filters?: EnrollmentFilters
    ): Promise<PaginatedResponse<EnrollmentDetails>> => {
        return apiGet<PaginatedResponse<EnrollmentDetails>>(
            ENDPOINTS.STUDENT.ENROLLMENTS,
            filters
        );
    },

    /**
     * Récupérer les détails d'une inscription
     */
    getEnrollmentDetails: async (id: number | string): Promise<EnrollmentDetails> => {
        return apiGet<EnrollmentDetails>(ENDPOINTS.STUDENT.ENROLLMENT_DETAIL(id));
    },

    /**
     * Marquer une leçon comme complétée
     */
    completeLesson: async (
        chapterId: number | string,
        lessonId: number | string
    ): Promise<{ message: string }> => {
        return apiPost<{ message: string }>(
            ENDPOINTS.LESSONS.COMPLETE(chapterId, lessonId)
        );
    },

    /**
     * Mettre à jour la progression d'une leçon
     */
    updateLessonProgress: async (
        chapterId: number | string,
        lessonId: number | string,
        data: UpdateLessonProgress
    ): Promise<{ message: string }> => {
        return apiPost<{ message: string }>(
            ENDPOINTS.LESSONS.PROGRESS(chapterId, lessonId),
            data
        );
    },

    /**
     * Récupérer les statistiques de progression pour un cours
     */
    getProgressStats: async (enrollmentId: number | string): Promise<ProgressStats> => {
        return apiGet<ProgressStats>(`/enrollments/${enrollmentId}/stats`);
    },

    /**
     * Reprendre le dernier cours consulté
     */
    getLastAccessedLesson: async (
        enrollmentId: number | string
    ): Promise<{ chapter_id: number; lesson_id: number }> => {
        return apiGet<{ chapter_id: number; lesson_id: number }>(
            `/enrollments/${enrollmentId}/last-accessed`
        );
    },
};