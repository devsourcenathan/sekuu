import { useQuery } from '@tanstack/react-query';
import { type ApiResponse } from '@/types';
import { apiClient } from '@/lib/api/client';

interface RevenueStats {
    total_revenue: number;
    this_month_revenue: number;
    last_month_revenue: number;
    revenue_growth: number;
    transactions: Transaction[];
    daily_revenue: { date: string; amount: number }[];
}

interface Transaction {
    id: number;
    course_title: string;
    student_name: string;
    amount: number;
    currency: string;
    date: string;
    status: 'completed' | 'refunded';
}

export function useInstructorRevenue() {
    return useQuery({
        queryKey: ['instructor-revenue'],
        queryFn: async () => {
            const response = await apiClient.get<ApiResponse<RevenueStats>>(
                '/instructor/dashboard/revenue'
            );
            return response.data.data;
        },
    });
}
