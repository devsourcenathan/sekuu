import { useState, useEffect } from 'react';
import { TestWithQuestions, SubmissionAnswerData } from '../types/test.types';

// Mock data for development
const MOCK_TEST: TestWithQuestions = {
    id: 1,
    title: 'Laravel Basics Quiz',
    description: 'Test your understanding of Laravel basics',
    instructions: 'Answer all questions to the best of your ability. You have 30 minutes.',
    duration_minutes: 30,
    passing_score: 70,
    questions: [
        {
            id: 1,
            question_text: 'What is Laravel?',
            type: 'single_choice',
            points: 10,
            order: 1,
            is_required: true,
            options: [
                { id: 1, option_text: 'A PHP Framework', is_correct: true },
                { id: 2, option_text: 'A JavaScript Library', is_correct: false },
                { id: 3, option_text: 'A Database', is_correct: false },
            ],
        },
        {
            id: 2,
            question_text: 'Which of the following are Laravel features?',
            type: 'multiple_choice',
            points: 15,
            order: 2,
            is_required: true,
            options: [
                { id: 4, option_text: 'Eloquent ORM', is_correct: true },
                { id: 5, option_text: 'Blade Templating', is_correct: true },
                { id: 6, option_text: 'React Components', is_correct: false },
            ],
        },
        {
            id: 3,
            question_text: 'Laravel uses the MVC architectural pattern.',
            type: 'true_false',
            points: 5,
            order: 3,
            is_required: true,
            options: [
                { id: 7, option_text: 'True', is_correct: true },
                { id: 8, option_text: 'False', is_correct: false },
            ],
        },
        {
            id: 4,
            question_text: 'What command is used to create a new Laravel project?',
            type: 'short_answer',
            points: 10,
            order: 4,
            is_required: true,
        },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    testable_type: 'App\\Models\\Chapter',
    testable_id: 1,
    type: 'formative',
    position: 'after_chapter',
    show_results_immediately: true,
    show_correct_answers: true,
    randomize_questions: false,
    randomize_options: false,
    one_question_per_page: true,
    allow_back_navigation: true,
    auto_save_draft: true,
    validation_type: 'automatic',
    is_published: true,
    disable_copy_paste: false,
    full_screen_required: false,
    webcam_monitoring: false,
};

export const useTest = (testId: string) => {
    const [test, setTest] = useState<TestWithQuestions | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Simulate API call
        const fetchTest = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setTest(MOCK_TEST);
                setIsLoading(false);
            } catch (err) {
                setError(err as Error);
                setIsLoading(false);
            }
        };

        if (testId) {
            fetchTest();
        }
    }, [testId]);

    const submitTest = async (answers: SubmissionAnswerData[]) => {
        // Simulate submission
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Submitting answers:', answers);
        return { success: true, score: 85 };
    };

    return { test, isLoading, error, submitTest };
};
