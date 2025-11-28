import { Outlet } from 'react-router-dom';
import { type ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { LayoutDashboard, BookOpen, Award, CreditCard, Package, Library, Video, Calendar } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

import { useTranslation } from 'react-i18next';

export function StudentLayout({ children }: { children?: ReactNode }) {
    const { t } = useTranslation();

    const studentSidebarGroups = [
        {
            title: t('sidebar.groupsItems.overview'), // "Vue d'ensemble"
            items: [
                {
                    title: t('sidebar.dashboard'),
                    href: ROUTES.DASHBOARD,
                    icon: LayoutDashboard,
                },
            ]
        },
        {
            title: t('sidebar.groupsItems.learning'), // "Apprentissage"
            items: [
                {
                    title: t('sidebar.myCourses'),
                    href: ROUTES.MY_COURSES,
                    icon: BookOpen,
                },
                {
                    title: t('sidebar.myPacks'),
                    href: ROUTES.MY_PACKS,
                    icon: Package,
                },
                {
                    title: t('sidebar.browsePacks'),
                    href: ROUTES.PACKS,
                    icon: Library,
                },
            ]
        },
        {
            title: t('sidebar.groupsItems.sessions'), // "Sessions"
            items: [
                {
                    title: t('sidebar.mySessions'),
                    href: ROUTES.MY_SESSIONS,
                    icon: Video,
                },
                {
                    title: t('sidebar.requestMeeting'),
                    href: ROUTES.REQUEST_MEETING,
                    icon: Calendar,
                },
            ]
        },
        {
            title: t('sidebar.groupsItems.account'),
            items: [
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
            ]
        },
    ];

    return (
        <DashboardLayout sidebarGroups={studentSidebarGroups}>
            {children || <Outlet />}
        </DashboardLayout>
    );
}