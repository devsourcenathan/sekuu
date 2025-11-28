import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type LucideIcon } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

export interface SidebarNavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    disabled?: boolean;
    permission?: string | string[]; // Required permission(s) to view this item
}

export interface SidebarNavGroup {
    title?: string;
    items: SidebarNavItem[];
}

interface SidebarProps {
    groups: SidebarNavGroup[];
    isOpen: boolean;
}

export function Sidebar({ groups, isOpen }: SidebarProps) {
    const location = useLocation();
    const { hasPermission } = usePermissions();

    // Filter items based on permissions
    const filteredGroups = groups.map(group => ({
        ...group,
        items: group.items.filter(item =>
            !item.permission || hasPermission(item.permission)
        )
    })).filter(group => group.items.length > 0); // Remove empty groups

    return (
        <aside
            className={cn(
                'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-card transition-all duration-300 ease-in-out',
                isOpen ? 'translate-x-0' : '-translate-x-full'
            )}
        >
            <ScrollArea className="h-full py-4">
                <nav className="space-y-4 px-3">
                    {Array.isArray(filteredGroups) && filteredGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-0.5">
                            {/* Affiche le titre du groupe si présent */}
                            {group.title && (
                                <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {group.title}
                                </h4>
                            )}

                            {/* Items du groupe */}
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
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
                            </div>
                        </div>
                    ))}
                </nav>
            </ScrollArea>
        </aside>
    );
}