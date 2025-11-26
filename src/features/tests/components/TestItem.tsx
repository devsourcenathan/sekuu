import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, FileText } from 'lucide-react';
import type { TestWithQuestions } from '../types/test.types';

interface TestItemProps {
    test: TestWithQuestions;
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
}

export function TestItem({ test, onEdit, onDelete, onView }: TestItemProps) {
    const questionCount = test.questions?.length || 0;

    return (
        <Card className="p-3 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                </div>

                {/* Test Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium truncate">{test.title}</h4>
                        {!test.is_published && (
                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded">
                                Draft
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {questionCount} question{questionCount !== 1 ? 's' : ''} • {test.passing_score}% to pass
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    {onView && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onView}
                            title="View test"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    )}
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onEdit}
                            title="Edit test"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDelete}
                            title="Delete test"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
