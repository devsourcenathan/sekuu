import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
    const { user, token, isAuthenticated, isLoading, setAuth, clearAuth, updateUser } = useAuthStore();

    const hasRole = (roleSlug: string) => {
        return user?.roles.some((role) => role.slug === roleSlug) ?? false;
    };

    const hasPermission = (permissionSlug: string) => {
        return user?.roles.some((role) =>
            role.permissions?.some(p => p.slug === permissionSlug)
        ) ?? false;
    };

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        login: setAuth,
        logout: clearAuth,
        updateUser,
        hasRole,
        hasPermission
    };
};

export default useAuth;
