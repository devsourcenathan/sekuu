import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/client';
import { coursesApi } from '../api/coursesApi';
import { PAGINATION_CONFIG } from '@/lib/constants';
import type { CourseFilters } from '../types/course.types';


/**
 * Hook pour récupérer la liste des cours avec filtres
 */

export function useCourses(filters?: CourseFilters) {
    return useQuery({
        queryKey: queryKeys.courses.list(filters || {}),
        queryFn: () => coursesApi.getCourses({
            per_page: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            ...filters,
        }),
        staleTime: 2 * 60 * 1000,
    });
}
// export function useCategory() {
//     return useQuery({
//         queryKey: queryKeys.categories.all,
//         queryFn: () => coursesApi.getCategories(),
//         staleTime: 2 * 60 * 1000,
//     });
// }