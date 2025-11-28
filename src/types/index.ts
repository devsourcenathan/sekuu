export interface IPermission {
    id: number;
    name: string;
    slug: string;
    module?: string;
}

export interface IRole {
    id: number;
    name: string;
    slug: string;
    permissions?: IPermission[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    email_verified_at?: string;
    roles: IRole[];
    permissions?: string[]; // Array of permission slugs
    avatar?: string;
    created_at: string;
    updated_at: string;
}

export type UserRole = 'super_admin' | 'admin' | 'instructor' | 'student';

export interface AuthResponse {
    user: User;
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
}
export interface ForgotPasswordData {
    email: string;
}
export interface ResetPasswordData {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data: T;
    meta?: PaginationMeta;
}
export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}
export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}
// Course Types
export interface Course {
    id: number;
    title: string;
    slug: string;
    description: string;
    what_you_will_learn?: string;
    requirements?: string;
    target_audience?: string;
    category_id?: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    language: string;
    cover_image?: string;
    preview_video?: string;
    is_free: boolean;
    price?: number;
    currency?: string;
    discount_price?: number;
    discount_start_date?: string;
    discount_end_date?: string;
    status: 'draft' | 'published' | 'archived';
    is_public: boolean;
    requires_approval: boolean;
    max_students?: number;
    access_duration_days?: number;
    allow_download: boolean;
    has_certificate: boolean;
    has_forum: boolean;
    instructor_id: number;
    instructor?: User;
    chapters?: Chapter[];
    chapters_count?: number;
    lessons_count?: number;
    students_count?: number;
    average_rating?: number;
    enrollments_count?: number;
    completion_rate?: number;
    total_revenue?: number;
    presentation_text?: string;
    presentation_video_url?: string;
    presentation_video_type?: 'youtube' | 'vimeo' | 'custom';
    enrollment_start_date?: string;
    enrollment_end_date?: string;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    slug: string;
    name: string;
    description: string;
}
export interface Chapter {
    id: number;
    course_id: number;
    title: string;
    description?: string;
    order: number;
    is_free: boolean;
    is_published: boolean;
    duration_minutes?: number;
    lessons?: Lesson[];
    lessons_count?: number;
    created_at: string;
    updated_at: string;
}
export interface Lesson {
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
    auto_complete: boolean;
    completion_threshold?: number;
    created_at: string;
    updated_at: string;
}
// Enrollment & Progress Types
export interface Enrollment {
    id: number;
    user_id: number;
    course_id: number;
    status: 'active' | 'completed' | 'expired' | 'suspended';
    progress_percentage: number;
    enrolled_at: string;
    completed_at?: string;
    expires_at?: string;
    course?: Course;
}
export interface LessonProgress {
    id: number;
    user_id: number;
    lesson_id: number;
    enrollment_id: number;
    is_completed: boolean;
    progress_percentage: number;
    watch_time_seconds?: number;
    completed_at?: string;
    created_at: string;
    updated_at: string;
}
// Test Types
export interface Test {
    id: number;
    testable_type: string;
    testable_id: number;
    title: string;
    description?: string;
    instructions?: string;
    type: 'formative' | 'summative';
    position: 'after_lesson' | 'after_chapter' | 'after_course';
    duration_minutes?: number;
    max_attempts?: number;
    passing_score: number;
    show_results_immediately: boolean;
    show_correct_answers: boolean;
    randomize_questions: boolean;
    randomize_options: boolean;
    one_question_per_page: boolean;
    allow_back_navigation: boolean;
    auto_save_draft: boolean;
    validation_type: 'automatic' | 'manual' | 'mixed';
    is_published: boolean;
    disable_copy_paste: boolean;
    full_screen_required: boolean;
    webcam_monitoring: boolean;
    questions?: Question[];
    questions_count?: number;
    total_points?: number;
    created_at: string;
    updated_at: string;
}
export interface Question {
    id: number;
    test_id: number;
    question_text: string;
    explanation?: string;
    type: 'single_choice' | 'multiple_choice' | 'true_false' | 'short_answer' | 'long_answer' | 'file_upload';
    points: number;
    order: number;
    is_required: boolean;
    options?: QuestionOption[];
    created_at: string;
    updated_at: string;
}
export interface QuestionOption {
    id: number;
    question_id: number;
    option_text: string;
    is_correct: boolean;
    feedback?: string;
    order: number;
}
export interface TestSubmission {
    id: number;
    test_id: number;
    user_id: number;
    attempt_number: number;
    status: 'draft' | 'submitted' | 'graded';
    started_at: string;
    submitted_at?: string;
    graded_at?: string;
    score?: number;
    percentage?: number;
    grade?: string;
    passed?: boolean;
    instructor_comments?: string;
    answers?: SubmissionAnswer[];
    created_at: string;
    updated_at: string;
}
export interface SubmissionAnswer {
    id: number;
    submission_id: number;
    question_id: number;
    selected_options?: number[];
    answer_text?: string;
    answer_file?: string;
    is_correct?: boolean;
    points_earned?: number;
    feedback?: string;
}
// Payment Types
export interface Payment {
    id: number;
    user_id: number;
    course_id: number;
    amount: number;
    currency: string;
    payment_gateway: 'stripe' | 'paypal';
    gateway_transaction_id?: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    refund_reason?: string;
    refund_amount?: number;
    refunded_at?: string;
    metadata?: Record<string, any>;
    paid_at?: string;
    created_at: string;
    updated_at: string;
    course?: Course;
    user?: User;
}
export interface PromoCode {
    id: number;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    max_uses?: number;
    used_count: number;
    valid_from?: string;
    valid_until?: string;
    is_active: boolean;
}
// Certificate Types
export interface Certificate {
    id: number;
    user_id: number;
    course_id: number;
    enrollment_id: number;
    certificate_number: string;
    issued_at: string;
    verification_code: string;
    course?: Course;
    user?: User;
    final_score?: number;
    instructor?: User;
}
// Resource Types
export interface Resource {
    id: number;
    resourceable_type: string;
    resourceable_id: number;
    title: string;
    description?: string;
    file_path: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    is_free: boolean;
    is_downloadable: boolean;
    download_limit?: number;
    downloads_count: number;
    order: number;
    created_at: string;
    updated_at: string;
}
// Dashboard Stats Types
export interface StudentDashboardStats {
    in_progress: number;
    completed: number;
    total_enrollments: number;
    total_enrolled: number;
    active_courses: number;
    completed_courses: number;
    certificates_earned: number;
    total_learning_time: number;
    average_progress: number;
    recent_enrollments: Enrollment[];
    recent_activity: Enrollment[]
    stats: StudentDashboardStats;
    upcoming_tests: Test[];
}
export interface InstructorDashboardStats {
    total_courses: number;
    published_courses: number;
    total_students: number;
    total_revenue: number;
    pending_gradings: number;
    average_rating: number;
    recent_enrollments: Enrollment[];
    revenue_chart: { date: string; amount: number }[];
}
export interface AdminDashboardStats {
    stats: {
        total_users: number;
        total_instructors: number;
        total_students: number;
        total_courses: number;
        published_courses: number;
        total_enrollments: number;
        total_revenue: number;
        platform_revenue: number;
    };
    user_growth: { month: string; count: number }[];
    revenue_growth: { month: string; amount: number }[];
    top_courses: (Course & { enrollments_count: number })[];
    top_instructors: (User & { total_students: number })[];
}

// Pack Types
export * from './pack.types';

