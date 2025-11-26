import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { type ApiResponse } from '@/types';

interface UploadResponse {
    url: string;
    filename: string;
    size: number;
}

export function useUploadResource(lessonId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (files: File[]) => {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('resources[]', file);
            });

            const response = await apiClient.post<ApiResponse<UploadResponse[]>>(
                `/lessons/${lessonId}/resources`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
            queryClient.invalidateQueries({ queryKey: ['lesson-resources', lessonId] });
        },
    });
}

export function useDownloadResource() {
    return async (resourceId: number, filename: string) => {
        try {
            const response = await apiClient.get(`/resources/${resourceId}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            console.error('Error downloading resource:', error);
            throw error;
        }
    };
}
