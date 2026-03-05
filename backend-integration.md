# API Endpoints & Backend Integration

## Base URLs
- Frontend (dev): http://localhost:3000
- Backend (Supabase/Jiobase): https://hirrd.jiobase.com

## Implemented Route Handlers (Server Endpoints)
- GET /auth/callback
  - Handler: [route.ts](file:///d:/hirrd/app/auth/callback/route.ts)
  - Purpose: Supabase code exchange → session create → redirect
  - Query params: code, next

## Client-Side Data Operations (Direct Supabase Calls)
- Auth (login)
  - File: [login/page.tsx](file:///d:/hirrd/app/auth/login/page.tsx)
  - Operation: supabase.auth.signInWithPassword
- Auth (signup)
  - File: [signup/page.tsx](file:///d:/hirrd/app/auth/signup/page.tsx)
  - Operation: supabase.auth.signUp → redirect to /auth/login
- Jobs Listing
  - File: [JobsList.tsx](file:///d:/hirrd/app/jobs/JobsList.tsx#L60-L83)
  - Operation: from("jobs").select("*, companies(name)").eq("status","open").order("created_at", false)
- Job Details: User/Applications/Saved
  - File: [JobDetailsContent.tsx](file:///d:/hirrd/app/jobs/%5Bid%5D/JobDetailsContent.tsx#L71-L117)
  - Operations:
    - Get current user: auth.getUser
    - Get user profile: from("profiles").select("resume_url").eq("id", user.id)
    - Check existing application: from("applications").select("*").eq("job_id", job.id).eq("applicant_id", user.id)
    - Check saved job: from("saved_jobs").select("*").eq("job_id", job.id).eq("user_id", user.id)
- Apply to Job
  - File: [JobDetailsContent.tsx](file:///d:/hirrd/app/jobs/%5Bid%5D/JobDetailsContent.tsx#L168-L177)
  - Operation: from("applications").insert({...}).select().single()
- Save/Unsave Job
  - File: [JobDetailsContent.tsx](file:///d:/hirrd/app/jobs/%5Bid%5D/JobDetailsContent.tsx#L209-L224)
  - Operation: insert/delete on "saved_jobs"
- Resume Upload (Storage)
  - File: [JobDetailsContent.tsx](file:///d:/hirrd/app/jobs/%5Bid%5D/JobDetailsContent.tsx#L135-L147)
  - Operations: storage.from("resumes").upload → getPublicUrl

## Middleware/Proxy (Auth Guard)
- Path: [proxy.ts](file:///d:/hirrd/proxy.ts#L32-L41)
- Behavior: /dashboard access without session → redirect to /auth/login

## Environment Configuration
- Path: [.env.local](file:///d:/hirrd/.env.local)
- Vars:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL

## Database & Policies
- SQL scripts: [scripts](file:///d:/hirrd/scripts)
  - 001_create_tables.sql
  - 002_profile_trigger.sql
  - 003_create_chat_and_storage.sql
  - 004_update_application_status.sql
  - 005_update_message_policy.sql

## Notes
- Current architecture client-first hai: zyada operations direct Supabase ke through hoti hain, REST endpoints minimal (sirf /auth/callback).
- Agar REST API endpoints chahiye (jobs list/create, apply, save), to app/api/.../route.ts handlers add kiye ja sakte hain.
