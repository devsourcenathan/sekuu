import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMyPayments, useDownloadInvoice } from '@/features/payments/hooks';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';

export function MyPayments() {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');

    const { data, isLoading } = useMyPayments(page, statusFilter === 'all' ? undefined : statusFilter);
    const downloadInvoice = useDownloadInvoice();

    const handleDownload = async (paymentId: number) => {
        try {
            await downloadInvoice(paymentId);
        } catch (error) {
            console.error('Error downloading invoice:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
            case 'succeeded':
                return <Badge className="bg-green-500">Complété</Badge>;
            case 'pending':
                return <Badge variant="secondary">En attente</Badge>;
            case 'failed':
                return <Badge variant="destructive">Échoué</Badge>;
            case 'refunded':
                return <Badge variant="outline" className="border-orange-500 text-orange-500">Remboursé</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Mes Paiements</h1>
                <p className="text-muted-foreground mt-2">
                    Consultez l'historique de vos paiements et téléchargez vos factures
                </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="completed">Complétés</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="failed">Échoués</SelectItem>
                        <SelectItem value="refunded">Remboursés</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Payments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Historique des Transactions</CardTitle>
                    <CardDescription>
                        Liste de toutes vos transactions et factures
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Cours</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Méthode</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : data?.data?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Aucun paiement trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.data?.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            {formatDate(payment.created_at)}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {payment.course?.title || 'Cours supprimé'}
                                        </TableCell>
                                        <TableCell>
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(payment.status)}
                                        </TableCell>
                                        {/* <TableCell>
                                            {payment.payment_method === 'stripe' ? 'Carte bancaire' :
                                                payment.payment_method === 'paypal' ? 'PayPal' :
                                                    payment.payment_method}
                                        </TableCell> */}
                                        <TableCell className="text-right">
                                            {(payment.status === 'completed' || payment.status === 'refunded') && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDownload(payment.id)}
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Facture
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {data && data?.meta && data.meta.last_page > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-muted-foreground">
                                Page {data.meta.current_page} sur {data.meta.last_page}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Précédent
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === data.meta.last_page}
                                >
                                    Suivant
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}