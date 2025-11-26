import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Save,
    Send,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { TestTimer } from '@/features/tests/components/TestTimer';
import { QuestionRenderer } from '@/features/tests/components/QuestionRenderer';
import { TestProgress } from '@/features/tests/components/TestProgress';
import {
    useStartTest,
    useSaveDraft,
    useSubmitTest,
} from '@/features/tests/hooks';
import type { SubmissionAnswerData } from '@/features/tests/types/test.types';

export function TestTaking() {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();

    const [submissionId, setSubmissionId] = useState<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<number, SubmissionAnswerData>>(
        new Map()
    );
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [testData, setTestData] = useState<any>(null);

    const { mutate: startTest, isPending: isStarting } = useStartTest();
    const { mutate: saveDraft, isPending: isSaving } = useSaveDraft(submissionId || 0);
    const { mutate: submitTest, isPending: isSubmitting } = useSubmitTest(submissionId || 0);

    // Démarrer le test au montage
    useEffect(() => {
        if (testId && !submissionId) {
            startTest(testId, {
                onSuccess: (submission) => {
                    setSubmissionId(submission.id);
                    setTestData(submission.test);
                },
            });
        }
    }, [testId, submissionId, startTest]);

    // Auto-save toutes les 30 secondes
    useEffect(() => {
        if (!submissionId || answers.size === 0) return;

        const interval = setInterval(() => {
            handleSaveDraft();
        }, 30000); // 30 secondes

        return () => clearInterval(interval);
    }, [submissionId, answers]);

    const currentQuestion = testData?.questions?.[currentQuestionIndex];
    const totalQuestions = testData?.questions?.length || 0;
    const answeredQuestions = answers.size;

    const handleAnswerChange = (answer: SubmissionAnswerData) => {
        setAnswers(new Map(answers.set(answer.question_id, answer)));
    };

    const handleSaveDraft = () => {
        if (!submissionId) return;

        saveDraft({
            answers: Array.from(answers.values()),
        });
    };

    const handleSubmit = () => {
        if (!submissionId) return;

        submitTest({
            answers: Array.from(answers.values()),
        });
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleTimeUp = () => {
        // Auto-submit quand le temps est écoulé
        handleSubmit();
    };

    if (isStarting || !testData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header - Fixed */}
            <div className="sticky top-0 z-50 bg-background border-b">
                <div className="container py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(-1)}
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                            <div>
                                <h1 className="text-xl font-semibold">{testData.title}</h1>
                                <p className="text-sm text-muted-foreground">
                                    {testData.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {testData.duration_minutes && (
                                <TestTimer
                                    durationMinutes={testData.duration_minutes}
                                    startedAt={new Date().toISOString()}
                                    onTimeUp={handleTimeUp}
                                />
                            )}

                            <Button
                                variant="outline"
                                onClick={handleSaveDraft}
                                disabled={isSaving || answers.size === 0}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                            </Button>

                            <Button
                                onClick={() => setShowSubmitDialog(true)}
                                disabled={isSubmitting}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Soumettre
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Progress */}
                    <TestProgress
                        currentQuestion={currentQuestionIndex + 1}
                        totalQuestions={totalQuestions}
                        answeredQuestions={answeredQuestions}
                    />

                    {/* Instructions */}
                    {testData.instructions && currentQuestionIndex === 0 && (
                        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                            <CardContent className="pt-6">
                                <div className="flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                            Instructions
                                        </p>
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            {testData.instructions}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Question */}
                    {currentQuestion && (
                        <QuestionRenderer
                            question={currentQuestion}
                            questionNumber={currentQuestionIndex + 1}
                            answer={answers.get(currentQuestion.id)}
                            onAnswerChange={handleAnswerChange}
                        />
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-6 border-t">
                        <Button
                            variant="outline"
                            onClick={goToPreviousQuestion}
                            disabled={currentQuestionIndex === 0 || !testData.allow_back_navigation}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Précédent
                        </Button>

                        {currentQuestionIndex < totalQuestions - 1 ? (
                            <Button onClick={goToNextQuestion}>
                                Suivant
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={() => setShowSubmitDialog(true)}>
                                <Send className="h-4 w-4 mr-2" />
                                Terminer et soumettre
                            </Button>
                        )}
                    </div>

                    {/* Question Navigator */}
                    {testData.questions && testData.questions.length > 1 && (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm font-semibold mb-3">Navigation rapide</p>
                                <div className="grid grid-cols-10 gap-2">
                                    {testData.questions.map((q: any, index: number) => (
                                        <button
                                            key={q.id}
                                            onClick={() => setCurrentQuestionIndex(index)}
                                            className={`
                        h-10 rounded-lg border-2 font-medium text-sm
                        transition-colors
                        ${index === currentQuestionIndex
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : answers.has(q.id)
                                                        ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950'
                                                        : 'border-muted-foreground/20 hover:border-muted-foreground/40'
                                                }
                      `}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Submit Confirmation Dialog */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Soumettre le test ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Vous avez répondu à {answeredQuestions} question(s) sur {totalQuestions}.
                            {answeredQuestions < totalQuestions && (
                                <span className="block mt-2 text-yellow-600 dark:text-yellow-500">
                                    ⚠️ Attention : {totalQuestions - answeredQuestions} question(s) non répondue(s).
                                </span>
                            )}
                            <span className="block mt-2">
                                Une fois soumis, vous ne pourrez plus modifier vos réponses.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>
                            {isSubmitting ? 'Soumission...' : 'Confirmer'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}