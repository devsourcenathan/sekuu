import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { testsApi } from '../api/testsApi';
import { invalidateQueries } from '@/lib/query/helpers';
import { useUiStore } from '@/store/uiStore';
import type { SubmitTestData } from '../types/test.types';

export function useSubmitTest(submissionId: number | string) {
    const navigate = useNavigate();
    const { addNotification } = useUiStore();

    return useMutation({
        mutationFn: (data: SubmitTestData) =>
            testsApi.submitTest(submissionId, data),
        onSuccess: (submission) => {
            invalidateQueries.tests();

            addNotification({
                type: 'success',
                title: 'Test soumis',
                message: submission.passed
                    ? 'Félicitations ! Vous avez réussi le test.'
                    : 'Test soumis. Consultez vos résultats.',
            });

            // Rediriger vers les résultats
            navigate(`/student/submissions/${submission.id}/results`);
        },
        onError: (error: any) => {
            addNotification({
                type: 'error',
                title: 'Erreur',
                message: error.message || 'Impossible de soumettre le test',
            });
        },
    });
}