import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../api/coursesApi';
import { queryKeys } from '@/lib/query/client';

/**
 * Hook pour récupérer mes cours (instructeur)
 */
export function useMyCourses() {
    return useQuery({
        queryKey: queryKeys.courses.myCourses,
        queryFn: () => coursesApi.getInstructorCourses(),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}