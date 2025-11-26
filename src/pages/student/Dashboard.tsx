// src/pages/student/Dashboard.tsx

import { Link } from 'react-router-dom';
import {
    BookOpen,
    Clock,
    Award,
    TrendingUp,
    ArrowRight,
    CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { useStudentDashboard } from '@/features/dashboard/hooks/useStudentDashboard';
import { formatDuration } from '@/lib/utils';
import { ROUTES } from '@/lib/constants/routes';
import { useTranslation } from 'react-i18next';

export function StudentDashboard() {
    const { t } = useTranslation();
    const { data, isLoading } = useStudentDashboard();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!data) {
        return (
            <EmptyState
                icon={BookOpen}
                title={t('dashboard.noActiveCourses')}
                description={t('dashboard.enrollToStart')}
                action={{
                    label: t('dashboard.exploreCourses'),
                    onClick: () => window.location.href = ROUTES.COURSES,
                }}
            />
        );
    }

    const { stats, recent_activity } = data;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">{t('dashboard.studentTitle')}</h1>
                <p className="text-muted-foreground mt-2">
                    {t('dashboard.overview')}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('dashboard.activeCourses')}
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.in_progress}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('dashboard.enrolledCourses', { count: stats.total_enrolled })}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('dashboard.completedCourses')}
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completed}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.completed > 0 && stats.total_enrolled > 0
                                ? t('dashboard.completionRate', { rate: Math.round((stats.completed / stats.total_enrolled) * 100) })
                                : t('dashboard.noCompletedCourses')}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('dashboard.certificates')}
                        </CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.certificates_earned}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('dashboard.certificatesEarned')}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('dashboard.totalTime')}
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatDuration(stats.total_learning_time)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t('dashboard.learningTime')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Cours en cours */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{t('dashboard.continueLearning')}</CardTitle>
                            <Link to={ROUTES.MY_COURSES}>
                                <Button variant="ghost" size="sm">
                                    {t('dashboard.viewAll')}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recent_activity && recent_activity.length > 0 ? (
                            <div className="space-y-4">
                                {recent_activity.slice(0, 3).map((activity) => (
                                    <Link
                                        key={activity.id}
                                        to={`/student/courses/${activity.course_id}/play`}
                                        className="block"
                                    >
                                        <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                            {activity.course?.cover_image ? (
                                                <img
                                                    src={activity.course.cover_image}
                                                    alt={activity.course.title}
                                                    className="w-16 h-16 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                                                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold truncate">
                                                    {activity.course?.title}
                                                </h4>
                                                <div className="mt-2 space-y-1">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            {t('dashboard.progress')}
                                                        </span>
                                                        <span className="font-medium">
                                                            {Math.round(activity.progress_percentage)}%
                                                        </span>
                                                    </div>
                                                    <Progress value={activity.progress_percentage} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={BookOpen}
                                title={t('dashboard.noActiveCourses')}
                                description={t('dashboard.enrollToStart')}
                                action={{
                                    label: t('dashboard.exploreCourses'),
                                    onClick: () => window.location.href = ROUTES.COURSES,
                                }}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Tests à venir */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.upcomingTests')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.upcoming_tests && stats.upcoming_tests.length > 0 ? (
                            <div className="space-y-4">
                                {stats.upcoming_tests.slice(0, 3).map((test) => (
                                    <div
                                        key={test.id}
                                        className="flex items-center justify-between p-4 rounded-lg border"
                                    >
                                        <div>
                                            <h4 className="font-semibold">{test.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {test.questions_count || 0} {t('dashboard.questions')} • {test.duration_minutes} {t('dashboard.minutes')}
                                            </p>
                                        </div>
                                        <Button size="sm">{t('dashboard.start')}</Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>{t('dashboard.noUpcomingTests')}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Progression globale */}
            {stats.average_progress > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            {t('dashboard.globalProgress')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    {t('dashboard.averageProgress')}
                                </span>
                                <span className="text-2xl font-bold">
                                    {Math.round(stats.average_progress)}%
                                </span>
                            </div>
                            <Progress value={stats.average_progress} className="h-3" />
                            <p className="text-sm text-muted-foreground">
                                {t('dashboard.progressMessage', { rate: Math.round(stats.average_progress) })}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}