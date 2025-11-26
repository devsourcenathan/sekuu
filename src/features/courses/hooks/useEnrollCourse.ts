import { useMutation } from '@tanstack/react-query';
import { coursesApi } from '../api/coursesApi';
import { invalidateQueries } from '@/lib/query/helpers';
import { useUiStore } from '@/store/uiStore';
import { queryClient, queryKeys } from '@/lib/query/client';

/**
 * Hook pour s'inscrire à un cours
 */
export function useEnrollCourse(courseId: number | string) {
    const { addNotification } = useUiStore();

    return useMutation({
        mutationFn: () => coursesApi.enrollCourse(courseId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.courses.detail(courseId)
            });
            invalidateQueries.enrollments();

            addNotification({
                type: 'success',
                title: 'Inscription réussie',
                message: data.message || 'Vous êtes maintenant inscrit à ce cours',
            });
        },
        onError: (error: any) => {
            addNotification({
                type: 'error',
                title: 'Erreur',
                message: error.message || 'Impossible de s\'inscrire au cours',
            });
        },
    });
}