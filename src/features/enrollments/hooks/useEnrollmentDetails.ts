import { useQuery } from '@tanstack/react-query';
import { enrollmentsApi } from '../api/enrollmentsApi';
import { queryKeys } from '@/lib/query/client';

export function useEnrollmentDetails(id: number | string, enabled = true) {
    return useQuery({
        queryKey: queryKeys.enrollments.detail(id),
        queryFn: () => enrollmentsApi.getEnrollmentDetails(id),
        enabled: enabled && !!id,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}