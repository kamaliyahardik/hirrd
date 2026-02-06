# Job Portal Website

Enterprise-grade job portal built with Next.js, Supabase, and Tailwind CSS. It supports recruiter job postings with rich-text descriptions, candidate applications, saved jobs, and an admin moderation panel.

## Highlights

- Recruiters post jobs with rich text description (bold, lists, headings, colors).
- Candidates view formatted descriptions, upload resumes, and apply.
- Saved jobs/bookmarking, application status tracking, and notifications.
- Admin dashboard for job moderation and status management.

## Tech Stack

- Next.js 16, React 19
- Tailwind CSS v4 with Typography plugin
- Supabase (Authentication, Postgres, Storage)
- Shadcn UI components, Lucide Icons

## Screenshots

These are placeholders. Replace with real screenshots in production.

![Landing / Listing](./public/placeholder.jpg)
![Recruiter Dashboard](./public/placeholder.jpg)
![Create Job (Rich Text)](./public/placeholder.jpg)
![Job Details](./public/placeholder.jpg)

## Folder Structure

```text
d:/job-portal-website
├─ app
│  ├─ admin
│  │  ├─ jobs
│  │  │  └─ page.tsx
│  │  ├─ users
│  │  │  └─ page.tsx
│  │  └─ page.tsx
│  ├─ auth
│  │  ├─ login/page.tsx
│  │  ├─ signup/page.tsx
│  │  ├─ callback/route.ts
│  │  └─ layout.tsx
│  ├─ dashboard
│  │  ├─ jobs
│  │  │  ├─ create/page.tsx
│  │  │  └─ page.tsx
│  │  ├─ applicants/page.tsx
│  │  ├─ applications/page.tsx
│  │  ├─ company/page.tsx
│  │  ├─ profile/page.tsx
│  │  ├─ saved-jobs/page.tsx
│  │  ├─ settings/page.tsx
│  │  └─ layout.tsx
│  ├─ jobs
│  │  ├─ [id]/JobDetailsContent.tsx
│  │  └─ [id]/page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components
│  ├─ Home/...
│  └─ ui
│     ├─ card.tsx, button.tsx, input.tsx, label.tsx, ...
│     ├─ rich-text-editor.tsx
│     └─ rich-text-editor.css
├─ lib
│  └─ supabase
│     ├─ client.ts
│     └─ server.ts
├─ public
│  ├─ icon.svg, logo-dark.png, logo-white.png, ...
│  └─ placeholder.jpg
├─ scripts
│  ├─ 001_create_tables.sql
│  ├─ 002_profile_trigger.sql
│  ├─ 003_create_chat_and_storage.sql
│  ├─ 004_update_application_status.sql
│  └─ 005_update_message_policy.sql
├─ package.json
└─ README.md
```

## Getting Started

### Prerequisites

- Node.js v18+ (recommended v20)
- A Supabase project (Project URL + Anon Key)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Do not commit secrets to the repository.

### Database & Storage Setup (Supabase)

Run these SQL scripts in order inside Supabase:

- scripts/001_create_tables.sql
- scripts/002_profile_trigger.sql
- scripts/003_create_chat_and_storage.sql
- scripts/004_update_application_status.sql
- scripts/005_update_message_policy.sql

This creates core tables, sets Row Level Security (RLS) policies, and a public `resumes` storage bucket (public read; only owner can write/update/delete).

To grant admin role:

```sql
UPDATE public.users SET role = 'admin' WHERE email = '<admin-email>';
```

### Development

```bash
npm run dev
```

Open http://localhost:3000

### Build

```bash
npm run build
```

### Start (Production)

```bash
npm run start
```

### Lint

```bash
npm run lint
```

## Key Workflows

- Recruiter must first complete Company profile (Dashboard → Company).
- Job descriptions are stored in HTML from a rich text editor and displayed using safe rendering rules.
- Resume uploads go to `resumes` bucket; public read is enabled for viewing submissions.
- Auth-protected routes are handled via middleware; unauthenticated users are redirected to login when accessing dashboard pages.

## Security & Compliance

- Never commit `.env.local` or secrets.
- Supabase RLS policies restrict data access based on authenticated user roles.
- Storage policies allow only owners to modify their files.

## Contributing

PRs welcome. Please run lint and build locally before submitting changes.

## License

For personal/educational use. Ensure compliance for commercial deployments.
