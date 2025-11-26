import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { type Lesson } from '@/types';
import { useCreateLesson, useUpdateLesson } from '../hooks/useLessons';

const lessonSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    content_type: z.enum(['video', 'text', 'pdf', 'audio', 'quiz']),
    content: z.string().optional(),
    video_url: z.string().url().optional().or(z.literal('')),
    video_provider: z.enum(['youtube', 'vimeo']).optional(),
    duration_minutes: z.number().min(0),
    is_free: z.boolean(),
    is_preview: z.boolean(),
    is_downloadable: z.boolean(),
    auto_complete: z.boolean(),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface LessonFormProps {
    lesson?: Lesson;
    chapterId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LessonForm({ lesson, chapterId, open, onOpenChange }: LessonFormProps) {
    const createLesson = useCreateLesson();
    const updateLesson = useUpdateLesson();

    const form = useForm<LessonFormValues>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: lesson?.title || '',
            description: lesson?.description || '',
            content_type: lesson?.content_type || 'video',
            content: lesson?.content || '',
            video_url: lesson?.video_url || '',
            video_provider: lesson?.video_provider || 'youtube',
            duration_minutes: lesson?.duration_minutes || 0,
            is_free: lesson?.is_free ?? false,
            is_preview: lesson?.is_preview ?? false,
            is_downloadable: lesson?.is_downloadable ?? false,
            auto_complete: lesson?.auto_complete ?? false,
        },
    });

    const contentType = form.watch('content_type');

    // Reset form when dialog opens with new data
    useEffect(() => {
        if (open) {
            form.reset({
                title: lesson?.title || '',
                description: lesson?.description || '',
                content_type: lesson?.content_type || 'video',
                content: lesson?.content || '',
                video_url: lesson?.video_url || '',
                video_provider: lesson?.video_provider || 'youtube',
                duration_minutes: lesson?.duration_minutes || 0,
                is_free: lesson?.is_free ?? false,
                is_preview: lesson?.is_preview ?? false,
                is_downloadable: lesson?.is_downloadable ?? false,
                auto_complete: lesson?.auto_complete ?? false,
            });
        }
    }, [open, lesson, form]);

    const handleSubmit = async (values: LessonFormValues) => {
        try {
            if (lesson) {
                // Update existing lesson
                await updateLesson.mutateAsync({
                    id: lesson.id,
                    data: values,
                });
            } else {
                // Create new lesson
                await createLesson.mutateAsync({
                    chapter_id: chapterId,
                    title: values.title,
                    description: values.description,
                    content_type: values.content_type,
                    content: values.content,
                    video_url: values.video_url,
                    video_provider: values.video_provider,
                    duration_minutes: values.duration_minutes,
                    is_free: values.is_free ?? false,
                    is_preview: values.is_preview ?? false,
                    is_downloadable: values.is_downloadable ?? false,
                    auto_complete: values.auto_complete ?? false,
                    order: 0, // Should be calculated based on existing lessons
                });
            }
            form.reset();
            onOpenChange(false);
        } catch (error) {
            // Error is handled by the hook with toast
            console.error('Error submitting lesson:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{lesson ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
                    <DialogDescription>
                        {lesson
                            ? 'Update the lesson details below.'
                            : 'Add a new lesson to this chapter.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lesson title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Brief description of this lesson"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select content type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="video">Video</SelectItem>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="pdf">PDF</SelectItem>
                                            <SelectItem value="audio">Audio</SelectItem>
                                            <SelectItem value="quiz">Quiz</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {contentType === 'video' && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="video_provider"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Video Provider</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select provider" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="youtube">YouTube</SelectItem>
                                                    <SelectItem value="vimeo">Vimeo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="video_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Video URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://youtube.com/watch?v=..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {contentType === 'text' && (
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Lesson content (markdown supported)"
                                                className="resize-none min-h-[200px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="duration_minutes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration (minutes)</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" placeholder="30" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="is_free"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-sm">Free Lesson</FormLabel>
                                            <FormDescription className="text-xs">
                                                Available without enrollment
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="is_preview"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-sm">Preview Lesson</FormLabel>
                                            <FormDescription className="text-xs">
                                                Show in course preview
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="is_downloadable"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-sm">Downloadable</FormLabel>
                                            <FormDescription className="text-xs">
                                                Allow students to download
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="auto_complete"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-sm">Auto-complete</FormLabel>
                                            <FormDescription className="text-xs">
                                                Mark as complete automatically
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createLesson.isPending || updateLesson.isPending}
                            >
                                {createLesson.isPending || updateLesson.isPending
                                    ? 'Saving...'
                                    : lesson
                                        ? 'Update'
                                        : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
