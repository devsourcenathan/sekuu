import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useUpdateSession } from '../hooks/useSessions';
import type { Session } from '../types/index';

const sessionSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    description: z.string().optional(),
    type: z.enum(['course', 'mentoring', 'meeting']),
    datetime_start: z.string().min(1, 'La date de début est requise'),
    datetime_end: z.string().min(1, 'La date de fin est requise'),
    max_participants: z.number().optional(),
    recording_enabled: z.boolean().optional(),
});

type SessionFormValues = z.infer<typeof sessionSchema>;

interface EditSessionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    session: Session;
}

export function EditSessionDialog({ open, onOpenChange, session }: EditSessionDialogProps) {
    const updateSession = useUpdateSession();

    const form = useForm<SessionFormValues>({
        resolver: zodResolver(sessionSchema),
        defaultValues: {
            title: session.title,
            description: session.description,
            type: session.type,
            datetime_start: session.datetime_start,
            datetime_end: session.datetime_end,
            max_participants: session.max_participants,
            recording_enabled: session.recording_enabled,
        },
    });

    useEffect(() => {
        if (session) {
            form.reset({
                title: session.title,
                description: session.description,
                type: session.type,
                datetime_start: session.datetime_start,
                datetime_end: session.datetime_end,
                max_participants: session.max_participants,
                recording_enabled: session.recording_enabled,
            });
        }
    }, [session, form]);

    const onSubmit = async (data: SessionFormValues) => {
        await updateSession.mutateAsync({ id: session.id, data });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Modifier la session</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de la session
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Titre de la session" {...field} />
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
                                            placeholder="Description de la session"
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="course">Course</SelectItem>
                                            <SelectItem value="mentoring">Mentoring</SelectItem>
                                            <SelectItem value="meeting">Meeting</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="datetime_start"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date et heure de début</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="datetime_end"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date et heure de fin</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
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
                                Annuler
                            </Button>
                            <Button type="submit" disabled={updateSession.isPending}>
                                {updateSession.isPending ? 'Modification...' : 'Modifier'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
