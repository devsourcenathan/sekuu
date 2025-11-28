import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { LiveKitRoom as LKRoom, VideoConference, useToken } from '@livekit/components-react';
// import '@livekit/components-styles';
import { Loader2 } from 'lucide-react';

export default function LiveKitRoom() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const { token, url } = location.state || {};

    useEffect(() => {
        if (!token || !url) {
            navigate(`/sessions/${id}/waiting-room`);
        }
    }, [token, url, id, navigate]);

    const handleDisconnect = () => {
        navigate('/sessions');
    };

    if (!token || !url) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-screen w-full">
            <LKRoom
                token={token}
                serverUrl={url}
                connect={true}
                video={true}
                audio={true}
                onDisconnected={handleDisconnect}
                className="h-full"
            >
                <VideoConference />
            </LKRoom>
        </div>
    );
}
