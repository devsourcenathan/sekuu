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
import { TestBuilder } from '@/features/tests/components/TestBuilder';

// Admin Pages
import { AdminUsers } from '@/pages/admin/Users';
import { AdminCourses } from '@/pages/admin/Courses';
import { AdminPayments } from '@/pages/admin/Payments';
import { AdminSettings } from '@/pages/admin/Settings';
// Error Pages
import { NotFound } from '@/pages/errors/NotFound';
import { Unauthorized } from '@/pages/errors/Unauthorized';
// Helper component for role-based rendering on same route
import { useAuthStore } from '@/store/authStore';
import { RolesPermissions } from '@/pages/admin/RolesPermissions';

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
                {/* We need a layout that adapts or just use the switcher which renders the correct dashboard with its layout? 
                     Actually, the dashboards likely use their own layouts. 
                     Let's see: StudentDashboard uses? It seems they are just page components.
                     The previous router wrapped them in layouts.
                     So DashboardSwitcher should probably render the LAYOUT + Page, or we need a UnifiedLayout.
                     
                     Let's look at how it was:
                     /student -> StudentLayout -> children
                     
                     So if I go to /dashboard, I want to render StudentLayout > StudentDashboard if I am a student.
                     
                     I will make DashboardSwitcher render the correct LAYOUT and the Dashboard Page as the outlet/child?
                     No, DashboardSwitcher is an element.
                     
                     Let's try this:
                     We can have specific routes that redirect to the unified ones, OR we just map the unified ones.
                     
                     If I am a student, /dashboard should show StudentDashboard inside StudentLayout.
                     
                     Let's define the routes structure such that /dashboard is handled by a component that decides.
                  */}
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
            // {
            //     path: ROUTES.INSTRUCTOR_TEST_BUILDER,
            //     element: <TestBuilder />,
            // },
            // {
            //     path: ROUTES.INSTRUCTOR_TEST_EDIT,
            //     element: <TestBuilder />,
            // },
            // Instructor also has "My Courses" but maybe different view? 
            // In previous router: /instructor/courses -> InstructorCourses
            // Let's map it to /courses/manage or keep it distinct if needed. 
            // But wait, ROUTES.MY_COURSES is /my-courses. 
            // If I use the same path for both, I need a wrapper that decides which component to render?
            // OR I can just use different paths for now to avoid collision if they are in the same router level.
            // But the user wants "Role based routing without visible in url".
            // So /my-courses should show StudentCourses for Student and InstructorCourses for Instructor.
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

