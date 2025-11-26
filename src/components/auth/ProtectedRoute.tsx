import { Navigate, useLocation } from 'react-router-dom';
import { type UserRole } from '@/types';
import { ROUTES } from '@/lib/constants/routes';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuthStore();
    const location = useLocation();

    // if (isLoading) {
    //     return (
    //         <div className="flex h-screen items-center justify-center">
    //             <LoadingSpinner size="lg" />
    //         </div>
    //     );
    // }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    // if (allowedRoles && user && !allowedRoles.includes(user?.roles)) {
    //     return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    // }

    return <>{children}</>;
}