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
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

import { useTranslation } from 'react-i18next';

export function InstructorLayout({ children }: { children?: ReactNode }) {
    const { t } = useTranslation();

    // const sidebarItems = [
    //     {
    //         title: t('sidebar.dashboard'),
    //         href: ROUTES.DASHBOARD,
    //         icon: LayoutDashboard,
    //     },
    //     {
    //         title: t('sidebar.myCourses'),
    //         href: ROUTES.MY_COURSES,
    //         icon: BookOpen,
    //     },
    //     {
    //         title: t('sidebar.myPacks'),
    //         href: ROUTES.INSTRUCTOR_PACKS,
    //         icon: Package,
    //     },
    //     {
    //         title: t('sidebar.createCourse'),
    //         href: ROUTES.INSTRUCTOR_CREATE_COURSE,
    //         icon: Plus,
    //     },
    //     {
    //         title: t('sidebar.sessions'),
    //         href: ROUTES.SESSIONS,
    //         icon: Video,
    //     },
    //     {
    //         title: t('sidebar.groups'),
    //         href: ROUTES.GROUPS,
    //         icon: UsersRound,
    //     },
    //     {
    //         title: t('sidebar.meetingRequests'),
    //         href: ROUTES.MEETING_REQUESTS,
    //         icon: Calendar,
    //     },
    //     {
    //         title: t('sidebar.students'),
    //         href: ROUTES.INSTRUCTOR_STUDENTS,
    //         icon: Users,
    //     },
    //     {
    //         title: t('sidebar.pendingGradings'),
    //         href: ROUTES.INSTRUCTOR_PENDING_GRADINGS,
    //         icon: ClipboardCheck,
    //     },
    //     {
    //         title: t('sidebar.revenue'),
    //         href: ROUTES.INSTRUCTOR_REVENUE,
    //         icon: DollarSign,
    //     },
    // ];

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
                },
                {
                    title: t('sidebar.myPacks'),
                    href: ROUTES.INSTRUCTOR_PACKS,
                    icon: Package,
                },
                {
                    title: t('sidebar.createCourse'),
                    href: ROUTES.INSTRUCTOR_CREATE_COURSE,
                    icon: Plus,
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
                },
                {
                    title: t('sidebar.groups'),
                    href: ROUTES.GROUPS,
                    icon: UsersRound,
                },
                {
                    title: t('sidebar.meetingRequests'),
                    href: ROUTES.MEETING_REQUESTS,
                    icon: Calendar,
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
            ]
        },
    ];

    return (
        <DashboardLayout sidebarGroups={sidebarGroups}>
            {children || <Outlet />}
        </DashboardLayout>
    );
}