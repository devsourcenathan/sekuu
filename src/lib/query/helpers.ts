import { type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { type ApiError } from '@/types';
import { queryClient, queryKeys } from './client';

export type QueryConfig<TData = unknown, TError = ApiError> = Omit<
    UseQueryOptions<TData, TError>,
    'queryKey' | 'queryFn'
>;

export type MutationConfig<
    TData = unknown,
    TError = ApiError,
    TVariables = unknown
> = Omit<
    UseMutationOptions<TData, TError, TVariables>,
    'mutationFn'
>;

// Helper pour invalider les queries liées
export const invalidateQueries = {
    courses: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },

    chapters: (courseId?: number | string) => {
        if (courseId) {
            queryClient.invalidateQueries({
                queryKey: queryKeys.chapters.list(courseId)
            });
        } else {
            queryClient.invalidateQueries({ queryKey: queryKeys.chapters.all });
        }
    },

    lessons: (chapterId?: number | string) => {
        if (chapterId) {
            queryClient.invalidateQueries({
                queryKey: queryKeys.lessons.list(chapterId)
            });
        } else {
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.all });
        }
    },

    tests: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tests.all });
    },

    enrollments: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all });
    },

    payments: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },

    certificates: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.certificates.all });
    },

    dashboard: {
        student: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.student });
        },
        instructor: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.instructor });
        },
        admin: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.admin });
        },
    },
};

// Helper pour précharger des données
export const prefetchQuery = {
    courseDetails: async (id: number | string) => {
        await queryClient.prefetchQuery({
            queryKey: queryKeys.courses.detail(id),
            // La fonction queryFn sera ajoutée dans la Phase 2
        });
    },
};