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
import { Switch } from '@/components/ui/switch';
import { type Chapter } from '@/types';
import { useCreateChapter, useUpdateChapter } from '../hooks/useChapters';

const chapterSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    is_free: z.boolean(),
    is_published: z.boolean(),
});

type ChapterFormValues = z.infer<typeof chapterSchema>;

interface ChapterFormProps {
    chapter?: Chapter;
    courseId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChapterForm({ chapter, courseId, open, onOpenChange }: ChapterFormProps) {
    const createChapter = useCreateChapter();
    const updateChapter = useUpdateChapter();

    const form = useForm<ChapterFormValues>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            title: chapter?.title || '',
            description: chapter?.description || '',
            is_free: chapter?.is_free ?? false,
            is_published: chapter?.is_published ?? false,
        },
    });

    // Reset form when dialog opens with new data
    useEffect(() => {
        if (open) {
            form.reset({
                title: chapter?.title || '',
                description: chapter?.description || '',
                is_free: chapter?.is_free ?? false,
                is_published: chapter?.is_published ?? false,
            });
        }
    }, [open, chapter, form]);

    const handleSubmit = async (values: ChapterFormValues) => {
        try {
            if (chapter) {
                // Update existing chapter
                await updateChapter.mutateAsync({
                    courseId,
                    id: chapter.id,
                    data: values,
                });
            } else {
                // Create new chapter
                // Calculate order based on existing chapters (should come from parent)
                await createChapter.mutateAsync({
                    course_id: courseId,
                    title: values.title,
                    description: values.description,
                    is_free: values.is_free ?? false,
                    is_published: values.is_published ?? false,
                    order: 0, // This should be calculated based on existing chapters
                });
            }
            form.reset();
            onOpenChange(false);
        } catch (error) {
            // Error is handled by the hook with toast
            console.error('Error submitting chapter:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{chapter ? 'Edit Chapter' : 'Add Chapter'}</DialogTitle>
                    <DialogDescription>
                        {chapter
                            ? 'Update the chapter details below.'
                            : 'Add a new chapter to your course.'}
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
                                        <Input placeholder="Chapter title" {...field} />
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
                                            placeholder="Brief description of this chapter"
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
                            name="is_free"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Free Preview</FormLabel>
                                        <FormDescription>
                                            Allow everyone to preview this chapter
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="is_published"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Published</FormLabel>
                                        <FormDescription>
                                            Make this chapter visible to students
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

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
                                disabled={createChapter.isPending || updateChapter.isPending}
                            >
                                {createChapter.isPending || updateChapter.isPending
                                    ? 'Saving...'
                                    : chapter
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
