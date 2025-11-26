import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Switch } from '@/components/ui/switch';
import type { Pack, PackFormValues } from '@/types';
import { Loader2 } from 'lucide-react';

const packSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().min(0, 'Price must be positive'),
    currency: z.string().optional(),
    cover_image: z.string().optional(),
    is_active: z.boolean().optional(),
    is_public: z.boolean().optional(),
    max_enrollments: z.number().min(0).optional(),
    access_duration_days: z.number().min(0).optional(),
    has_certificate: z.boolean().optional(),
    require_sequential_completion: z.boolean().optional(),
}) satisfies z.ZodType<PackFormValues>;

interface PackFormProps {
    initialData?: Pack;
    onSubmit: (data: PackFormValues) => Promise<void>;
    isSubmitting?: boolean;
}

export function PackForm({ initialData, onSubmit, isSubmitting = false }: PackFormProps) {
    const form = useForm<PackFormValues>({
        resolver: zodResolver(packSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            currency: initialData?.currency || 'USD',
            cover_image: initialData?.cover_image || '',
            is_active: initialData?.is_active ?? true,
            is_public: initialData?.is_public ?? true,
            max_enrollments: initialData?.max_enrollments,
            access_duration_days: initialData?.access_duration_days,
            has_certificate: initialData?.has_certificate ?? false,
            require_sequential_completion: initialData?.require_sequential_completion ?? false,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pack Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Complete Web Development Bundle" {...field} />
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
                                    placeholder="Describe what's included in this pack..."
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
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={field.value}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="max_enrollments"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Max Enrollments</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="Unlimited"
                                        value={field.value ?? ''}
                                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                                    />
                                </FormControl>
                                <FormDescription>Leave empty for unlimited</FormDescription>
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
                                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                                    />
                                </FormControl>
                                <FormDescription>Leave empty for lifetime</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="is_public"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Public</FormLabel>
                                    <FormDescription>Make this pack visible in the catalog</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="has_certificate"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Certificate</FormLabel>
                                    <FormDescription>Award certificate upon completion</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? 'Update Pack' : 'Create Pack'}
                </Button>
            </form>
        </Form>
    );
}
