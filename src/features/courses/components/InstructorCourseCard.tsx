import { type Course } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Eye, Users, DollarSign, TrendingUp, ListChecks } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

interface InstructorCourseCardProps {
    course: Course;
    onEdit: (course: Course) => void;
    onDelete: (course: Course) => void;
    onView: (course: Course) => void;
    onTogglePublish: (course: Course) => void;
    onAddTest: (course: Course) => void;
}

export function InstructorCourseCard({
    course,
    onEdit,
    onDelete,
    onView,
    onTogglePublish,
    onAddTest,
}: InstructorCourseCardProps) {
    const getStatusBadge = () => {
        switch (course.status) {
            case 'published':
                return <Badge variant="default">Published</Badge>;
            case 'draft':
                return <Badge variant="secondary">Draft</Badge>;
            case 'archived':
                return <Badge variant="outline">Archived</Badge>;
            default:
                return null;
        }
    };

    const coverImage = course.cover_image || '/placeholder-course.jpg';

    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
            {/* Cover Image */}
            <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                    src={coverImage}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                    {getStatusBadge()}
                </div>

                {/* Stats Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-8">
                    <div className="text-center text-white">
                        <Users className="h-5 w-5 mx-auto mb-1" />
                        <p className="text-sm font-medium">{course.enrollments_count || 0}</p>
                        <p className="text-xs text-white/80">Students</p>
                    </div>
                    <div className="text-center text-white">
                        <DollarSign className="h-5 w-5 mx-auto mb-1" />
                        <p className="text-sm font-medium">
                            {course.total_revenue ? formatCurrency(course.total_revenue) : '$0'}
                        </p>
                        <p className="text-xs text-white/80">Revenue</p>
                    </div>
                    <div className="text-center text-white">
                        <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                        <p className="text-sm font-medium">{course.completion_rate || 0}%</p>
                        <p className="text-xs text-white/80">Completion</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold line-clamp-2 mb-1">
                            {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {course.description}
                        </p>
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(course)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onView(course)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAddTest(course)}>
                                <ListChecks className="mr-2 h-4 w-4" />
                                Add Test
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onTogglePublish(course)}
                                className="cursor-pointer"
                            >
                                {course.status === 'published' ? 'Unpublish' : 'Publish'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(course)}
                                className="text-destructive focus:text-destructive cursor-pointer"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                            {course.chapters_count || 0} chapters
                        </span>
                        <span className="text-muted-foreground">
                            {course.lessons_count || 0} lessons
                        </span>
                    </div>
                    <span className="font-semibold">
                        {course.is_free ? 'Free' : formatCurrency(course.price || 0)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
