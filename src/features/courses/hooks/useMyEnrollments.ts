import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/client';
import type { Enrollment } from '@/types';

// Utilise l'endpoint exact présent dans endpoints.json :
// GET /student/dashboard/enrollments
export function useMyEnrollments() {
    return useQuery({
        queryKey: queryKeys.enrollments.all,
        queryFn: async () => {
            const data = await apiGet<Enrollment[]>('/student/dashboard/enrollments');
            return data as Enrollment[];
        },
        staleTime: 2 * 60 * 1000,
    });
}
