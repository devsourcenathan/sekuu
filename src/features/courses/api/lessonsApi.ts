import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { type Lesson, type ApiResponse } from '@/types';

export interface CreateLessonData {
    chapter_id: number;
    title: string;
    description?: string;
    content_type: 'video' | 'text' | 'pdf' | 'audio' | 'quiz';
    content?: string;
    video_url?: string;
    video_provider?: 'youtube' | 'vimeo';
    video_id?: string;
    order: number;
    duration_minutes?: number;
    is_free?: boolean;
    is_preview?: boolean;
    is_downloadable?: boolean;
    auto_complete?: boolean;
    completion_threshold?: number;
}

export interface UpdateLessonData extends Partial<CreateLessonData> { }

export const lessonsApi = {
    getLessonsByChapter: async (chapterId: number): Promise<Lesson[]> => {
        const response = await apiGet<Lesson[]>(
            ENDPOINTS.LESSONS.BY_CHAPTER(chapterId)
        );

        return response;
    },

    getLesson: async (lessonId: number): Promise<Lesson> => {
        const response = await apiGet<Lesson>(
            ENDPOINTS.LESSONS.SHOW(lessonId)
        );
        return response;
    },

    createLesson: async (data: CreateLessonData): Promise<Lesson> => {
        const response = await apiPost<Lesson>(
            ENDPOINTS.LESSONS.CREATE(data.chapter_id),
            data
        );
        return response;
    },

    updateLesson: async (lessonId: number, data: UpdateLessonData): Promise<Lesson> => {
        const response = await apiPut<ApiResponse<Lesson>>(
            ENDPOINTS.LESSONS.UPDATE(lessonId),
            data
        );
        return response.data;
    },

    deleteLesson: async (lessonId: number): Promise<void> => {
        await apiDelete<void>(ENDPOINTS.LESSONS.DELETE(lessonId));
    },

    reorderLessons: async (chapterId: number, lessonIds: number[]): Promise<void> => {
        await apiPost<void>(ENDPOINTS.LESSONS.REORDER(chapterId), {
            lesson_ids: lessonIds,
        });
    },
};
