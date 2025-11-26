import { useQuery } from '@tanstack/react-query';
import { enrollmentsApi } from '../api/enrollmentsApi';
import { queryKeys } from '@/lib/query/client';
import type { EnrollmentFilters } from '../types/enrollment.types';

export function useMyEnrollments(filters?: EnrollmentFilters) {
    return useQuery({
        queryKey: queryKeys.enrollments.list(filters || {}),
        queryFn: () => enrollmentsApi.getMyEnrollments(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}