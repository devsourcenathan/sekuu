import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type CreateQuestionData } from '../types/test.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, GripVertical } from 'lucide-react';

const questionSchema = z.object({
    question_text: z.string().min(1, 'Question text is required'),
    type: z.enum(['single_choice', 'multiple_choice', 'true_false', 'short_answer', 'long_answer']),
    points: z.number().min(1),
    explanation: z.string().optional(),
    is_required: z.boolean(),
    options: z.array(
        z.object({
            option_text: z.string().min(1, 'Option text is required'),
            is_correct: z.boolean(),
            feedback: z.string().optional(),
        })
    ).optional(),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

interface QuestionFormProps {
    initialData?: Partial<CreateQuestionData>;
    onSave: (data: CreateQuestionData) => void;
    onCancel: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
    initialData,
    onSave,
    onCancel,
}) => {
    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<QuestionFormValues>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            question_text: initialData?.question_text || '',
            type: initialData?.type || 'single_choice' as any,
            points: initialData?.points || 10,
            explanation: initialData?.explanation || '',
            is_required: initialData?.is_required ?? true,
            options: initialData?.options || [{ option_text: '', is_correct: false }, { option_text: '', is_correct: false }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'options',
    });

    const questionType = watch('type');
    const hasOptions = ['single_choice', 'multiple_choice'].includes(questionType);

    // Handle type change to set default options for True/False
    React.useEffect(() => {
        if (questionType === 'true_false') {
            setValue('options', [
                { option_text: 'True', is_correct: true },
                { option_text: 'False', is_correct: false },
            ]);
        }
    }, [questionType, setValue]);

    const onSubmit = (data: QuestionFormValues) => {
        // @ts-ignore - casting issue with enum vs string
        onSave({ ...data, order: initialData?.order || 0 });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{initialData ? 'Edit Question' : 'Add New Question'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Question Type</Label>
                            <Select
                                onValueChange={(value) => setValue('type', value as any)}
                                defaultValue={questionType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="single_choice">Single Choice</SelectItem>
                                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                    <SelectItem value="true_false">True / False</SelectItem>
                                    <SelectItem value="short_answer">Short Answer</SelectItem>
                                    <SelectItem value="long_answer">Long Answer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="question_text">Question Text</Label>
                            <Textarea
                                id="question_text"
                                {...register('question_text')}
                                placeholder="Enter your question here..."
                            />
                            {errors.question_text && (
                                <p className="text-sm text-destructive">{errors.question_text.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="points">Points</Label>
                                <Input
                                    type="number"
                                    id="points"
                                    {...register('points', { valueAsNumber: true })}
                                />
                                {errors.points && (
                                    <p className="text-sm text-destructive">{errors.points.message}</p>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 mt-8">
                                <Checkbox
                                    id="is_required"
                                    checked={watch('is_required')}
                                    onCheckedChange={(checked) => setValue('is_required', checked as boolean)}
                                />
                                <Label htmlFor="is_required">Required</Label>
                            </div>
                        </div>

                        {hasOptions && (
                            <div className="space-y-4">
                                <Label>Options</Label>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-start gap-2">
                                        <GripVertical className="w-5 h-5 mt-2 text-muted-foreground cursor-move" />
                                        <div className="flex-grow grid gap-2">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    {...register(`options.${index}.option_text` as const)}
                                                    placeholder={`Option ${index + 1}`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length <= 2}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={watch(`options.${index}.is_correct`)}
                                                    onCheckedChange={(checked) => {
                                                        if (questionType === 'single_choice' && checked) {
                                                            // Uncheck others
                                                            fields.forEach((_, i) => {
                                                                if (i !== index) {
                                                                    setValue(`options.${i}.is_correct`, false);
                                                                }
                                                            });
                                                        }
                                                        setValue(`options.${index}.is_correct`, checked as boolean);
                                                    }}
                                                />
                                                <span className="text-sm text-muted-foreground">Correct Answer</span>
                                            </div>
                                            {errors.options?.[index]?.option_text && (
                                                <p className="text-sm text-destructive">
                                                    {errors.options[index]?.option_text?.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ option_text: '', is_correct: false })}
                                    className="mt-2"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Option
                                </Button>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="explanation">Explanation (Optional)</Label>
                            <Textarea
                                id="explanation"
                                {...register('explanation')}
                                placeholder="Explain why the correct answer is correct..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit">Save Question</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
