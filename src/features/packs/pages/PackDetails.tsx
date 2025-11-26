import { useParams } from 'react-router-dom';
import { usePack, useEnrollInPack } from '../hooks/usePacks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Users, Clock, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function PackDetails() {
    const { slug } = useParams<{ slug: string }>();
    const { data: pack, isLoading } = usePack(slug!);
    const enrollInPack = useEnrollInPack();
    const { user } = useAuth();


    const handleEnroll = async () => {
        if (pack) {
            await enrollInPack.mutateAsync(pack.id);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!pack) {
        return <div>Pack not found</div>;
    }

    const isInstructor = pack.instructor_id === user?.id;

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6">
            {/* Hero Section */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    {/* Cover Image */}
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                        {pack.cover_image ? (
                            <img
                                src={pack.cover_image}
                                alt={pack.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-24 h-24 text-primary/20" />
                            </div>
                        )}
                        <Badge className="absolute top-4 left-4 bg-primary">Pack</Badge>
                        {pack.discount_percentage > 0 && (
                            <Badge className="absolute top-4 right-4 bg-destructive">
                                -{pack.discount_percentage.toFixed(0)}% OFF
                            </Badge>
                        )}
                    </div>

                    {/* Title and Description */}
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{pack.title}</h1>
                        {pack.instructor && (
                            <p className="text-muted-foreground">
                                By {pack.instructor.name}
                            </p>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <div>
                                <p className="font-semibold">{pack.total_courses}</p>
                                <p className="text-xs text-muted-foreground">Courses</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <div>
                                <p className="font-semibold">{pack.students_enrolled}</p>
                                <p className="text-xs text-muted-foreground">Students</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <div>
                                <p className="font-semibold">
                                    {Math.round(pack.total_duration_minutes / 60)}h
                                </p>
                                <p className="text-xs text-muted-foreground">Duration</p>
                            </div>
                        </div>
                        {pack.has_certificate && (
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="font-semibold">Certificate</p>
                                    <p className="text-xs text-muted-foreground">Included</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Description */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">About This Pack</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {pack.description}
                        </p>
                    </div>

                    {/* Included Courses */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">
                            Included Courses ({pack.courses?.length || 0})
                        </h2>
                        <div className="space-y-3">
                            {pack.courses?.map((course, index) => (
                                <Card key={course.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-semibold text-primary">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold mb-1">{course.title}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {course.description}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                    <span>{course.level}</span>
                                                    <span>•</span>
                                                    <span>{course.lessons_count || 0} lessons</span>
                                                    {course.pivot?.is_required && (
                                                        <>
                                                            <span>•</span>
                                                            <Badge variant="secondary" className="text-xs">
                                                                Required
                                                            </Badge>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Enroll Now</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Price */}
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-primary">
                                        {pack.price} {pack.currency}
                                    </span>
                                </div>
                                {pack.discount_percentage > 0 && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm line-through text-muted-foreground">
                                            {(pack.price / (1 - pack.discount_percentage / 100)).toFixed(2)} {pack.currency}
                                        </span>
                                        <Badge variant="destructive" className="text-xs">
                                            Save {pack.discount_percentage.toFixed(0)}%
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* What's Included */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">This pack includes:</h4>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        <span>{pack.total_courses} complete courses</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        <span>
                                            {pack.access_duration_days
                                                ? `${pack.access_duration_days} days access`
                                                : 'Lifetime access'}
                                        </span>
                                    </li>
                                    {pack.has_certificate && (
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            <span>Certificate of completion</span>
                                        </li>
                                    )}
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        <span>Access on mobile and desktop</span>
                                    </li>
                                </ul>
                            </div>

                            <Separator />

                            {/* Enroll Button */}
                            {!isInstructor && (
                                <Button
                                    onClick={handleEnroll}
                                    disabled={enrollInPack.isPending}
                                    className="w-full"
                                    size="lg"
                                >
                                    {enrollInPack.isPending ? 'Enrolling...' : 'Enroll Now'}
                                </Button>
                            )}

                            {/* Savings Highlight */}
                            {pack.discount_percentage > 0 && (
                                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            You save {((pack.price / (1 - pack.discount_percentage / 100)) - pack.price).toFixed(2)} {pack.currency}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
