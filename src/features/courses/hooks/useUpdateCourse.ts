import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../api/coursesApi';
import { type UpdateCourseData } from '../types/course.types';
import { useUiStore } from '@/store/uiStore';

export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCourseData }) =>
            coursesApi.updateCourse(id, data),
        onSuccess: (_, { id }) => {
            // showSuccess('Course updated successfully');
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({ queryKey: ['course', id] });
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
        },
        onError: (error: any) => {
            // showError(error.message || 'Failed to update course');
        },
    });
}