import { QueryClient } from '@tanstack/react-query';

const queryConfig = {
    queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
        retry: 0,
    },
};

export const queryClient = new QueryClient({
    defaultOptions: queryConfig,
});

// Query Keys Factory pour organiser les clés de cache
export const queryKeys = {
    // Auth
    auth: {
        me: ['auth', 'me'] as const,
    },

    // Courses
    courses: {
        all: ['courses'] as const,
        lists: () => [...queryKeys.courses.all, 'list'] as const,
        list: (filters: Record<string, any>) =>
            [...queryKeys.courses.lists(), filters] as const,
        details: () => [...queryKeys.courses.all, 'detail'] as const,
        detail: (id: number | string) =>
            [...queryKeys.courses.details(), id] as const,
        myCourses: ['courses', 'my-courses'] as const,
    },

    categories: {
        all: ['categories'] as const
    },

    // Chapters
    chapters: {
        all: ['chapters'] as const,
        lists: () => [...queryKeys.chapters.all, 'list'] as const,
        list: (courseId: number | string) =>
            [...queryKeys.chapters.lists(), courseId] as const,
        details: () => [...queryKeys.chapters.all, 'detail'] as const,
        detail: (courseId: number | string, id: number | string) =>
            [...queryKeys.chapters.details(), courseId, id] as const,
    },

    // Lessons
    lessons: {
        all: ['lessons'] as const,
        lists: () => [...queryKeys.lessons.all, 'list'] as const,
        list: (chapterId: number | string) =>
            [...queryKeys.lessons.lists(), chapterId] as const,
        details: () => [...queryKeys.lessons.all, 'detail'] as const,
        detail: (chapterId: number | string, id: number | string) =>
            [...queryKeys.lessons.details(), chapterId, id] as const,
    },

    // Tests
    tests: {
        all: ['tests'] as const,
        details: () => [...queryKeys.tests.all, 'detail'] as const,
        detail: (id: number | string) =>
            [...queryKeys.tests.details(), id] as const,
        submissions: (id: number | string) =>
            [...queryKeys.tests.all, 'submissions', id] as const,
        pendingGradings: ['tests', 'pending-gradings'] as const,
    },

    // Enrollments
    enrollments: {
        all: ['enrollments'] as const,
        lists: () => [...queryKeys.enrollments.all, 'list'] as const,
        list: (filters: Record<string, any>) =>
            [...queryKeys.enrollments.lists(), filters] as const,
        details: () => [...queryKeys.enrollments.all, 'detail'] as const,
        detail: (id: number | string) =>
            [...queryKeys.enrollments.details(), id] as const,
    },

    // Payments
    payments: {
        all: ['payments'] as const,
        lists: () => [...queryKeys.payments.all, 'list'] as const,
        list: (filters: Record<string, any>) =>
            [...queryKeys.payments.lists(), filters] as const,
        myPayments: ['payments', 'my-payments'] as const,
    },

    // Certificates
    certificates: {
        all: ['certificates'] as const,
        lists: () => [...queryKeys.certificates.all, 'list'] as const,
        list: () => [...queryKeys.certificates.lists()] as const,
        verify: (code: string) =>
            [...queryKeys.certificates.all, 'verify', code] as const,
    },

    // Dashboard
    dashboard: {
        student: ['dashboard', 'student'] as const,
        instructor: ['dashboard', 'instructor'] as const,
        admin: ['dashboard', 'admin'] as const,
        instructorAnalytics: (courseId: number | string) =>
            ['dashboard', 'instructor', 'analytics', courseId] as const,
        instructorStudents: (filters: Record<string, any>) =>
            ['dashboard', 'instructor', 'students', filters] as const,
        instructorRevenue: (filters: Record<string, any>) =>
            ['dashboard', 'instructor', 'revenue', filters] as const,
        adminUsers: (filters: Record<string, any>) =>
            ['dashboard', 'admin', 'users', filters] as const,
        adminCourses: (filters: Record<string, any>) =>
            ['dashboard', 'admin', 'courses', filters] as const,
        adminPayments: (filters: Record<string, any>) =>
            ['dashboard', 'admin', 'payments', filters] as const,
    },
} as const;