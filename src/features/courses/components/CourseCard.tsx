import { Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDuration } from '@/lib/utils';
import type { Course } from '@/types';
import { useTranslation } from 'react-i18next';

interface CourseCardProps {
    course: Course;
    showInstructor?: boolean;
}

export function CourseCard({ course, showInstructor = true }: CourseCardProps) {
    const { t } = useTranslation();
    const getEffectivePrice = () => {
        if (course.is_free) return t('course.free');
        if (course.discount_price) {
            return (
                <>
                    <span className="text-muted-foreground line-through text-sm mr-2">
                        {formatCurrency(course.price || 0, course.currency)}
                    </span>
                    {formatCurrency(course.discount_price, course.currency)}
                </>
            );
        }
        return formatCurrency(course.price || 0, course.currency);
    };

    const getLevelColor = () => {
        switch (course.level) {
            case 'beginner':
                return 'bg-green-500/10 text-green-700 dark:text-green-400';
            case 'intermediate':
                return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
            case 'advanced':
                return 'bg-red-500/10 text-red-700 dark:text-red-400';
            default:
                return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
        }
    };

    const getLevelLabel = () => {
        switch (course.level) {
            case 'beginner':
                return t('course.levels.beginner');
            case 'intermediate':
                return t('course.levels.intermediate');
            case 'advanced':
                return t('course.levels.advanced');
            default:
                return course.level;
        }
    };

    return (
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image de couverture */}
            <Link to={`/courses/${course.slug}`}>
                <div className="relative aspect-video overflow-hidden bg-muted">
                    {course.cover_image ? (
                        <img
                            src={course.cover_image}
                            alt={course.title}
                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <BookOpen className="h-16 w-16 text-muted-foreground" />
                        </div>
                    )}

                    {/* Badge niveau */}
                    <div className="absolute top-2 right-2">
                        <Badge className={getLevelColor()}>
                            {getLevelLabel()}
                        </Badge>
                    </div>

                    {/* Badge promotion */}
                    {course.discount_price && (
                        <div className="absolute top-2 left-2">
                            <Badge variant="destructive">
                                -{Math.round(((course.price! - course.discount_price) / course.price!) * 100)}%
                            </Badge>
                        </div>
                    )}
                </div>
            </Link>

            <CardHeader className="pb-3">
                <Link to={`/courses/${course.slug}`}>
                    <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                        {course.title}
                    </h3>
                </Link>

                {showInstructor && course.instructor && (
                    <p className="text-sm text-muted-foreground">
                        {course.instructor.name}
                    </p>
                )}
            </CardHeader>

            <CardContent className="flex-1 pb-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                </p>

                {/* Statistiques */}
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    {course.average_rating && course.average_rating > 0 && (
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{course.average_rating}</span>
                        </div>
                    )}

                    {course.students_count !== undefined && (
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{course.students_count}</span>
                        </div>
                    )}

                    {course.lessons_count !== undefined && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.lessons_count} {t('course.includes.lessonsLabel')}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-3 flex items-center justify-between border-t">
                <div className="font-bold text-lg">
                    {getEffectivePrice()}
                </div>
                <Link to={`/courses/${course.slug}`}>
                    <Button size="sm">{t('course.view')}</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}