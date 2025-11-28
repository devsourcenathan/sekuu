import { apiClient, apiPost } from "@/lib/api/client";
import { ENDPOINTS } from "../../../lib/api/endpoints";

export const login = async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post(ENDPOINTS.AUTH_LOGIN, credentials);
    return res.data;
};

export const getCurrentUser = async () => {
    const res = await apiClient.get('/me');
    return res.data;
};

export const logout = async () => {
    const res = await apiPost(ENDPOINTS.AUTH_LOGOUT)
    return res;
}
export const register = async (payload: any) => {
    const res = await apiClient.post(ENDPOINTS.AUTH_REGISTER, payload);
    return res.data;
};

export default { login, register, logout, getCurrentUser };
