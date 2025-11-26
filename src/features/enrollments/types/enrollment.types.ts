import { type Course, type User } from '@/types';

/**
 * Filtre pour les inscriptions
 */
export interface EnrollmentFilters {
    status?: 'active' | 'completed' | 'expired' | 'suspended';
    course_id?: number;
    page?: number;
    per_page?: number;
}

/**
 * Détails d'une inscription avec relations
 */
export interface EnrollmentDetails {
    id: number;
    user_id: number;
    course_id: number;
    status: 'active' | 'completed' | 'expired' | 'suspended';
    progress_percentage: number;
    enrolled_at: string;
    completed_at?: string;
    expires_at?: string;
    last_accessed_at?: string;
    course: Course & {
        chapters?: ChapterWithProgress[];
    };
    user?: User;
}

/**
 * Chapitre avec progression
 */
export interface ChapterWithProgress {
    id: number;
    course_id: number;
    title: string;
    description?: string;
    order: number;
    is_free: boolean;
    is_published: boolean;
    duration_minutes?: number;
    lessons?: LessonWithProgress[];
    progress_percentage?: number;
    is_completed?: boolean;
}

/**
 * Leçon avec progression
 */
export interface LessonWithProgress {
    id: number;
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
    is_free: boolean;
    is_preview: boolean;
    is_downloadable: boolean;
    is_completed?: boolean;
    progress_percentage?: number;
    watch_time_seconds?: number;
    completed_at?: string;
}

/**
 * Données pour marquer une leçon comme complétée
 */
export interface CompleteLesson {
    lesson_id: number;
    enrollment_id: number;
}

/**
 * Données pour mettre à jour la progression d'une leçon
 */
export interface UpdateLessonProgress {
    progress_percentage: number;
    watch_time_seconds?: number;
}

/**
 * Statistiques de progression
 */
export interface ProgressStats {
    total_lessons: number;
    completed_lessons: number;
    total_chapters: number;
    completed_chapters: number;
    total_duration_minutes: number;
    watched_duration_minutes: number;
    progress_percentage: number;
    estimated_completion_date?: string;
}