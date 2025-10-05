# Round 1 & Round 2 Data Migration Instructions

## Overview
This migration sets up the complete data structure for both Round 1 submissions and Round 2 team projects, allowing students to see their progress across both rounds.

## What's Included

### 1. Database Changes
- **New table**: `round1_submissions` - Stores all Round 1 project submissions
- **New columns in `students` table**:
  - `round2_participant` (BOOLEAN) - Marks if student qualified for Round 2
  - `team_id` (INTEGER) - Team assignment for Round 2 participants
  - `university` (TEXT) - Student's university
  - `phone_number` (TEXT) - Contact number

### 2. Round 2 Teams
The following students have been selected for Round 2 and assigned to teams:

- **Team 1**: Manish Bhavar + Aishwarya Sangle
- **Team 2**: Prathmesh Suryawanshi + Siddhi Gaikwad
- **Team 3**: Aditya Bhingardive + Sneha Shahane
- **Team 4**: Prashant Patil + Sakshi Patil
- **Team 5**: Krishna Bhandari + Vaishnavi Pawar

### 3. Dashboard Features
Students will now see:
- **Round 2 Badge**: Special indicator for Round 2 participants showing their team number
- **Round 2 Team Project**: Their assigned Round 2 project with team details
- **Round 1 Submission**: Their original Round 1 project submission with:
  - Project title and description
  - Tech stack and APIs used
  - Links to GitHub, demo, and video
  - Review status

## Migration Steps

### Step 1: Run the Main Migration
In your Supabase SQL Editor, run the following file:

```sql
-- File: supabase_migration_round1.sql
```

This will:
1. Create the `round1_submissions` table
2. Add new columns to the `students` table
3. Insert all 43 students from Round 1
4. Mark the 10 Round 2 participants with team IDs
5. Assign students to their Round 2 projects

### Step 2: Import Round 1 Submissions
Run the submissions file to import all Round 1 project data:

```sql
-- File: supabase_round1_submissions.sql
```

**Note**: The sample file includes submissions for the 10 Round 2 participants. You'll need to add the remaining 33 students' submissions following the same pattern.

### Step 3: Verify the Migration

Run these queries to verify everything worked:

```sql
-- Check Round 2 participants
SELECT email, first_name, last_name, round2_participant, team_id
FROM students
WHERE round2_participant = true
ORDER BY team_id;

-- Check project assignments
SELECT p.team_number, p.title, s.first_name, s.last_name
FROM projects p
LEFT JOIN students s ON p.student_id = s.id
ORDER BY p.team_number;

-- Check Round 1 submissions count
SELECT COUNT(*) as total_submissions FROM round1_submissions;
```

Expected results:
- 10 students marked as `round2_participant = true`
- 5 projects assigned to team leads
- At least 10 Round 1 submissions (add more as needed)

## Admin View

Admins will have access to:
- **Students Page** (`/dashboard/admin/students`) - View all students with Round 1 and Round 2 status
- **Projects Page** (`/dashboard/admin/projects`) - Manage all Round 2 team projects
- **Universities Page** (`/dashboard/admin/universities`) - Manage universities
- **Interviews Page** (`/dashboard/admin/interviews`) - Schedule interview sessions

To set yourself as admin:
```sql
UPDATE students
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

## Student View

When students log in, they'll see:
1. **Stats Card**: Active projects and total projects count
2. **Countdown Timer**: Deadline for submissions
3. **Round 2 Badge** (if selected): Highlighting their team participation
4. **Round 2 Team Project** (if selected): Their current team project details
5. **Round 1 Submission**: Their original submission from Round 1

## Adding Remaining Round 1 Submissions

To add the remaining 33 students' Round 1 submissions, follow this pattern in `supabase_round1_submissions.sql`:

```sql
INSERT INTO round1_submissions (
  student_id, full_name, email, university, phone_number, year_of_study,
  project_title, chosen_usecase, short_description, github_repo_url,
  deployed_demo_link, demo_video_link, models_or_apis_used, tech_stack_summary,
  readme_confirmation, additional_notes, submission_date, has_demo, reviewed
) VALUES
((SELECT id FROM students WHERE email = 'student@email.com'),
'Student Full Name', 'student@email.com', 'MET - BKC - Adgaon', '+91XXXXXXXXXX', '2nd year',
'Project Title', 'Use Case Category',
'Project description here...',
'https://github.com/username/repo', 'https://demo-link.com', NULL,
'APIs/Models used', 'Tech stack summary',
true, NULL, '2025-09-25 10:00:00+00', true, false);
```

## Troubleshooting

### Students table conflicts
If you get errors about existing students, the migration uses `ON CONFLICT (email) DO UPDATE` to update existing records.

### Missing student_id references
If Round 1 submissions fail due to missing student_id, ensure all students were inserted first by running Step 1 completely before Step 2.

### Project assignments not working
Make sure the projects table has entries with `team_number` 1-5 before running the student assignment updates.

## Files Created

1. `supabase_migration_round1.sql` - Main migration with table creation and Round 2 setup
2. `supabase_round1_submissions.sql` - Round 1 submissions data (sample with 10 entries)
3. `lib/actions/projects.ts` - Added `getRound1Submission()` and `isRound2Participant()` functions
4. `app/dashboard/page.tsx` - Updated to show both Round 1 and Round 2 data

## Next Steps

After running the migration:
1. Verify all data in Supabase
2. Test login as both Round 2 and non-Round 2 students
3. Complete adding all 43 Round 1 submissions
4. Set at least one user as admin to test admin pages
5. Create universities and schedule interviews for Round 2 teams

## Support

If you encounter any issues:
1. Check Supabase logs for detailed error messages
2. Verify all required tables exist
3. Ensure foreign key relationships are intact
4. Confirm environment variables are set correctly
