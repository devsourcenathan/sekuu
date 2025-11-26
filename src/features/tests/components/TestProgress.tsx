import { Progress } from '@/components/ui/progress';

interface TestProgressProps {
    currentQuestion: number;
    totalQuestions: number;
    answeredQuestions: number;
}

export function TestProgress({
    currentQuestion,
    totalQuestions,
    answeredQuestions,
}: TestProgressProps) {
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    Question {currentQuestion} sur {totalQuestions}
                </span>
                <span className="font-medium">
                    {answeredQuestions}/{totalQuestions} répondues
                </span>
            </div>
            <Progress value={progressPercentage} />
        </div>
    );
}