import { useQuery } from '@tanstack/react-query';
import { testsApi } from '../api/testsApi';
import { queryKeys } from '@/lib/query/client';

export function useTestDetails(id: number | string, enabled = true) {
    return useQuery({
        queryKey: queryKeys.tests.detail(id),
        queryFn: () => testsApi.getTestDetails(id),
        enabled: enabled && !!id,
        staleTime: 5 * 60 * 1000,
    });
}