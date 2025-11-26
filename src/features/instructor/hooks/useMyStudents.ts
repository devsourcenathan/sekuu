import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { type User, type ApiResponse, type PaginationMeta } from '@/types';

interface StudentWithProgress extends User {
    enrolled_courses_count: number;
    completed_courses_count: number;
    average_progress: number;
    last_active_at: string;
}

interface StudentsResponse {
    data: StudentWithProgress[];
    meta: PaginationMeta;
}

export function useMyStudents(page = 1, search = '') {
    return useQuery({
        queryKey: ['instructor-students', page, search],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                search,
            });
            const response = await apiClient.get<ApiResponse<StudentsResponse>>(
                `/instructor/dashboard/students?${params}`
            );
            return response.data.data;
        },
    });
}
