import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ServerError() {
    const navigate = useNavigate();

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-muted/20 to-background">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Erreur Serveur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-muted-foreground">
                        Désolé, quelque chose s'est mal passé de notre côté. Nous travaillons à résoudre ce problème.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Button onClick={handleRetry} className="w-full">
                            Réessayer
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="w-full"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/')}
                            className="w-full"
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Accueil
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                        Code d'erreur: 500 - Internal Server Error
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
