import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGroups } from '@/features/sessions/hooks/useGroups';
import { GroupCard } from '@/features/sessions/components/GroupCard';
import { CreateGroupDialog } from '@/features/sessions/components/CreateGroupDialog';

export default function GroupsManagement() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { data: groups, isLoading } = useGroups();

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Mes Groupes d'Encadrement</h1>
                    <p className="text-muted-foreground">
                        Gérez vos groupes d'étudiants pour les sessions collectives
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un groupe
                </Button>
            </div>

            {isLoading ? (
                <p>Chargement...</p>
            ) : groups?.data?.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">
                        Vous n'avez pas encore créé de groupe
                    </p>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        Créer votre premier groupe
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groups?.data?.map((group) => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                </div>
            )}

            <CreateGroupDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
    );
}
