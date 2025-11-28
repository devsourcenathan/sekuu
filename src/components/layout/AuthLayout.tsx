import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/lib/constants/routes';
import { BookOpen } from 'lucide-react';

export const AuthLayout = () => {
    const { isAuthenticated } = useAuthStore();

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side - Branding */}
            <div className="hidden md:flex md:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-8 w-8" />
                    <span className="text-2xl font-bold">Sekuu</span>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold leading-tight">
                        Learn at your own pace
                    </h1>
                    <p className="text-xl text-primary-foreground/80">
                        Access thousands of courses from expert instructors
                    </p>
                </div>

                <div className="text-sm text-primary-foreground/60">
                    © {new Date().getFullYear()} Sekuu. All rights reserved.
                </div>
            </div>

            {/* Right side - Auth forms */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="md:hidden mb-8 text-center">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <BookOpen className="h-8 w-8" />
                            <span className="text-2xl font-bold">Sekuu</span>
                        </div>
                    </div>

                    <Outlet />
                </div>
            </div>
        </div>
    );
};