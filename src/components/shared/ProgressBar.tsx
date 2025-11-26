import { cn } from '@/lib/utils';

interface ProgressBarProps {
    value: number;
    max?: number;
    className?: string;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
    value,
    max = 100,
    className,
    showLabel = false,
    size = 'md',
}: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);

    const sizeClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    return (
        <div className="space-y-1">
            <div
                className={cn(
                    'w-full overflow-hidden rounded-full bg-secondary',
                    sizeClasses[size],
                    className
                )}
            >
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <p className="text-xs text-muted-foreground">
                    {Math.round(percentage)}% complété
                </p>
            )}
        </div>
    );
}