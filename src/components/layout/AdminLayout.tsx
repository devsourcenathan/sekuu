import { Outlet } from 'react-router-dom';
import { type ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CreditCard,
    Settings,
    Shield,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

import { useTranslation } from 'react-i18next';

export function AdminLayout({ children }: { children?: ReactNode }) {
    const { t } = useTranslation();

    const sidebarItems = [
        {
            title: t('sidebar.dashboard'),
            href: ROUTES.DASHBOARD,
            icon: LayoutDashboard,
        },
        {
            title: t('sidebar.users'),
            href: ROUTES.ADMIN_USERS,
            icon: Users,
        },
        {
            title: t('sidebar.courses'),
            href: ROUTES.ADMIN_COURSES,
            icon: BookOpen,
        },
        {
            title: t('sidebar.payments'),
            href: ROUTES.ADMIN_PAYMENTS,
            icon: CreditCard,
        },
        {
            title: t('sidebar.roles'),
            href: ROUTES.ADMIN_ROLES,
            icon: Shield,
        },
        {
            title: t('sidebar.settings'),
            href: ROUTES.SETTINGS,
            icon: Settings,
        },
    ];

    return (
        <DashboardLayout sidebarItems={sidebarItems}>
            {children || <Outlet />}
        </DashboardLayout>
    );
}