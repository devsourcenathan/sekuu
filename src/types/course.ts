// src/types/course.ts

// Enum pour les niveaux
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

// Type pour les détails d'un cours
export interface Course {
    id: number;
    title: string;
    slug: string;
    description: string;

    // Media fields
    cover_image?: string;
    cover_image_url?: string; // URL returned from backend
    presentation_text?: string;
    presentation_video_url?: string;
    presentation_video_type?: 'youtube' | 'vimeo' | 'custom';

    // Instructor and category
    instructor_id?: number;
    instructor_name?: string;
    category_id?: number;
    category_name?: string;

    // Course details
    level: CourseLevel;
    language?: string;
    what_you_will_learn?: string;
    requirements?: string;
    target_audience?: string;

    // Pricing
    price: number;
    discount_price?: number | null;
    currency: string;
    is_free: boolean;
    discount_start_date?: string;
    discount_end_date?: string;

    // Enrollment
    enrollment_start_date?: string;
    enrollment_end_date?: string;
    max_students?: number;
    access_duration_days?: number;

    // Stats
    total_duration_minutes?: number;
    chapters_count?: number;
    lessons_count?: number;
    rating?: number; // Moyenne des notes
    reviews_count?: number;

    // Settings
    is_public: boolean;
    requires_approval?: boolean;
    allow_download?: boolean;
    has_certificate?: boolean;
    has_forum?: boolean;

    // Status
    status?: 'draft' | 'published' | 'archived';

    // Timestamps
    created_at?: string;
    updated_at?: string;
}

// Type pour les paramètres de requête de la liste de cours
export interface CourseQueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    category_id?: number | string;
    level?: CourseLevel | 'all';
    is_free?: boolean;
    sort_by?: 'created_at' | 'price' | 'rating';
    sort_order?: 'asc' | 'desc';
}

// Type pour une réponse d'API paginée (standard Laravel/API)
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}