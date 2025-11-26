import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { type Course, type ApiResponse, type PaginationMeta } from '@/types';

interface CoursesResponse {
    data: Course[];
    meta: PaginationMeta;
}

export function useManageCourses(page = 1, search = '', status = '') {
    return useQuery({
        queryKey: ['admin-courses', page, search, status],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                search,
                status,
            });
            const response = await apiClient.get<ApiResponse<CoursesResponse>>(
                `/admin/dashboard/courses?${params}`
            );
            return response.data.data;
        },
    });
}

export function useUpdateCourseStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, status }: { courseId: number; status: string }) => {
            await apiClient.put(`/admin/courses/${courseId}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
        },
    });
}
