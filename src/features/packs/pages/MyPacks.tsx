import { useMyPackEnrollments } from '../hooks/usePacks';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MyPacks() {
    const { data: enrollmentsData, isLoading } = useMyPackEnrollments();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const enrollments = enrollmentsData?.data || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Packs</h1>
                <p className="text-muted-foreground">
                    Track your progress across all enrolled packs
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {enrollments.map((enrollment) => (
                    <Card key={enrollment.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2">
                                        {enrollment.pack?.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {enrollment.pack?.description}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        enrollment.status === 'completed'
                                            ? 'default'
                                            : enrollment.status === 'active'
                                                ? 'secondary'
                                                : 'outline'
                                    }
                                >
                                    {enrollment.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Progress */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Overall Progress</span>
                                    <span className="font-medium">
                                        {enrollment.progress_percentage.toFixed(0)}%
                                    </span>
                                </div>
                                <Progress value={enrollment.progress_percentage} />
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">
                                            {enrollment.completed_courses}/{enrollment.total_courses}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Courses</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">
                                            {enrollment.expires_at
                                                ? new Date(enrollment.expires_at).toLocaleDateString()
                                                : 'Lifetime'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Access</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">
                                            {enrollment.certificate_issued ? 'Earned' : 'Not yet'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Certificate</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                                <Button asChild className="flex-1">
                                    <Link to={`/packs/${enrollment.pack_id}`}>
                                        Continue Learning
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link to={`/student/pack-enrollments/${enrollment.id}/progress`}>
                                        View Progress
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {enrollments.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                        You haven't enrolled in any packs yet
                    </p>
                    <Button asChild>
                        <Link to="/packs">Browse Packs</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
