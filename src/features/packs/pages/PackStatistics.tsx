import { useParams } from 'react-router-dom';
import { usePackStatistics } from '../hooks/usePacks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, BookOpen, Award } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export function PackStatistics() {
    const { id } = useParams<{ id: string }>();
    const { data: stats, isLoading } = usePackStatistics(id!);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!stats) {
        return <div>Statistics not found</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Pack Statistics</h1>
                <p className="text-muted-foreground">
                    Track performance and engagement metrics
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Enrollments
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_enrollments}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.active_enrollments} active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${stats.total_revenue.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            From {stats.total_enrollments} enrollments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Average Progress
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.average_progress.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all students
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Completions
                        </CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.completed_enrollments}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.total_enrollments > 0
                                ? ((stats.completed_enrollments / stats.total_enrollments) * 100).toFixed(1)
                                : 0}% completion rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Enrollment Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Enrollment Trend</CardTitle>
                    <CardDescription>
                        Monthly enrollment over the last 12 months
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.enrollments_by_month}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Pack Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Courses</span>
                            <span className="font-semibold">{stats.total_courses}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Active Enrollments</span>
                            <span className="font-semibold">{stats.active_enrollments}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Completed</span>
                            <span className="font-semibold">{stats.completed_enrollments}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg. Progress</span>
                            <span className="font-semibold">
                                {stats.average_progress.toFixed(1)}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Completion Rate</span>
                            <span className="font-semibold">
                                {stats.total_enrollments > 0
                                    ? ((stats.completed_enrollments / stats.total_enrollments) * 100).toFixed(1)
                                    : 0}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Revenue per Student</span>
                            <span className="font-semibold">
                                ${stats.total_enrollments > 0
                                    ? (stats.total_revenue / stats.total_enrollments).toFixed(2)
                                    : 0}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
