import { useQuery } from '@tanstack/react-query';
import { testsApi } from '../api/testsApi';

/**
 * Hook pour récupérer les tests d'un cours
 */
export function useTestsByCourse(courseId: number | string) {
    return useQuery({
        queryKey: ['tests', 'course', courseId],
        queryFn: () => testsApi.getTestsByCourse(courseId),
        enabled: !!courseId,
    });
}

/**
 * Hook pour récupérer les tests d'un chapitre
 */
export function useTestsByChapter(chapterId: number | string) {
    return useQuery({
        queryKey: ['tests', 'chapter', chapterId],
        queryFn: () => testsApi.getTestsByChapter(chapterId),
        enabled: !!chapterId,
    });
}

/**
 * Hook pour récupérer les tests d'une leçon
 */
export function useTestsByLesson(lessonId: number | string) {
    return useQuery({
        queryKey: ['tests', 'lesson', lessonId],
        queryFn: () => testsApi.getTestsByLesson(lessonId),
        enabled: !!lessonId,
    });
}
