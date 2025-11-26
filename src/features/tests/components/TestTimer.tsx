import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestTimerProps {
    durationMinutes: number;
    onTimeUp: () => void;
    className?: string;
}

export const TestTimer: React.FC<TestTimerProps> = ({
    durationMinutes,
    onTimeUp,
    className,
}) => {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const isWarning = timeLeft < 300; // Less than 5 minutes
    const isCritical = timeLeft < 60; // Less than 1 minute

    return (
        <div
            className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md font-mono text-lg font-bold border transition-colors',
                isCritical
                    ? 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                    : isWarning
                        ? 'bg-yellow-100 text-yellow-600 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
                        : 'bg-secondary text-secondary-foreground border-transparent',
                className
            )}
        >
            <Clock className="w-5 h-5" />
            <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </div>
    );
};