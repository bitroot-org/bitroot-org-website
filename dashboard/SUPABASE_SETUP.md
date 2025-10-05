# Supabase Setup Guide

## Prerequisites
- A Supabase account (sign up at https://supabase.com)
- Node.js installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - Project name: `bitroot-dashboard` (or your choice)
   - Database password: (create a strong password)
   - Region: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

## Step 3: Update Environment Variables

Update your `.env.local` file with the copied values:

```env
# Replace these with your actual Supabase values
NEXT_PUBLIC_SUPABASE_URL=https://rlizvwhejcsenaulmtuo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsaXp2d2hlamNzZW5hdWxtdHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDQ2MTYsImV4cCI6MjA3NDgyMDYxNn0.B0-pXE6eqjcQq9j3kmOBn-a1-3mRyFqLsDsuY9BB-r8
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 4: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `lib/supabase/schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the schema

This will create:
- ✅ Students table
- ✅ Projects table
- ✅ Submission requirements table
- ✅ Submissions table
- ✅ Timeline events table
- ✅ Storage bucket for file uploads
- ✅ Row Level Security policies
- ✅ Default submission requirements data

## Step 5: Configure Storage

1. Go to **Storage** in your Supabase dashboard
2. Verify that the `submissions` bucket was created
3. The bucket should be **private** (not public)
4. RLS policies are already set up for secure file access

## Step 6: Test the Connection

1. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Log in with a BKC student account (`user@bkc.met.edu`)

3. Navigate to the **Submissions** page

4. You should see:
   - All 8 submission requirements
   - Progress bar showing 0/8
   - File upload buttons on each card

## Step 7: Test File Upload

1. Click "Attach Submission" on any card
2. Select a file (max 10MB)
3. File should upload successfully
4. Card should update to show "Submitted" status
5. Progress bar should update automatically

## Features Implemented

### 1. Database Management
- ✅ Student profiles (auto-created on first login)
- ✅ Project management (one active project per student)
- ✅ Submission tracking with status
- ✅ Timeline events

### 2. File Storage
- ✅ Secure file uploads to Supabase Storage
- ✅ Files organized by user/project/requirement
- ✅ Support for PDF, DOC, DOCX, ZIP, and images
- ✅ 10MB file size limit

### 3. Real-time Progress
- ✅ Automatic progress calculation (completed/total)
- ✅ Visual progress bar
- ✅ Status badges (Pending, In Progress, Completed)

### 4. Security
- ✅ Row Level Security (RLS) enabled
- ✅ Users can only access their own data
- ✅ Clerk authentication integration
- ✅ Private file storage with access control

## Database Schema Overview

### Students Table
- Stores user profiles from Clerk
- Tracks BKC vs non-BKC students
- Links to projects

### Projects Table
- One active project per student
- Tracks project status
- Links to submissions and timeline

### Submission Requirements Table
- Pre-populated with 8 requirements
- Static reference data
- Used for all students

### Submissions Table
- Links projects to requirements
- Tracks status and files
- One submission per project-requirement pair

### Timeline Events Table
- Project milestones
- Deadlines
- Meetings

## Troubleshooting

### Error: "relation does not exist"
- Make sure you ran the schema.sql file in Step 4
- Check that all tables were created successfully

### Error: "JWT claims missing"
- RLS policies expect Clerk JWT in the `auth.jwt()` function
- Make sure you're logged in with Clerk

### Files not uploading
- Check Storage bucket exists and is named "submissions"
- Verify RLS policies are set up correctly
- Check file size is under 10MB

### Progress not updating
- Try refreshing the page
- Check browser console for errors
- Verify database connection

## Next Steps

1. **Add Timeline Management**: Implement the timeline page with milestone tracking
2. **Project Details**: Add project editing capabilities
3. **Team Collaboration**: Add team member invitations
4. **Notifications**: Email notifications for deadlines
5. **Admin Dashboard**: For mentors to view student progress

## Support

For issues:
1. Check Supabase dashboard logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Ensure database schema is up to date
