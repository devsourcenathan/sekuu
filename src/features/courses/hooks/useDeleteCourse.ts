import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { coursesApi } from '../api/coursesApi';
import { invalidateQueries } from '@/lib/query/helpers';
import { useUiStore } from '@/store/uiStore';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Hook pour supprimer un cours
 */
export function useDeleteCourse() {
    const navigate = useNavigate();
    const { addNotification } = useUiStore();

    return useMutation({
        mutationFn: (courseId: number | string) =>
            coursesApi.deleteCourse(courseId),
        onSuccess: () => {
            invalidateQueries.courses();

            addNotification({
                type: 'success',
                title: 'Cours supprimé',
                message: 'Le cours a été supprimé avec succès',
            });

            navigate(ROUTES.INSTRUCTOR_COURSES);
        },
        onError: (error: any) => {
            addNotification({
                type: 'error',
                title: 'Erreur',
                message: error.message || 'Impossible de supprimer le cours',
            });
        },
    });
}