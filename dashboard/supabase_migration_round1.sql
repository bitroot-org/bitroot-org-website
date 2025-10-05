-- ============================================
-- Round 1 Data Import & Round 2 Setup Migration
-- ============================================

-- 1. Create round1_submissions table
CREATE TABLE IF NOT EXISTS round1_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  university TEXT,
  phone_number TEXT,
  year_of_study TEXT,
  project_title TEXT,
  chosen_usecase TEXT,
  short_description TEXT,
  github_repo_url TEXT,
  deployed_demo_link TEXT,
  demo_video_link TEXT,
  models_or_apis_used TEXT,
  tech_stack_summary TEXT,
  readme_confirmation BOOLEAN DEFAULT false,
  additional_notes TEXT,
  submission_date TIMESTAMP WITH TIME ZONE,
  project_summary TEXT,
  project_category TEXT,
  project_stack_keywords TEXT,
  has_demo BOOLEAN DEFAULT false,
  reviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Make clerk_id nullable (students will be linked when they first log in)
ALTER TABLE students
ALTER COLUMN clerk_id DROP NOT NULL;

-- 3. Add round2_participant and team_id columns to students table
ALTER TABLE students
ADD COLUMN IF NOT EXISTS round2_participant BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS team_id INTEGER,
ADD COLUMN IF NOT EXISTS university TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- 4. Insert all students from CSV (if they don't already exist)
INSERT INTO students (email, first_name, last_name, is_bkc_student, university, phone_number, created_at)
VALUES
  ('adityab.mca_iom@bkc.met.edu', 'Aditya', 'Bhingardive', true, 'MET - BKC - Adgaon', '+917972905955', '2025-09-25 09:22:00+00'),
  ('patilpoonam2003@gmail.com', 'Poonam', 'Patil', false, 'MET - BKC - Adgaon', '+917756061063', '2025-09-25 10:24:00+00'),
  ('prashantp.mca_iom@bkc.met.edu', 'Prashant', 'Patil', true, 'MET - BKC - Adgaon', '+918668868253', '2025-09-25 10:25:00+00'),
  ('anjalip.mca_iom@bkc.met.edu', 'Anjali', 'Pekhale', true, 'MET - BKC - Adgaon', '+919637173459', '2025-09-25 10:33:00+00'),
  ('mayurs.mca_iom@bkc.met.edu', 'Mayur', 'Shinde', true, 'MET - BKC - Adgaon', '+919545285123', '2025-09-25 10:37:00+00'),
  ('kalyanir.mca_iom@bkc.met.edu', 'Kalyani', 'Rewale', true, 'MET - BKC - Adgaon', '+918329633434', '2025-09-25 10:37:00+00'),
  ('siddharthc.mca_iom@bkc.met.edu', 'Siddharth', 'Chavanke', true, 'MET - BKC - Adgaon', '+919172041620', '2025-09-25 10:38:00+00'),
  ('sayalichavhan20022@gmail.com', 'Sayali', 'Chavhan', false, 'MET - BKC - Adgaon', '+917219830010', '2025-09-25 10:40:00+00'),
  ('shubhamk.mca_iom@bkc.met.edu', 'Shubham', 'Khaire', true, 'MET - BKC - Adgaon', '+919022871608', '2025-09-25 10:42:00+00'),
  ('manishg.mca_iom@bkc.met.edu', 'Manish', 'Gavali', true, 'MET - BKC - Adgaon', '+917447848243', '2025-09-25 10:55:00+00'),
  ('hire.aniket22@gmail.com', 'Aniket', 'Hire', false, 'MET - BKC - Adgaon', '+918080256639', '2025-09-25 10:56:00+00'),
  ('pawarsarthak8858@gmail.com', 'Sarthak', 'Pawar', false, 'MET - BKC - Adgaon', '+917028239806', '2025-09-25 11:09:00+00'),
  ('abhijitb.mca_iom@bkc.met.edu', 'Abhijit', 'Borse', true, 'MET - BKC - Adgaon', '+917020639781', '2025-09-25 11:15:00+00'),
  ('anushj.mca_iom@bkc.met.edu', 'Anush', 'Jadhav', true, 'MET - BKC - Adgaon', '+918080433168', '2025-09-25 11:16:00+00'),
  ('amolc.mca_iom@bkc.met.edu', 'Amol', 'Chinchole', true, 'MET - BKC - Adgaon', '+919766913954', '2025-09-25 11:26:00+00'),
  ('aishwaryas.mca_iom@bkc.met.edu', 'Aishwarya', 'Sangle', true, 'MET - BKC - Adgaon', '+919322874566', '2025-09-25 11:34:00+00'),
  ('siddhesha.mca_iom@bkc.met.edu', 'Siddhesh', 'Ambekar', true, 'MET - BKC - Adgaon', '+919890914525', '2025-09-25 11:34:00+00'),
  ('manishb.mca_iom@bkc.met.edu', 'Manish', 'Bhavar', true, 'MET - BKC - Adgaon', '+918459059460', '2025-09-25 11:36:00+00'),
  ('siddheshs.mca_iom@bkc.met.edu', 'Siddhesh', 'Shinde', true, 'MET - BKC - Adgaon', '+917758847690', '2025-09-25 11:44:00+00'),
  ('gajananraut428@gmail.com', 'Gajanan', 'Raut', false, 'MET - BKC - Adgaon', '+917972848504', '2025-09-25 11:50:00+00'),
  ('tanvid.mca_iom@bkc.met.edu', 'Tanvi', 'Dogmane', true, 'MET - BKC - Adgaon', '+919579243703', '2025-09-25 12:10:00+00'),
  ('jayeshb.mca_iom@bkc.met.edu', 'Jayesh', 'Borse', true, 'MET - BKC - Adgaon', '+919699593776', '2025-09-25 14:05:00+00'),
  ('sakship.mca_iom@bkc.met.edu', 'Sakshi', 'Patil', true, 'MET - BKC - Adgaon', '+919699985735', '2025-09-25 14:24:00+00'),
  ('atishb.mca_iom@bkc.met.edu', 'Atish', 'Bodke', true, 'MET - BKC - Adgaon', '+917709038073', '2025-09-25 14:37:00+00'),
  ('komalk.mca_iom@bkc.met.edu', 'Komal', 'Kubade', true, 'MET - BKC - Adgaon', '+917276808278', '2025-09-25 14:43:00+00'),
  ('shrawanit.mca_iom@bkc.met.edu', 'Shrawani', 'Tormad', true, 'MET - BKC - Adgaon', '+917666878078', '2025-09-25 14:45:00+00'),
  ('khuship.mca_iom@bkc.met.edu', 'Khushi', 'Pardeshi', true, 'MET - BKC - Adgaon', '+917249887286', '2025-09-25 15:21:00+00'),
  ('vaishnavipawar28504@gmail.com', 'Vaishnavi', 'Pawar', false, 'MET - BKC - Adgaon', '+917744022870', '2025-09-25 15:46:00+00'),
  ('prathmeshs.mca_iom@bkc.met.edu', 'Prathmesh', 'Suryawanshi', true, 'MET - BKC - Adgaon', '+919359519620', '2025-09-25 15:59:00+00'),
  ('sahils.mca_iom@bkc.met.edu', 'Sahil', 'Shaikh', true, 'MET - BKC - Adgaon', '+919960856229', '2025-09-25 16:04:00+00'),
  ('krishnab.mca_iom@bkc.met.edu', 'Krishna', 'Bhandari', true, 'MET - BKC - Adgaon', '+919850676602', '2025-09-25 16:29:00+00'),
  ('siddhig.mca_iom@bkc.met.edu', 'Siddhi', 'Gaikwad', true, 'MET - BKC - Adgaon', '+919552505674', '2025-09-25 16:57:00+00'),
  ('amrutaw.mca_iom@bkc.met.edu', 'Amruta', 'Wagh', true, 'MET - BKC - Adgaon', '+919021945004', '2025-09-25 16:57:00+00'),
  ('akankshaborhade95@gmail.com', 'Akanksha', 'Borhade', false, 'MET - BKC - Adgaon', '+917843074082', '2025-09-25 17:00:00+00'),
  ('renukas.mca_iom@bkc.met.edu', 'Renuka', 'Sonawane', true, 'MET - BKC - Adgaon', '+918999549280', '2025-09-25 17:10:00+00'),
  ('snehas.mca_iom@bkc.met.edu', 'Sneha', 'Shahane', true, 'MET - BKC - Adgaon', '+918956391800', '2025-09-25 17:10:00+00'),
  ('manass.mca_iom@bkc.met.edu', 'Manas', 'Suryawanshi', true, 'MET - BKC - Adgaon', '+919404724101', '2025-09-25 18:19:00+00'),
  ('darshanj.mca_iom@bkc.met.edu', 'Darshan', 'Jadhav', true, 'MET - BKC - Adgaon', '+919511220540', '2025-09-25 18:19:00+00'),
  ('riddhig.mca_iom@bkc.met.edu', 'Riddhi', 'Gaikwad', true, 'MET - BKC - Adgaon', '+919552505674', '2025-09-25 18:35:00+00'),
  ('saurabhg.mca_iom@bkc.met.edu', 'Saurabh', 'Girase', true, 'MET - BKC - Adgaon', '+919284853256', '2025-09-25 19:39:00+00'),
  ('vishalt.mca_iom@bkc.met.edu', 'Vishal', 'Taskar', true, 'MET - BKC - Adgaon', '+918975591487', '2025-09-25 20:00:00+00'),
  ('vaibhavp.mca_iom@bkc.met.edu', 'Vaibhav', 'Patil', true, 'MET - BKC - Adgaon', '+918390380535', '2025-09-25 20:06:00+00')
ON CONFLICT (email) DO UPDATE SET
  university = EXCLUDED.university,
  phone_number = EXCLUDED.phone_number;

-- 5. Mark Round 2 participants and assign team IDs
UPDATE students SET round2_participant = true, team_id = 1 WHERE email IN ('manishb.mca_iom@bkc.met.edu', 'aishwaryas.mca_iom@bkc.met.edu');
UPDATE students SET round2_participant = true, team_id = 2 WHERE email IN ('prathmeshs.mca_iom@bkc.met.edu', 'siddhig.mca_iom@bkc.met.edu');
UPDATE students SET round2_participant = true, team_id = 3 WHERE email IN ('adityab.mca_iom@bkc.met.edu', 'snehas.mca_iom@bkc.met.edu');
UPDATE students SET round2_participant = true, team_id = 4 WHERE email IN ('prashantp.mca_iom@bkc.met.edu', 'sakship.mca_iom@bkc.met.edu');
UPDATE students SET round2_participant = true, team_id = 5 WHERE email IN ('krishnab.mca_iom@bkc.met.edu', 'vaishnavipawar28504@gmail.com');

-- 6. Update projects table to assign students to teams
-- First, get student IDs for team assignments (you'll need to run these updates with actual UUIDs from your database)
-- Team 1: Manish Bhavar + Aishwarya Sangle
UPDATE projects SET
  student_id = (SELECT id FROM students WHERE email = 'manishb.mca_iom@bkc.met.edu' LIMIT 1)
WHERE team_number = 1;

-- Team 2: Prathmesh Suryawanshi + Siddhi Gaikwad
UPDATE projects SET
  student_id = (SELECT id FROM students WHERE email = 'prathmeshs.mca_iom@bkc.met.edu' LIMIT 1)
WHERE team_number = 2;

-- Team 3: Aditya Bhingardive + Sneha Shahane
UPDATE projects SET
  student_id = (SELECT id FROM students WHERE email = 'adityab.mca_iom@bkc.met.edu' LIMIT 1)
WHERE team_number = 3;

-- Team 4: Prashant Patil + Sakshi Patil
UPDATE projects SET
  student_id = (SELECT id FROM students WHERE email = 'prashantp.mca_iom@bkc.met.edu' LIMIT 1)
WHERE team_number = 4;

-- Team 5: Krishna Bhandari + Vaishnavi Pawar
UPDATE projects SET
  student_id = (SELECT id FROM students WHERE email = 'krishnab.mca_iom@bkc.met.edu' LIMIT 1)
WHERE team_number = 5;

-- Note: Round 1 submissions will be inserted in a separate script due to size
