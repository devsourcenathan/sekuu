import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useManagePayments, useRefundPayment } from '@/features/admin/hooks/useManagePayments';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MoreHorizontal, RotateCcw, Download } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { formatCurrency } from '@/lib/utils/format';

export function AdminPayments() {
    // const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const debouncedSearch = useDebounce(search, 500);
    const [page] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [refundReason, setRefundReason] = useState('');

    const { data, isLoading } = useManagePayments(page, debouncedSearch, statusFilter === 'all' ? '' : statusFilter);
    const { mutate: refundPayment, isPending: isRefunding } = useRefundPayment();

    const handleRefund = () => {
        if (!selectedPayment) return;

        refundPayment(
            { paymentId: selectedPayment.id, reason: refundReason },
            {
                onSuccess: () => {
                    setSelectedPayment(null);
                    setRefundReason('');
                },
            }
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-500">Completed</Badge>;
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>;
            case 'refunded':
                return <Badge variant="outline" className="text-orange-600 border-orange-600">Refunded</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
                <p className="text-muted-foreground">
                    View transactions and manage refunds.
                </p>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by transaction ID or user..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.data?.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-mono text-xs">
                                        {payment.gateway_transaction_id || `TXN-${payment.id}`}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{payment.user?.name}</span>
                                            <span className="text-xs text-muted-foreground">{payment.user?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="truncate max-w-[200px]">
                                        {payment.course?.title}
                                    </TableCell>
                                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                    <TableCell>
                                        {new Date(payment.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download Invoice
                                                </DropdownMenuItem>
                                                {payment.status === 'completed' && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <DropdownMenuItem onSelect={(e) => {
                                                                    e.preventDefault();
                                                                    setSelectedPayment(payment);
                                                                }}>
                                                                    <RotateCcw className="mr-2 h-4 w-4" />
                                                                    Refund Payment
                                                                </DropdownMenuItem>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Refund Payment</DialogTitle>
                                                                    <DialogDescription>
                                                                        Are you sure you want to refund this payment? This action cannot be undone.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-4 py-4">
                                                                    <div className="space-y-2">
                                                                        <Label>Refund Reason</Label>
                                                                        <Textarea
                                                                            placeholder="Enter reason for refund..."
                                                                            value={refundReason}
                                                                            onChange={(e) => setRefundReason(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button variant="outline" onClick={() => setSelectedPayment(null)}>Cancel</Button>
                                                                    <Button variant="destructive" onClick={handleRefund} disabled={isRefunding}>
                                                                        {isRefunding ? 'Refunding...' : 'Confirm Refund'}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}