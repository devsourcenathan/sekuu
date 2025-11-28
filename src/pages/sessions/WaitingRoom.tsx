import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, VideoOff, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession, useSessionToken } from '@/features/sessions/hooks/useSessions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function WaitingRoom() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const { data: session, isLoading } = useSession(Number(id));
    const { refetch: fetchToken, isFetching: fetchingToken } = useSessionToken(Number(id));

    useEffect(() => {
        // Get user media for preview
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((mediaStream) => {
                setStream(mediaStream);
                const videoElement = document.getElementById('preview-video') as HTMLVideoElement;
                if (videoElement) {
                    videoElement.srcObject = mediaStream;
                }
            })
            .catch((error) => {
                console.error('Error accessing media devices:', error);
            });

        return () => {
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setVideoEnabled(!videoEnabled);
        }
    };

    const toggleAudio = () => {
        if (stream) {
            stream.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled;
            });
            setAudioEnabled(!audioEnabled);
        }
    };

    const handleJoin = async () => {
        const { data: tokenData } = await fetchToken();
        if (tokenData) {
            navigate(`/sessions/${id}/room`, {
                state: { token: tokenData.token, url: tokenData.url },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Session non trouvée</p>
            </div>
        );
    }

    const canJoin = session.status === 'en_cours' || session.status === 'planifiee';

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>{session.title}</CardTitle>
                    <CardDescription>
                        {format(new Date(session.datetime_start), 'PPP à HH:mm', { locale: fr })}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Video Preview */}
                    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                        <video
                            id="preview-video"
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        {!videoEnabled && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                <VideoOff className="h-16 w-16 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-4">
                        <Button
                            variant={videoEnabled ? 'default' : 'destructive'}
                            size="lg"
                            onClick={toggleVideo}
                        >
                            {videoEnabled ? (
                                <Video className="h-5 w-5" />
                            ) : (
                                <VideoOff className="h-5 w-5" />
                            )}
                        </Button>
                        <Button
                            variant={audioEnabled ? 'default' : 'destructive'}
                            size="lg"
                            onClick={toggleAudio}
                        >
                            {audioEnabled ? (
                                <Mic className="h-5 w-5" />
                            ) : (
                                <MicOff className="h-5 w-5" />
                            )}
                        </Button>
                    </div>

                    {!canJoin && (
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <p className="text-yellow-800">
                                La session n'est pas encore active. Veuillez patienter.
                            </p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        Retour
                    </Button>
                    <Button
                        onClick={handleJoin}
                        disabled={!canJoin || fetchingToken}
                        size="lg"
                    >
                        {fetchingToken ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Connexion...
                            </>
                        ) : (
                            'Rejoindre la session'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
