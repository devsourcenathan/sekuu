import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Course, PackAccessConfig } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PackResourceConfiguratorProps {
    course: Course;
    initialConfig?: PackAccessConfig;
    onSave: (config: PackAccessConfig) => void;
}

export function PackResourceConfigurator({
    course,
    initialConfig,
    onSave,
}: PackResourceConfiguratorProps) {
    const [config, setConfig] = useState<PackAccessConfig>(
        initialConfig || {
            include_chapters: null,
            include_lessons: null,
            include_tests: true,
            include_resources: true,
            allow_download: true,
            include_certificate: true,
        }
    );

    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());

    const toggleChapter = (chapterId: number) => {
        setExpandedChapters((prev) => {
            const next = new Set(prev);
            if (next.has(chapterId)) {
                next.delete(chapterId);
            } else {
                next.add(chapterId);
            }
            return next;
        });
    };

    const handleChapterToggle = (chapterId: number, checked: boolean) => {
        setConfig((prev) => {
            const chapters = prev.include_chapters || [];
            if (checked) {
                return {
                    ...prev,
                    include_chapters: [...chapters, chapterId],
                };
            } else {
                return {
                    ...prev,
                    include_chapters: chapters.filter((id) => id !== chapterId),
                };
            }
        });
    };

    const handleLessonToggle = (lessonId: number, checked: boolean) => {
        setConfig((prev) => {
            const lessons = prev.include_lessons || [];
            if (checked) {
                return {
                    ...prev,
                    include_lessons: [...lessons, lessonId],
                };
            } else {
                return {
                    ...prev,
                    include_lessons: lessons.filter((id) => id !== lessonId),
                };
            }
        });
    };

    const selectAllChapters = () => {
        const allChapterIds = course.chapters?.map((c: any) => c.id) || [];
        setConfig((prev) => ({
            ...prev,
            include_chapters: allChapterIds,
        }));
    };

    const deselectAllChapters = () => {
        setConfig((prev) => ({
            ...prev,
            include_chapters: [],
        }));
    };

    return (
        <Card className="border-0 shadow-none">
            <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>
                    Configure which resources students can access from this course
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 ">
                {/* Global Settings */}
                <div className="space-y-4">
                    <h4 className="font-semibold">Global Settings</h4>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Include Tests</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow access to course tests
                            </p>
                        </div>
                        <Switch
                            checked={config.include_tests}
                            onCheckedChange={(checked) =>
                                setConfig((prev) => ({ ...prev, include_tests: checked }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Include Resources</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow access to downloadable resources
                            </p>
                        </div>
                        <Switch
                            checked={config.include_resources}
                            onCheckedChange={(checked) =>
                                setConfig((prev) => ({ ...prev, include_resources: checked }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Allow Downloads</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow students to download content
                            </p>
                        </div>
                        <Switch
                            checked={config.allow_download}
                            onCheckedChange={(checked) =>
                                setConfig((prev) => ({ ...prev, allow_download: checked }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Include Certificate</Label>
                            <p className="text-sm text-muted-foreground">
                                Award course certificate upon completion
                            </p>
                        </div>
                        <Switch
                            checked={config.include_certificate}
                            onCheckedChange={(checked) =>
                                setConfig((prev) => ({ ...prev, include_certificate: checked }))
                            }
                        />
                    </div>
                </div>

                <Separator />

                {/* Chapters and Lessons */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Chapters & Lessons</h4>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={selectAllChapters}
                            >
                                Select All
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={deselectAllChapters}
                            >
                                Deselect All
                            </Button>
                        </div>
                    </div>

                    {course.chapters && course.chapters.length > 0 ? (
                        <div className="space-y-2">
                            {course.chapters.map((chapter: any) => {
                                const isExpanded = expandedChapters.has(chapter.id);
                                const isChapterSelected = config.include_chapters?.includes(chapter.id);

                                return (
                                    <div key={chapter.id} className="border rounded-lg p-3">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                onClick={() => toggleChapter(chapter.id)}
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Checkbox
                                                checked={isChapterSelected}
                                                onCheckedChange={(checked) =>
                                                    handleChapterToggle(chapter.id, checked as boolean)
                                                }
                                            />
                                            <Label className="flex-1 cursor-pointer">
                                                {chapter.title}
                                            </Label>
                                            <Badge variant="secondary">
                                                {chapter.lessons_count || 0} lessons
                                            </Badge>
                                        </div>

                                        {isExpanded && chapter.lessons && (
                                            <div className="ml-8 mt-2 space-y-2">
                                                {chapter.lessons.map((lesson: any) => {
                                                    const isLessonSelected = config.include_lessons?.includes(lesson.id);

                                                    return (
                                                        <div
                                                            key={lesson.id}
                                                            className="flex items-center gap-2 py-1"
                                                        >
                                                            <Checkbox
                                                                checked={isLessonSelected}
                                                                onCheckedChange={(checked) =>
                                                                    handleLessonToggle(lesson.id, checked as boolean)
                                                                }
                                                            />
                                                            <Label className="text-sm cursor-pointer">
                                                                {lesson.title}
                                                            </Label>
                                                            <Badge variant="outline" className="text-xs">
                                                                {lesson.content_type}
                                                            </Badge>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No chapters available for this course
                        </p>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={() => onSave(config)}>
                        Save Configuration
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
