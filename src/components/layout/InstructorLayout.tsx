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
    Package,
    Video,
    UsersRound,
    Calendar,
    Settings,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

import { useTranslation } from 'react-i18next';

export function InstructorLayout({ children }: { children?: ReactNode }) {
    const { t } = useTranslation();

    const sidebarGroups = [
        {
            title: t('sidebar.groupsItems.overview'),
            items: [
                {
                    title: t('sidebar.dashboard'),
                    href: ROUTES.DASHBOARD,
                    icon: LayoutDashboard,
                },
            ]
        },
        {
            title: t('sidebar.groupsItems.content'),
            items: [
                {
                    title: t('sidebar.myCourses'),
                    href: ROUTES.MY_COURSES,
                    icon: BookOpen,
                    permission: 'courses.view',
                },
                {
                    title: t('sidebar.myPacks'),
                    href: ROUTES.INSTRUCTOR_PACKS,
                    icon: Package,
                    permission: 'packs.view',
                },
                {
                    title: t('sidebar.createCourse'),
                    href: ROUTES.INSTRUCTOR_CREATE_COURSE,
                    icon: Plus,
                    permission: 'courses.create',
                },
            ]
        },
        {
            title: t('sidebar.groupsItems.sessionsGroups'),
            items: [
                {
                    title: t('sidebar.sessions'),
                    href: ROUTES.SESSIONS,
                    icon: Video,
                    permission: 'sessions.view',
                },
                {
                    title: t('sidebar.groups'),
                    href: ROUTES.GROUPS,
                    icon: UsersRound,
                    permission: 'groups.view',
                },
                {
                    title: t('sidebar.meetingRequests'),
                    href: ROUTES.MEETING_REQUESTS,
                    icon: Calendar,
                    permission: 'meeting-requests.view',
                },
            ]
        },
        {
            title: t('sidebar.groupsItems.management'),
            items: [
                {
                    title: t('sidebar.students'),
                    href: ROUTES.INSTRUCTOR_STUDENTS,
                    icon: Users,
                    permission: 'courses.view',
                },
                {
                    title: t('sidebar.pendingGradings'),
                    href: ROUTES.INSTRUCTOR_PENDING_GRADINGS,
                    icon: ClipboardCheck,
                    permission: 'tests.evaluate',
                },
                {
                    title: t('sidebar.revenue'),
                    href: ROUTES.INSTRUCTOR_REVENUE,
                    icon: DollarSign,
                    permission: 'payments.view',
                },
                {
                    title: t('sidebar.settings'),
                    href: ROUTES.SETTINGS,
                    icon: Settings,
                },
            ]
        },
    ];

    return (
        <DashboardLayout sidebarGroups={sidebarGroups}>
            {children || <Outlet />}
        </DashboardLayout>
    );
}