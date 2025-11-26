import { useQuery } from '@tanstack/react-query';
import { testsApi } from '../api/testsApi';
import { queryKeys } from '@/lib/query/client';

export function useMySubmissions(testId: number | string, enabled = true) {
    return useQuery({
        queryKey: queryKeys.tests.submissions(testId),
        queryFn: () => testsApi.getMySubmissions(testId),
        enabled: enabled && !!testId,
        staleTime: 1 * 60 * 1000,
    });
}