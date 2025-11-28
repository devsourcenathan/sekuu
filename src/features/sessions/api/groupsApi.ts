import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { Group, CreateGroupData, UpdateGroupData } from '../types';
import type { User } from '@/types';

export const groupsApi = {
    /**
     * Get list of groups for the current instructor
     */
    getGroups: async (courseId?: number) => {
        return apiGet<{ data: Group[]; total: number }>('/groups', {
            course_id: courseId,
        });
    },

    /**
     * Get a single group by ID
     */
    getGroup: async (id: number) => {
        return apiGet<Group>(`/groups/${id}`);
    },

    /**
     * Create a new group
     */
    createGroup: async (data: CreateGroupData) => {
        return apiPost<Group>('/groups', data);
    },

    /**
     * Update an existing group
     */
    updateGroup: async (id: number, data: UpdateGroupData) => {
        return apiPut<Group>(`/groups/${id}`, data);
    },

    /**
     * Delete a group
     */
    deleteGroup: async (id: number) => {
        return apiDelete<void>(`/groups/${id}`);
    },

    /**
     * Add members to a group
     */
    addMembers: async (id: number, userIds: number[]) => {
        return apiPost<void>(`/groups/${id}/members`, { user_ids: userIds });
    },

    /**
     * Remove members from a group
     */
    removeMembers: async (id: number, userIds: number[]) => {
        return apiDelete<void>(`/groups/${id}/members`, { user_ids: userIds });
    },

    /**
     * Get eligible students for the instructor
     */
    getEligibleStudents: async (courseId?: number) => {
        return apiGet<User[]>('/groups/eligible-students', {
            course_id: courseId,
        });
    },
};
