import { useState } from "react";
import * as authApi from "../api/authApi";
import { useAuthStore } from "@/store/authStore";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const auth = useAuthStore();

    const login = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const { data } = await authApi.login(values as any);
            console.log(data, "auth");

            // Expect API to return { user, token }
            if (data?.user && data?.access_token) {
                auth.setAuth(data.user, data.access_token);
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
