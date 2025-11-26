import { useMutation } from '@tanstack/react-query';
import { apiPost } from '@/lib/api/client';
import { invalidateQueries } from '@/lib/query/helpers';

/**
 * Hook pour gérer la progression d'une leçon : mise à jour et marquage complet.
 * NOTE: Nous faisons l'hypothèse que l'API expose les endpoints suivants :
 *  - POST /lessons/:id/progress  -> { progress_percentage, watch_time_seconds }
 *  - POST /lessons/:id/complete  -> { }
 * Si l'API diffère, il faudra adapter les URLs ci-dessous.
 */
export function useLessonProgress() {
    const updateProgress = useMutation({
        mutationFn: async ({ chapterId, lessonId, payload }: { chapterId: number | string; lessonId: number | string; payload: any }) => {
            return apiPost(`/chapters/${chapterId}/lessons/${lessonId}/progress`, payload);
        },
        onSuccess: () => {
            invalidateQueries.lessons();
            invalidateQueries.dashboard.student();
        },
    });

    const markComplete = useMutation({
        mutationFn: async ({ chapterId, lessonId }: { chapterId: number | string; lessonId: number | string }) => {
            return apiPost(`/chapters/${chapterId}/lessons/${lessonId}/complete`);
        },
        onSuccess: () => {
            invalidateQueries.lessons();
            invalidateQueries.dashboard.student();
        },
    });

    return {
        updateProgress,
        markComplete,
    };
}
