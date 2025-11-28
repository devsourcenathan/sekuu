import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';

// Layouts
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { InstructorLayout } from '@/components/layout/InstructorLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DashboardSwitcher } from '@/components/layout/DashboardSwitcher';

// Protected Route
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Public Pages
import { Home } from '@/pages/public/Home';
import { CourseCatalog } from '@/pages/public/CourseCatalog';
import { CourseDetails } from '@/pages/public/CourseDetails';

// Auth Pages
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';

// Student Pages
import { MyCourses } from '@/pages/student/MyCourses';
import { CoursePlayer } from '@/pages/student/CoursePlayer';
import { MyCertificates } from '@/features/student/pages/MyCertificates';
import { MyPayments } from '@/features/payments/pages/MyPayments';
import { TestTaking } from '@/features/tests/components/TestTaking';
import { Checkout } from '@/features/payments/pages/Checkout';

// Instructor Pages
import { InstructorCourses } from '@/pages/instructor/MyCourses';
import { CreateCourse } from '@/pages/instructor/CreateCourse';
import { EditCourse } from '@/pages/instructor/EditCourse';
import { InstructorStudents } from '@/pages/instructor/Students';
import { PendingGradings } from '@/pages/instructor/PendingGradings';
import { InstructorRevenue } from '@/pages/instructor/Revenue';

// Admin Pages
import { AdminUsers } from '@/pages/admin/Users';
import { AdminCourses } from '@/pages/admin/Courses';
import { AdminPayments } from '@/pages/admin/Payments';
import { AdminSettings } from '@/pages/admin/Settings';
import { RolesPermissions } from '@/pages/admin/RolesPermissions';

// Pack Pages
import { PackCatalog } from '@/features/packs/pages/PackCatalog';
import { PackDetails } from '@/features/packs/pages/PackDetails';
import { MyPacks } from '@/features/packs/pages/MyPacks';
import { InstructorPacks } from '@/features/packs/pages/InstructorPacks';
import { AdminPacks } from '@/pages/admin/Packs';

// Error Pages
import { NotFound } from '@/pages/errors/NotFound';
import { Unauthorized } from '@/pages/errors/Unauthorized';

// Session Pages
import SessionsManagement from '@/pages/instructor/SessionsManagement';
import GroupsManagement from '@/pages/instructor/GroupsManagement';
import MeetingRequests from '@/pages/instructor/MeetingRequests';
import MySessions from '@/pages/student/MySessions';
import RequestMeeting from '@/pages/student/RequestMeeting';
import WaitingRoom from '@/pages/sessions/WaitingRoom';
import LiveKitRoom from '@/pages/sessions/LiveKitRoom';

// Helper component for role-based rendering on same route
import { useAuthStore } from '@/store/authStore';

const RoleBasedComponent = ({ student, instructor, admin }: { student?: React.ReactNode, instructor?: React.ReactNode, admin?: React.ReactNode }) => {
    const { user } = useAuthStore();

    if (!user) return null;

    const hasRole = (roleSlug: string) => user.roles.some(r => r.slug === roleSlug);


    if ((hasRole('admin') || hasRole('super_admin')) && admin) return <>{admin}</>;
    if (hasRole('instructor') && instructor) return <>{instructor}</>;
    if (hasRole('student') && student) return <>{student}</>;

    return <Navigate to={ROUTES.UNAUTHORIZED} />;
};

