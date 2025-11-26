import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type {
    TestWithQuestions,
    CreateTestData,
    UpdateTestData,
    CreateQuestionData,
    SubmitTestData,
    SubmissionDetails,
    GradeSubmissionData,
} from '../types/test.types';
import type { Question } from '@/types';

/**
 * API pour la gestion des tests
 */
export const testsApi = {
    /**
     * Créer un test
     */
    createTest: async (data: CreateTestData): Promise<TestWithQuestions> => {
        return apiPost<TestWithQuestions>(ENDPOINTS.TESTS.CREATE, data);
    },

    /**
     * Récupérer les détails d'un test
     */
    getTestDetails: async (id: number | string): Promise<TestWithQuestions> => {
        return apiGet<TestWithQuestions>(ENDPOINTS.TESTS.SHOW(id));
    },

    /**
     * Mettre à jour un test
     */
    updateTest: async (
        id: number | string,
        data: UpdateTestData
    ): Promise<TestWithQuestions> => {
        return apiPut<TestWithQuestions>(ENDPOINTS.TESTS.UPDATE(id), data);
    },

    /**
     * Supprimer un test
     */
    deleteTest: async (id: number | string): Promise<void> => {
        return apiDelete<void>(ENDPOINTS.TESTS.DELETE(id));
    },

    /**
     * Ajouter une question à un test
     */
    addQuestion: async (
        testId: number | string,
        data: CreateQuestionData
    ): Promise<Question> => {
        return apiPost<Question>(ENDPOINTS.QUESTIONS.CREATE(testId), data);
    },

    /**
     * Mettre à jour une question
     */
    updateQuestion: async (
        testId: number | string,
        questionId: number | string,
        data: Partial<CreateQuestionData>
    ): Promise<Question> => {
        return apiPut<Question>(
            ENDPOINTS.QUESTIONS.UPDATE(testId, questionId),
            data
        );
    },

    /**
     * Supprimer une question
     */
    deleteQuestion: async (
        testId: number | string,
        questionId: number | string
    ): Promise<void> => {
        return apiDelete<void>(ENDPOINTS.QUESTIONS.DELETE(testId, questionId));
    },

    /**
     * Démarrer un test (créer une soumission)
     */
    startTest: async (testId: number | string): Promise<SubmissionDetails> => {
        return apiPost<SubmissionDetails>(ENDPOINTS.TESTS.START(testId));
    },

    /**
     * Sauvegarder un brouillon
     */
    saveDraft: async (
        submissionId: number | string,
        data: SubmitTestData
    ): Promise<{ message: string }> => {
        return apiPost<{ message: string }>(
            ENDPOINTS.SUBMISSIONS.DRAFT(submissionId),
            data
        );
    },

    /**
     * Soumettre un test
     */
    submitTest: async (
        submissionId: number | string,
        data: SubmitTestData
    ): Promise<SubmissionDetails> => {
        return apiPost<SubmissionDetails>(
            ENDPOINTS.SUBMISSIONS.SUBMIT(submissionId),
            data
        );
    },

    /**
     * Noter une soumission (instructeur)
     */
    gradeSubmission: async (
        submissionId: number | string,
        data: GradeSubmissionData
    ): Promise<SubmissionDetails> => {
        return apiPost<SubmissionDetails>(
            ENDPOINTS.SUBMISSIONS.GRADE(submissionId),
            data
        );
    },

    /**
     * Récupérer mes soumissions pour un test
     */
    getMySubmissions: async (testId: number | string): Promise<SubmissionDetails[]> => {
        return apiGet<SubmissionDetails[]>(ENDPOINTS.TESTS.MY_SUBMISSIONS(testId));
    },

    /**
     * Récupérer les soumissions en attente de notation (instructeur)
     */
    getPendingGradings: async (): Promise<SubmissionDetails[]> => {
        return apiGet<SubmissionDetails[]>(ENDPOINTS.TESTS.PENDING_GRADINGS);
    },

    /**
     * Récupérer une soumission spécifique
     */
    getSubmission: async (submissionId: number | string): Promise<SubmissionDetails> => {
        return apiGet<SubmissionDetails>(`/submissions/${submissionId}`);
    },

    /**
     * Récupérer les tests d'un cours
     */
    getTestsByCourse: async (courseId: number | string): Promise<TestWithQuestions[]> => {
        return apiGet<TestWithQuestions[]>(ENDPOINTS.TESTS.BY_COURSE(courseId));
    },

    /**
     * Récupérer les tests d'un chapitre
     */
    getTestsByChapter: async (chapterId: number | string): Promise<TestWithQuestions[]> => {
        return apiGet<TestWithQuestions[]>(ENDPOINTS.TESTS.BY_CHAPTER(chapterId));
    },

    /**
     * Récupérer les tests d'une leçon
     */
    getTestsByLesson: async (lessonId: number | string): Promise<TestWithQuestions[]> => {
        return apiGet<TestWithQuestions[]>(ENDPOINTS.TESTS.BY_LESSON(lessonId));
    },
};