import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Grid3x3, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useMyCourses } from '@/features/courses/hooks/useMyCourses';
import { useDeleteCourse } from '@/features/courses/hooks/useDeleteCourse';
import { usePublishCourse } from '@/features/courses/hooks/usePublishCourse';
import { InstructorCourseCard } from '@/features/courses/components/InstructorCourseCard';
import { CourseDrawer } from '@/features/courses/components/CourseDrawer';
import { TestBuilder } from '@/features/tests/components/TestBuilder';
import type { Course } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export function InstructorCourses() {
    console.log("instructor view");

    const { t } = useTranslation();
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [testBuilderOpen, setTestBuilderOpen] = useState(false);
    const [testBuilderContext, setTestBuilderContext] = useState<{ id: number; type: string } | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; course: Course | null }>({
        open: false,
        course: null,
    });

    const { data: courses = [], isLoading } = useMyCourses();
    const deleteCourse = useDeleteCourse();
    const publishCourse = usePublishCourse();
    const queryClient = useQueryClient();


    // Filter courses
    const filteredCourses = Array.isArray(courses) ? courses.filter((course) => {
        const matchesSearch =
            search === '' ||
            course.title.toLowerCase().includes(search.toLowerCase()) ||
            course.description?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || course.status === statusFilter;

        return matchesSearch && matchesStatus;
    }) : [];

    const handleCreateCourse = () => {
        setSelectedCourse(undefined);
        setDrawerOpen(true);
    };

    const handleEditCourse = (course: Course) => {
        setSelectedCourse(course);
        setDrawerOpen(true);
    };

    const handleDeleteCourse = async (course: Course) => {
        try {
            await deleteCourse.mutateAsync(course.id);
            toast.success('Course deleted successfully');
            setDeleteDialog({ open: false, course: null });
        } catch (error) {
            toast.error('Failed to delete course');
        }
    };

    const handleTogglePublish = async (course: Course) => {
        try {
            await publishCourse.mutateAsync(course.id);
            const newStatus = course.status === 'published' ? 'draft' : 'published';
            toast.success(
                newStatus === 'published'
                    ? 'Course published successfully'
                    : 'Course unpublished'
            );
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update course status');
        }
    };

    const handleViewCourse = (course: Course) => {
        // Navigate to course detail page
        window.open(`/courses/${course.slug}`, '_blank');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('header.myCourses')}</h1>
                    <p className="text-muted-foreground">
                        Manage your courses and track their performance
                    </p>
                </div>
                <Button onClick={handleCreateCourse}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                </Button>
            </div>

            {/* Filters and View Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-1 gap-4 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2">
                    <Button
                        variant={view === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setView('grid')}
                    >
                        <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={view === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setView('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Courses Grid/List */}
            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="aspect-video w-full" />
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : filteredCourses.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Grid3x3 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                            {search || statusFilter !== 'all'
                                ? 'No courses found'
                                : 'No courses yet'}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {search || statusFilter !== 'all'
                                ? 'Try adjusting your filters'
                                : "Get started by creating your first course"}
                        </p>
                        {!search && statusFilter === 'all' && (
                            <Button onClick={handleCreateCourse}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Course
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : view === 'grid' ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                        <InstructorCourseCard
                            key={course.id}
                            course={course}
                            onEdit={handleEditCourse}
                            onDelete={(course) => setDeleteDialog({ open: true, course })}
                            onView={handleViewCourse}
                            onTogglePublish={handleTogglePublish}
                            onAddTest={(course) => {
                                setTestBuilderContext({ id: course.id, type: 'App\\Models\\Course' });
                                setTestBuilderOpen(true);
                            }}
                        />
                    ))}
                </div>
            ) : (
                // List view - simpler table layout
                <div className="space-y-2">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="p-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={course.cover_image || '/placeholder-course.jpg'}
                                    alt={course.title}
                                    className="w-24 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{course.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {course.lessons_count || 0} lessons •{' '}
                                        {course.students_count || 0} students
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditCourse(course)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleTogglePublish(course)}
                                    >
                                        {course.status === 'published' ? 'Unpublish' : 'Publish'}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Course Drawer */}
            <CourseDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                course={selectedCourse}
            />

            {/* Test Builder Drawer */}
            <Sheet open={testBuilderOpen} onOpenChange={setTestBuilderOpen}>
                <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Add Test</SheetTitle>
                    </SheetHeader>
                    {testBuilderContext && (
                        <TestBuilder
                            testableId={testBuilderContext.id}
                            testableType={testBuilderContext.type}
                            onSuccess={() => {
                                setTestBuilderOpen(false);
                                queryClient.invalidateQueries({ queryKey: ['my-courses'] });
                            }}
                        />
                    )}
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, course: null })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Course</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deleteDialog.course?.title}"? This
                            action cannot be undone and will also delete all chapters, lessons, and
                            associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteDialog.course) {
                                    handleDeleteCourse(deleteDialog.course);
                                }
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteCourse.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Course'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}