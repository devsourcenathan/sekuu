import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { type Chapter, type ApiResponse } from '@/types';

export interface CreateChapterData {
    course_id: number;
    title: string;
    description?: string;
    order: number;
    is_free?: boolean;
    is_published?: boolean;
    duration_minutes?: number;
}

export interface UpdateChapterData extends Partial<CreateChapterData> { }

export const chaptersApi = {
    getChaptersByCourse: async (courseId: number): Promise<Chapter[]> => {
        const response = await apiGet<Chapter[]>(
            ENDPOINTS.CHAPTERS.BY_COURSE(courseId)
        );

        return response;
    },

    getChapter: async (courseId: number, chapterId: number): Promise<Chapter> => {
        const response = await apiGet<Chapter>(
            ENDPOINTS.CHAPTERS.SHOW(courseId, chapterId)
        );
        return response;
    },

    createChapter: async (data: CreateChapterData): Promise<Chapter> => {
        const response = await apiPost<Chapter>(
            ENDPOINTS.CHAPTERS.CREATE(data.course_id),
            data
        );
        return response;
    },

    updateChapter: async (courseId: number, chapterId: number, data: UpdateChapterData): Promise<Chapter> => {
        const response = await apiPut<Chapter>(
            ENDPOINTS.CHAPTERS.UPDATE(courseId, chapterId),
            data
        );
        return response;
    },

    deleteChapter: async (courseId: number, chapterId: number): Promise<void> => {
        await apiDelete<void>(ENDPOINTS.CHAPTERS.DELETE(courseId, chapterId));
    },

    reorderChapters: async (courseId: number, chapterIds: number[]): Promise<void> => {
        await apiPost<void>(ENDPOINTS.CHAPTERS.REORDER(courseId), {
            chapter_ids: chapterIds,
        });
    },
};
