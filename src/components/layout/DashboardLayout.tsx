import { type ReactNode } from 'react';
import { SidebarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/store/uiStore';
import { Sidebar, type SidebarNavGroup, type SidebarNavItem } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
    children: ReactNode;
    sidebarGroups: SidebarNavGroup[];
}

export function DashboardLayout({ children, sidebarGroups }: DashboardLayoutProps) {
    const { sidebarOpen, toggleSidebar } = useUiStore();

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <Sidebar groups={sidebarGroups} isOpen={sidebarOpen} />

            <div
                className={cn(
                    'transition-all duration-300 ease-in-out',
                    sidebarOpen ? 'md:pl-64' : 'md:pl-0'
                )}
            >
                <div className="container p-4 space-y-6">
                    <Button
                        variant="outline"
                        size="icon"
                        className="mb-2"
                        onClick={() => toggleSidebar()}
                    >
                        <SidebarIcon className="h-4 w-4" />
                    </Button>

                    {children}
                </div>
            </div>
        </div>
    );
}