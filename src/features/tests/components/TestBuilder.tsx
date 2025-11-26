import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type CreateQuestionData } from '../types/test.types';
import { QuestionForm } from './QuestionForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Plus, Save, Settings, ListChecks, Trash2, Edit2, ArrowUp, ArrowDown } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';

// Schema for Test Configuration
const testConfigSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    instructions: z.string().optional(),
    duration_minutes: z.number().min(1).optional(),
    passing_score: z.number().min(0).max(100),
    max_attempts: z.number().min(1),
    shuffle_questions: z.boolean(),
    show_results_immediately: z.boolean(),
    show_correct_answers: z.boolean(),
    randomize_options: z.boolean(),
    one_question_per_page: z.boolean(),
    allow_back_navigation: z.boolean(),
    auto_save_draft: z.boolean(),
    disable_copy_paste: z.boolean(),
    full_screen_required: z.boolean(),
    webcam_monitoring: z.boolean(),
    is_published: z.boolean(),
});

type TestConfigValues = z.infer<typeof testConfigSchema>;

import { useCreateTest } from '../hooks/useCreateTest';
import { testsApi } from '../api/testsApi';
import { useNavigate } from 'react-router-dom';

interface TestBuilderProps {
    testableId: number;
    testableType: string;
    onSuccess?: () => void;
}

