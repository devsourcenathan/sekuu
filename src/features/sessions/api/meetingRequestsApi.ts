import { apiGet, apiPost } from '@/lib/api/client';
import type {
    MeetingRequest,
    CreateMeetingRequestData,
    AcceptMeetingRequestData,
    RejectMeetingRequestData,
    Session,
    InstructorWithCourses,
} from '../types';

export const meetingRequestsApi = {
    /**
     * Get list of meeting requests (sent or received based on role)
     */
    getMeetingRequests: async (status?: string) => {
        return apiGet<{ data: MeetingRequest[]; total: number }>('/meeting-requests', {
            status,
        });
    },

    /**
     * Get a single meeting request by ID
     */
    getMeetingRequest: async (id: number) => {
        return apiGet<MeetingRequest>(`/meeting-requests/${id}`);
    },

    /**
     * Create a new meeting request (student)
     */
    createMeetingRequest: async (data: CreateMeetingRequestData) => {
        return apiPost<MeetingRequest>('/meeting-requests', data);
    },

    /**
     * Accept a meeting request and create session (instructor)
     */
    acceptMeetingRequest: async (id: number, data: AcceptMeetingRequestData) => {
        return apiPost<{ meeting_request: MeetingRequest; session: Session }>(
            `/meeting-requests/${id}/accept`,
            data
        );
    },

    /**
     * Reject a meeting request (instructor)
     */
    rejectMeetingRequest: async (id: number, data: RejectMeetingRequestData) => {
        return apiPost<void>(`/meeting-requests/${id}/reject`, data);
    },

    /**
     * Cancel a meeting request (student)
     */
    cancelMeetingRequest: async (id: number) => {
        return apiPost<void>(`/meeting-requests/${id}/cancel`);
    },

    /**
     * Get eligible instructors for the student
     */
    getEligibleInstructors: async () => {
        return apiGet<InstructorWithCourses[]>('/meeting-requests/eligible-instructors');
    },
};
