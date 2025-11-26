import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle2, Download, XCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatDate } from '@/lib/utils';
import { type Certificate, type ApiResponse } from '@/types';

export function CertificateVerification() {
    const { code } = useParams<{ code: string }>();

    const { data, isLoading, error } = useQuery({
        queryKey: ['certificate-verification', code],
        queryFn: async () => {
            const response = await apiClient.get<ApiResponse<Certificate>>(
                `/certificates/verify/${code}`
            );
            return response.data.data;
        },
        enabled: !!code,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center space-y-4">
                        <XCircle className="h-16 w-16 mx-auto text-destructive" />
                        <h2 className="text-2xl font-bold">Certificat Non Trouvé</h2>
                        <p className="text-muted-foreground">
                            Ce certificat n'existe pas ou a été révoqué.
                        </p>
                        <Button onClick={() => window.location.href = '/'}>
                            Retour à l'accueil
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Verification Status */}
                <Card className="border-green-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center gap-3 text-green-600">
                            <CheckCircle2 className="h-8 w-8" />
                            <span className="text-xl font-semibold">Certificat Vérifié</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Certificate Display */}
                <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-background text-center py-12">
                        <Award className="h-24 w-24 mx-auto mb-6 text-primary" />
                        <h1 className="text-4xl font-bold mb-2">Certificat de Réussite</h1>
                        <p className="text-muted-foreground">
                            Ce certificat est décerné à
                        </p>
                    </CardHeader>

                    <CardContent className="py-8 space-y-6">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-bold">{data.user?.name}</h2>

                            <div>
                                <p className="text-muted-foreground mb-2">
                                    pour avoir complété avec succès le cours
                                </p>
                                <h3 className="text-2xl font-semibold">
                                    {data.course?.title}
                                </h3>
                            </div>

                            {data.final_score && (
                                <div className="flex items-center justify-center gap-2">
                                    <Badge variant="secondary" className="text-lg px-4 py-1">
                                        Score: {data.final_score}%
                                    </Badge>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-b py-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-1">Date de délivrance</p>
                                    <p className="font-medium">{formatDate(data.issued_at)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-1">Numéro de certificat</p>
                                    <p className="font-mono font-medium">{data.certificate_number}</p>
                                </div>
                            </div>
                        </div>

                        {data.instructor && (
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-1">Instructeur</p>
                                <p className="font-medium">{data.instructor.name}</p>
                            </div>
                        )}

                        <div className="flex justify-center gap-4 pt-4">
                            <Button
                                size="lg"
                                onClick={() => window.open(`/api/certificates/${data.id}/download`, '_blank')}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger le PDF
                            </Button>
                        </div>

                        <div className="text-center text-xs text-muted-foreground pt-4">
                            <p>Ce certificat peut être vérifié à tout moment à l'adresse :</p>
                            <p className="font-mono mt-1">{window.location.href}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
