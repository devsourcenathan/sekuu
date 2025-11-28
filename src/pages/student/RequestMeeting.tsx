import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    useCreateMeetingRequest,
    useEligibleInstructors,
} from '@/features/sessions/hooks/useMeetingRequests';
import type { CreateMeetingRequestData } from '@/features/sessions/types';

const requestSchema = z.object({
    instructor_id: z.number({ message: 'Sélectionnez un instructeur' }),
    course_id: z.number({ message: 'Sélectionnez une formation' }),
    message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
    datetime_proposed: z.string().optional(),
});

export default function RequestMeeting() {
    const [selectedInstructorId, setSelectedInstructorId] = useState<number>();
    const { data: instructors, isLoading: loadingInstructors } = useEligibleInstructors();
    const createRequest = useCreateMeetingRequest();

    const form = useForm<CreateMeetingRequestData>({
        resolver: zodResolver(requestSchema),
    });

    const selectedInstructor = instructors?.find((i) => i.id === selectedInstructorId);
    const availableCourses = selectedInstructor?.instructedCourses || [];

    const onSubmit = async (data: CreateMeetingRequestData) => {
        await createRequest.mutateAsync(data);
        form.reset();
        setSelectedInstructorId(undefined);
    };

    return (
        <div className="container mx-auto py-6 max-w-3xl">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Demander un Meeting</h1>
                    <p className="text-muted-foreground">
                        Demandez un rendez-vous individuel avec un de vos instructeurs
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Nouvelle demande de meeting</CardTitle>
                        <CardDescription>
                            Remplissez le formulaire ci-dessous pour envoyer votre demande
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="instructor_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Instructeur</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    const id = parseInt(value);
                                                    field.onChange(id);
                                                    setSelectedInstructorId(id);
                                                    form.setValue('course_id', 0 as any); // Reset course
                                                }}
                                                value={field.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionnez un instructeur" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {loadingInstructors ? (
                                                        <SelectItem value="loading" disabled>
                                                            Chargement...
                                                        </SelectItem>
                                                    ) : instructors?.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            Aucun instructeur disponible
                                                        </SelectItem>
                                                    ) : (
                                                        instructors?.map((instructor) => (
                                                            <SelectItem
                                                                key={instructor.id}
                                                                value={instructor.id.toString()}
                                                            >
                                                                {instructor.name}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Seuls les instructeurs de vos formations sont affichés
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {selectedInstructorId && (
                                    <FormField
                                        control={form.control}
                                        name="course_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Formation</FormLabel>
                                                <Select
                                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                                    value={field.value?.toString()}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Sélectionnez une formation" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {availableCourses.length === 0 ? (
                                                            <SelectItem value="none" disabled>
                                                                Aucune formation disponible
                                                            </SelectItem>
                                                        ) : (
                                                            availableCourses.map((course: any) => (
                                                                <SelectItem
                                                                    key={course.id}
                                                                    value={course.id.toString()}
                                                                >
                                                                    {course.title}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <FormField
                                    control={form.control}
                                    name="datetime_proposed"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date et heure proposée (optionnel)</FormLabel>
                                            <FormControl>
                                                <Input type="datetime-local" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Proposez une date, l'instructeur pourra l'ajuster
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Expliquez le sujet que vous souhaitez aborder lors du meeting..."
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Minimum 10 caractères
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={createRequest.isPending}
                                >
                                    {createRequest.isPending ? (
                                        'Envoi en cours...'
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Envoyer la demande
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>
                            • Vous pouvez uniquement demander des meetings avec les instructeurs
                            de vos formations actives
                        </p>
                        <p>
                            • L'instructeur recevra une notification et pourra accepter ou refuser
                            votre demande
                        </p>
                        <p>
                            • Si acceptée, une session sera automatiquement créée et vous recevrez
                            les détails
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
