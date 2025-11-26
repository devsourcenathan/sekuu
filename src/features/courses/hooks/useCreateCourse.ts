import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '../api/coursesApi';
import { type CreateCourseData } from '../types/course.types';
import { useUiStore } from '@/store/uiStore';

export function useCreateCourse() {
    const queryClient = useQueryClient();
    // const { showSuccess, showError } = useUiStore();

    return useMutation({
        mutationFn: (data: CreateCourseData) => coursesApi.createCourse(data),
        onSuccess: () => {
            // showSuccess('Course created successfully');
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
        },
        onError: (error: any) => {
            // showError(error.message || 'Failed to create course');
        },
    });
}