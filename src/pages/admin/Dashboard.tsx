import { useTranslation } from 'react-i18next';
import { useAdminDashboard } from '@/features/admin/hooks/useAdminDashboard';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils/format';
import { Users, BookOpen, DollarSign, Activity } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';

export function AdminDashboard() {
    const { t } = useTranslation();
    const { data: stats, isLoading } = useAdminDashboard();
    console.log(stats, "stats");


    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-[400px]" />
                    <Skeleton className="h-[400px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.adminTitle')}</h1>
                <p className="text-muted-foreground">
                    {t('dashboard.systemOverview')}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title={t('dashboard.totalUsers')}
                    value={stats?.stats.total_users || 0}
                    description={`${stats?.stats.total_students || 0} étudiants, ${stats?.stats.total_instructors || 0} instructeurs`}
                    icon={Users}
                />
                <StatCard
                    title={t('dashboard.totalCourses')}
                    value={stats?.stats.total_courses || 0}
                    description={`${stats?.stats.published_courses || 0} publiés`}
                    icon={BookOpen}
                />
                <StatCard
                    title={t('dashboard.totalRevenue')}
                    value={formatCurrency(stats?.stats.total_revenue || 0)}
                    description={`Plateforme: ${formatCurrency(stats?.stats.platform_revenue || 0)}`}
                    icon={DollarSign}
                />
                <StatCard
                    title="Inscriptions"
                    value={stats?.stats.total_enrollments || 0}
                    description="Total des inscriptions"
                    icon={Activity}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.revenueOverview')}</CardTitle>
                        <CardDescription>{t('dashboard.revenueTrend')}</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px]">
                            {stats?.revenue_growth && stats.revenue_growth.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.revenue_growth}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                        <XAxis
                                            dataKey="month"
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value} XAF`}
                                        />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Aucune donnée de revenus disponible
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.userGrowth')}</CardTitle>
                        <CardDescription>{t('dashboard.newRegistrations')}</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px]">
                            {stats?.user_growth && stats.user_growth.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.user_growth}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            className="stroke-muted/20"
                                        />
                                        <XAxis
                                            dataKey="month"
                                            // stroke="hsl(var(--muted-foreground))"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            // stroke="hsl(var(--muted-foreground))"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            // stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Aucune donnée de croissance disponible
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Cours</CardTitle>
                        <CardDescription>Cours les plus populaires par inscriptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats?.top_courses && stats.top_courses.length > 0 ? (
                                stats.top_courses.map((course) => (
                                    <div key={course.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{course.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {course.level} • {course.language}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">{course.enrollments_count} inscriptions</p>
                                            <p className="text-sm text-muted-foreground">
                                                {course.status === 'published' ? '✓ Publié' : 'Brouillon'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-4">Aucun cours disponible</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Instructeurs</CardTitle>
                        <CardDescription>Instructeurs avec le plus d'étudiants</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats?.top_instructors && stats.top_instructors.length > 0 ? (
                                stats.top_instructors.map((instructor) => (
                                    <div key={instructor.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="font-semibold text-primary">
                                                    {instructor.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{instructor.name}</h4>
                                                <p className="text-sm text-muted-foreground">{instructor.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">{instructor.total_students}</p>
                                            <p className="text-sm text-muted-foreground">étudiants</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-4">Aucun instructeur disponible</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}