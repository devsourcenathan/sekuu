import { CourseCard } from './CourseCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { BookOpen } from 'lucide-react';
import type { Course } from '@/types';

interface CourseListProps {
    courses: Course[];
    showInstructor?: boolean;
}

export function CourseList({ courses, showInstructor = true }: CourseListProps) {
    if (courses.length === 0) {
        return (
            <EmptyState
                icon={BookOpen}
                title="Aucun cours trouvé"
                description="Essayez de modifier vos filtres de recherche"
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <CourseCard
                    key={course.id}
                    course={course}
                    showInstructor={showInstructor}
                />
            ))}
        </div>
    );
}