export const router = createBrowserRouter([
    // Public routes
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: ROUTES.COURSES,
                element: <CourseCatalog />,
            },
            {
                path: ROUTES.COURSE_DETAILS,
                element: <CourseDetails />,
            },
            {
                path: ROUTES.PACKS,
                element: <PackCatalog />,
            },
            {
                path: ROUTES.PACK_DETAILS,
                element: <PackDetails />,
            },
        ],
    },

    // Auth routes
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {
                path: ROUTES.LOGIN,
                element: <Login />,
            },
            {
                path: ROUTES.REGISTER,
                element: <Register />,
            },
            {
                path: ROUTES.FORGOT_PASSWORD,
                element: <ForgotPassword />,
            },
            {
                path: ROUTES.RESET_PASSWORD,
                element: <ResetPassword />,
            },
        ],
    },

    // Unified Dashboard Route
    {
        path: ROUTES.DASHBOARD,
        element: (
            <ProtectedRoute>
                <DashboardSwitcher />
            </ProtectedRoute>
        ),
    },

    // Student Routes (Unified paths but protected by role)
    {
        path: '/',
        element: (
            <ProtectedRoute allowedRoles={['student']}>
                <StudentLayout />
            </ProtectedRoute>
        ),
        children: [
            // {
            //     path: ROUTES.MY_COURSES,
            //     element: <MyCourses />,
            // },
            {
                path: ROUTES.STUDENT_COURSE_PLAYER,
                element: <CoursePlayer />,
            },
            {
                path: ROUTES.MY_PACKS,
                element: <MyPacks />,
            },
            {
                path: ROUTES.STUDENT_CERTIFICATES,
                element: <MyCertificates />,
            },
            {
                path: ROUTES.STUDENT_PAYMENTS,
                element: <MyPayments />,
            },
            {
                path: 'tests/:testId/take',
                element: <TestTaking />,
            },
            {
                path: ROUTES.MY_SESSIONS,
                element: <MySessions />,
            },
            {
                path: ROUTES.REQUEST_MEETING,
                element: <RequestMeeting />,
            },
        ],
    },

    // Checkout Route (Protected for Student)
    {
        path: ROUTES.CHECKOUT,
        element: (
            <ProtectedRoute allowedRoles={['student']}>
                <Checkout />
            </ProtectedRoute>
        ),
    },

    // Instructor Routes
    {
        path: '/',
        element: (
            <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: ROUTES.INSTRUCTOR_CREATE_COURSE,
                element: <CreateCourse />,
            },
            {
                path: ROUTES.INSTRUCTOR_EDIT_COURSE,
                element: <EditCourse />,
            },
            {
                path: ROUTES.INSTRUCTOR_PACKS,
                element: <InstructorPacks />,
            },
            {
                path: ROUTES.INSTRUCTOR_STUDENTS,
                element: <InstructorStudents />,
            },
            {
                path: ROUTES.INSTRUCTOR_PENDING_GRADINGS,
                element: <PendingGradings />,
            },
            {
                path: ROUTES.INSTRUCTOR_REVENUE,
                element: <InstructorRevenue />,
            },
            {
                path: ROUTES.SESSIONS,
                element: <SessionsManagement />,
            },
            {
                path: ROUTES.GROUPS,
                element: <GroupsManagement />,
            },
            {
                path: ROUTES.MEETING_REQUESTS,
                element: <MeetingRequests />,
            },
            // {
            //     path: ROUTES.INSTRUCTOR_TEST_BUILDER,
            //     element: <TestBuilder />,
            // },
            // {
            //     path: ROUTES.INSTRUCTOR_TEST_EDIT,
            //     element: <TestBuilder />,
            // },
        ],
    },

    // Shared Route for My Courses (if we want to unify the URL)
    {
        path: ROUTES.MY_COURSES,
        element: (
            <ProtectedRoute>
                {/* We need a switcher here too if we want the same URL */}
                <RoleBasedComponent
                    student={<StudentLayout><MyCourses /></StudentLayout>}
                    instructor={<InstructorLayout><InstructorCourses /></InstructorLayout>}
                />
            </ProtectedRoute>
        )
    },

    // Admin Routes
    {
        path: '/',
        element: (
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: ROUTES.ADMIN_USERS,
                element: <AdminUsers />,
            },
            {
                path: ROUTES.ADMIN_COURSES,
                element: <AdminCourses />,
            },
            {
                path: ROUTES.ADMIN_PACKS,
                element: <AdminPacks />,
            },
            {
                path: ROUTES.ADMIN_PAYMENTS,
                element: <AdminPayments />,
            },
            {
                path: ROUTES.ADMIN_ROLES,
                element: <RolesPermissions />,
            },
            {
                path: ROUTES.SETTINGS, // Admin settings
                element: <AdminSettings />,
            },
        ],
    },

    // Session Room Routes (Protected but not layout-specific)
    {
        path: ROUTES.SESSION_WAITING_ROOM,
        element: (
            <ProtectedRoute>
                <WaitingRoom />
            </ProtectedRoute>
        ),
    },
    {
        path: ROUTES.SESSION_ROOM,
        element: (
            <ProtectedRoute>
                <LiveKitRoom />
            </ProtectedRoute>
        ),
    },

    // Error routes
    {
        path: ROUTES.UNAUTHORIZED,
        element: <Unauthorized />,
    },
    {
        path: '*',
        element: <NotFound />,
    },
]);
