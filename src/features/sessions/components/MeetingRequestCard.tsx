import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, User, BookOpen, Check, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { MeetingRequest } from '../types';
import {
    useAcceptMeetingRequest,
    useRejectMeetingRequest,
} from '../hooks/useMeetingRequests';

interface MeetingRequestCardProps {
    request: MeetingRequest;
}

const statusColors = {
    pending: 'bg-yellow-500',
    accepted: 'bg-green-500',
    rejected: 'bg-red-500',
    cancelled: 'bg-gray-500',
};

const statusLabels = {
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
};

export function MeetingRequestCard({ request }: MeetingRequestCardProps) {
    const [isAcceptOpen, setIsAcceptOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [datetimeStart, setDatetimeStart] = useState('');
    const [datetimeEnd, setDatetimeEnd] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    const acceptRequest = useAcceptMeetingRequest();
    const rejectRequest = useRejectMeetingRequest();

    const handleAccept = async () => {
        await acceptRequest.mutateAsync({
            id: request.id,
            data: {
                datetime_start: datetimeStart,
                datetime_end: datetimeEnd,
            },
        });
        setIsAcceptOpen(false);
    };

    const handleReject = async () => {
        await rejectRequest.mutateAsync({
            id: request.id,
            data: { reason: rejectReason },
        });
        setIsRejectOpen(false);
    };

    const isPending = request.status === 'pending';

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="font-semibold">{request.student?.name}</span>
                            </div>
                            <Badge className={statusColors[request.status]}>
                                {statusLabels[request.status]}
                            </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {format(new Date(request.created_at), 'PPP', { locale: fr })}
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4" />
                        <span>{request.course?.title}</span>
                    </div>

                    {request.datetime_proposed && (
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>
                                Date proposée :{' '}
                                {format(new Date(request.datetime_proposed), 'PPP à HH:mm', {
                                    locale: fr,
                                })}
                            </span>
                        </div>
                    )}

                    <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{request.message}</p>
                    </div>

                    {request.rejection_reason && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                                <strong>Raison du refus :</strong> {request.rejection_reason}
                            </p>
                        </div>
                    )}
                </CardContent>

                {isPending && (
                    <CardFooter className="flex gap-2">
                        <Button
                            onClick={() => setIsAcceptOpen(true)}
                            className="flex-1"
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Accepter
                        </Button>
                        <Button
                            onClick={() => setIsRejectOpen(true)}
                            variant="destructive"
                            className="flex-1"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Refuser
                        </Button>
                    </CardFooter>
                )}
            </Card>

            {/* Accept Dialog */}
            <Dialog open={isAcceptOpen} onOpenChange={setIsAcceptOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Accepter la demande</DialogTitle>
                        <DialogDescription>
                            Planifiez la session avec {request.student?.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="start">Date et heure de début</Label>
                            <Input
                                id="start"
                                type="datetime-local"
                                value={datetimeStart}
                                onChange={(e) => setDatetimeStart(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="end">Date et heure de fin</Label>
                            <Input
                                id="end"
                                type="datetime-local"
                                value={datetimeEnd}
                                onChange={(e) => setDatetimeEnd(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAcceptOpen(false)}>
                            Annuler
                        </Button>
                        <Button
                            onClick={handleAccept}
                            disabled={!datetimeStart || !datetimeEnd || acceptRequest.isPending}
                        >
                            {acceptRequest.isPending ? 'Création...' : 'Accepter et créer la session'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Refuser la demande</DialogTitle>
                        <DialogDescription>
                            Indiquez la raison du refus à {request.student?.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div>
                        <Label htmlFor="reason">Raison du refus</Label>
                        <Textarea
                            id="reason"
                            placeholder="Ex: Je ne suis pas disponible à cette date..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
                            Annuler
                        </Button>
                        <Button
                            onClick={handleReject}
                            variant="destructive"
                            disabled={!rejectReason || rejectRequest.isPending}
                        >
                            {rejectRequest.isPending ? 'Refus...' : 'Refuser'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
