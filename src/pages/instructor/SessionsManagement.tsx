import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSessions } from '@/features/sessions/hooks/useSessions';
import { SessionCard } from '@/features/sessions/components/SessionCard';
import { CreateSessionDialog } from '@/features/sessions/components/CreateSessionDialog';
import { EditSessionDialog } from '@/features/sessions/components/EditSessionDialog';
import { ManageSessionParticipantsDialog } from '@/features/sessions/components/ManageSessionParticipantsDialog';
import type { Session } from '@/features/sessions/types';

export default function SessionsManagement() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [managingParticipantsSession, setManagingParticipantsSession] = useState<Session | null>(null);
    const [activeTab, setActiveTab] = useState('upcoming');

    const { data: upcomingSessions, isLoading: loadingUpcoming } = useSessions({
        upcoming: true,
    });

    const { data: pastSessions, isLoading: loadingPast } = useSessions({
        past: true,
    });

    const { data: allSessions, isLoading: loadingAll } = useSessions();

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Mes Sessions</h1>
                    <p className="text-muted-foreground">
                        Gérez vos sessions de visioconférence
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une session
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="upcoming">À venir</TabsTrigger>
                    <TabsTrigger value="past">Passées</TabsTrigger>
                    <TabsTrigger value="all">Toutes</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                    {loadingUpcoming ? (
                        <p>Chargement...</p>
                    ) : upcomingSessions?.data?.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            Aucune session à venir
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingSessions?.data?.map((session) => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    onEdit={(s) => setEditingSession(s)}
                                    onManageParticipants={(s) => setManagingParticipantsSession(s)}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                    {loadingPast ? (
                        <p>Chargement...</p>
                    ) : pastSessions?.data?.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            Aucune session passée
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pastSessions?.data?.map((session) => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    onEdit={(s) => setEditingSession(s)}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="all" className="space-y-4">
                    {loadingAll ? (
                        <p>Chargement...</p>
                    ) : allSessions?.data?.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            Aucune session
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {allSessions?.data?.map((session) => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    onEdit={(s) => setEditingSession(s)}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <CreateSessionDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

            {editingSession && (
                <EditSessionDialog
                    open={!!editingSession}
                    onOpenChange={(open) => !open && setEditingSession(null)}
                    session={editingSession}
                />
            )}

            {managingParticipantsSession && (
                <ManageSessionParticipantsDialog
                    open={!!managingParticipantsSession}
                    onOpenChange={(open) => !open && setManagingParticipantsSession(null)}
                    session={managingParticipantsSession}
                />
            )}
        </div>
    );
}
