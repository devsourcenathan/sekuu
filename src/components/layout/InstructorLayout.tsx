import { Outlet } from 'react-router-dom';
import { type ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    ClipboardCheck,
    DollarSign,
    Plus,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

import { useTranslation } from 'react-i18next';

export function InstructorLayout({ children }: { children?: ReactNode }) {
    const { t } = useTranslation();

    const sidebarItems = [
        {
            title: t('sidebar.dashboard'),
            href: ROUTES.DASHBOARD,
            icon: LayoutDashboard,
        },
        {
            title: t('sidebar.myCourses'),
            href: ROUTES.MY_COURSES,
            icon: BookOpen,
        },
        {
            title: t('sidebar.createCourse'),
            href: ROUTES.INSTRUCTOR_CREATE_COURSE,
            icon: Plus,
        },
        {
            title: t('sidebar.students'),
            href: ROUTES.INSTRUCTOR_STUDENTS,
            icon: Users,
        },
        {
            title: t('sidebar.pendingGradings'),
            href: ROUTES.INSTRUCTOR_PENDING_GRADINGS,
            icon: ClipboardCheck,
        },
        {
            title: t('sidebar.revenue'),
            href: ROUTES.INSTRUCTOR_REVENUE,
            icon: DollarSign,
        },
    ];

    return (
        <DashboardLayout sidebarItems={sidebarItems}>
            {children || <Outlet />}
        </DashboardLayout>
    );
}