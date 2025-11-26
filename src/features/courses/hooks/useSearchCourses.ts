import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../api/coursesApi';
import { useDebounce } from '@/lib/hooks/useDebounce';

/**
 * Hook pour rechercher des cours avec debounce
 */
export function useSearchCourses(query: string) {
    const debouncedQuery = useDebounce(query, 500);

    return useQuery({
        queryKey: ['courses', 'search', debouncedQuery],
        queryFn: () => coursesApi.searchCourses(debouncedQuery),
        enabled: debouncedQuery.length >= 3,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}