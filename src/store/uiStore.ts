import { create } from 'zustand';

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

interface UiState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark' | 'system';
    notifications: Notification[];
}

interface UiActions {
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
}

type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>()((set) => ({
    // Initial state
    sidebarOpen: true,
    theme: 'system',
    notifications: [],

    // Actions
    toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
    },

    setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
    },

    setTheme: (theme) => {
        set({ theme });

        // Apply theme to document
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    },

    addNotification: (notification) => {
        const id = Math.random().toString(36).substring(7);
        const newNotification = { ...notification, id };

        set((state) => ({
            notifications: [...state.notifications, newNotification],
        }));

        // Auto remove after duration
        if (notification.duration !== 0) {
            setTimeout(() => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                }));
            }, notification.duration || 5000);
        }
    },

    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        }));
    },

    clearNotifications: () => {
        set({ notifications: [] });
    },
}));

// Selectors
// export const useSidebar = () => useUiStore((state) => ({
//     isOpen: state.sidebarOpen,
//     toggle: state.toggleSidebar,
//     setOpen: state.setSidebarOpen,
// }));

export const useTheme = () => useUiStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
}));

// export const useNotifications = () => useUiStore((state) => ({
//     notifications: state.notifications,
//     addNotification: state.addNotification,
//     removeNotification: state.removeNotification,
//     clearNotifications: state.clearNotifications,
// }));