import { useState } from "react";
import * as authApi from "../api/authApi";
import { useAuthStore } from "@/store/authStore";
import { AUTH_CONFIG } from "@/lib/constants/config";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const auth = useAuthStore();

    const login = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            // Step 1: Login to get token
            const { data } = await authApi.login(values as any);
            console.log(data, "auth");

            // Expect API to return { user, token }
            if (data?.user && data?.access_token) {
                // Step 2: Store token in localStorage FIRST so /me can use it
                localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, data.access_token);

                // Step 3: Fetch complete user data with permissions
                try {
                    const meResponse = await authApi.getCurrentUser();
                    console.log(meResponse, "me response");

                    // Use user data from /me which includes permissions
                    if (meResponse?.data?.user) {
                        auth.setAuth({
                            ...meResponse.data.user,
                            permissions: meResponse.data.permissions // Add permissions array
                        }, data.access_token);
                    } else {
                        // Fallback to login response if /me fails
                        auth.setAuth(data.user, data.access_token);
                    }
                } catch (meError) {
                    console.error("Failed to fetch user permissions:", meError);
                    // Still login but without permissions
                    auth.setAuth(data.user, data.access_token);
                }
            }
            return { success: true, data };
        } catch (e: any) {
            return { success: false, message: e?.response?.data?.message ?? e.message };
        } finally {
            setLoading(false);
        }
    };

    return { login, loading };
};

export default useLogin;
