import { CourseCard } from "./CourseCard"
import { type Course } from "@/types"

interface Props {
    courses: Course[]
}

export const CourseList = ({ courses }: Props) => {
    if (courses.length === 0) {
        return <p className="text-center text-muted-foreground">Aucun cours trouvé.</p>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    )
}
