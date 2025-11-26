import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../api/coursesApi';

export interface InstructorStats {
    totalStudents: number;
    totalRevenue: number;
    averageRating: number;
    totalCourses: number;
    recentEnrollments: number;
}

export function useInstructorStats() {
    return useQuery({
        queryKey: ['instructor-stats'],
        queryFn: async (): Promise<InstructorStats> => {
            // In a real app, this would be a dedicated endpoint
            // For now, we'll fetch courses and derive some stats, or return mock data

            try {
                const courses = await coursesApi.getMyCourses();

                // Mock calculation based on courses
                const totalCourses = courses.length;
                const totalStudents = courses.reduce((acc, course) => acc + (course.students_count || 0), 0);

                // Mock revenue and rating as they might not be in the course object yet
                const totalRevenue = totalStudents * 49.99; // Mock average price
                const averageRating = 4.5; // Mock rating

                return {
                    totalStudents,
                    totalRevenue,
                    averageRating,
                    totalCourses,
                    recentEnrollments: Math.floor(Math.random() * 10), // Mock
                };
            } catch (error) {
                console.error('Failed to fetch instructor stats', error);
                // Return fallback mock data if API fails
                return {
                    totalStudents: 150,
                    totalRevenue: 12500,
                    averageRating: 4.8,
                    totalCourses: 5,
                    recentEnrollments: 12,
                };
            }
        },
    });
}
