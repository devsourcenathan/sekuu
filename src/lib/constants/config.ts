
/**
 * Configuration de l'API
 */
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    TIMEOUT: 30000, // 30 secondes
} as const;

/**
 * Configuration de l'authentification
 */
export const AUTH_CONFIG = {
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'auth_user',
    REFRESH_TOKEN_KEY: 'refresh_token',
} as const;

/**
 * Configuration de la pagination
 */
export const PAGINATION_CONFIG = {
    DEFAULT_PAGE_SIZE: 15,
    PAGE_SIZE_OPTIONS: [10, 15, 25, 50, 100],
} as const;

/**
 * Configuration des uploads de fichiers
 */
export const FILE_UPLOAD_CONFIG = {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_IMAGE_TYPES: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
    ],
    ALLOWED_VIDEO_TYPES: [
        'video/mp4',
        'video/webm',
    ],
    ALLOWED_DOCUMENT_TYPES: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    ALLOWED_RESOURCE_TYPES: [
        'application/pdf',
        'application/zip',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
} as const;

/**
 * Configuration des cours
 */
export const COURSE_CONFIG = {
    LEVELS: [
        { value: 'beginner', label: 'Débutant' },
        { value: 'intermediate', label: 'Intermédiaire' },
        { value: 'advanced', label: 'Avancé' },
    ],
    LANGUAGES: [
        { value: 'fr', label: 'Français' },
        { value: 'en', label: 'Anglais' },
        { value: 'es', label: 'Espagnol' },
    ],
    CURRENCIES: [
        { value: 'USD', label: 'USD ($)', symbol: '$' },
        { value: 'EUR', label: 'EUR (€)', symbol: '€' },
        { value: 'XAF', label: 'XAF (FCFA)', symbol: 'FCFA' },
    ],
    STATUSES: [
        { value: 'draft', label: 'Brouillon', color: 'gray' },
        { value: 'published', label: 'Publié', color: 'green' },
        { value: 'archived', label: 'Archivé', color: 'red' },
    ],
} as const;

/**
 * Configuration des leçons
 */
export const LESSON_CONFIG = {
    CONTENT_TYPES: [
        { value: 'video', label: 'Vidéo', icon: 'Video' },
        { value: 'text', label: 'Texte', icon: 'FileText' },
        { value: 'pdf', label: 'PDF', icon: 'File' },
        { value: 'audio', label: 'Audio', icon: 'Music' },
        { value: 'quiz', label: 'Quiz', icon: 'ClipboardCheck' },
    ],
    VIDEO_PROVIDERS: [
        { value: 'youtube', label: 'YouTube' },
        { value: 'vimeo', label: 'Vimeo' },
    ],
} as const;

/**
 * Configuration des tests
 */
export const TEST_CONFIG = {
    TYPES: [
        { value: 'formative', label: 'Formatif' },
        { value: 'summative', label: 'Sommatif' },
    ],
    POSITIONS: [
        { value: 'after_lesson', label: 'Après une leçon' },
        { value: 'after_chapter', label: 'Après un chapitre' },
        { value: 'after_course', label: 'Fin de formation' },
    ],
    QUESTION_TYPES: [
        { value: 'single_choice', label: 'QCM - Choix unique' },
        { value: 'multiple_choice', label: 'QCM - Choix multiples' },
        { value: 'true_false', label: 'Vrai/Faux' },
        { value: 'short_answer', label: 'Réponse courte' },
        { value: 'long_answer', label: 'Réponse longue' },
        { value: 'file_upload', label: 'Fichier à uploader' },
    ],
    VALIDATION_TYPES: [
        { value: 'automatic', label: 'Automatique' },
        { value: 'manual', label: 'Manuelle' },
        { value: 'mixed', label: 'Mixte' },
    ],
    GRADES: [
        { value: 'A+', label: 'Excellent', min: 90 },
        { value: 'A', label: 'Très bien', min: 80 },
        { value: 'B', label: 'Bien', min: 70 },
        { value: 'C', label: 'Passable', min: 60 },
        { value: 'D', label: 'Insuffisant', min: 50 },
        { value: 'F', label: 'Échec', min: 0 },
    ],
} as const;

/**
 * Configuration des paiements
 */
export const PAYMENT_CONFIG = {
    GATEWAYS: [
        { value: 'stripe', label: 'Stripe', icon: 'CreditCard' },
        { value: 'paypal', label: 'PayPal', icon: 'Wallet' },
    ],
    STATUSES: [
        { value: 'pending', label: 'En attente', color: 'yellow' },
        { value: 'completed', label: 'Complété', color: 'green' },
        { value: 'failed', label: 'Échoué', color: 'red' },
        { value: 'refunded', label: 'Remboursé', color: 'gray' },
    ],
} as const;

/**
 * Rôles des utilisateurs
 */
export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    INSTRUCTOR: 'instructor',
    STUDENT: 'student',
} as const;

/**
 * Labels des rôles
 */
export const ROLE_LABELS: Record<string, string> = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.ADMIN]: 'Administrateur',
    [ROLES.INSTRUCTOR]: 'Instructeur',
    [ROLES.STUDENT]: 'Étudiant',
} as const;

/**
 * Configuration de l'application
 */
export const APP_CONFIG = {
    NAME: 'Sekuu',
    DESCRIPTION: 'Plateforme de formation en ligne',
    VERSION: '1.0.0',
    SUPPORT_EMAIL: 'support@sekuu.com',
    DEFAULT_LANGUAGE: 'fr',
} as const;

/**
 * Configuration des notifications
 */
export const NOTIFICATION_CONFIG = {
    DEFAULT_DURATION: 5000, // 5 secondes
    SUCCESS_DURATION: 3000,
    ERROR_DURATION: 7000,
    WARNING_DURATION: 5000,
    INFO_DURATION: 4000,
} as const;

/**
 * Configuration du cache
 */
export const CACHE_CONFIG = {
    STALE_TIME: 5 * 60 * 1000, // 5 minutes
    GC_TIME: 10 * 60 * 1000, // 10 minutes
    RETRY_COUNT: 1,
    RETRY_DELAY: 1000,
} as const;

// Types pour TypeScript
export type Role = typeof ROLES[keyof typeof ROLES];
export type CourseLevel = typeof COURSE_CONFIG.LEVELS[number]['value'];
export type CourseStatus = typeof COURSE_CONFIG.STATUSES[number]['value'];
export type LessonContentType = typeof LESSON_CONFIG.CONTENT_TYPES[number]['value'];
export type VideoProvider = typeof LESSON_CONFIG.VIDEO_PROVIDERS[number]['value'];
export type TestType = typeof TEST_CONFIG.TYPES[number]['value'];
export type TestPosition = typeof TEST_CONFIG.POSITIONS[number]['value'];
export type QuestionType = typeof TEST_CONFIG.QUESTION_TYPES[number]['value'];
export type ValidationType = typeof TEST_CONFIG.VALIDATION_TYPES[number]['value'];
export type PaymentGateway = typeof PAYMENT_CONFIG.GATEWAYS[number]['value'];
export type PaymentStatus = typeof PAYMENT_CONFIG.STATUSES[number]['value'];