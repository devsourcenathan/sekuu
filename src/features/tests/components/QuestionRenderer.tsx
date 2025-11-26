import React from 'react';
import { type SubmissionAnswerData } from '@/features/tests/types/test.types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Question } from '@/types';

interface QuestionRendererProps {
    question: Question;
    answer?: SubmissionAnswerData;
    onAnswerChange: (answer: SubmissionAnswerData) => void;
    readOnly?: boolean;
    showFeedback?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
    question,
    answer,
    onAnswerChange,
    readOnly = false,
    showFeedback = false,
}) => {
    const handleSingleChoiceChange = (optionId: string) => {
        if (readOnly) return;
        onAnswerChange({
            question_id: question.id,
            selected_options: [parseInt(optionId)],
        });
    };

    const handleMultipleChoiceChange = (optionId: number, checked: boolean) => {
        if (readOnly) return;
        const currentSelected = answer?.selected_options || [];
        let newSelected;
        if (checked) {
            newSelected = [...currentSelected, optionId];
        } else {
            newSelected = currentSelected.filter((id) => id !== optionId);
        }
        onAnswerChange({
            question_id: question.id,
            selected_options: newSelected,
        });
    };

    const handleTextChange = (text: string) => {
        if (readOnly) return;
        onAnswerChange({
            question_id: question.id,
            answer_text: text,
        });
    };

    const renderContent = () => {
        switch (question.type) {
            case 'single_choice':
            case 'true_false':
                return (
                    <RadioGroup
                        value={answer?.selected_options?.[0]?.toString()}
                        onValueChange={handleSingleChoiceChange}
                        disabled={readOnly}
                        className="space-y-3"
                    >
                        {question.options?.map((option) => (
                            <div
                                key={option.id}
                                className={cn(
                                    'flex items-center space-x-2 p-3 rounded-lg border transition-colors',
                                    answer?.selected_options?.includes(option.id)
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:bg-accent/50',
                                    showFeedback && option.is_correct && 'border-green-500 bg-green-50 dark:bg-green-900/10',
                                    showFeedback &&
                                    !option.is_correct &&
                                    answer?.selected_options?.includes(option.id) &&
                                    'border-red-500 bg-red-50 dark:bg-red-900/10'
                                )}
                            >
                                <RadioGroupItem value={option.id.toString()} id={`opt-${option.id}`} />
                                <Label
                                    htmlFor={`opt-${option.id}`}
                                    className="flex-grow cursor-pointer font-normal"
                                >
                                    {option.option_text}
                                </Label>
                                {showFeedback && option.is_correct && (
                                    <span className="text-xs font-medium text-green-600">Correct</span>
                                )}
                            </div>
                        ))}
                    </RadioGroup>
                );

            case 'multiple_choice':
                return (
                    <div className="space-y-3">
                        {question.options?.map((option) => (
                            <div
                                key={option.id}
                                className={cn(
                                    'flex items-center space-x-2 p-3 rounded-lg border transition-colors',
                                    answer?.selected_options?.includes(option.id)
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:bg-accent/50',
                                    showFeedback && option.is_correct && 'border-green-500 bg-green-50 dark:bg-green-900/10',
                                    showFeedback &&
                                    !option.is_correct &&
                                    answer?.selected_options?.includes(option.id) &&
                                    'border-red-500 bg-red-50 dark:bg-red-900/10'
                                )}
                            >
                                <Checkbox
                                    id={`opt-${option.id}`}
                                    checked={answer?.selected_options?.includes(option.id)}
                                    onCheckedChange={(checked) =>
                                        handleMultipleChoiceChange(option.id, checked as boolean)
                                    }
                                    disabled={readOnly}
                                />
                                <Label
                                    htmlFor={`opt-${option.id}`}
                                    className="flex-grow cursor-pointer font-normal"
                                >
                                    {option.option_text}
                                </Label>
                                {showFeedback && option.is_correct && (
                                    <span className="text-xs font-medium text-green-600">Correct</span>
                                )}
                            </div>
                        ))}
                    </div>
                );

            case 'short_answer':
                return (
                    <div className="space-y-2">
                        <Input
                            value={answer?.answer_text || ''}
                            onChange={(e) => handleTextChange(e.target.value)}
                            placeholder="Type your answer here..."
                            disabled={readOnly}
                            className={cn(
                                showFeedback && question.explanation && 'border-green-500'
                            )}
                        />
                        {showFeedback && question.explanation && (
                            <div className="text-sm text-muted-foreground mt-2">
                                <span className="font-semibold text-green-600">Correct Answer/Explanation: </span>
                                {question.explanation}
                            </div>
                        )}
                    </div>
                );

            case 'long_answer':
                return (
                    <div className="space-y-2">
                        <Textarea
                            value={answer?.answer_text || ''}
                            onChange={(e) => handleTextChange(e.target.value)}
                            placeholder="Type your detailed answer here..."
                            disabled={readOnly}
                            rows={6}
                            className={cn(
                                showFeedback && question.explanation && 'border-green-500'
                            )}
                        />
                        {showFeedback && question.explanation && (
                            <div className="text-sm text-muted-foreground mt-2">
                                <span className="font-semibold text-green-600">Correct Answer/Explanation: </span>
                                {question.explanation}
                            </div>
                        )}
                    </div>
                );

            default:
                return <div>Unsupported question type</div>;
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium flex justify-between items-start gap-4">
                    <span className="flex-grow">{question.question_text}</span>
                    <span className="text-sm font-normal text-muted-foreground whitespace-nowrap bg-secondary px-2 py-1 rounded">
                        {question.points} points
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>{renderContent()}</CardContent>
        </Card>
    );
};