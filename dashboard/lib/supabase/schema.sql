-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  is_bkc_student BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active', -- active, completed, paused
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submission requirements table
CREATE TABLE IF NOT EXISTS submission_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  requirement_id UUID REFERENCES submission_requirements(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, in-progress, completed
  file_url TEXT,
  file_name TEXT,
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, requirement_id)
);

-- Timeline events table
CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT, -- milestone, deadline, meeting
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default submission requirements
INSERT INTO submission_requirements (number, title, description) VALUES
  (1, 'Intro & Research Document', 'Submit a comprehensive research document outlining your project idea, target audience, market analysis, and problem statement. Include competitor analysis and user research findings.'),
  (2, 'Plan and Market Understanding', 'Provide a detailed business plan demonstrating your understanding of the market. Include revenue models, go-to-market strategy, customer personas, and market size estimation.'),
  (3, 'Website', 'Develop and deploy a fully functional website for your product. The website should be responsive, user-friendly, and include all essential pages like home, features, pricing, and contact.'),
  (4, 'Dashboard / Mobile App', 'Build and submit either a web dashboard or mobile application that demonstrates your product''s core functionality. Include user authentication, key features, and intuitive UI/UX design.'),
  (5, 'Backend Postman & Frontend Documentation', 'Submit complete API documentation using Postman collections. Include all endpoints, request/response formats, authentication methods, and frontend component documentation.'),
  (6, 'Product Hunt Launch Plan', 'Create a comprehensive launch strategy for Product Hunt. Include timeline, messaging, hunter outreach plan, community engagement strategy, and success metrics.'),
  (7, 'Icons, Banners & Visual Assets', 'Design and submit all visual assets required for your product launch. Include app icons, social media banners, Product Hunt thumbnails, and promotional graphics in various sizes.'),
  (8, 'Marketing Plan', 'Develop a complete marketing strategy covering social media campaigns, content marketing, email marketing, influencer partnerships, and paid advertising. Include budget allocation and KPIs.')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_clerk_id ON students(clerk_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_projects_student_id ON projects(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_project_id ON submissions(project_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_timeline_events_project_id ON timeline_events(project_id);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students
CREATE POLICY "Users can view their own profile"
  ON students FOR SELECT
  USING (clerk_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own profile"
  ON students FOR UPDATE
  USING (clerk_id = auth.jwt() ->> 'sub');

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE clerk_id = auth.jwt() ->> 'sub'));

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (student_id IN (SELECT id FROM students WHERE clerk_id = auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (student_id IN (SELECT id FROM students WHERE clerk_id = auth.jwt() ->> 'sub'));

-- RLS Policies for submissions
CREATE POLICY "Users can view their own submissions"
  ON submissions FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE student_id IN (SELECT id FROM students WHERE clerk_id = auth.jwt() ->> 'sub')));

CREATE POLICY "Users can create submissions"
  ON submissions FOR INSERT
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE student_id IN (SELECT id FROM students WHERE clerk_id = auth.jwt() ->> 'sub')));

CREATE POLICY "Users can update their own submissions"
  ON submissions FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE student_id IN (SELECT id FROM students WHERE clerk_id = auth.jwt() ->> 'sub')));

-- RLS Policies for timeline_events
CREATE POLICY "Users can view their own timeline events"
  ON timeline_events FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE student_id IN (SELECT id FROM students WHERE clerk_id = auth.jwt() ->> 'sub')));

-- Create storage bucket for submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', false)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);