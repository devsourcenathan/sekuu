import { useMutation } from '@tanstack/react-query';
import { testsApi } from '../api/testsApi';
import { queryClient } from '@/lib/query/client';
import { useUiStore } from '@/store/uiStore';
import type { GradeSubmissionData } from '../types/test.types';

export function useGradeSubmission(submissionId: number | string) {
    const { addNotification } = useUiStore();

    return useMutation({
        mutationFn: (data: GradeSubmissionData) =>
            testsApi.gradeSubmission(submissionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['submissions', submissionId]
            });

            addNotification({
                type: 'success',
                title: 'Notation enregistrée',
                message: 'La note a été attribuée avec succès',
            });
        },
        onError: (error: any) => {
            addNotification({
                type: 'error',
                title: 'Erreur',
                message: error.message || 'Impossible de noter la soumission',
            });
        },
    });
}