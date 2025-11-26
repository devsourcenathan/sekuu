import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Enrollment } from '@/types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface Props {
    enrollment: Enrollment;
}

export const StudentCourseCard = ({ enrollment }: Props) => {
    const { t } = useTranslation();
    const course = enrollment.course;
    const progress = enrollment.progress_percentage || 0;

    return (
        <Card className="overflow-hidden hover:shadow transition">
            {course?.cover_image && (
                <img src={course.cover_image} alt={course.title} className="w-full h-36 object-cover" />
            )}

            <CardHeader>
                <h3 className="font-semibold text-lg">{course?.title}</h3>
            </CardHeader>

            <CardContent>
                <p className="text-sm line-clamp-3 text-muted-foreground">{course?.description}</p>
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{t('course.progress')}</span>
                        <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
                <div>
                    <span className="text-sm text-muted-foreground">{enrollment.status}</span>
                </div>
                <Button variant="secondary" asChild>
                    <Link to={`/student/courses/${course?.id}/play`}>{t('course.continue')}</Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
