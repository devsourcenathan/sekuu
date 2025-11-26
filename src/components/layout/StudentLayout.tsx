import { Outlet } from 'react-router-dom';
import { type ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { LayoutDashboard, BookOpen, Award, CreditCard } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

import { useTranslation } from 'react-i18next';

export function StudentLayout({ children }: { children?: ReactNode }) {
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
            title: t('sidebar.certificates'),
            href: ROUTES.STUDENT_CERTIFICATES,
            icon: Award,
        },
        {
            title: t('sidebar.payments'),
            href: ROUTES.STUDENT_PAYMENTS,
            icon: CreditCard,
        },
    ];

    return (
        <DashboardLayout sidebarItems={sidebarItems}>
            {children || <Outlet />}
        </DashboardLayout>
    );
}