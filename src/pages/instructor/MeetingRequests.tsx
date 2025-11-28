import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMeetingRequests } from '@/features/sessions/hooks/useMeetingRequests';
import { MeetingRequestCard } from '@/features/sessions/components/MeetingRequestCard';

export default function MeetingRequests() {
    const { data: pendingRequests, isLoading: loadingPending } = useMeetingRequests('en_attente');
    const { data: allRequests, isLoading: loadingAll } = useMeetingRequests();

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Demandes de Meeting</h1>
                <p className="text-muted-foreground">
                    Gérez les demandes de rendez-vous de vos étudiants
                </p>
            </div>

            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">
                        En attente ({pendingRequests?.data?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="all">Toutes</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    {loadingPending ? (
                        <p>Chargement...</p>
                    ) : pendingRequests?.data?.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">
                                Aucune demande en attente
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingRequests?.data?.map((request) => (
                                <MeetingRequestCard key={request.id} request={request} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="all" className="space-y-4">
                    {loadingAll ? (
                        <p>Chargement...</p>
                    ) : allRequests?.data?.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">
                                Aucune demande
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {allRequests?.data?.map((request) => (
                                <MeetingRequestCard key={request.id} request={request} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
