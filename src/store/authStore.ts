// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User } from '@/types';
import { AUTH_CONFIG } from '@/lib/constants/config';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthActions {
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
    updateUser: (user: Partial<User>) => void;
    setLoading: (isLoading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            // Initial state
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,

            // Actions
            setAuth: (user, token) => {
                localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
                localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));

                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            clearAuth: () => {
                localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
                localStorage.removeItem(AUTH_CONFIG.USER_KEY);

                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            },

            updateUser: (userData) => {
                set((state) => {
                    if (!state.user) return state;

                    const updatedUser = { ...state.user, ...userData };
                    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(updatedUser));

                    return {
                        user: updatedUser,
                    };
                });
            },

            setLoading: (isLoading) => {
                set({ isLoading });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

// Selectors
export const useAuth = () => useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
}));

export const useUser = () => useAuthStore((state) => state.user);

export const useIsAuthenticated = () =>
    useAuthStore((state) => state.isAuthenticated);

export const useUserRole = () =>
    useAuthStore((state) => state.user?.roles);