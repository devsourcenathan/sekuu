import { useParams, Link } from 'react-router-dom';
import {
    CheckCircle2,
    XCircle,
    Clock,
    Award,
     Home,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
 import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { QuestionRenderer } from '@/features/tests/components/QuestionRenderer';
import { useSubmissionDetails } from '@/features/tests/hooks';
import { formatDate } from '@/lib/utils';

export function TestResults() {
    const { submissionId } = useParams<{ submissionId: string }>();
    const { data: submission, isLoading } = useSubmissionDetails(submissionId || '');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold mb-2">Résultats non trouvés</h2>
                <Link to="/student/dashboard">
                    <Button>Retour au dashboard</Button>
                </Link>
            </div>
        );
    }

    const isPassed = submission.passed || false;
    const score = submission.score || 0;
    const percentage = submission.percentage || 0;

    return (
        <div className="min-h-screen bg-muted/30 py-8">
            <div className="container">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header with Score */}
                    <Card className={`border-2 ${isPassed ? 'border-green-500' : 'border-red-500'}`}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-2xl mb-2">
                                        {submission.test?.title}
                                    </CardTitle>
                                    <p className="text-muted-foreground">
                                        Soumis le {formatDate(submission.submitted_at || '')}
                                    </p>
                                </div>

                                <div className="text-right">
                                    {isPassed ? (
                                        <div className="flex items-center gap-2 text-green-600 mb-2">
                                            <CheckCircle2 className="h-6 w-6" />
                                            <span className="text-lg font-semibold">Réussi</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-600 mb-2">
                                            <XCircle className="h-6 w-6" />
                                            <span className="text-lg font-semibold">Échoué</span>
                                        </div>
                                    )}
                                    <Badge variant={submission.grade ? 'default' : 'secondary'} className="text-lg">
                                        {submission.grade || 'En attente'}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6 mb-6">
                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <p className="text-4xl font-bold mb-1">{Math.round(percentage)}%</p>
                                    <p className="text-sm text-muted-foreground">Score</p>
                                </div>

                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <p className="text-4xl font-bold mb-1">
                                        {score}/{submission.test?.total_points || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Points</p>
                                </div>

                                <div className="text-center p-4 bg-muted rounded-lg">
                                    <p className="text-4xl font-bold mb-1">
                                        {submission.attempt_number}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Tentative</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Progression</span>
                                    <span className="font-medium">{Math.round(percentage)}%</span>
                                </div>
                                <Progress
                                    value={percentage}
                                    className={`h-3 ${isPassed ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
                                />
                            </div>

                            {/* Commentaires instructeur */}
                            {submission.instructor_comments && (
                                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                        Commentaires de l'instructeur
                                    </p>
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        {submission.instructor_comments}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-6 flex gap-3">
                                <Link to="/student/dashboard" className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        <Home className="h-4 w-4 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>

                                {isPassed && submission.test?.testable_type === 'course' && (
                                    <Link to={`/student/certificates`} className="flex-1">
                                        <Button className="w-full">
                                            <Award className="h-4 w-4 mr-2" />
                                            Voir le certificat
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Questions et Réponses */}
                    {submission.test?.show_correct_answers && submission.answers && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Revue des questions</h2>

                            {submission.test.questions?.map((question, index) => {
                                const answer = submission.answers?.find(a => a.question_id === question.id);

                                return (
                                    <div key={question.id} className="relative">
                                        {/* Indicateur correct/incorrect */}
                                        <div className="absolute -left-3 top-6">
                                            {answer?.is_correct ? (
                                                <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                                </div>
                                            ) : answer?.is_correct === false ? (
                                                <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                                                    <XCircle className="h-4 w-4 text-white" />
                                                </div>
                                            ) : (
                                                <div className="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center">
                                                    <Clock className="h-4 w-4 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        <QuestionRenderer
                                            question={question}
                                            questionNumber={index + 1}
                                            answer={{
                                                question_id: question.id,
                                                selected_options: answer?.selected_options,
                                                answer_text: answer?.answer_text,
                                            }}
                                            onAnswerChange={() => { }}
                                            showResults={true}
                                            disabled={true}
                                        />

                                        {/* Feedback spécifique */}
                                        {answer?.feedback && (
                                            <Card className="mt-2 border-orange-200 bg-orange-50 dark:bg-orange-950">
                                                <CardContent className="pt-4">
                                                    <p className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">
                                                        Feedback de l'instructeur
                                                    </p>
                                                    <p className="text-sm text-orange-800 dark:text-orange-200">
                                                        {answer.feedback}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Message si les réponses ne sont pas affichées */}
                    {!submission.test?.show_correct_answers && (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    Les réponses correctes ne sont pas affichées pour ce test
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}