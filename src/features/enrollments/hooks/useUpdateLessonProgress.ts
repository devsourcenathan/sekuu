import { useMutation } from '@tanstack/react-query';
import { enrollmentsApi } from '../api/enrollmentsApi';
import { queryClient, queryKeys } from '@/lib/query/client';
import type { UpdateLessonProgress } from '../types/enrollment.types';

export function useUpdateLessonProgress(enrollmentId: number | string) {
    return useMutation({
        mutationFn: ({
            chapterId,
            lessonId,
            data
        }: {
            chapterId: number | string;
            lessonId: number | string;
            data: UpdateLessonProgress;
        }) => enrollmentsApi.updateLessonProgress(chapterId, lessonId, data),
        onSuccess: () => {
            // Mise à jour silencieuse du cache
            queryClient.invalidateQueries({
                queryKey: queryKeys.enrollments.detail(enrollmentId),
            });
        },
    });
}