import { useState } from 'react';
import { type Course } from '@/types';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseForm } from './CourseForm';
import { CourseContent } from './CourseContent';
import { useCreateCourse } from '../hooks/useCreateCourse';
import { useUpdateCourse } from '../hooks/useUpdateCourse';
import { toast } from 'sonner';
import type { CreateCourseData } from '../types/course.types';

interface CourseDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course?: Course;
}

export function CourseDrawer({ open, onOpenChange, course }: CourseDrawerProps) {
    const [activeTab, setActiveTab] = useState('info');
    const [createdCourse, setCreatedCourse] = useState<Course | undefined>();
    const createCourse = useCreateCourse();
    const updateCourse = useUpdateCourse();

    const isEdit = !!course;
    const currentCourse = course || createdCourse;

    const handleSubmit = async (data: CreateCourseData) => {
        try {
            if (isEdit) {
                await updateCourse.mutateAsync({ id: course.id.toString(), data });
                toast.success('Course updated successfully');
            } else {
                const newCourse = await createCourse.mutateAsync(data);
                setCreatedCourse(newCourse);
                toast.success('Course created successfully');
                // Switch to content tab after creating course to add chapters/lessons
                if (newCourse) {
                    setActiveTab('content');
                }
            }
        } catch (error) {
            toast.error(isEdit ? 'Failed to update course' : 'Failed to create course');
            throw error;
        }
    };

    const handleClose = () => {
        setActiveTab('info');
        setCreatedCourse(undefined);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto p-4">
                <SheetHeader>
                    <SheetTitle>{isEdit ? 'Edit Course' : 'Create New Course'}</SheetTitle>
                    <SheetDescription>
                        {isEdit
                            ? 'Update your course information and content'
                            : 'Fill in the details to create a new course'}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="info">Course Information</TabsTrigger>
                            <TabsTrigger value="content" disabled={!currentCourse}>
                                Content & Structure
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="info" className="mt-6">
                            <CourseForm
                                initialData={course}
                                onSubmit={handleSubmit}
                                isSubmitting={createCourse.isPending || updateCourse.isPending}
                            />
                        </TabsContent>

                        <TabsContent value="content" className="mt-6">
                            {currentCourse && (
                                <CourseContent courseId={currentCourse.id} />
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </SheetContent>
        </Sheet>
    );
}
