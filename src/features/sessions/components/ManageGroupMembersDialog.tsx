import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Group } from '../types';
import {
    useGroup,
    useEligibleStudents,
    useAddGroupMembers,
    useRemoveGroupMembers,
} from '../hooks/useGroups';
import { Loader2 } from 'lucide-react';

interface ManageGroupMembersDialogProps {
    group: Group;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ManageGroupMembersDialog({
    group,
    open,
    onOpenChange,
}: ManageGroupMembersDialogProps) {
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

    // Fetch detailed group data with members
    const { data: groupDetails, isLoading: isLoadingGroup } = useGroup(group.id);

    // Fetch eligible students
    const { data: eligibleStudents, isLoading: isLoadingStudents } = useEligibleStudents(
        group.course_id
    );

    const addMembers = useAddGroupMembers();
    const removeMembers = useRemoveGroupMembers();

    const currentMemberIds = groupDetails?.members?.map((m) => m.user_id) || [];
    const availableStudents = eligibleStudents?.filter(
        (student) => !currentMemberIds.includes(student.id)
    ) || [];

    const handleToggleStudent = (studentId: number) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleAddMembers = async () => {
        if (selectedStudents.length === 0) return;

        await addMembers.mutateAsync({
            id: group.id,
            userIds: selectedStudents,
        });
        setSelectedStudents([]);
    };

    const handleRemoveMember = async (userId: number) => {
        await removeMembers.mutateAsync({
            id: group.id,
            userIds: [userId],
        });
    };

    const isLoading = isLoadingGroup || isLoadingStudents;
    const isSubmitting = addMembers.isPending || removeMembers.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Gérer les membres - {group.name}</DialogTitle>
                    <DialogDescription>
                        Ajoutez ou retirez des étudiants de ce groupe
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Current Members */}
                        <div>
                            <h3 className="text-sm font-medium mb-3">
                                Membres actuels ({groupDetails?.members?.length || 0})
                            </h3>
                            <ScrollArea className="h-48 border rounded-md p-4">
                                {groupDetails?.members && groupDetails.members.length > 0 ? (
                                    <div className="space-y-2">
                                        {groupDetails.members.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-sm font-medium">
                                                            {member.user?.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {member.user?.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {member.user?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveMember(member.user_id)}
                                                    disabled={isSubmitting}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        Aucun membre dans ce groupe
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
                                onClick={handleAddMembers}
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
    );
}
