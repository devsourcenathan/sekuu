import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi, type CreateLessonData, type UpdateLessonData } from '../api/lessonsApi';
import { toast } from 'sonner';

export function useLessons(chapterId: number) {
    return useQuery({
        queryKey: ['lessons', chapterId],
        queryFn: () => lessonsApi.getLessonsByChapter(chapterId),
        enabled: !!chapterId,
    });
}

export function useLesson(lessonId: number) {
    return useQuery({
        queryKey: ['lesson', lessonId],
        queryFn: () => lessonsApi.getLesson(lessonId),
        enabled: !!lessonId,
    });
}

export function useCreateLesson() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLessonData) => lessonsApi.createLesson(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lessons', variables.chapter_id] });
            queryClient.invalidateQueries({ queryKey: ['chapter', variables.chapter_id] });
            toast.success('Lesson created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to create lesson');
        },
    });
}

export function useUpdateLesson() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateLessonData }) =>
            lessonsApi.updateLesson(id, data),
        onSuccess: (lesson) => {
            queryClient.invalidateQueries({ queryKey: ['lessons', lesson.chapter_id] });
            queryClient.invalidateQueries({ queryKey: ['lesson', lesson.id] });
            queryClient.invalidateQueries({ queryKey: ['chapter', lesson.chapter_id] });
            toast.success('Lesson updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to update lesson');
        },
    });
}

export function useDeleteLesson() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lessonId: number) => lessonsApi.deleteLesson(lessonId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessons'] });
            queryClient.invalidateQueries({ queryKey: ['chapters'] });
            toast.success('Lesson deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to delete lesson');
        },
    });
}

export function useReorderLessons() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ chapterId, lessonIds }: { chapterId: number; lessonIds: number[] }) =>
            lessonsApi.reorderLessons(chapterId, lessonIds),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lessons', variables.chapterId] });
            toast.success('Lessons reordered successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to reorder lessons');
        },
    });
}
