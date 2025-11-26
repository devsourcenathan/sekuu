import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { packsApi } from '../api/packsApi';
import type {
    Pack,
    PackFormValues,
    PackCourseConfigFormValues,
    PackEnrollment,
    PackStatistics,
    PackProgress,
} from '@/types';
import { toast } from 'sonner';

// Query keys
export const packKeys = {
    all: ['packs'] as const,
    lists: () => [...packKeys.all, 'list'] as const,
    list: (filters?: any) => [...packKeys.lists(), filters] as const,
    details: () => [...packKeys.all, 'detail'] as const,
    detail: (id: number | string) => [...packKeys.details(), id] as const,
    instructor: () => [...packKeys.all, 'instructor'] as const,
    statistics: (id: number | string) => [...packKeys.all, 'statistics', id] as const,
    enrollments: () => [...packKeys.all, 'enrollments'] as const,
    enrollment: (id: number | string) => [...packKeys.enrollments(), id] as const,
    progress: (id: number | string) => [...packKeys.all, 'progress', id] as const,
};

/**
 * Hook pour récupérer la liste des packs
 */
export function usePacks(filters?: any) {
    return useQuery({
        queryKey: packKeys.list(filters),
        queryFn: () => packsApi.getPacks(filters),
    });
}

/**
 * Hook pour récupérer les détails d'un pack
 */
export function usePack(id: number | string) {
    return useQuery({
        queryKey: packKeys.detail(id),
        queryFn: () => packsApi.getPackDetails(id),
        enabled: !!id,
    });
}

/**
 * Hook pour créer un pack
 */
export function useCreatePack() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: PackFormValues) => packsApi.createPack(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: packKeys.lists() });
            queryClient.invalidateQueries({ queryKey: packKeys.instructor() });
        },
    });
}

/**
 * Hook pour mettre à jour un pack
 */
export function useUpdatePack() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: Partial<PackFormValues> }) =>
            packsApi.updatePack(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: packKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: packKeys.lists() });
            queryClient.invalidateQueries({ queryKey: packKeys.instructor() });
        },
    });
}

/**
 * Hook pour supprimer un pack
 */
export function useDeletePack() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => packsApi.deletePack(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: packKeys.lists() });
            queryClient.invalidateQueries({ queryKey: packKeys.instructor() });
            toast.success('Pack supprimé avec succès');
        },
        onError: () => {
            toast.error('Erreur lors de la suppression du pack');
        },
    });
}

/**
 * Hook pour publier un pack
 */
export function usePublishPack() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => packsApi.publishPack(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: packKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: packKeys.lists() });
            queryClient.invalidateQueries({ queryKey: packKeys.instructor() });
            toast.success('Pack publié avec succès');
        },
        onError: () => {
            toast.error('Erreur lors de la publication du pack');
        },
    });
}

/**
 * Hook pour dépublier un pack
 */
export function useUnpublishPack() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => packsApi.unpublishPack(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: packKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: packKeys.lists() });
            queryClient.invalidateQueries({ queryKey: packKeys.instructor() });
            toast.success('Pack dépublié avec succès');
        },
        onError: () => {
            toast.error('Erreur lors de la dépublication du pack');
        },
    });
}

/**
 * Hook pour ajouter un cours à un pack
 */
export function useAddCourseToPack() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ packId, data }: { packId: number | string; data: PackCourseConfigFormValues }) =>
            packsApi.addCourseToPack(packId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: packKeys.detail(variables.packId) });
            toast.success('Formation ajoutée au pack');
        },
        onError: () => {
            toast.error('Erreur lors de l\'ajout de la formation');
        },
    });
}

/**
 * Hook pour retirer un cours d'un pack
 */
export function useRemoveCourseFromPack() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ packId, courseId }: { packId: number | string; courseId: number | string }) =>
            packsApi.removeCourseFromPack(packId, courseId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: packKeys.detail(variables.packId) });
            toast.success('Formation retirée du pack');
        },
        onError: () => {
            toast.error('Erreur lors du retrait de la formation');
        },
    });
}

/**
 * Hook pour mettre à jour la configuration d'un cours dans un pack
 */
export function useUpdatePackCourseConfig() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            packId,
            courseId,
            data,
        }: {
            packId: number | string;
            courseId: number | string;
            data: Partial<PackCourseConfigFormValues>;
        }) => packsApi.updatePackCourseConfig(packId, courseId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: packKeys.detail(variables.packId) });
            toast.success('Configuration mise à jour');
        },
        onError: () => {
            toast.error('Erreur lors de la mise à jour');
        },
    });
}

/**
 * Hook pour récupérer les packs de l'instructeur
 */
export function useInstructorPacks() {
    return useQuery({
        queryKey: packKeys.instructor(),
        queryFn: () => packsApi.getInstructorPacks(),
    });
}

/**
 * Hook pour récupérer les statistiques d'un pack
 */
export function usePackStatistics(id: number | string) {
    return useQuery({
        queryKey: packKeys.statistics(id),
        queryFn: () => packsApi.getPackStatistics(id),
        enabled: !!id,
    });
}

/**
 * Hook pour s'inscrire à un pack
 */
export function useEnrollInPack() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => packsApi.enrollInPack(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: packKeys.enrollments() });
            toast.success('Inscription au pack réussie');
        },
        onError: () => {
            toast.error('Erreur lors de l\'inscription au pack');
        },
    });
}

/**
 * Hook pour récupérer les inscriptions aux packs de l'étudiant
 */
export function useMyPackEnrollments() {
    return useQuery({
        queryKey: packKeys.enrollments(),
        queryFn: () => packsApi.getMyPackEnrollments(),
    });
}

/**
 * Hook pour récupérer les détails d'une inscription à un pack
 */
export function usePackEnrollment(id: number | string) {
    return useQuery({
        queryKey: packKeys.enrollment(id),
        queryFn: () => packsApi.getPackEnrollmentDetails(id),
        enabled: !!id,
    });
}

/**
 * Hook pour récupérer la progression dans un pack
 */
export function usePackProgress(id: number | string) {
    return useQuery({
        queryKey: packKeys.progress(id),
        queryFn: () => packsApi.getPackProgress(id),
        enabled: !!id,
    });
}

/**
 * Hook pour annuler une inscription à un pack
 */
export function useCancelPackEnrollment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => packsApi.cancelPackEnrollment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: packKeys.enrollments() });
            toast.success('Inscription annulée');
        },
        onError: () => {
            toast.error('Erreur lors de l\'annulation');
        },
    });
}
