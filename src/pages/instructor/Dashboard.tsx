import { useTranslation } from 'react-i18next';
import { useInstructorStats } from '@/features/courses/hooks/useInstructorStats';
import { useCourses } from '@/features/courses/hooks/useCourses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, Star, BookOpen, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';

export function InstructorDashboard() {
    const { t } = useTranslation();
    const { data: stats, isLoading: isLoadingStats } = useInstructorStats();
    const { isLoading: isLoadingCourses } = useCourses({ sort_by: 'created_at', sort_order: 'desc', per_page: 5 });



    if (isLoadingStats || isLoadingCourses) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.instructorTitle')}</h1>
                    <p className="text-muted-foreground">
                        {t('dashboard.welcomeBack', { name: 'Instructor' })}
                    </p>
                </div>
                <Button asChild>
                    <Link to="/instructor/courses/create">
                        <Plus className="mr-2 h-4 w-4" />
                        {t('dashboard.createCourse')}
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title={t('dashboard.totalRevenue')}
                    value={formatCurrency(stats?.totalRevenue || 0)}
                    icon={DollarSign}
                    description={t('dashboard.fromLastMonth')}
                />
                <StatsCard
                    title={t('dashboard.totalStudents')}
                    value={stats?.totalStudents.toString() || "0"}
                    icon={Users}
                    description="+180 new students"
                />
                <StatsCard
                    title={t('dashboard.activeCourses')}
                    value={stats?.totalCourses.toString() || "0"}
                    icon={BookOpen}
                    description={t('dashboard.pendingApprovals', { count: 2 })}
                />
                <StatsCard
                    title={t('dashboard.averageRating')}
                    value={stats?.averageRating.toFixed(1) || "0.0"}
                    icon={Star}
                    description={t('dashboard.basedOnReviews', { count: 450 })}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{t('dashboard.recentCourses')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Mock Activity Items */}
                        <div className="flex items-center">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                            </span>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">New enrollment</p>
                                <p className="text-sm text-muted-foreground">
                                    John Doe enrolled in "React Mastery"
                                </p>
                            </div>
                            <div className="ml-auto text-xs text-muted-foreground">2m ago</div>
                        </div>
                        <div className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">New review</p>
                                <p className="text-sm text-muted-foreground">
                                    5 stars from Sarah Smith
                                </p>
                            </div>
                            <div className="ml-auto text-xs text-muted-foreground">1h ago</div>
                        </div>
                        <div className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">Course approved</p>
                                <p className="text-sm text-muted-foreground">
                                    "Advanced TypeScript" is now live
                                </p>
                            </div>
                            <div className="ml-auto text-xs text-muted-foreground">5h ago</div>
                        </div>
                    </CardContent>
                </Card>
            </div >
        </div >
    );
}

function StatsCard({ title, value, icon: Icon, description }: { title: string; value: string; icon: any; description: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-[200px]" />
                <Skeleton className="h-10 w-[140px]" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array(4).fill(0).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[60px] mb-2" />
                            <Skeleton className="h-3 w-[120px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-[400px]" />
                <Skeleton className="col-span-3 h-[400px]" />
            </div>
        </div>
    );
}