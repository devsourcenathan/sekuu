import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsApi } from '../api/groupsApi';
import type { CreateGroupData, UpdateGroupData } from '../types';
import { toast } from 'sonner';

// Query keys
export const groupKeys = {
    all: ['groups'] as const,
    lists: () => [...groupKeys.all, 'list'] as const,
    list: (formationId?: number) => [...groupKeys.lists(), { formationId }] as const,
    details: () => [...groupKeys.all, 'detail'] as const,
    detail: (id: number) => [...groupKeys.details(), id] as const,
    eligibleStudents: (formationId?: number) => [...groupKeys.all, 'eligible-students', { formationId }] as const,
};

/**
 * Hook to fetch groups list
 */
export function useGroups(formationId?: number) {
    return useQuery({
        queryKey: groupKeys.list(formationId),
        queryFn: () => groupsApi.getGroups(formationId),
    });
}

/**
 * Hook to fetch a single group
 */
export function useGroup(id: number) {
    return useQuery({
        queryKey: groupKeys.detail(id),
        queryFn: () => groupsApi.getGroup(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new group
 */
export function useCreateGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGroupData) => groupsApi.createGroup(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
            toast.success('Groupe créé avec succès');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors de la création du groupe');
        },
    });
}

/**
 * Hook to update a group
 */
export function useUpdateGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateGroupData }) =>
            groupsApi.updateGroup(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
            queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.id) });
            toast.success('Groupe mis à jour');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors de la mise à jour');
        },
    });
}

/**
 * Hook to delete a group
 */
export function useDeleteGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => groupsApi.deleteGroup(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
            toast.success('Groupe supprimé');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors de la suppression');
        },
    });
}

/**
 * Hook to add members to a group
 */
export function useAddGroupMembers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, userIds }: { id: number; userIds: number[] }) =>
            groupsApi.addMembers(id, userIds),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.id) });
            toast.success('Membres ajoutés');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors de l\'ajout des membres');
        },
    });
}

/**
 * Hook to remove members from a group
 */
export function useRemoveGroupMembers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, userIds }: { id: number; userIds: number[] }) =>
            groupsApi.removeMembers(id, userIds),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.id) });
            toast.success('Membres retirés');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors du retrait des membres');
        },
    });
}

/**
 * Hook to fetch eligible students
 */
export function useEligibleStudents(formationId?: number) {
    return useQuery({
        queryKey: groupKeys.eligibleStudents(formationId),
        queryFn: () => groupsApi.getEligibleStudents(formationId),
    });
}
