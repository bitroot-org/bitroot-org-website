export interface Student {
  id: string;
  clerk_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_bkc_student: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  student_id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface SubmissionRequirement {
  id: string;
  number: number;
  title: string;
  description: string;
  created_at: string;
}

export interface Submission {
  id: string;
  project_id: string;
  requirement_id: string;
  status: 'pending' | 'in-progress' | 'completed';
  file_url?: string;
  file_name?: string;
  notes?: string;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  event_type?: 'milestone' | 'deadline' | 'meeting';
  event_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}