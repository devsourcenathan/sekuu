import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CategorySelect } from '@/features/categories/components/CategorySelect';
import { ImageUpload } from './ImageUpload';
import { type CreateCourseData, type Course } from '../types/course.types';

const courseSchema = z.object({
    // Basic Info
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    what_you_will_learn: z.string().optional(),
    requirements: z.string().optional(),
    target_audience: z.string().optional(),

    // Media
    cover_image: z.union([z.instanceof(File), z.string()]).optional(),
    presentation_text: z.string().optional(),
    presentation_video_url: z.string().optional(),
    presentation_video_type: z.enum(['youtube', 'vimeo', 'custom']).optional(),

    // Category and Level
    category_id: z.number().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    language: z.string(),

    // Pricing
    is_free: z.boolean(),
    price: z.coerce.number().min(0).nullable().optional().transform(val => val === null ? undefined : val),
    currency: z.string().optional(),
    discount_price: z.coerce.number().min(0).nullable().optional().transform(val => val === null ? undefined : val),
    discount_start_date: z.string().optional(),
    discount_end_date: z.string().optional(),

    // Enrollment
    enrollment_start_date: z.string().optional(),
    enrollment_end_date: z.string().optional(),
    max_students: z.coerce.number().min(0).nullable().optional().transform(val => val === null ? undefined : val),
    access_duration_days: z.coerce.number().min(0).nullable().optional().transform(val => val === null ? undefined : val),

    // Settings
    is_public: z.boolean(),
    requires_approval: z.boolean(),
    allow_download: z.boolean(),
    has_certificate: z.boolean(),
    has_forum: z.boolean(),
});


type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
    initialData?: Course;
    onSubmit: (data: CreateCourseData) => Promise<void>;
    isSubmitting?: boolean;
}

export function CourseForm({ initialData, onSubmit, isSubmitting = false }: CourseFormProps) {
    const [activeTab, setActiveTab] = useState('basic');

    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema) as Resolver<CourseFormValues>,
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            what_you_will_learn: initialData?.what_you_will_learn || '',
            requirements: initialData?.requirements || '',
            target_audience: initialData?.target_audience || '',

            // Media
            cover_image: initialData?.cover_image || '',
            presentation_text: initialData?.presentation_text || '',
            presentation_video_url: initialData?.presentation_video_url || '',
            presentation_video_type: initialData?.presentation_video_type || undefined,

            category_id: initialData?.category_id,
            level: initialData?.level || 'beginner',
            language: initialData?.language || 'en',

            // Pricing
            is_free: initialData?.is_free || false,
            price: initialData?.price || 0,
            currency: initialData?.currency || 'USD',
            discount_price: initialData?.discount_price,
            discount_start_date: initialData?.discount_start_date || '',
            discount_end_date: initialData?.discount_end_date || '',

            // Enrollment
            enrollment_start_date: initialData?.enrollment_start_date || '',
            enrollment_end_date: initialData?.enrollment_end_date || '',
            max_students: initialData?.max_students,
            access_duration_days: initialData?.access_duration_days,

            // Settings
            is_public: initialData?.is_public || false,
            requires_approval: initialData?.requires_approval || false,
            allow_download: initialData?.allow_download ?? true,
            has_certificate: initialData?.has_certificate ?? true,
            has_forum: initialData?.has_forum ?? true,
        },
    });

    const handleSubmit = async (values: CourseFormValues) => {
        await onSubmit(values as any);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {initialData ? 'Edit Course' : 'Create New Course'}
                    </h2>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Course
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="media">Media</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="pricing">Pricing</TabsTrigger>
                        <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Basic Info Tab */}
                    <TabsContent value="basic">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    The core details of your course.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Complete React Guide" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <CategorySelect
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                />
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
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe your course content..."
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="level"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Level</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select level" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="beginner">Beginner</SelectItem>
                                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                                        <SelectItem value="advanced">Advanced</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="language"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Language</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. en, fr, es" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Media Tab */}
                    <TabsContent value="media">
                        <Card>
                            <CardHeader>
                                <CardTitle>Media & Presentation</CardTitle>
                                <CardDescription>
                                    Add visual content to make your course more appealing.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="cover_image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cover Image</FormLabel>
                                            <FormControl>
                                                <ImageUpload
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Upload a cover image for your course (recommended: 1280x720px)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="presentation_text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Presentation Text</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Introduce your course with a compelling message..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="presentation_video_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Presentation Video URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="presentation_video_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Video Type</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="youtube">YouTube</SelectItem>
                                                        <SelectItem value="vimeo">Vimeo</SelectItem>
                                                        <SelectItem value="custom">Custom</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Details Tab */}
                    <TabsContent value="details">
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Details</CardTitle>
                                <CardDescription>
                                    Help students understand what they will learn.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="what_you_will_learn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>What will students learn?</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Key learning outcomes..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="requirements"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Requirements</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Prerequisites or tools needed..."
                                                    className="min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="target_audience"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Audience</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Who is this course for?"
                                                    className="min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Pricing Tab */}
                    <TabsContent value="pricing">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing</CardTitle>
                                <CardDescription>
                                    Set the price for your course.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="is_free"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Free Course</FormLabel>
                                                <FormDescription>
                                                    Make this course available for free.
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
                                {!form.watch('is_free') && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Price</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={field.value ?? ''}
                                                                onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="currency"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Currency</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} disabled />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-4 border-t pt-4">
                                            <h4 className="text-sm font-medium">Discount (Optional)</h4>
                                            <div className="grid grid-cols-3 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="discount_price"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Discount Price</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    value={field.value ?? ''}
                                                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="discount_start_date"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Start Date</FormLabel>
                                                            <FormControl>
                                                                <Input type="date" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="discount_end_date"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>End Date</FormLabel>
                                                            <FormControl>
                                                                <Input type="date" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Enrollment Tab */}
                    <TabsContent value="enrollment">
                        <Card>
                            <CardHeader>
                                <CardTitle>Enrollment Settings</CardTitle>
                                <CardDescription>
                                    Configure enrollment and access settings.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="enrollment_start_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Enrollment Start Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    When students can start enrolling
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="enrollment_end_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Enrollment End Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Last day for enrollment
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="max_students"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Maximum Students</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        placeholder="Unlimited"
                                                        value={field.value ?? ''}
                                                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Leave empty for unlimited
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="access_duration_days"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Access Duration (Days)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        placeholder="Lifetime"
                                                        value={field.value ?? ''}
                                                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Leave empty for lifetime access
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                                <CardDescription>
                                    Configure course visibility and features.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="is_public"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Public</FormLabel>
                                                <FormDescription>
                                                    Make this course visible in the catalog.
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
                                    name="requires_approval"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Requires Approval</FormLabel>
                                                <FormDescription>
                                                    Students must be approved before enrolling.
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
                                    name="has_certificate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Certificate</FormLabel>
                                                <FormDescription>
                                                    Award a certificate upon completion.
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
                                    name="has_forum"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Forum</FormLabel>
                                                <FormDescription>
                                                    Enable discussion forum for this course.
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
                                    name="allow_download"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Allow Downloads</FormLabel>
                                                <FormDescription>
                                                    Allow students to download course materials.
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
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    );
}
