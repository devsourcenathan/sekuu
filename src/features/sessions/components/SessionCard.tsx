import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Session } from '../types';
import { useNavigate } from 'react-router-dom';

interface SessionCardProps {
    session: Session;
    onEdit?: (session: Session) => void;
    onManageParticipants?: (session: Session) => void;
}

const statusColors = {
    scheduled: 'bg-blue-500',
    in_progress: 'bg-green-500',
    completed: 'bg-gray-500',
    cancelled: 'bg-red-500',
};

const typeLabels = {
    course: 'Course',
    mentoring: 'Mentoring',
    meeting: 'Meeting',
};

export function SessionCard({ session, onEdit, onManageParticipants }: SessionCardProps) {
    const navigate = useNavigate();
    const isUpcoming = new Date(session.datetime_start) > new Date();
    const isActive = session.status === 'in_progress';

    const handleJoin = () => {
        if (isActive) {
            navigate(`/sessions/${session.id}/waiting-room`);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <Badge className={statusColors[session.status]}>
                        {session.status}
                    </Badge>
                </div>
                <Badge variant="outline">{typeLabels[session.type]}</Badge>
            </CardHeader>

            <CardContent className="space-y-2">
                {session.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {session.description}
                    </p>
                )}

                <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {format(new Date(session.datetime_start), 'PPP', { locale: fr })}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                            {format(new Date(session.datetime_start), 'HH:mm')} -{' '}
                            {format(new Date(session.datetime_end), 'HH:mm')}
                        </span>
                    </div>

                    {session.course && (
                        <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            <span className="truncate">{session.course.title}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                            {session.participants?.length || 0}
                            {session.max_participants && ` / ${session.max_participants}`} participants
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex gap-2 flex-wrap">
                {isActive && (
                    <Button onClick={handleJoin} className="w-full">
                        Rejoindre
                    </Button>
                )}
                {isUpcoming && session.status === 'scheduled' && (
                    <>
                        {onEdit && (
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => onEdit(session)}
                            >
                                Modifier
                            </Button>
                        )}
                        {onManageParticipants && (
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => onManageParticipants(session)}
                            >
                                Participants
                            </Button>
                        )}
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
