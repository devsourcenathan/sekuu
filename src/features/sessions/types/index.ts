import type { Course, User } from '@/types';

// Extended User type for instructors with their courses
export interface InstructorWithCourses extends User {
  instructedCourses?: Course[];
}

export type SessionType = 'course' | 'mentoring' | 'meeting';
export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type ParticipantRole = 'host' | 'cohost' | 'participant';

export interface SessionParticipant {
  id: number;
  session_id: number;
  user_id: number;
  user?: User;
  role: ParticipantRole;
  joined_at?: string;
  left_at?: string;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: number;
  title: string;
  description?: string;
  instructor_id: number;
  instructor?: User;
  course_id?: number;
  course?: Course;
  datetime_start: string;
  datetime_end: string;
  livekit_room_name: string;
  type: SessionType;
  status: SessionStatus;
  recording_enabled: boolean;
  max_participants?: number;
  recording_url?: string;
  cancellation_reason?: string;
  participants?: SessionParticipant[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateSessionData {
  title: string;
  description?: string;
  course_id?: number;
  datetime_start: string;
  datetime_end: string;
  type: SessionType;
  participant_ids?: number[];
  group_ids?: number[];
  max_participants?: number;
  recording_enabled?: boolean;
}

export interface UpdateSessionData extends Partial<CreateSessionData> { }

export interface SessionFilters {
  instructor_id?: number;
  course_id?: number;
  status?: SessionStatus;
  type?: SessionType;
  upcoming?: boolean;
  past?: boolean;
  per_page?: number;
}

export interface SessionTokenResponse {
  token: string;
  url: string;
  room_name: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  instructor_id: number;
  instructor?: User;
  course_id?: number;
  course?: Course;
  is_active: boolean;
  members?: GroupMember[];
  members_count?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface GroupMember {
  id: number;
  group_id: number;
  user_id: number;
  user?: User;
  added_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  course_id?: number;
  member_ids?: number[];
}

export interface UpdateGroupData extends Partial<CreateGroupData> {
  is_active?: boolean;
}

export type MeetingRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface MeetingRequest {
  id: number;
  student_id: number;
  student?: User;
  instructor_id: number;
  instructor?: User;
  course_id: number;
  course?: Course;
  message: string;
  status: MeetingRequestStatus;
  datetime_proposed?: string;
  datetime_final?: string;
  session_id?: number;
  session?: Session;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingRequestData {
  instructor_id: number;
  course_id: number;
  message: string;
  datetime_proposed?: string;
}

export interface AcceptMeetingRequestData {
  datetime_start: string;
  datetime_end: string;
  title?: string;
}

export interface RejectMeetingRequestData {
  reason: string;
}
