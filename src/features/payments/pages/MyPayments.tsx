import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

// Mock Data
const MOCK_PAYMENTS = [
    {
        id: 'pay_123456789',
        course_title: 'Complete Laravel Development Course',
        amount: 39.99,
        currency: 'USD',
        status: 'succeeded',
        date: new Date('2024-05-15'),
        payment_method: 'Stripe (**** 4242)',
    },
    {
        id: 'pay_987654321',
        course_title: 'React Mastery',
        amount: 49.99,
        currency: 'USD',
        status: 'refunded',
        date: new Date('2024-04-10'),
        payment_method: 'PayPal',
    },
];

export const MyPayments: React.FC = () => {
    const handleDownloadInvoice = (paymentId: string) => {
        console.log('Downloading invoice for:', paymentId);
        // Implement actual PDF download logic here
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Payment History</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>View your past purchases and invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_PAYMENTS.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{format(payment.date, 'MMM dd, yyyy')}</TableCell>
                                    <TableCell className="font-medium">{payment.course_title}</TableCell>
                                    <TableCell>
                                        {payment.currency} {payment.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                payment.status === 'succeeded'
                                                    ? 'default' // Changed from 'success' to 'default' as 'success' might not exist in standard shadcn badge
                                                    : payment.status === 'refunded'
                                                        ? 'secondary'
                                                        : 'destructive'
                                            }
                                            className={
                                                payment.status === 'succeeded'
                                                    ? 'bg-green-500 hover:bg-green-600'
                                                    : ''
                                            }
                                        >
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{payment.payment_method}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDownloadInvoice(payment.id)}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Invoice
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
