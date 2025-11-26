import { apiGet, apiPost, apiPut, apiDelete, apiUpload } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type {
    Course,
    CourseDetails,
    CoursesResponse,
    CourseFilters,
    CreateCourseData,
    UpdateCourseData,
} from '../types/course.types';

/**
 * API pour la gestion des cours
 */
export const coursesApi = {
    /**
     * Récupérer la liste des cours avec filtres
     */
    getCourses: async (filters?: CourseFilters): Promise<CoursesResponse> => {
        const params = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }

        return apiGet<CoursesResponse>(ENDPOINTS.COURSES.LIST,
            Object.fromEntries(params)
        );
    },

    /**
     * Récupérer les détails d'un cours
     */
    getCourseDetails: async (id: number | string): Promise<CourseDetails> => {
        return apiGet<CourseDetails>(ENDPOINTS.COURSES.SHOW(id));
    },

    /**
     * Récupérer un cours par son slug
     */
    getCourseBySlug: async (slug: string): Promise<CourseDetails> => {
        return apiGet<CourseDetails>(`/courses/slug/${slug}`);
    },

    /**
     * Créer un nouveau cours
     */
    createCourse: async (data: CreateCourseData): Promise<Course> => {
        // Si une image de couverture est fournie, utiliser FormData
        if (data.cover_image) {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            return apiUpload<Course>(ENDPOINTS.COURSES.CREATE, formData);
        }

        // Sinon, envoyer en JSON
        return apiPost<Course>(ENDPOINTS.COURSES.CREATE, data);
    },

    /**
     * Mettre à jour un cours
     */
    updateCourse: async (
        id: number | string,
        data: UpdateCourseData
    ): Promise<Course> => {
        // Si une image de couverture est fournie, utiliser FormData
        if (data.cover_image) {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            formData.append('_method', 'PUT');
            return apiUpload<Course>(ENDPOINTS.COURSES.UPDATE(id), formData);
        }

        return apiPut<Course>(ENDPOINTS.COURSES.UPDATE(id), data);
    },

    /**
     * Supprimer un cours
     */
    deleteCourse: async (id: number | string): Promise<void> => {
        return apiDelete<void>(ENDPOINTS.COURSES.DELETE(id));
    },

    /**
     * Publier un cours
     */
    publishCourse: async (id: number | string): Promise<Course> => {
        return apiPost<Course>(ENDPOINTS.COURSES.PUBLISH(id));
    },

    /**
     * S'inscrire à un cours
     */
    enrollCourse: async (id: number | string): Promise<{ message: string }> => {
        return apiPost<{ message: string }>(ENDPOINTS.COURSES.ENROLL(id));
    },

    /**
     * Récupérer mes cours (instructeur)
     */
    getInstructorCourses: async (): Promise<Course[]> => {
        const response = await apiGet<{ data: Course[] }>(ENDPOINTS.INSTRUCTOR.MY_COURSES);


        return response.data;
    },

    /**
     * Upload d'image de couverture
     */
    uploadCoverImage: async (
        courseId: number | string,
        file: File
    ): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('cover_image', file);

        return apiUpload<{ url: string }>(
            `/courses/${courseId}/cover-image`,
            formData
        );
    },

    /**
     * Recherche de cours (texte complet)
     */
    searchCourses: async (query: string): Promise<Course[]> => {
        return apiGet<Course[]>('/courses/search', { q: query });
    },

    /**
     * Cours populaires
     */
    getPopularCourses: async (limit = 10): Promise<Course[]> => {
        return apiGet<Course[]>('/courses/popular', { limit });
    },

    /**
     * Cours recommandés
     */
    getRecommendedCourses: async (limit = 10): Promise<Course[]> => {
        return apiGet<Course[]>('/courses/recommended', { limit });
    },
};