import { useSessions } from '@/features/sessions/hooks/useSessions';
import { SessionCard } from '@/features/sessions/components/SessionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MySessions() {
    const { data: upcomingSessions, isLoading: loadingUpcoming } = useSessions({
        upcoming: true,
    });

    const { data: pastSessions, isLoading: loadingPast } = useSessions({
        past: true,
    });

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Mes Sessions</h1>
                <p className="text-muted-foreground">
                    Consultez vos sessions de visioconférence
                </p>
            </div>

            <Tabs defaultValue="upcoming">
                <TabsList>
                    <TabsTrigger value="upcoming">À venir</TabsTrigger>
                    <TabsTrigger value="past">Historique</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                    {loadingUpcoming ? (
                        <p>Chargement...</p>
                    ) : upcomingSessions?.data?.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                Vous n'avez aucune session à venir
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingSessions?.data?.map((session) => (
                                <SessionCard key={session.id} session={session} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                    {loadingPast ? (
                        <p>Chargement...</p>
                    ) : pastSessions?.data?.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                Aucune session dans l'historique
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pastSessions?.data?.map((session) => (
                                <SessionCard key={session.id} session={session} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
