import { useQuery } from '@tanstack/react-query';
import { enrollmentsApi } from '../api/enrollmentsApi';

export function useProgressStats(enrollmentId: number | string, enabled = true) {
    return useQuery({
        queryKey: ['enrollments', enrollmentId, 'stats'],
        queryFn: () => enrollmentsApi.getProgressStats(enrollmentId),
        enabled: enabled && !!enrollmentId,
        staleTime: 30 * 1000, // 30 secondes
    });
}