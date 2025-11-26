import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    trend?: {
        value: string;
        isPositive?: boolean;
    };
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
    ...props
}: StatCardProps) {
    return (
        <Card className={cn('transition-all hover:shadow-md', className)} {...props}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <div className="flex items-center gap-2 mt-1">
                        {trend && (
                            <span
                                className={cn(
                                    'text-xs font-medium',
                                    trend.isPositive
                                        ? 'text-green-600 dark:text-green-500'
                                        : 'text-red-600 dark:text-red-500'
                                )}
                            >
                                {trend.value}
                            </span>
                        )}
                        {description && (
                            <p className="text-xs text-muted-foreground">{description}</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
