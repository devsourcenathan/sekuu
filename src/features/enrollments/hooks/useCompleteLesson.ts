import { useMutation } from '@tanstack/react-query';
import { enrollmentsApi } from '../api/enrollmentsApi';
import { queryClient, queryKeys } from '@/lib/query/client';
import { invalidateQueries } from '@/lib/query/helpers';
import { useUiStore } from '@/store/uiStore';

export function useCompleteLesson(enrollmentId: number | string) {
    const { addNotification } = useUiStore();

    return useMutation({
        mutationFn: ({
            chapterId,
            lessonId
        }: {
            chapterId: number | string;
            lessonId: number | string
        }) => enrollmentsApi.completeLesson(chapterId, lessonId),
        onSuccess: () => {
            // Invalider la progression
            queryClient.invalidateQueries({
                queryKey: queryKeys.enrollments.detail(enrollmentId),
            });
            invalidateQueries.enrollments();

            addNotification({
                type: 'success',
                title: 'Leçon complétée',
                message: 'Félicitations ! Continuez comme ça.',
            });
        },
        onError: (error: any) => {
            addNotification({
                type: 'error',
                title: 'Erreur',
                message: error.message || 'Impossible de marquer la leçon comme complétée',
            });
        },
    });
}