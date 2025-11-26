import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Settings } from 'lucide-react';
import { useMyCourses } from '@/features/courses/hooks';
import { useAddCourseToPack, useRemoveCourseFromPack, usePack, useUpdatePackCourseConfig } from '../hooks/usePacks';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { PackResourceConfigurator } from './PackResourceConfigurator';
import type { PackAccessConfig, CourseWithPivot } from '@/types';

interface PackCoursesProps {
    packId: number;
}

export function PackCourses({ packId }: PackCoursesProps) {
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [configDialogOpen, setConfigDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<CourseWithPivot | null>(null);
    const { data: pack } = usePack(packId);
    const { data: instructorCourses } = useMyCourses();
    const addCourse = useAddCourseToPack();
    const removeCourse = useRemoveCourseFromPack();
    const updateConfig = useUpdatePackCourseConfig();

    const packCourseIds = pack?.courses?.map((c: any) => c.id) || [];
    const availableCourses = instructorCourses?.filter(
        (c: any) => !packCourseIds.includes(c.id)
    ) || [];

    const handleAddCourse = async () => {
        if (!selectedCourseId) {
            toast.error('Please select a course');
            return;
        }

        try {
            await addCourse.mutateAsync({
                packId,
                data: {
                    course_id: parseInt(selectedCourseId),
                    is_required: true,
                },
            });
            setSelectedCourseId('');
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleRemoveCourse = async (courseId: number) => {
        try {
            await removeCourse.mutateAsync({ packId, courseId });
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleConfigureCourse = (course: CourseWithPivot) => {
        setSelectedCourse(course);
        setConfigDialogOpen(true);
    };

    const handleSaveConfig = async (config: PackAccessConfig) => {
        if (!selectedCourse) return;

        try {
            await updateConfig.mutateAsync({
                packId,
                courseId: selectedCourse.id,
                data: { access_config: config },
            });
            setConfigDialogOpen(false);
            setSelectedCourse(null);
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add Courses to Pack</CardTitle>
                    <CardDescription>
                        Select courses from your library to include in this pack
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableCourses.map((course) => (
                                    <SelectItem key={course.id} value={course.id.toString()}>
                                        {course.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={handleAddCourse}
                            disabled={!selectedCourseId || addCourse.isPending}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Course
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Included Courses ({pack?.courses?.length || 0})</CardTitle>
                    <CardDescription>
                        Courses currently included in this pack
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {pack?.courses && pack.courses.length > 0 ? (
                        <div className="space-y-2">
                            {pack.courses.map((course: any) => (
                                <div
                                    key={course.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-medium">{course.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {course.level} • {course.lessons_count || 0} lessons
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {course.pivot?.is_required && (
                                            <Badge variant="secondary">Required</Badge>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleConfigureCourse(course)}
                                        >
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveCourse(course.id)}
                                            disabled={removeCourse.isPending}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            No courses added yet. Add courses to get started.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Resource Configuration Dialog */}
            <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Configure Course Resources</DialogTitle>
                        <DialogDescription>
                            Select which resources students can access from this course
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCourse && (
                        <PackResourceConfigurator
                            course={selectedCourse}
                            initialConfig={selectedCourse.pivot?.access_config}
                            onSave={handleSaveConfig}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

