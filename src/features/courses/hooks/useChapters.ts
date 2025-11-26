import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chaptersApi, type CreateChapterData, type UpdateChapterData } from '../api/chaptersApi';
import { toast } from 'sonner';

export function useChapters(courseId: number) {
    return useQuery({
        queryKey: ['chapters', courseId],
        queryFn: () => chaptersApi.getChaptersByCourse(courseId),
        enabled: !!courseId,
    });
}

export function useChapter(courseId: number, chapterId: number) {
    return useQuery({
        queryKey: ['chapter', courseId, chapterId],
        queryFn: () => chaptersApi.getChapter(courseId, chapterId),
        enabled: !!courseId && !!chapterId,
    });
}

export function useCreateChapter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateChapterData) => chaptersApi.createChapter(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chapters', variables.course_id] });
            queryClient.invalidateQueries({ queryKey: ['course', variables.course_id] });
            toast.success('Chapter created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to create chapter');
        },
    });
}

export function useUpdateChapter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, id, data }: { courseId: number; id: number; data: UpdateChapterData }) =>
            chaptersApi.updateChapter(courseId, id, data),
        onSuccess: (chapter) => {
            console.log(chapter, "Chapter After Update");

            queryClient.invalidateQueries({ queryKey: ['chapters', chapter.course_id] });
            queryClient.invalidateQueries({ queryKey: ['chapter', chapter.course_id, chapter.id] });
            queryClient.invalidateQueries({ queryKey: ['course', chapter.course_id] });
            toast.success('Chapter updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to update chapter');
        },
    });
}

export function useDeleteChapter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, chapterId }: { courseId: number; chapterId: number }) =>
            chaptersApi.deleteChapter(courseId, chapterId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chapters'] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            toast.success('Chapter deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to delete chapter');
        },
    });
}

export function useReorderChapters() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, chapterIds }: { courseId: number; chapterIds: number[] }) =>
            chaptersApi.reorderChapters(courseId, chapterIds),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chapters', variables.courseId] });
            toast.success('Chapters reordered successfully');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to reorder chapters');
        },
    });
}
