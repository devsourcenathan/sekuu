import { type Test, type Question, type TestSubmission } from '@/types';

/**
 * Données pour créer un test
 */
export interface CreateTestData {
    testable_type: string;
    testable_id: number | string;
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
}

/**
 * Données pour mettre à jour un test
 */
export interface UpdateTestData extends Partial<CreateTestData> { }

/**
 * Données pour créer une question
 */
export interface CreateQuestionData {
    question_text: string;
    explanation?: string;
    type: 'single_choice' | 'multiple_choice' | 'true_false' | 'short_answer' | 'long_answer' | 'file_upload';
    points: number;
    order: number;
    is_required: boolean;
    options?: CreateQuestionOptionData[];
}

/**
 * Données pour créer une option de question
 */
export interface CreateQuestionOptionData {
    option_text: string;
    is_correct: boolean;
    feedback?: string;
    order?: number;
}

/**
 * Réponse d'un étudiant à une question
 */
export interface SubmissionAnswerData {
    question_id: number;
    selected_options?: number[];
    answer_text?: string;
    answer_file?: File;
}

/**
 * Données pour soumettre un test
 */
export interface SubmitTestData {
    answers: SubmissionAnswerData[];
}

/**
 * Données pour noter une soumission (instructeur)
 */
export interface GradeSubmissionData {
    gradings: QuestionGrading[];
    comments?: string;
}

/**
 * Notation d'une question
 */
export interface QuestionGrading {
    question_id: number;
    points_earned: number;
    feedback?: string;
}

/**
 * Détails d'un test avec questions
 */
export interface TestWithQuestions extends Test {
    questions: Question[];
}

/**
 * Détails d'une soumission avec réponses
 */
export interface SubmissionDetails extends TestSubmission {
    test?: TestWithQuestions;
    answers?: SubmissionAnswerWithDetails[];
}

/**
 * Réponse avec détails de la question
 */
export interface SubmissionAnswerWithDetails {
    id: number;
    submission_id: number;
    question_id: number;
    selected_options?: number[];
    answer_text?: string;
    answer_file?: string;
    is_correct?: boolean;
    points_earned?: number;
    feedback?: string;
    question?: Question;
}

/**
 * Statistiques d'un test
 */
export interface TestStats {
    total_submissions: number;
    average_score: number;
    passing_rate: number;
    highest_score: number;
    lowest_score: number;
    average_time_minutes: number;
}

/**
 * Test en cours (session active)
 */
export interface ActiveTestSession {
    submission_id: number;
    test: TestWithQuestions;
    started_at: string;
    time_remaining_seconds?: number;
    current_answers: Map<number, SubmissionAnswerData>;
}