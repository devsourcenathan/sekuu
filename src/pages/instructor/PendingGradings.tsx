import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePendingGradings, useGradeSubmission } from '@/features/instructor/hooks/usePendingGradings';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUiStore } from '@/store/uiStore';

export function PendingGradings() {
    const { t } = useTranslation();
    const { data: submissions, isLoading } = usePendingGradings();
    const { mutate: gradeSubmission, isPending: isGrading } = useGradeSubmission();
    // const { showSuccess, showError } = useUiStore();
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [grades, setGrades] = useState<Record<number, { points: number; feedback: string }>>({});

    const handleGradeChange = (questionId: number, field: 'points' | 'feedback', value: any) => {
        setGrades((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                [field]: value,
            },
        }));
    };

    const handleSubmitGrade = () => {
        if (!selectedSubmission) return;

        const formattedGrades = Object.entries(grades).map(([questionId, data]) => ({
            question_id: Number(questionId),
            points: Number(data.points),
            feedback: data.feedback,
        }));

        gradeSubmission(
            { submissionId: selectedSubmission.id, grades: formattedGrades },
            {
                onSuccess: () => {
                    // showSuccess('Submission graded successfully');
                    setSelectedSubmission(null);
                    setGrades({});
                },
                onError: (error: any) => {
                    // showError(error.message || 'Failed to grade submission');
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Pending Gradings</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-[200px] w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Pending Gradings</h1>
                <p className="text-muted-foreground">
                    Review and grade student test submissions.
                </p>
            </div>

            {submissions?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No pending submissions to grade.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {submissions?.map((submission) => (
                        <Card key={submission.id}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start">
                                    <span>Test #{submission.test_id}</span>
                                    <Badge variant="outline">Attempt {submission.attempt_number}</Badge>
                                </CardTitle>
                                <CardDescription>
                                    Submitted by User #{submission.user_id} on{' '}
                                    {new Date(submission.submitted_at!).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Waiting for manual grading of subjective questions.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            className="w-full"
                                            onClick={() => setSelectedSubmission(submission)}
                                        >
                                            Grade Submission
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Grade Submission</DialogTitle>
                                            <DialogDescription>
                                                Review answers and assign points.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-6 py-4">
                                            {/* Mocking questions for now as they should come with submission details */}
                                            {submission.answers?.map((answer) => (
                                                <div key={answer.id} className="border p-4 rounded-lg space-y-3">
                                                    <div className="font-medium">Question #{answer.question_id}</div>
                                                    <div className="bg-muted p-3 rounded text-sm">
                                                        {answer.answer_text || 'No text answer provided'}
                                                    </div>

                                                    <div className="grid grid-cols-4 gap-4">
                                                        <div className="col-span-1">
                                                            <Label>Points</Label>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                onChange={(e) => handleGradeChange(answer.question_id, 'points', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-span-3">
                                                            <Label>Feedback</Label>
                                                            <Textarea
                                                                placeholder="Optional feedback..."
                                                                onChange={(e) => handleGradeChange(answer.question_id, 'feedback', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <DialogFooter>
                                            <Button onClick={handleSubmitGrade} disabled={isGrading}>
                                                {isGrading ? 'Submitting...' : 'Submit Grades'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}