import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CourseForm } from '@/features/courses/components/CourseForm';
import { useCreateCourse } from '@/features/courses/hooks/useCreateCourse';
import { type CreateCourseData } from '@/features/courses/types/course.types';

export function CreateCourse() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutate: createCourse, isPending } = useCreateCourse();

    const handleSubmit = async (data: CreateCourseData) => {
        createCourse(data, {
            onSuccess: () => {
                navigate('/instructor/courses');
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
                <p className="text-muted-foreground">
                    Start building your new course by filling out the information below.
                </p>
            </div>
            <CourseForm onSubmit={handleSubmit} isSubmitting={isPending} />
        </div>
    );
}