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
import { useCreateGroup } from '../hooks/useGroups';
import type { CreateGroupData } from '../types';

const groupSchema = z.object({
    name: z.string().min(1, 'Le nom est requis'),
    description: z.string().optional(),
    formation_id: z.number().optional(),
});

interface CreateGroupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateGroupDialog({ open, onOpenChange }: CreateGroupDialogProps) {
    const createGroup = useCreateGroup();

    const form = useForm<CreateGroupData>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const onSubmit = async (data: CreateGroupData) => {
        await createGroup.mutateAsync(data);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Créer un groupe</DialogTitle>
                    <DialogDescription>
                        Créez un groupe d'étudiants pour organiser vos sessions d'encadrement
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom du groupe</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Groupe A - Promotion 2024" {...field} />
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
                                    <FormLabel>Description (optionnel)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Description du groupe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={createGroup.isPending}>
                                {createGroup.isPending ? 'Création...' : 'Créer'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
