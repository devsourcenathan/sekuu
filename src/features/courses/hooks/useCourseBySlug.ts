import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../api/coursesApi';

/**
 * Hook pour récupérer un cours par son slug
 */
export function useCourseBySlug(slug: string, enabled = true) {
    return useQuery({
        queryKey: ['courses', 'slug', slug],
        queryFn: () => coursesApi.getCourseBySlug(slug),
        enabled: enabled && !!slug,
        staleTime: 5 * 60 * 1000,
    });
}