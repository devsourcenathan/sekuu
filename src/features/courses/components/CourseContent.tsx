import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronRight, Plus, GripVertical, Edit, Trash2, ListChecks } from 'lucide-react';
import { useChapters, useDeleteChapter } from '../hooks/useChapters';
import { useLessons, useDeleteLesson } from '../hooks/useLessons';
import { ChapterForm } from './ChapterForm';
import { LessonForm } from './LessonForm';
import { TestBuilder } from '@/features/tests/components/TestBuilder';
import { TestItem } from '@/features/tests/components/TestItem';
import { useTestsByCourse, useTestsByChapter, useTestsByLesson } from '@/features/tests/hooks/useTests';
import { testsApi } from '@/features/tests/api/testsApi';
import type { Chapter, Lesson } from '@/types';
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

interface CourseContentProps {
    courseId: number;
}

export function CourseContent({ courseId }: CourseContentProps) {
    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
    const [chapterFormOpen, setChapterFormOpen] = useState(false);
    const [lessonFormOpen, setLessonFormOpen] = useState(false);
    const [testBuilderOpen, setTestBuilderOpen] = useState(false);
    const [testBuilderContext, setTestBuilderContext] = useState<{ id: number; type: string } | null>(null);
    const [editingChapter, setEditingChapter] = useState<Chapter | undefined>();
    const [editingLesson, setEditingLesson] = useState<Lesson | undefined>();
    const [activeChapterId, setActiveChapterId] = useState<number | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        type: 'chapter' | 'lesson' | 'test';
        id: number;
    } | null>(null);

    const { data: chapters = [], isLoading } = useChapters(courseId);
    const { data: courseTests = [] } = useTestsByCourse(courseId);
    const queryClient = useQueryClient();

    const deleteChapter = useDeleteChapter();
    const deleteLesson = useDeleteLesson();

    const toggleChapter = (chapterId: number) => {
        const newExpanded = new Set(expandedChapters);
        if (newExpanded.has(chapterId)) {
            newExpanded.delete(chapterId);
        } else {
            newExpanded.add(chapterId);
        }
        setExpandedChapters(newExpanded);
    };

    const handleAddChapter = () => {
        setEditingChapter(undefined);
        setChapterFormOpen(true);
    };

    const handleEditChapter = (chapter: Chapter) => {
        setEditingChapter(chapter);
        setChapterFormOpen(true);
    };

    const handleDeleteChapter = async (chapterId: number) => {
        try {
            await deleteChapter.mutateAsync({ courseId, chapterId });
            setDeleteDialog(null);
        } catch (error) {
            // Error toast is handled by the hook
        }
    };

    const handleAddLesson = (chapterId: number) => {
        setActiveChapterId(chapterId);
        setEditingLesson(undefined);
        setLessonFormOpen(true);
    };

    const handleEditLesson = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setLessonFormOpen(true);
    };

    const handleDeleteLesson = async (lessonId: number) => {
        try {
            await deleteLesson.mutateAsync(lessonId);
            setDeleteDialog(null);
        } catch (error) {
            // Error toast is handled by the hook
        }
    };

    const handleDeleteTest = async (testId: number) => {
        try {
            await testsApi.deleteTest(testId);
            setDeleteDialog(null);
            // Invalidate all test queries
            queryClient.invalidateQueries({ queryKey: ['tests'] });
        } catch (error) {
            console.error('Failed to delete test:', error);
        }
    };

    if (isLoading) {
        return <div className="text-center py-8">Loading course content...</div>;
    }

    return (
        <div className="space-y-4">
            {/* Course Tests Section */}
            {courseTests.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">Course Tests</h3>
                    {courseTests.map((test) => (
                        <TestItem
                            key={test.id}
                            test={test}
                            onDelete={() => setDeleteDialog({ open: true, type: 'test', id: test.id })}
                        />
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Course Structure</h3>
                <Button onClick={handleAddChapter} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Chapter
                </Button>
            </div>

            {chapters.length === 0 ? (
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground mb-4">
                            No chapters yet. Add your first chapter to get started.
                        </p>
                        <Button onClick={handleAddChapter}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Chapter
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {chapters.map((chapter, index) => (
                        <ChapterItem
                            key={chapter.id}
                            chapter={chapter}
                            index={index}
                            expanded={expandedChapters.has(chapter.id)}
                            onToggle={() => toggleChapter(chapter.id)}
                            onEdit={() => handleEditChapter(chapter)}
                            onDelete={() =>
                                setDeleteDialog({ open: true, type: 'chapter', id: chapter.id })
                            }
                            onAddLesson={() => handleAddLesson(chapter.id)}
                            onEditLesson={handleEditLesson}
                            onDeleteLesson={(lessonId) =>
                                setDeleteDialog({ open: true, type: 'lesson', id: lessonId })
                            }
                            onAddTest={() => {
                                setTestBuilderContext({ id: chapter.id, type: 'App\\Models\\Chapter' });
                                setTestBuilderOpen(true);
                            }}
                            onAddLessonTest={(lessonId) => {
                                setTestBuilderContext({ id: lessonId, type: 'App\\Models\\Lesson' });
                                setTestBuilderOpen(true);
                            }}
                            onDeleteTest={(testId) =>
                                setDeleteDialog({ open: true, type: 'test', id: testId })
                            }
                        />
                    ))}
                </div>
            )}

            {/* Chapter Form Dialog */}
            <ChapterForm
                chapter={editingChapter}
                courseId={courseId}
                open={chapterFormOpen}
                onOpenChange={setChapterFormOpen}
            />

            {/* Lesson Form Dialog */}
            {activeChapterId && (
                <LessonForm
                    lesson={editingLesson}
                    chapterId={activeChapterId}
                    open={lessonFormOpen}
                    onOpenChange={setLessonFormOpen}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialog?.open || false}
                onOpenChange={() => setDeleteDialog(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this {deleteDialog?.type}.
                            {deleteDialog?.type === 'chapter' &&
                                ' All lessons in this chapter will also be deleted.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteDialog) {
                                    if (deleteDialog.type === 'chapter') {
                                        handleDeleteChapter(deleteDialog.id);
                                    } else if (deleteDialog.type === 'lesson') {
                                        handleDeleteLesson(deleteDialog.id);
                                    } else if (deleteDialog.type === 'test') {
                                        handleDeleteTest(deleteDialog.id);
                                    }
                                }
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                                queryClient.invalidateQueries({ queryKey: ['chapters', courseId] });
                                queryClient.invalidateQueries({ queryKey: ['lessons'] });
                                queryClient.invalidateQueries({ queryKey: ['tests'] });
                            }}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}

// Chapter Item Component
interface ChapterItemProps {
    chapter: Chapter;
    index: number;
    expanded: boolean;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onAddLesson: () => void;
    onEditLesson: (lesson: Lesson) => void;
    onDeleteLesson: (lessonId: number) => void;
    onAddTest: () => void;
    onAddLessonTest: (lessonId: number) => void;
    onDeleteTest: (testId: number) => void;
}

function ChapterItem({
    chapter,
    index,
    expanded,
    onToggle,
    onEdit,
    onDelete,
    onAddLesson,
    onEditLesson,
    onDeleteLesson,
    onAddTest,
    onAddLessonTest,
    onDeleteTest,
}: ChapterItemProps) {
    const { data: lessons = [] } = useLessons(chapter.id);
    const { data: chapterTests = [] } = useTestsByChapter(chapter.id);

    return (
        <Card>
            <div className="flex items-center gap-2 p-4">
                {/* Drag Handle */}
                <button className="cursor-move text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-4 w-4" />
                </button>

                {/* Expand/Collapse */}
                <Button variant="ghost" size="sm" onClick={onToggle} className="p-0 h-auto">
                    {expanded ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>

                {/* Chapter Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">
                            Chapter {index + 1}: {chapter.title}
                        </span>
                        {chapter.is_free && (
                            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                                Free
                            </span>
                        )}
                        {!chapter.is_published && (
                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded">
                                Draft
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">{lessons.length} lessons</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={onAddTest} title="Add Test">
                        <ListChecks className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onEdit}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Lessons and Tests */}
            {expanded && (
                <div className="border-t p-4 pl-12 space-y-2 bg-muted/30">
                    {/* Lessons */}
                    {lessons.map((lesson, lessonIndex) => (
                        <LessonItem
                            key={lesson.id}
                            lesson={lesson}
                            lessonIndex={lessonIndex}
                            onEdit={() => onEditLesson(lesson)}
                            onDelete={() => onDeleteLesson(lesson.id)}
                            onAddTest={() => onAddLessonTest(lesson.id)}
                        />
                    ))}

                    {/* Chapter Tests */}
                    {chapterTests.length > 0 && (
                        <div className="space-y-2 mt-4">
                            <h4 className="text-xs font-semibold text-muted-foreground">Chapter Tests</h4>
                            {chapterTests.map((test) => (
                                <TestItem
                                    key={test.id}
                                    test={test}
                                    onDelete={() => onDeleteTest(test.id)}
                                />
                            ))}
                        </div>
                    )}

                    <Button variant="outline" size="sm" onClick={onAddLesson} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lesson
                    </Button>
                </div>
            )}
        </Card>
    );
}

// Lesson Item Component
interface LessonItemProps {
    lesson: Lesson;
    lessonIndex: number;
    onEdit: () => void;
    onDelete: () => void;
    onAddTest: () => void;
}

function LessonItem({ lesson, lessonIndex, onEdit, onDelete, onAddTest }: LessonItemProps) {
    const { data: lessonTests = [] } = useTestsByLesson(lesson.id);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded hover:bg-accent">
                <button className="cursor-move text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-4 w-4" />
                </button>
                <div className="flex-1">
                    <p className="text-sm font-medium">
                        Lesson {lessonIndex + 1}: {lesson.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {lesson.content_type} • {lesson.duration_minutes || 0} min
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        title="Add Test"
                        onClick={onAddTest}
                    >
                        <ListChecks className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Lesson Tests */}
            {lessonTests.length > 0 && (
                <div className="pl-8 space-y-2">
                    <h5 className="text-xs font-semibold text-muted-foreground">Lesson Tests</h5>
                    {lessonTests.map((test) => (
                        <TestItem
                            key={test.id}
                            test={test}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
