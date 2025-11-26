import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Clock,
    Star,
    BookOpen,
    Award,
    CheckCircle2,
    Globe,
    Calendar,
    PlayCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useCourseBySlug, useEnrollCourse } from '@/features/courses/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/store/authStore';

export function CourseDetails() {

    const { t } = useTranslation();
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    const { data: course, isLoading, error } = useCourseBySlug(slug || '');

    const { mutate: enrollCourse, isPending: isEnrolling } = useEnrollCourse(
        course?.id || ''
    );

    const handleEnroll = () => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN, { state: { from: `/courses/${slug}` } });
            return;
        }

        if (course?.is_free) {
            enrollCourse();
        } else {
            // Rediriger vers la page de paiement
            navigate(`/checkout/${course?.id}`);
        }
    };

    if (isLoading) {
        return (
            <div className="container p-20 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="container p-20 text-center">
                <h2 className="text-2xl font-bold mb-2">{t('course.notFound.title')}</h2>
                <p className="text-muted-foreground mb-4">{t('course.notFound.desc')}</p>
                <Link to={ROUTES.COURSES}>
                    <Button>{t('course.backToCatalog')}</Button>
                </Link>
            </div>
        );
    }

    // const getEffectivePrice = () => {
    //     if (course.is_free) return 0;
    //     return course.discount_price || course.price || 0;
    // };

    const getLevelLabel = () => {
        switch (course.level) {
            case 'beginner': return t('course.levels.beginner');
            case 'intermediate': return t('course.levels.intermediate');
            case 'advanced': return t('course.levels.advanced');
            default: return course.level;
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-muted/50 to-background border-b">
                <div className="container p-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Informations principales */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <Badge className="mb-4">{getLevelLabel()}</Badge>
                                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                                <p className="text-xl text-muted-foreground">
                                    {course.description}
                                </p>
                            </div>

                            {/* Métadonnées */}
                            <div className="flex flex-wrap gap-6 text-sm">
                                {course.instructor && (
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="font-semibold text-primary">
                                                {course.instructor.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{course.instructor.name}</p>
                                            <p className="text-muted-foreground">{t('course.tabs.instructor')}</p>
                                        </div>
                                    </div>
                                )}

                                {course.average_rating && course.average_rating > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium">{course.average_rating}</span>
                                        {/* <span className="text-muted-foreground">
                                            ({course.students_count} étudiants)
                                        </span> */}
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        {t('courseMeta.updated')} {formatDate(course.updated_at)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        {course.language === 'fr' ? 'Français' : course.language}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card d'achat */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-20">
                                {/* Image de prévisualisation */}
                                {course.cover_image && (
                                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                                        <img
                                            src={course.cover_image}
                                            alt={course.title}
                                            className="object-cover w-full h-full"
                                        />
                                        {course.preview_video && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer">
                                                <PlayCircle className="h-16 w-16 text-white" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <CardContent className="p-6 space-y-4">
                                    {/* Prix */}
                                    <div className="space-y-2">
                                        {course.is_free ? (
                                            <p className="text-3xl font-bold">{t('course.free')}</p>
                                        ) : (
                                            <>
                                                {course.discount_price ? (
                                                    <div>
                                                        <p className="text-3xl font-bold">
                                                            {formatCurrency(course.discount_price, course.currency)}
                                                        </p>
                                                        <p className="text-muted-foreground line-through">
                                                            {formatCurrency(course.price || 0, course.currency)}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-3xl font-bold">
                                                        {formatCurrency(course.price || 0, course.currency)}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Bouton d'action */}
                                    {course.is_enrolled ? (
                                        <Button className="w-full" size="lg" asChild>
                                            <Link to={`/student/courses/${course.id}/play`}>
                                                {t('course.continue')}
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full"
                                            size="lg"
                                            onClick={handleEnroll}
                                            disabled={isEnrolling}
                                        >
                                            {isEnrolling
                                                ? t('course.enrolling')
                                                : course.is_free
                                                    ? t('course.enrollFree')
                                                    : t('course.buyNow')}
                                        </Button>
                                    )}

                                    <Separator />

                                    {/* Ce que comprend ce cours */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold">{t('course.includes.title')}</h3>
                                        <ul className="space-y-2 text-sm">
                                            {course.lessons_count && (
                                                <li className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                    <span>{course.lessons_count} {t('course.includes.lessonsLabel')}</span>
                                                </li>
                                            )}
                                            {course.access_duration_days && (
                                                <li className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {t('course.includes.accessForDays', { count: course.access_duration_days })}
                                                    </span>
                                                </li>
                                            )}
                                            {course.has_certificate && (
                                                <li className="flex items-center gap-2">
                                                    <Award className="h-4 w-4 text-muted-foreground" />
                                                    <span>{t('course.includes.certificate')}</span>
                                                </li>
                                            )}
                                            {course.allow_download && (
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                                    <span>{t('course.includes.downloadable')}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu détaillé */}
            <div className="container p-12">
                <div className="lg:grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="overview">{t('course.tabs.overview')}</TabsTrigger>
                                <TabsTrigger value="curriculum">{t('course.tabs.curriculum')}</TabsTrigger>
                                <TabsTrigger value="instructor">{t('course.tabs.instructor')}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6 mt-6">
                                {/* Ce que vous allez apprendre */}
                                {course.what_you_will_learn && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{t('course.cards.whatYouWillLearn')}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div
                                                className="prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{
                                                    __html: course.what_you_will_learn,
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Prérequis */}
                                {course.requirements && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{t('course.cards.prerequisites')}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div
                                                className="prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{
                                                    __html: course.requirements,
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                )}

                                {/* À qui s'adresse ce cours */}
                                {course.target_audience && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{t('course.cards.audience')}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div
                                                className="prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{
                                                    __html: course.target_audience,
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="curriculum" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('course.tabs.curriculum')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {course.chapters && course.chapters.length > 0 ? (
                                            <div className="space-y-4">
                                                {course.chapters.map((chapter, index) => (
                                                    <div key={chapter.id} className="border-b pb-4 last:border-0">
                                                        <h3 className="font-semibold mb-2">
                                                            {index + 1}. {chapter.title}
                                                        </h3>
                                                        {chapter.description && (
                                                            <p className="text-sm text-muted-foreground">
                                                                {chapter.description}
                                                            </p>
                                                        )}
                                                        {chapter.lessons_count && (
                                                            <p className="text-sm text-muted-foreground mt-2">
                                                                {chapter.lessons_count} {t('course.includes.lessonsLabel')}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">{t('course.cards.programSoon')}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="instructor" className="mt-6">
                                {course.instructor && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{t('course.tabs.instructor')}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-2xl font-semibold text-primary">
                                                        {course.instructor.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold">
                                                        {course.instructor.name}
                                                    </h3>
                                                    <p className="text-muted-foreground">
                                                        {course.instructor.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar - Infos supplémentaires */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Statistiques */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('courseMeta.statsTitle')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">{t('course.stats.students')}</span>
                                    <span className="font-semibold">{course.students_count || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">{t('course.stats.lessons')}</span>
                                    <span className="font-semibold">{course.lessons_count || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">{t('course.stats.chapters')}</span>
                                    <span className="font-semibold">{course.chapters_count || 0}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}