export const TestBuilder: React.FC<TestBuilderProps> = ({ testableId, testableType, onSuccess }) => {
    const [questions, setQuestions] = useState<CreateQuestionData[]>([]);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { addNotification } = useUiStore();
    const createTestMutation = useCreateTest();
    const navigate = useNavigate();

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<TestConfigValues>({
        resolver: zodResolver(testConfigSchema),
        defaultValues: {
            title: '',
            description: '',
            instructions: '',
            passing_score: 70,
            max_attempts: 1,
            shuffle_questions: false,
            show_results_immediately: true,
            show_correct_answers: true,
            randomize_options: false,
            one_question_per_page: true,
            allow_back_navigation: true,
            auto_save_draft: true,
            disable_copy_paste: false,
            full_screen_required: false,
            webcam_monitoring: false,
            is_published: false,
        },
    });

    const handleSaveQuestion = (questionData: CreateQuestionData) => {
        if (editingQuestionIndex !== null) {
            const updatedQuestions = [...questions];
            updatedQuestions[editingQuestionIndex] = questionData;
            setQuestions(updatedQuestions);
            setEditingQuestionIndex(null);
        } else {
            setQuestions([...questions, { ...questionData, order: questions.length + 1 }]);
        }
        setIsAddingQuestion(false);
    };

    const handleDeleteQuestion = (index: number) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === questions.length - 1)
        ) {
            return;
        }

        const newQuestions = [...questions];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
        setQuestions(newQuestions);
    };

    const onSaveTest = async (data: TestConfigValues) => {
        setIsSaving(true);
        try {
            // Determine position based on testableType
            let position = 'end_of_course';
            if (testableType.includes('Chapter')) position = 'after_chapter';
            if (testableType.includes('Lesson')) position = 'after_lesson';

            // 1. Create the test
            const testData = {
                ...data,
                testable_type: testableType,
                testable_id: testableId,
                type: 'summative',
                position: position,
                randomize_questions: data.shuffle_questions,
                validation_type: 'automatic',
            } as any;

            const createdTest = await createTestMutation.mutateAsync(testData);

            // 2. Add questions
            if (questions.length > 0) {
                await Promise.all(
                    questions.map((question) =>
                        testsApi.addQuestion(createdTest.id, question)
                    )
                );
            }

            addNotification({
                type: 'success',
                title: 'Test Saved',
                message: 'The test and its questions have been successfully saved.',
            });

            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/instructor/courses');
            }
        } catch (error: any) {
            console.error('Failed to save test:', error);
            addNotification({
                type: 'error',
                title: 'Error Saving Test',
                message: error.message || 'An error occurred while saving the test.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Test Builder</h1>
                    <p className="text-muted-foreground">Create and configure a new test</p>
                </div>
                <Button onClick={handleSubmit(onSaveTest)} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Test'}
                </Button>
            </div>

            <Tabs defaultValue="questions" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="questions" className="flex items-center gap-2">
                        <ListChecks className="w-4 h-4" />
                        Questions ({questions.length})
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="questions" className="space-y-6">
                    {isAddingQuestion || editingQuestionIndex !== null ? (
                        <QuestionForm
                            initialData={editingQuestionIndex !== null ? questions[editingQuestionIndex] : undefined}
                            onSave={handleSaveQuestion}
                            onCancel={() => {
                                setIsAddingQuestion(false);
                                setEditingQuestionIndex(null);
                            }}
                        />
                    ) : (
                        <>
                            {questions.length === 0 ? (
                                <Card className="border-dashed">
                                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="rounded-full bg-primary/10 p-4 mb-4">
                                            <ListChecks className="w-8 h-8 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
                                        <p className="text-muted-foreground mb-6 max-w-sm">
                                            Start building your test by adding questions. You can create multiple choice, true/false, and more.
                                        </p>
                                        <Button onClick={() => setIsAddingQuestion(true)}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add First Question
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {questions.map((question, index) => (
                                        <Card key={index} className="group hover:border-primary/50 transition-colors">
                                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-secondary text-secondary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                                                        {index + 1}
                                                    </span>
                                                    <CardTitle className="text-base font-medium">
                                                        {question.question_text}
                                                    </CardTitle>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleMoveQuestion(index, 'up')}
                                                        disabled={index === 0}
                                                    >
                                                        <ArrowUp className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleMoveQuestion(index, 'down')}
                                                        disabled={index === questions.length - 1}
                                                    >
                                                        <ArrowDown className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setEditingQuestionIndex(index)}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDeleteQuestion(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex gap-4 text-sm text-muted-foreground">
                                                    <span className="capitalize bg-secondary/50 px-2 py-0.5 rounded">
                                                        {question.type.replace('_', ' ')}
                                                    </span>
                                                    <span>{question.points} points</span>
                                                    {question.is_required && <span>Required</span>}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <Button
                                        variant="outline"
                                        className="w-full border-dashed"
                                        onClick={() => setIsAddingQuestion(true)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Another Question
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Test Configuration</CardTitle>
                            <CardDescription>
                                Configure the general settings for this test.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Test Title</Label>
                                    <Input id="title" {...register('title')} placeholder="e.g., Final Exam" />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title.message}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        {...register('description')}
                                        placeholder="Brief description of the test..."
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="instructions">Instructions</Label>
                                    <Textarea
                                        id="instructions"
                                        {...register('instructions')}
                                        placeholder="Instructions for students..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                                        <Input
                                            type="number"
                                            id="duration_minutes"
                                            {...register('duration_minutes', { valueAsNumber: true })}
                                            placeholder="Optional"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="passing_score">Passing Score (%)</Label>
                                        <Input
                                            type="number"
                                            id="passing_score"
                                            {...register('passing_score', { valueAsNumber: true })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="max_attempts">Max Attempts</Label>
                                        <Input
                                            type="number"
                                            id="max_attempts"
                                            {...register('max_attempts', { valueAsNumber: true })}
                                            min={1}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Shuffle Questions</Label>
                                                <p className="text-xs text-muted-foreground">Randomize question order</p>
                                            </div>
                                            <Switch
                                                checked={watch('shuffle_questions')}
                                                onCheckedChange={(checked) => setValue('shuffle_questions', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Shuffle Options</Label>
                                                <p className="text-xs text-muted-foreground">Randomize answer choices</p>
                                            </div>
                                            <Switch
                                                checked={watch('randomize_options')}
                                                onCheckedChange={(checked) => setValue('randomize_options', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Show Results</Label>
                                                <p className="text-xs text-muted-foreground">Immediately after submission</p>
                                            </div>
                                            <Switch
                                                checked={watch('show_results_immediately')}
                                                onCheckedChange={(checked) => setValue('show_results_immediately', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Show Correct Answers</Label>
                                                <p className="text-xs text-muted-foreground">Display correct answers in results</p>
                                            </div>
                                            <Switch
                                                checked={watch('show_correct_answers')}
                                                onCheckedChange={(checked) => setValue('show_correct_answers', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>One Question Per Page</Label>
                                                <p className="text-xs text-muted-foreground">Pagination for questions</p>
                                            </div>
                                            <Switch
                                                checked={watch('one_question_per_page')}
                                                onCheckedChange={(checked) => setValue('one_question_per_page', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Allow Back Navigation</Label>
                                                <p className="text-xs text-muted-foreground">Go back to previous questions</p>
                                            </div>
                                            <Switch
                                                checked={watch('allow_back_navigation')}
                                                onCheckedChange={(checked) => setValue('allow_back_navigation', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Auto Save Draft</Label>
                                                <p className="text-xs text-muted-foreground">Save progress automatically</p>
                                            </div>
                                            <Switch
                                                checked={watch('auto_save_draft')}
                                                onCheckedChange={(checked) => setValue('auto_save_draft', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Disable Copy/Paste</Label>
                                                <p className="text-xs text-muted-foreground">Prevent cheating</p>
                                            </div>
                                            <Switch
                                                checked={watch('disable_copy_paste')}
                                                onCheckedChange={(checked) => setValue('disable_copy_paste', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Full Screen Required</Label>
                                                <p className="text-xs text-muted-foreground">Force full screen mode</p>
                                            </div>
                                            <Switch
                                                checked={watch('full_screen_required')}
                                                onCheckedChange={(checked) => setValue('full_screen_required', checked)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Webcam Monitoring</Label>
                                                <p className="text-xs text-muted-foreground">Require webcam access</p>
                                            </div>
                                            <Switch
                                                checked={watch('webcam_monitoring')}
                                                onCheckedChange={(checked) => setValue('webcam_monitoring', checked)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="space-y-0.5">
                                            <Label>Publish Test</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Make this test available to students
                                            </p>
                                        </div>
                                        <Switch
                                            checked={watch('is_published')}
                                            onCheckedChange={(checked) => setValue('is_published', checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
