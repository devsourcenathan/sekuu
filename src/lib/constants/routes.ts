// src/lib/constants/routes.ts
export const ROUTES = {
    // Public
    HOME: '/',
    COURSES: '/courses',
    COURSE_DETAILS: '/courses/:slug',

    // Auth
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',

    // Dashboard (Unified)
    DASHBOARD: '/dashboard',

    // Common Protected
    MY_COURSES: '/my-courses',
    SETTINGS: '/settings',

    // Student Specific
    STUDENT_COURSE_PLAYER: '/courses/:id/play',
    STUDENT_CERTIFICATES: '/certificates',
    STUDENT_PAYMENTS: '/payments',
    CHECKOUT: '/checkout/:courseId',

    // Packs
    PACKS: '/packs',
    PACK_DETAILS: '/packs/:slug',
    MY_PACKS: '/my-packs',

    // Instructor Specific
    INSTRUCTOR_CREATE_COURSE: '/courses/create',
    INSTRUCTOR_EDIT_COURSE: '/courses/:id/edit',
    INSTRUCTOR_PACKS: '/instructor/packs',
    INSTRUCTOR_CREATE_PACK: '/instructor/packs/create',
    INSTRUCTOR_EDIT_PACK: '/instructor/packs/:id/edit',
    INSTRUCTOR_STUDENTS: '/students',
    INSTRUCTOR_PENDING_GRADINGS: '/gradings',
    INSTRUCTOR_REVENUE: '/revenue',
    INSTRUCTOR_TEST_BUILDER: '/tests/create',
    INSTRUCTOR_TEST_EDIT: '/tests/:testId/edit',



    // Admin Specific
    ADMIN_USERS: '/users',
    ADMIN_COURSES: '/admin/courses',
    ADMIN_PACKS: '/admin/packs',
    ADMIN_PAYMENTS: '/admin/payments',
    ADMIN_ROLES: '/roles',

    // Sessions (LiveKit)
    SESSIONS: '/sessions',
    SESSION_WAITING_ROOM: '/sessions/:id/waiting-room',
    SESSION_ROOM: '/sessions/:id/room',
    MY_SESSIONS: '/my-sessions',
    REQUEST_MEETING: '/request-meeting',
    GROUPS: '/groups',
    MEETING_REQUESTS: '/meeting-requests',

    // Other
    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '/404',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];