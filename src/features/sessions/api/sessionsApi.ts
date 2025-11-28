import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type {
    Session,
    CreateSessionData,
    UpdateSessionData,
    SessionFilters,
    SessionTokenResponse,
    SessionParticipant,
} from '../types';

export const sessionsApi = {
    /**
     * Get list of sessions with filters
     */
    getSessions: async (filters?: SessionFilters) => {
        return apiGet<{ data: Session[]; total: number }>('/sessions', filters);
    },

    /**
     * Get a single session by ID
     */
    getSession: async (id: number) => {
        return apiGet<Session>(`/sessions/${id}`);
    },

    /**
     * Create a new session
     */
    createSession: async (data: CreateSessionData) => {
        return apiPost<Session>('/sessions', data);
    },

    /**
     * Update an existing session
     */
    updateSession: async (id: number, data: UpdateSessionData) => {
        return apiPut<Session>(`/sessions/${id}`, data);
    },

    /**
     * Cancel a session
     */
    deleteSession: async (id: number, reason?: string) => {
        return apiDelete<void>(`/sessions/${id}`, { data: { reason } });
    },

    /**
     * Start a session
     */
    startSession: async (id: number) => {
        return apiPost<Session>(`/sessions/${id}/start`);
    },

    /**
     * End a session
     */
    endSession: async (id: number) => {
        return apiPost<Session>(`/sessions/${id}/end`);
    },

    /**
     * Generate LiveKit token to join session
     */
    generateToken: async (id: number) => {
        return apiPost<SessionTokenResponse>(`/sessions/${id}/token`);
    },

    /**
     * Get session participants
     */
    getParticipants: async (id: number) => {
        return apiGet<SessionParticipant[]>(`/sessions/${id}/participants`);
    },

    /**
     * Add participants to session
     */
    addParticipants: async (id: number, userIds: number[], role: string = 'participant') => {
        return apiPost<void>(`/sessions/${id}/participants`, {
            user_ids: userIds,
            role,
        });
    },

    /**
     * Remove a participant from session
     */
    removeParticipant: async (sessionId: number, userId: number) => {
        return apiDelete<void>(`/sessions/${sessionId}/participants/${userId}`);
    },
};
