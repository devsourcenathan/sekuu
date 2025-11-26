import { Download, Award, Share2, Linkedin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { useGenerateCertificatePDF, useShareCertificateLinkedIn } from '@/features/student/hooks/useCertificatePDF';
import type { Certificate } from '@/types';

export function MyCertificates() {
    const { data: certificates, isLoading } = useQuery({
        queryKey: ['certificates'],
        queryFn: () => apiGet<Certificate[]>(ENDPOINTS.STUDENT.CERTIFICATES),
    });

    const { mutate: generatePDF, isPending: isGeneratingPDF } = useGenerateCertificatePDF();
    const shareOnLinkedIn = useShareCertificateLinkedIn();

    const handleDownloadPDF = (certificate: Certificate) => {
        generatePDF(certificate);
    };

    const handleShare = (certificate: Certificate) => {
        const url = `${window.location.origin}/certificates/verify/${certificate.verification_code}`;

        if (navigator.share) {
            navigator.share({
                title: 'Mon certificat',
                text: `J'ai obtenu mon certificat pour ${certificate.course?.title}`,
                url: url,
            });
        } else {
            navigator.clipboard.writeText(url);
            alert('Lien copié dans le presse-papier !');
        }
    };

    const handleLinkedInShare = (certificate: Certificate) => {
        shareOnLinkedIn(certificate);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Mes certificats</h1>
                <p className="text-muted-foreground mt-2">
                    Téléchargez et partagez vos certificats de réussite
                </p>
            </div>

            {/* Certificates Grid */}
            {certificates && certificates.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((certificate) => (
                        <Card key={certificate.id} className="overflow-hidden">
                            <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 pb-12">
                                <Award className="h-16 w-16 mx-auto mb-4 text-primary" />
                                <CardTitle className="text-center line-clamp-2">
                                    {certificate.course?.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="pt-6 space-y-4">
                                <div className="text-center space-y-2">
                                    <Badge className="bg-green-500 text-white">Certifié</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Délivré le {formatDate(certificate.issued_at)}
                                    </p>
                                    <p className="text-xs font-mono text-muted-foreground">
                                        N° {certificate.certificate_number}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleDownloadPDF(certificate)}
                                        disabled={isGeneratingPDF}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        {isGeneratingPDF ? 'Génération...' : 'Télécharger PDF'}
                                    </Button>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleLinkedInShare(certificate)}
                                        >
                                            <Linkedin className="h-4 w-4 mr-2" />
                                            LinkedIn
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleShare(certificate)}
                                        >
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Partager
                                        </Button>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="w-full"
                                        asChild
                                    >
                                        <a
                                            href={`/certificates/verify/${certificate.verification_code}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Vérifier l'authenticité
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Award}
                    title="Aucun certificat"
                    description="Terminez un cours pour obtenir votre certificat"
                />
            )}
        </div>
    );
}