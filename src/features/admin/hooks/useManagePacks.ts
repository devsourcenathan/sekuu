import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packsApi } from '@/features/packs/api/packsApi';
import type { Pack, AdminPackStatistics, PaginatedResponse } from '@/types';

export function useAdminPacks(
    page = 1,
    search = '',
    instructorId?: number,
    status = ''
) {
    return useQuery({
        queryKey: ['admin-packs', page, search, instructorId, status],
        queryFn: async () => {
            const filters: any = {
                page,
                per_page: 15,
            };

            if (search) filters.search = search;
            if (instructorId) filters.instructor_id = instructorId;
            if (status) filters.status = status;

            return packsApi.getAdminPacks(filters);
        },
    });
}

export function useAdminPackStatistics() {
    return useQuery<AdminPackStatistics>({
        queryKey: ['admin-pack-statistics'],
        queryFn: async () => {
            const response = await packsApi.getAdminPackStatistics();
            console.log(response, "response");

            return response;
        },
    });
}

export function useUpdatePackStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ packId, isActive }: { packId: number; isActive: boolean }) => {
            return packsApi.updatePackStatus(packId, isActive);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-packs'] });
            queryClient.invalidateQueries({ queryKey: ['admin-pack-statistics'] });
        },
    });
}

export function useForceDeletePack() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (packId: number) => {
            return packsApi.forceDeletePack(packId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-packs'] });
            queryClient.invalidateQueries({ queryKey: ['admin-pack-statistics'] });
        },
    });
}
