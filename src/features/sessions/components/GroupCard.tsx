import { useState } from 'react';
import { Users, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Group } from '../types';
import { useDeleteGroup } from '../hooks/useGroups';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ManageGroupMembersDialog } from './ManageGroupMembersDialog';

interface GroupCardProps {
    group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
    const [showManageMembers, setShowManageMembers] = useState(false);
    const deleteGroup = useDeleteGroup();

    const handleDelete = async () => {
        await deleteGroup.mutateAsync(group.id);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <Badge variant={group.is_active ? 'default' : 'secondary'}>
                            {group.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-2">
                    {group.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {group.description}
                        </p>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        <span>
                            {group.members?.length || group.members_count || 0} membre(s)
                        </span>
                    </div>

                    {group.course && (
                        <p className="text-sm text-muted-foreground truncate">
                            Formation : {group.course.title}
                        </p>
                    )}
                </CardContent>

                <CardFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowManageMembers(true)}
                    >
                        Gérer les membres
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer le groupe ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Cette action est irréversible. Le groupe "{group.name}" sera
                                    définitivement supprimé.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>
                                    Supprimer
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>

            <ManageGroupMembersDialog
                group={group}
                open={showManageMembers}
                onOpenChange={setShowManageMembers}
            />
        </>
    );
}
