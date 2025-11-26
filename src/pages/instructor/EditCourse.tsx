import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CourseForm } from '@/features/courses/components/CourseForm';
import { useUpdateCourse } from '@/features/courses/hooks/useUpdateCourse';
import { type CreateCourseData } from '@/features/courses/types/course.types';
import { Skeleton } from '@/components/ui/skeleton';
import { coursesApi } from '@/features/courses/api/coursesApi';
import { useQuery } from '@tanstack/react-query';

export function EditCourse() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();

    // Fetch course details
    const { data: course, isLoading } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => coursesApi.getCourseDetails(courseId!),
        enabled: !!courseId,
    });

    const handleSubmit = async (data: CreateCourseData) => {
        if (!courseId) return;
        updateCourse(
            { id: courseId, data },
            {
                onSuccess: () => {
                    navigate('/instructor/courses');
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-[600px] w-full" />
            </div>
        );
    }

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
                <p className="text-muted-foreground">
                    Update your course information.
                </p>
            </div>
            <CourseForm initialData={course} onSubmit={handleSubmit} isSubmitting={isUpdating} />
        </div>
    );
}