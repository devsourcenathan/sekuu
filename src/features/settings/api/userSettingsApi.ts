import { apiPut, apiUpload } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { UserProfileData, PasswordUpdateData } from '../types/settings.types';

export const userSettingsApi = {
    /**
     * Update user profile
     */
    updateProfile: async (data: UserProfileData): Promise<any> => {
        // If avatar is provided, use FormData
        if (data.avatar) {
            const formData = new FormData();

            if (data.name) formData.append('name', data.name);
            if (data.email) formData.append('email', data.email);
            if (data.phone) formData.append('phone', data.phone);
            if (data.bio) formData.append('bio', data.bio);
            if (data.avatar) formData.append('avatar', data.avatar);

            const response = await apiUpload<{ user: any }>(
                ENDPOINTS.USER_SETTINGS.UPDATE_PROFILE,
                formData
            );
            return response.user;
        }

        // Otherwise, send as JSON
        const response = await apiPut<{ user: any }>(
            ENDPOINTS.USER_SETTINGS.UPDATE_PROFILE,
            data
        );
        return response.user;
    },

    /**
     * Update user password
     */
    updatePassword: async (data: PasswordUpdateData): Promise<void> => {
        return apiPut<void>(ENDPOINTS.USER_SETTINGS.UPDATE_PASSWORD, data);
    },
};
