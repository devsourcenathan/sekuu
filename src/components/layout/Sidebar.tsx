import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type LucideIcon } from 'lucide-react';

export interface SidebarNavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    disabled?: boolean;
}

interface SidebarProps {
    items: SidebarNavItem[];
    isOpen: boolean;
}

export function Sidebar({ items, isOpen }: SidebarProps) {
    const location = useLocation();

    return (
        <aside
            className={cn(
                'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-card transition-all duration-300 ease-in-out',
                isOpen ? 'translate-x-0' : '-translate-x-full'
            )}
        >
            <ScrollArea className="h-full py-4">
                <nav className="space-y-0.5 px-3">
                    {Array.isArray(items) && items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;

                        return (
                            <Button
                                key={item.href}
                                asChild
                                variant={isActive ? 'secondary' : 'ghost'}
                                className={cn(
                                    'w-full justify-start cursor-pointer h-10 rounded-md transition-colors',
                                    isActive && 'bg-secondary font-medium',
                                    !isActive && 'hover:bg-accent/50',
                                    item.disabled && 'cursor-not-allowed opacity-50'
                                )}
                                disabled={item.disabled}
                            >
                                <Link to={item.href} className="flex items-center w-full">
                                    {Icon && <Icon className="mr-3 h-4 w-4" />}
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </Button>
                        );
                    })}
                </nav>
            </ScrollArea>
        </aside>
    );
}