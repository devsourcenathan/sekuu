import type { Course } from './index';

// Course with pivot data when part of a pack
export interface CourseWithPivot extends Course {
    pivot?: {
        pack_id: number;
        course_id: number;
        order?: number;
        is_required: boolean;
        access_config?: PackAccessConfig;
    };
}

export interface Pack {
    id: number;
    instructor_id: number;
    title: string;
    slug: string;
    description: string;
    cover_image?: string;
    price: number;
    currency: string;
    discount_percentage: number;
    is_active: boolean;
    is_public: boolean;
    max_enrollments?: number;
    access_duration_days?: number;
    enrollment_start_date?: string;
    enrollment_end_date?: string;
    has_certificate: boolean;
    require_sequential_completion: boolean;
    recommended_order?: number[];
    total_courses: number;
    total_duration_minutes: number;
    students_enrolled: number;
    average_rating: number;
    total_reviews: number;
    published_at?: string;
    created_at: string;
    updated_at: string;

    // Relations
    instructor?: {
        id: number;
        name: string;
        email: string;
    };
    courses?: CourseWithPivot[];
}

export interface PackCourse {
    id: number;
    pack_id: number;
    include_tests?: boolean;
    include_resources?: boolean;
    allow_download?: boolean;
    include_certificate?: boolean;
}

export interface PackAccessConfig {
    include_chapters: number[] | null;
    include_lessons: number[] | null;
    include_tests: boolean;
    include_resources: boolean;
    allow_download: boolean;
    include_certificate: boolean;
}

export interface PackEnrollment {
    id: number;
    user_id: number;
    pack_id: number;
    status: 'active' | 'completed' | 'expired' | 'cancelled';
    enrolled_at: string;
    expires_at?: string;
    completed_at?: string;
    progress_percentage: number;
    completed_courses: number;
    total_courses: number;
    last_accessed_at?: string;
    certificate_issued: boolean;
    certificate_issued_at?: string;
    created_at: string;
    updated_at: string;

    // Relations
    pack?: Pack;
    course_enrollments?: any[];
}

export interface PackFormValues {
    title: string;
    description: string;
    cover_image?: string;
    price: number;
    currency?: string;
    is_active?: boolean;
    is_public?: boolean;
    max_enrollments?: number;
    access_duration_days?: number;
    enrollment_start_date?: string;
    enrollment_end_date?: string;
    has_certificate?: boolean;
    require_sequential_completion?: boolean;
    recommended_order?: number[];
}

export interface PackCourseConfigFormValues {
    course_id: number;
    order?: number;
    is_required?: boolean;
    access_config?: PackAccessConfig;
}

export interface PackStatistics {
    total_enrollments: number;
    active_enrollments: number;
    completed_enrollments: number;
    total_revenue: number;
    average_progress: number;
    total_courses: number;
    enrollments_by_month: Array<{
        month: string;
        count: number;
    }>;
}

export interface PackProgress {
    pack_id: number;
    status: string;
    progress_percentage: number;
    completed_courses: number;
    total_courses: number;
    enrolled_at: string;
    expires_at?: string;
    completed_at?: string;
    certificate_issued: boolean;
    courses: Array<{
        course_id: number;
        course_title: string;
        status: string;
        progress_percentage: number;
        completed_lessons: number;
        total_lessons: number;
    }>;
}
