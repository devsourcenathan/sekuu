import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type TestSubmission, type ApiResponse } from '@/types';
import { apiClient } from '@/lib/api/client';

export function usePendingGradings() {
    return useQuery({
        queryKey: ['instructor-pending-gradings'],
        queryFn: async () => {
            const response = await apiClient.get<ApiResponse<TestSubmission[]>>(
                '/tests/pending-gradings'
            );
            return response.data.data;
        },
    });
}

export function useGradeSubmission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ submissionId, grades }: { submissionId: number; grades: { question_id: number; points: number; feedback?: string }[] }) => {
            const response = await apiClient.post<ApiResponse<TestSubmission>>(
                `/instructor/tests/submissions/${submissionId}/grade`,
                { grades }
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor-pending-gradings'] });
        },
    });
}
