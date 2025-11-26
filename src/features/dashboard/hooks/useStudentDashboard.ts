// import { useMemo } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { queryKeys } from '@/lib/query/client';
// import { useMyEnrollments } from '@/features/courses/hooks/useMyEnrollments';
// import type { StudentDashboardStats } from '@/types';

// /**
//  * Hook composite qui agrège les données du dashboard étudiant.
//  * Pour l'instant, on utilise les enrollments (mes cours) pour calculer
//  * les stats de base (actifs, complétés, progression moyenne).
//  */
// export function useStudentDashboard() {
//     const enrollmentsQuery = useMyEnrollments();

//     const statsQuery = useQuery({
//         queryKey: queryKeys.dashboard.student,
//         queryFn: async () => {
//             // On calcule localement les statistiques à partir des enrollments
//             const enrollments = (enrollmentsQuery.data as any) || [];

//             const total = enrollments.length;
//             const completed = enrollments.filter((e: any) => e.progress_percentage >= 100).length;
//             const active = enrollments.filter((e: any) => e.status === 'active').length;
//             const avgProgress =
//                 enrollments.length > 0
//                     ? Math.round(
//                         enrollments.reduce((s: number, e: any) => s + (e.progress_percentage || 0), 0) /
//                         enrollments.length
//                     )
//                     : 0;

//             const stats: StudentDashboardStats = {
//                 total_enrollments: total,
//                 active_courses: active,
//                 completed_courses: completed,
//                 certificates_earned: 0,
//                 total_watch_time_minutes: 0,
//                 average_progress: avgProgress,
//                 recent_enrollments: enrollments.slice(0, 5),
//                 upcoming_tests: [],
//             };

//             return stats;
//         },
//         enabled: !!enrollmentsQuery.data,
//         staleTime: 60 * 1000,
//     });

//     // Exposer aussi les enrollments bruts
//     const enrollments = enrollmentsQuery.data as any[] | undefined;

//     return useMemo(() => ({ statsQuery, enrollmentsQuery, enrollments }), [statsQuery, enrollmentsQuery, enrollments]);
// }

import { useQuery } from '@tanstack/react-query';
import { studentDashboardApi } from '../api/studentDashboardApi';
import { queryKeys } from '@/lib/query/client';

export function useStudentDashboard() {
    return useQuery({
        queryKey: queryKeys.dashboard.student,
        queryFn: () => studentDashboardApi.getOverview(),
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}