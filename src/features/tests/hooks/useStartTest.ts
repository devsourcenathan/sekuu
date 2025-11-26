import { useMutation } from '@tanstack/react-query';
import { testsApi } from '../api/testsApi';
import { useUiStore } from '@/store/uiStore';

export function useStartTest() {
    const { addNotification } = useUiStore();

    return useMutation({
        mutationFn: (testId: number | string) => testsApi.startTest(testId),
        onError: (error: any) => {
            addNotification({
                type: 'error',
                title: 'Erreur',
                message: error.message || 'Impossible de démarrer le test',
            });
        },
    });
}