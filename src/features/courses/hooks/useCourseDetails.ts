import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/client';
import { coursesApi } from '../api/coursesApi';

/**
 * Hook pour récupérer les détails d'un cours
 */
export function useCourseDetails(id: number | string, enabled = true) {
    return useQuery({
        queryKey: queryKeys.courses.detail(id),
        queryFn: () => coursesApi.getCourseDetails(id),
        enabled: enabled && !!id,
        staleTime: 5 * 60 * 1000,
    });
}