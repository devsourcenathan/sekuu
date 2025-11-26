import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTest } from '../hooks/useTest'; // Using my mock hook for now to ensure it works
import { TestTimer } from '../components/TestTimer';
import { QuestionRenderer } from '../components/QuestionRenderer';
import { type SubmissionAnswerData } from '../types/test.types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export const TestTaking: React.FC = () => {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();
    const { test, isLoading, error, submitTest } = useTest(testId || '');

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<number, SubmissionAnswerData>>(new Map());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [timeUp, setTimeUp] = useState(false);

    // Initialize answers map when test loads
    useEffect(() => {
        if (test) {
            // Optional: Load draft answers here
        }
    }, [test]);

    const handleAnswerChange = (answer: SubmissionAnswerData) => {
        setAnswers((prev) => {
            const newAnswers = new Map(prev);
            newAnswers.set(answer.question_id, answer);
            return newAnswers;
        });
    };

    const handleNext = () => {
        if (test && currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const answersList = Array.from(answers.values());
            await submitTest(answersList);
            navigate(`/student/tests/${testId}/results`);
        } catch (err) {
            console.error('Failed to submit test:', err);
            // Handle error (show toast, etc.)
        } finally {
            setIsSubmitting(false);
            setShowSubmitDialog(false);
        }
    };

    const handleTimeUp = () => {
        setTimeUp(true);
        handleSubmit();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !test) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load test. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const currentQuestion = test.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
    const answeredCount = answers.size;
    const totalQuestions = test.questions.length;

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background border-b shadow-sm">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold truncate max-w-md">{test.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            Question {currentQuestionIndex + 1} of {totalQuestions}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {test.duration_minutes && (
                            <TestTimer
                                durationMinutes={test.duration_minutes}
                                onTimeUp={handleTimeUp}
                            />
                        )}
                        <Button
                            variant={answeredCount === totalQuestions ? 'default' : 'secondary'}
                            onClick={() => setShowSubmitDialog(true)}
                        >
                            Submit Test
                        </Button>
                    </div>
                </div>
                <Progress value={progress} className="h-1 rounded-none" />
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="mb-6">
                    <QuestionRenderer
                        question={currentQuestion}
                        answer={answers.get(currentQuestion.id)}
                        onAnswerChange={handleAnswerChange}
                    />
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8">
                    <Button
                        variant="outline"
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>

                    {currentQuestionIndex < totalQuestions - 1 ? (
                        <Button onClick={handleNext}>
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={() => setShowSubmitDialog(true)}>
                            Finish
                            <CheckCircle2 className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </main>

            {/* Submit Confirmation Dialog */}
            <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Test?</DialogTitle>
                        <DialogDescription>
                            You have answered {answeredCount} out of {totalQuestions} questions.
                            {answeredCount < totalQuestions && (
                                <span className="block mt-2 text-yellow-600 font-medium">
                                    Warning: You have unanswered questions.
                                </span>
                            )}
                            <span className="block mt-2">
                                Once submitted, you cannot change your answers.
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Confirm Submit'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
