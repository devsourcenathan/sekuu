
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Circle,
    PlayCircle,
    FileText,
    Video,
    Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
    useEnrollmentDetails,
    useCompleteLesson,
    useUpdateLessonProgress,
} from '@/features/enrollments/hooks';
import ReactPlayer from 'react-player';
import { cn } from '@/lib/utils';
import type { ChapterWithProgress } from '@/features/enrollments/types/enrollment.types';

export function CoursePlayer() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
    // const [videoProgress, setVideoProgress] = useState(0);

    const { data: enrollment, isLoading } = useEnrollmentDetails(id || '');
    const { mutate: completeLesson } = useCompleteLesson(id || '');
    const { mutate: updateProgress } = useUpdateLessonProgress(id || '');

    // Sélectionner automatiquement la première leçon non complétée
    useEffect(() => {
        if (enrollment?.course?.chapters && !selectedChapterId && !selectedLessonId) {
            for (const chapter of enrollment.course.chapters) {
                if (chapter.lessons) {
                    const firstIncompleteLesson = chapter.lessons.find(l => !l.is_completed);
                    if (firstIncompleteLesson) {
                        setSelectedChapterId(chapter.id);
                        setSelectedLessonId(firstIncompleteLesson.id);
                        break;
                    }
                }
            }

            // Si aucune leçon incomplète, sélectionner la première leçon
            if (!selectedChapterId && enrollment.course.chapters[0]?.lessons?.[0]) {
                setSelectedChapterId(enrollment.course.chapters[0].id);
                setSelectedLessonId(enrollment.course.chapters[0].lessons[0].id);
            }
        }
    }, [enrollment, selectedChapterId, selectedLessonId]);

    const selectedChapter = enrollment?.course?.chapters?.find(
        c => c.id === selectedChapterId
    );

    const selectedLesson = selectedChapter?.lessons?.find(
        l => l.id === selectedLessonId
    );

    const handleLessonSelect = (chapterId: number, lessonId: number) => {
        setSelectedChapterId(chapterId);
        setSelectedLessonId(lessonId);
        // setVideoProgress(0);
    };

    const handleLessonComplete = () => {
        if (selectedChapterId && selectedLessonId) {
            completeLesson({
                chapterId: selectedChapterId,
                lessonId: selectedLessonId,
            });
        }
    };

    const handleVideoProgress = (state: any) => {
        const progress = (state.played * 100);
        // setVideoProgress(progress);

        // Mise à jour périodique de la progression
        if (selectedChapterId && selectedLessonId && progress > 0) {
            updateProgress({
                chapterId: selectedChapterId,
                lessonId: selectedLessonId,
                data: {
                    progress_percentage: Math.round(progress),
                    watch_time_seconds: Math.round(state.playedSeconds),
                },
            });
        }

        // Auto-complétion à 90%
        if (progress >= 90 && !selectedLesson?.is_completed) {
            handleLessonComplete();
        }
    };

    const getNextLesson = (): { chapterId: number; lessonId: number } | null => {
        if (!enrollment?.course?.chapters || !selectedChapterId || !selectedLessonId) {
            return null;
        }

        const chapters = enrollment.course.chapters;
        const currentChapterIndex = chapters.findIndex(c => c.id === selectedChapterId);
        const currentChapter = chapters[currentChapterIndex];

        if (!currentChapter?.lessons) return null;

        const currentLessonIndex = currentChapter.lessons.findIndex(
            l => l.id === selectedLessonId
        );

        // Leçon suivante dans le même chapitre
        if (currentLessonIndex < currentChapter.lessons.length - 1) {
            return {
                chapterId: selectedChapterId,
                lessonId: currentChapter.lessons[currentLessonIndex + 1].id,
            };
        }

        // Premier leçon du chapitre suivant
        if (currentChapterIndex < chapters.length - 1) {
            const nextChapter = chapters[currentChapterIndex + 1];
            if (nextChapter.lessons && nextChapter.lessons.length > 0) {
                return {
                    chapterId: nextChapter.id,
                    lessonId: nextChapter.lessons[0].id,
                };
            }
        }

        return null;
    };

    const goToNextLesson = () => {
        const next = getNextLesson();
        if (next) {
            handleLessonSelect(next.chapterId, next.lessonId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!enrollment) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Cours non trouvé</h2>
                    <Button onClick={() => navigate('/student/my-courses')}>
                        Retour à mes cours
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar - Curriculum */}
            <aside className="w-80 border-r bg-muted/10 flex flex-col">
                <div className="p-4 border-b">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mb-2"
                        onClick={() => navigate('/student/my-courses')}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Retour
                    </Button>
                    <h2 className="font-semibold line-clamp-2">
                        {enrollment.course?.title}
                    </h2>
                    <div className="mt-2">
                        <Progress value={enrollment.progress_percentage} />
                        <p className="text-xs text-muted-foreground mt-1">
                            {Math.round(enrollment.progress_percentage)}% complété
                        </p>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        {enrollment.course?.chapters?.map((chapter, chapterIndex) => (
                            <ChapterItem
                                key={chapter.id}
                                chapter={chapter}
                                chapterIndex={chapterIndex}
                                selectedLessonId={selectedLessonId}
                                onLessonSelect={handleLessonSelect}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {selectedLesson ? (
                    <>
                        {/* Video/Content Area */}
                        <div className="flex-1 bg-black flex items-center justify-center">
                            {selectedLesson.content_type === 'video' && selectedLesson.video_url ? (
                                <ReactPlayer
                                    src={selectedLesson.video_url}
                                    controls
                                    width="100%"
                                    height="100%"
                                    onProgress={handleVideoProgress}

                                />
                            ) : selectedLesson.content_type === 'text' ? (
                                <div className="w-full h-full bg-background overflow-auto">
                                    <div className="max-w-4xl mx-auto p-8">
                                        <div
                                            className="prose prose-lg max-w-none"
                                            dangerouslySetInnerHTML={{ __html: selectedLesson.content || '' }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-white text-center">
                                    <FileText className="h-16 w-16 mx-auto mb-4" />
                                    <p>Type de contenu: {selectedLesson.content_type}</p>
                                </div>
                            )}
                        </div>

                        {/* Lesson Info & Navigation */}
                        <div className="border-t bg-background">
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold">
                                            {selectedLesson.title}
                                        </h3>
                                        {selectedLesson.description && (
                                            <p className="text-muted-foreground mt-1">
                                                {selectedLesson.description}
                                            </p>
                                        )}
                                    </div>

                                    {!selectedLesson.is_completed && (
                                        <Button onClick={handleLessonComplete}>
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Marquer comme terminé
                                        </Button>
                                    )}
                                </div>

                                <Separator className="my-4" />

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        Leçon {selectedChapter?.lessons?.findIndex(l => l.id === selectedLessonId)! + 1}
                                        {' '}sur {selectedChapter?.lessons?.length}
                                    </div>

                                    <Button
                                        onClick={goToNextLesson}
                                        disabled={!getNextLesson()}
                                    >
                                        Leçon suivante
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                            <PlayCircle className="h-16 w-16 mx-auto mb-4" />
                            <p>Sélectionnez une leçon pour commencer</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

interface ChapterItemProps {
    chapter: ChapterWithProgress;
    chapterIndex: number;
    selectedLessonId: number | null;
    onLessonSelect: (chapterId: number, lessonId: number) => void;
}

function ChapterItem({
    chapter,
    chapterIndex,
    selectedLessonId,
    onLessonSelect,
}: ChapterItemProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left"
            >
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                            {chapterIndex + 1}. {chapter.title}
                        </span>
                    </div>
                    {chapter.progress_percentage !== undefined && (
                        <span className="text-xs text-muted-foreground">
                            {Math.round(chapter.progress_percentage)}%
                        </span>
                    )}
                </div>
            </button>

            {isExpanded && chapter.lessons && (
                <div className="ml-4 mt-2 space-y-1">
                    {chapter.lessons.map((lesson, lessonIndex) => (
                        <button
                            key={lesson.id}
                            onClick={() => onLessonSelect(chapter.id, lesson.id)}
                            className={cn(
                                'w-full text-left p-2 rounded-lg hover:bg-muted transition-colors',
                                selectedLessonId === lesson.id && 'bg-muted'
                            )}
                        >
                            <div className="flex items-center gap-2">
                                {lesson.is_completed ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                ) : lesson.is_free ? (
                                    <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                ) : (
                                    <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate">
                                        {lessonIndex + 1}. {lesson.title}
                                    </p>
                                    {lesson.duration_minutes && (
                                        <p className="text-xs text-muted-foreground">
                                            {lesson.duration_minutes} min
                                        </p>
                                    )}
                                </div>

                                {lesson.content_type === 'video' && (
                                    <Video className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}