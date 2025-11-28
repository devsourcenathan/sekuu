import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingRequestsApi } from '../api/meetingRequestsApi';
import type {
    CreateMeetingRequestData,
    AcceptMeetingRequestData,
    RejectMeetingRequestData,
} from '../types';
import { toast } from 'sonner';

// Query keys
export const meetingRequestKeys = {
    all: ['meeting-requests'] as const,
    lists: () => [...meetingRequestKeys.all, 'list'] as const,
    list: (status?: string) => [...meetingRequestKeys.lists(), { status }] as const,
    details: () => [...meetingRequestKeys.all, 'detail'] as const,
    detail: (id: number) => [...meetingRequestKeys.details(), id] as const,
    eligibleInstructors: () => [...meetingRequestKeys.all, 'eligible-instructors'] as const,
};

/**
 * Hook to fetch meeting requests list
 */
export function useMeetingRequests(status?: string) {
    return useQuery({
        queryKey: meetingRequestKeys.list(status),
        queryFn: () => meetingRequestsApi.getMeetingRequests(status),
    });
}

/**
 * Hook to fetch a single meeting request
 */
export function useMeetingRequest(id: number) {
    return useQuery({
        queryKey: meetingRequestKeys.detail(id),
        queryFn: () => meetingRequestsApi.getMeetingRequest(id),
        enabled: !!id,
    });
}

/**
 * Hook to create a new meeting request
 */
export function useCreateMeetingRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateMeetingRequestData) =>
            meetingRequestsApi.createMeetingRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: meetingRequestKeys.lists() });
            toast.success('Demande de meeting envoyée');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors de l\'envoi de la demande');
        },
    });
}

/**
 * Hook to accept a meeting request
 */
export function useAcceptMeetingRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: AcceptMeetingRequestData }) =>
            meetingRequestsApi.acceptMeetingRequest(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: meetingRequestKeys.lists() });
            queryClient.invalidateQueries({ queryKey: meetingRequestKeys.detail(variables.id) });
            // Also invalidate sessions since a new session was created
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            toast.success('Demande acceptée et session créée');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors de l\'acceptation');
        },
    });
}

/**
 * Hook to reject a meeting request
 */
export function useRejectMeetingRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: RejectMeetingRequestData }) =>
            meetingRequestsApi.rejectMeetingRequest(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: meetingRequestKeys.lists() });
            queryClient.invalidateQueries({ queryKey: meetingRequestKeys.detail(variables.id) });
            toast.success('Demande refusée');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors du refus');
        },
    });
}

/**
 * Hook to cancel a meeting request
 */
export function useCancelMeetingRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => meetingRequestsApi.cancelMeetingRequest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: meetingRequestKeys.lists() });
            toast.success('Demande annulée');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Erreur lors de l\'annulation');
        },
    });
}

/**
 * Hook to fetch eligible instructors
 */
export function useEligibleInstructors() {
    return useQuery({
        queryKey: meetingRequestKeys.eligibleInstructors(),
        queryFn: () => meetingRequestsApi.getEligibleInstructors(),
    });
}
