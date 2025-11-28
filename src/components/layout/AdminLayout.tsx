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
    Package,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

import { useTranslation } from 'react-i18next';

export function AdminLayout({ children }: { children?: ReactNode }) {
    const { t } = useTranslation();

    const adminSidebarGroups = [
        {
            title: t('sidebar.groupsItems.overview'), // "Vue d'ensemble"
            items: [
                {
                    title: t('sidebar.dashboard'),
                    href: ROUTES.DASHBOARD,
                    icon: LayoutDashboard,
                    permission: 'analytics.view',
                },
            ]
        },
        {
            title: t('sidebar.groupsItems.userManagement'), // "Gestion des utilisateurs"
            items: [
                {
                    title: t('sidebar.users'),
                    href: ROUTES.ADMIN_USERS,
                    icon: Users,
                    permission: 'users.view',
                },
                {
                    title: t('sidebar.roles'),
                    href: ROUTES.ADMIN_ROLES,
                    icon: Shield,
                    permission: 'roles.manage',
                },
            ]
        },
        {
            title: t('sidebar.groupsItems.contentManagement'), // "Gestion du contenu"
            items: [
                {
                    title: t('sidebar.courses'),
                    href: ROUTES.ADMIN_COURSES,
                    icon: BookOpen,
                    permission: 'courses.view',
                },
                {
                    title: t('sidebar.packs'),
                    href: ROUTES.ADMIN_PACKS,
                    icon: Package,
                    permission: 'packs.view',
                },
            ]
        },
        {
            title: t('sidebar.groupsItems.finance'), // "Finance"
            items: [
                {
                    title: t('sidebar.payments'),
                    href: ROUTES.ADMIN_PAYMENTS,
                    icon: CreditCard,
                    permission: 'payments.view',
                },
            ]
        },
        {
            title: t('sidebar.groupsItems.system'), // "Système"
            items: [
                {
                    title: t('sidebar.settings'),
                    href: ROUTES.SETTINGS,
                    icon: Settings,
                },
            ]
        },
    ];

    return (
        <DashboardLayout sidebarGroups={adminSidebarGroups}>
            {children || <Outlet />}
        </DashboardLayout>
    );
}