// src/pages/student/MyCourses.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { useMyEnrollments } from '@/features/enrollments/hooks';
import { formatDate } from '@/lib/utils';
import { ROUTES } from '@/lib/constants/routes';
import type { EnrollmentFilters } from '@/features/enrollments/types/enrollment.types';

export function MyCourses() {
    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

    const filters: EnrollmentFilters = {
        status: activeTab === 'all' ? undefined : activeTab,
    };

    const { data, isLoading } = useMyEnrollments(filters);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-blue-500">En cours</Badge>;
            case 'completed':
                return <Badge className="bg-green-500">Terminé</Badge>;
            case 'expired':
                return <Badge variant="destructive">Expiré</Badge>;
            case 'suspended':
                return <Badge variant="secondary">Suspendu</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Mes cours</h1>
                <p className="text-muted-foreground mt-2">
                    Gérez vos cours et suivez votre progression
                </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList>
                    <TabsTrigger value="all">
                        Tous ({data?.total || 0})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                        En cours
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                        Terminés
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : data && data.data.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {data.data.map((enrollment) => (
                                <Card key={enrollment.id} className="flex flex-col">
                                    {/* Image */}
                                    <Link to={`/student/courses/${enrollment.course_id}/play`}>
                                        <div className="relative aspect-video overflow-hidden rounded-t-lg bg-muted">
                                            {enrollment.course?.cover_image ? (
                                                <img
                                                    src={enrollment.course.cover_image}
                                                    alt={enrollment.course.title}
                                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <BookOpen className="h-16 w-16 text-muted-foreground" />
                                                </div>
                                            )}

                                            {/* Badge statut */}
                                            <div className="absolute top-2 right-2">
                                                {getStatusBadge(enrollment.status)}
                                            </div>

                                            {/* Badge progression */}
                                            {enrollment.status === 'completed' && (
                                                <div className="absolute top-2 left-2">
                                                    <Badge className="bg-green-500">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        100%
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    <CardHeader className="pb-3">
                                        <Link to={`/courses/${enrollment.id}/play`}>
                                            <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                                                {enrollment.course?.title}
                                            </h3>
                                        </Link>

                                        {enrollment.course?.instructor && (
                                            <p className="text-sm text-muted-foreground">
                                                {enrollment.course.instructor.name}
                                            </p>
                                        )}
                                    </CardHeader>

                                    <CardContent className="flex-1 space-y-4">
                                        {/* Progression */}
                                        {enrollment.status !== 'completed' && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground flex items-center gap-1">
                                                        <TrendingUp className="h-4 w-4" />
                                                        Progression
                                                    </span>
                                                    <span className="font-medium">
                                                        {Math.round(enrollment.progress_percentage)}%
                                                    </span>
                                                </div>
                                                <Progress value={enrollment.progress_percentage} />
                                            </div>
                                        )}

                                        {/* Informations */}
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <span>
                                                    Inscrit le {formatDate(enrollment.enrolled_at)}
                                                </span>
                                            </div>

                                            {enrollment.completed_at && (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span>
                                                        Terminé le {formatDate(enrollment.completed_at)}
                                                    </span>
                                                </div>
                                            )}

                                            {enrollment.expires_at && !enrollment.completed_at && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>
                                                        Expire le {formatDate(enrollment.expires_at)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-4 border-t">
                                            <Link to={`/courses/${enrollment.id}/play`}>
                                                <Button className="w-full">
                                                    {enrollment.status === 'completed'
                                                        ? 'Revoir le cours'
                                                        : 'Continuer'}
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={BookOpen}
                            title={
                                activeTab === 'all'
                                    ? 'Aucun cours inscrit'
                                    : activeTab === 'active'
                                        ? 'Aucun cours en cours'
                                        : 'Aucun cours terminé'
                            }
                            description={
                                activeTab === 'all'
                                    ? 'Explorez notre catalogue et inscrivez-vous à un cours'
                                    : 'Continuez votre apprentissage pour voir des cours ici'
                            }
                            action={
                                activeTab === 'all'
                                    ? {
                                        label: 'Explorer les cours',
                                        onClick: () => (window.location.href = ROUTES.COURSES),
                                    }
                                    : undefined
                            }
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}