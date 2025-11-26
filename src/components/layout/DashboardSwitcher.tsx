import { useAuthStore } from '@/store/authStore';
import { StudentDashboard } from '@/pages/student/Dashboard';
import { InstructorDashboard } from '@/pages/instructor/Dashboard';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';
import { StudentLayout } from './StudentLayout';
import { InstructorLayout } from './InstructorLayout';
import { AdminLayout } from './AdminLayout';

export const DashboardSwitcher = () => {
    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    const hasRole = (roleSlug: string) => {
        return user.roles.some((role) => role.slug === roleSlug);
    };

    if (hasRole('super_admin') || hasRole('admin')) {
        return (
            <AdminLayout>
                <AdminDashboard />
            </AdminLayout>
        );
    }

    if (hasRole('instructor')) {
        return (
            <InstructorLayout>
                <InstructorDashboard />
            </InstructorLayout>
        );
    }

    if (hasRole('student')) {
        return (
            <StudentLayout>
                <StudentDashboard />
            </StudentLayout>
        );
    }

    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
};
