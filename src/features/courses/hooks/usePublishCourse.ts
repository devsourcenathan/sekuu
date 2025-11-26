import { useMutation } from '@tanstack/react-query';
import { coursesApi } from '../api/coursesApi';
import { invalidateQueries } from '@/lib/query/helpers';
import { useUiStore } from '@/store/uiStore';
import { queryClient, queryKeys } from '@/lib/query/client';

/**
 * Hook pour publier un cours
 */
export function usePublishCourse() {
    const { addNotification } = useUiStore();

    return useMutation({
        mutationFn: (courseId: number | string) => coursesApi.publishCourse(courseId),
        onSuccess: (_, courseId) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.courses.detail(courseId)
            });
            invalidateQueries.courses();

            addNotification({
                type: 'success',
                title: 'Cours publié',
                message: 'Le cours est maintenant visible par les étudiants',
            });
        },
        onError: (error: any) => {
            addNotification({
                type: 'error',
                title: 'Erreur',
                message: error.message || 'Impossible de publier le cours',
            });
        },
    });
}
