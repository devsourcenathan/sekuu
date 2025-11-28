import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionsApi } from '../api/sessionsApi';
import type { SessionFilters, CreateSessionData, UpdateSessionData } from '../types';
import { toast } from 'sonner';

// Query keys
export const sessionKeys = {
    all: ['sessions'] as const,
    lists: () => [...sessionKeys.all, 'list'] as const,
    list: (filters: SessionFilters) => [...sessionKeys.lists(), filters] as const,
    details: () => [...sessionKeys.all, 'detail'] as const,
    detail: (id: number) => [...sessionKeys.details(), id] as const,
    participants: (id: number) => [...sessionKeys.detail(id), 'participants'] as const,
    token: (id: number) => [...sessionKeys.detail(id), 'token'] as const,
};

/**
 * Hook to fetch sessions list with filters
 */
export function useSessions(filters?: SessionFilters) {
    return useQuery({
        queryKey: sessionKeys.list(filters || {}),
        queryFn: () => sessionsApi.getSessions(filters),
    });
}

/**
 * Hook to fetch a single session
 */
export function useSession(id: number) {
    return useQuery({
        queryKey: sessionKeys.detail(id),
        queryFn: () => sessionsApi.getSession(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new session
 */
export function useCreateSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSessionData) => sessionsApi.createSession(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
            toast.success('Session créée avec succès');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors de la création de la session');
        },
    });
}

/**
 * Hook to update a session
 */
export function useUpdateSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateSessionData }) =>
            sessionsApi.updateSession(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
            queryClient.invalidateQueries({ queryKey: sessionKeys.detail(variables.id) });
            toast.success('Session mise à jour');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors de la mise à jour');
        },
    });
}

/**
 * Hook to delete/cancel a session
 */
export function useDeleteSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
            sessionsApi.deleteSession(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
            toast.success('Session annulée');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors de l\'annulation');
        },
    });
}

/**
 * Hook to start a session
 */
export function useStartSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => sessionsApi.startSession(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
            toast.success('Session démarrée');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors du démarrage');
        },
    });
}

/**
 * Hook to end a session
 */
export function useEndSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => sessionsApi.endSession(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
            toast.success('Session terminée');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors de la fin de session');
        },
    });
}

/**
 * Hook to generate LiveKit token
 */
export function useSessionToken(id: number) {
    return useQuery({
        queryKey: sessionKeys.token(id),
        queryFn: () => sessionsApi.generateToken(id),
        enabled: false, // Manual fetch
        staleTime: 0, // Always fresh
    });
}

/**
 * Hook to fetch session participants
 */
export function useSessionParticipants(id: number) {
    return useQuery({
        queryKey: sessionKeys.participants(id),
        queryFn: () => sessionsApi.getParticipants(id),
        enabled: !!id,
    });
}

/**
 * Hook to add participants to a session
 */
export function useAddParticipants() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, userIds, role }: { id: number; userIds: number[]; role?: string }) =>
            sessionsApi.addParticipants(id, userIds, role),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.participants(variables.id) });
            queryClient.invalidateQueries({ queryKey: sessionKeys.detail(variables.id) });
            toast.success('Participants ajoutés');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors de l\'ajout des participants');
        },
    });
}

/**
 * Hook to remove a participant from a session
 */
export function useRemoveParticipant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ sessionId, userId }: { sessionId: number; userId: number }) =>
            sessionsApi.removeParticipant(sessionId, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.participants(variables.sessionId) });
            queryClient.invalidateQueries({ queryKey: sessionKeys.detail(variables.sessionId) });
            toast.success('Participant retiré');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors du retrait du participant');
        },
    });
}
