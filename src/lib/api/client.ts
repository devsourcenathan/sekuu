import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '@/lib/constants/config';
import { type ApiError, type ApiResponse } from '@/types';

// Créer l'instance Axios
export const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor - Ajouter le token à chaque requête
apiClient.interceptors.request.use(
    (config) => {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log des requêtes en développement
        if (import.meta.env.DEV) {
            console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Gérer les réponses et erreurs
apiClient.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        // Log des réponses en développement
        if (import.meta.env.DEV) {
            console.log('✅ API Response:', response.config.url, response.data);
        }
        return response;
    },
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Log des erreurs en développement
        if (import.meta.env.DEV) {
            console.error('❌ API Error:', error.response?.status, error.response?.data);
        }

        // Gérer 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Effacer les données d'auth
            localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
            localStorage.removeItem(AUTH_CONFIG.USER_KEY);

            // Rediriger vers login
            window.location.href = '/login';

            return Promise.reject(error);
        }

        // Gérer 403 Forbidden
        if (error.response?.status === 403) {
            window.location.href = '/unauthorized';
        }

        // Gérer les erreurs réseau
        if (!error.response) {
            return Promise.reject({
                message: 'Erreur de connexion. Veuillez vérifier votre connexion internet.',
                errors: {},
            } as ApiError);
        }

        // Retourner l'erreur formatée
        return Promise.reject({
            message: error.response?.data?.message || 'Une erreur est survenue',
            errors: error.response?.data?.errors || {},
        } as ApiError);
    }
);

// Helper function pour les requêtes API
export async function apiRequest<T = any>(
    config: AxiosRequestConfig
): Promise<T> {
    try {
        const response = await apiClient.request<ApiResponse<T>>(config);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

// GET request
export async function apiGet<T = any>(
    url: string,
    params?: any
): Promise<T> {
    return apiRequest<T>({
        method: 'GET',
        url,
        params,
    });
}

// POST request
export async function apiPost<T = any>(
    url: string,
    data?: any
): Promise<T> {
    return apiRequest<T>({
        method: 'POST',
        url,
        data,
    });
}

// PUT request
export async function apiPut<T = any>(
    url: string,
    data?: any
): Promise<T> {
    return apiRequest<T>({
        method: 'PUT',
        url,
        data,
    });
}

// PATCH request
export async function apiPatch<T = any>(
    url: string,
    data?: any
): Promise<T> {
    return apiRequest<T>({
        method: 'PATCH',
        url,
        data,
    });
}

// DELETE request
export async function apiDelete<T = any>(
    url: string
): Promise<T> {
    return apiRequest<T>({
        method: 'DELETE',
        url,
    });
}

// Upload file
export async function apiUpload<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
): Promise<T> {
    return apiRequest<T>({
        method: 'POST',
        url,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
    });
}