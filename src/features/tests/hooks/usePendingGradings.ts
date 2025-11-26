import { useQuery } from '@tanstack/react-query';
import { testsApi } from '../api/testsApi';
import { queryKeys } from '@/lib/query/client';

export function usePendingGradings() {
    return useQuery({
        queryKey: queryKeys.tests.pendingGradings,
        queryFn: () => testsApi.getPendingGradings(),
        staleTime: 1 * 60 * 1000,
    });
}