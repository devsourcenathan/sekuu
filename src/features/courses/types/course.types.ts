import { type User, type PaginatedResponse } from '@/types';

/**
 * Filtres pour la recherche de cours
 */
export interface CourseFilters {
    search?: string;
    category_id?: number;
    level?: 'beginner' | 'intermediate' | 'advanced';
    is_free?: boolean;
    min_price?: number;
    max_price?: number;
    language?: string;
    sort_by?: 'created_at' | 'title' | 'price' | 'students_count' | 'rating';
    sort_order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}

/**
 * Données pour créer un cours
 */
export interface CreateCourseData {
    title: string;
    description: string;
    what_you_will_learn?: string;
    requirements?: string;
    target_audience?: string;

    // Media fields
    cover_image?: File; // File object for upload
    presentation_text?: string;
    presentation_video_url?: string;
    presentation_video_type?: 'youtube' | 'vimeo' | 'custom';

    // Category (required)
    category_id: number;

    level: 'beginner' | 'intermediate' | 'advanced';
    language: string;

    // Pricing
    is_free: boolean;
    price?: number;
    currency?: string;
    discount_price?: number;
    discount_start_date?: string;
    discount_end_date?: string;

    // Enrollment
    enrollment_start_date?: string;
    enrollment_end_date?: string;
    max_students?: number;
    access_duration_days?: number;

    // Settings
    is_public: boolean;
    requires_approval: boolean;
    allow_download: boolean;
    has_certificate: boolean;
    has_forum: boolean;
}

/**
 * Données pour mettre à jour un cours
 */
export interface UpdateCourseData extends Partial<CreateCourseData> {
    status?: 'draft' | 'published' | 'archived';
}

/**
 * Statistiques d'un cours
 */
export interface CourseStats {
    total_students: number;
    active_students: number;
    completed_students: number;
    average_progress: number;
    average_rating: number;
    total_reviews: number;
    total_revenue: number;
    completion_rate: number;
}

/**
 * Réponse paginée de cours
 */
export type CoursesResponse = PaginatedResponse<Course>;

/**
 * Détails complets d'un cours avec relations
 */
export interface CourseDetails extends Course {
    chapters?: Chapter[];
    instructor?: User;
    stats?: CourseStats;
    is_enrolled?: boolean;
    user_progress?: number;
}

// Ré-export des types depuis types/index.ts pour faciliter les imports
import type { Course, Chapter, Lesson } from '@/types';
export type { Course, Chapter, Lesson };