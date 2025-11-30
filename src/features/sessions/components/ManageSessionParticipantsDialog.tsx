import { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Session } from '../types';
import {
    useSessionParticipants,
    useAddParticipants,
    useRemoveParticipant,
} from '../hooks/useSessions';
import { useEligibleStudents } from '../hooks/useGroups';

interface ManageSessionParticipantsDialogProps {
    session: Session;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ManageSessionParticipantsDialog({
    session,
    open,
    onOpenChange,
}: ManageSessionParticipantsDialogProps) {
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [participantToRemove, setParticipantToRemove] = useState<number | null>(null);

    // Fetch session participants
    const { data: participants, isLoading: isLoadingParticipants } = useSessionParticipants(session.id);

    // Fetch eligible students (using course_id if available)
    const { data: eligibleStudents, isLoading: isLoadingStudents } = useEligibleStudents(
        session.course_id
    );

    const addParticipants = useAddParticipants();
    const removeParticipant = useRemoveParticipant();

    const currentParticipantIds = participants?.map((p) => p.user_id) || [];

    // Filter out students who are already participants
    const availableStudents = eligibleStudents?.filter(
        (student) => !currentParticipantIds.includes(student.id)
    ) || [];

    const handleToggleStudent = (studentId: number) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleAddParticipants = async () => {
        if (selectedStudents.length === 0) return;

        await addParticipants.mutateAsync({
            id: session.id,
            userIds: selectedStudents,
        });
        setSelectedStudents([]);
    };

    const handleRemoveClick = (userId: number) => {
        setParticipantToRemove(userId);
    };

    const handleConfirmRemove = async () => {
        if (!participantToRemove) return;

        await removeParticipant.mutateAsync({
            sessionId: session.id,
            userId: participantToRemove,
        });
        setParticipantToRemove(null);
    };

    const isLoading = isLoadingParticipants || isLoadingStudents;
    const isSubmitting = addParticipants.isPending || removeParticipant.isPending;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Gérer les participants - {session.title}</DialogTitle>
                        <DialogDescription>
                            Ajoutez ou retirez des étudiants de cette session
                        </DialogDescription>
                    </DialogHeader>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Current Participants */}
                            <div>
                                <h3 className="text-sm font-medium mb-3">
                                    Participants actuels ({participants?.length || 0})
                                </h3>
                                <ScrollArea className="h-48 border rounded-md p-4">
                                    {participants && participants.length > 0 ? (
                                        <div className="space-y-2">
                                            {participants.map((participant) => (
                                                <div
                                                    key={participant.id}
                                                    className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <span className="text-sm font-medium">
                                                                {participant.user?.name?.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {participant.user?.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {participant.user?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveClick(participant.user_id)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            Aucun participant dans cette session
                                        </p>
                                    )}
                                </ScrollArea>
                            </div>

                            {/* Available Students */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium">
                                        Étudiants disponibles ({availableStudents.length})
                                    </h3>
                                    {selectedStudents.length > 0 && (
                                        <Badge variant="secondary">
                                            {selectedStudents.length} sélectionné(s)
                                        </Badge>
                                    )}
                                </div>
                                <ScrollArea className="h-48 border rounded-md p-4">
                                    {availableStudents.length > 0 ? (
                                        <div className="space-y-2">
                                            {availableStudents.map((student) => (
                                                <div
                                                    key={student.id}
                                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent"
                                                >
                                                    <Checkbox
                                                        id={`student-${student.id}`}
                                                        checked={selectedStudents.includes(student.id)}
                                                        onCheckedChange={() =>
                                                            handleToggleStudent(student.id)
                                                        }
                                                        disabled={isSubmitting}
                                                    />
                                                    <Label
                                                        htmlFor={`student-${student.id}`}
                                                        className="flex-1 cursor-pointer"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {student.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {student.email}
                                                            </p>
                                                        </div>
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            Aucun étudiant disponible
                                        </p>
                                    )}
                                </ScrollArea>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => onOpenChange(false)}>
                                    Fermer
                                </Button>
                                <Button
                                    onClick={handleAddParticipants}
                                    disabled={selectedStudents.length === 0 || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Ajout...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Ajouter ({selectedStudents.length})
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={!!participantToRemove}
                onOpenChange={(open) => !open && setParticipantToRemove(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Retirer le participant ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir retirer ce participant de la session ?
                            Il ne pourra plus accéder à la session à moins d'être ajouté à nouveau.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmRemove}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Retirer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
