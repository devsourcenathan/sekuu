import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type Course } from "@/types"
import { useTranslation } from 'react-i18next'

interface Props {
    course: Course
}

export const CourseCard = ({ course }: Props) => {
    const { t } = useTranslation();
    return (
        <Card className="overflow-hidden hover:shadow-lg transition">
            <img
                src={course.cover_image}
                alt={course.title}
                className="w-full h-40 object-cover"
            />

            <CardHeader>
                <h3 className="font-semibold text-lg">{course.title}</h3>
                {/* <p className="text-sm text-muted-foreground">{course.category}</p> */}
            </CardHeader>

            <CardContent>
                <p className="text-sm line-clamp-3">{course.description}</p>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
                <span className="font-bold">{course.price} €</span>
                <Button asChild>
                    <a href={`/courses/${course.id}`}>{t('course.view')}</a>
                </Button>
            </CardFooter>
        </Card>
    )
}
