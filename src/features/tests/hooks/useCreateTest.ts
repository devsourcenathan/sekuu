import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { testsApi } from '../api/testsApi';
import { invalidateQueries } from '@/lib/query/helpers';
import { useUiStore } from '@/store/uiStore';
import type { CreateTestData } from '../types/test.types';

export function useCreateTest() {
    const navigate = useNavigate();
    const { addNotification } = useUiStore();

    return useMutation({
        mutationFn: (data: CreateTestData) => testsApi.createTest(data),
        onSuccess: (test) => {
            invalidateQueries.tests();

            addNotification({
                type: 'success',
                title: 'Test créé',
                message: 'Le test a été créé avec succès',
            });

            navigate(`/instructor/tests/${test.id}/edit`);
        },
        onError: (error: any) => {
            addNotification({
                type: 'error',
                title: 'Erreur',
                message: error.message || 'Impossible de créer le test',
            });
        },
    });
}