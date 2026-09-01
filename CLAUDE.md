# Project: Govt Middle School Awanpora ERP — AI Coding Context

## What this is
A multi-tenant School ERP: role-based portals (Student, Teacher, Parent, Admin/Headmaster) + React 18 Bento Grid web dashboard on Supabase (PostgreSQL) cloud infrastructure.
Tailored for: Govt Middle School Awanpora (Zone Mattan, District Anantnag, J&K). UDISE: 01061102301.

## Stack
- Frontend: React 18 + Vite + TypeScript + Tailwind CSS + Lucide UI (Bento Grid design)
- Database & Auth: Supabase (PostgreSQL) with Row-Level Security (RLS) & PostgREST
- Persistence: PostgreSQL schemas (`users`, `student_profiles`, `teacher_profiles`, `parent_profiles`, `attendance_records`, `exam_results`, `timetables`, `homework`, `notices`, `grants_and_fees`, `mid_day_meals`, `invoices`, `school_expenses`)
- Code Splitting: `React.lazy()` + `Suspense` on-demand route chunking
- Multi-tenancy: Multi-tenant organization scoping (`organization_id = 'a0000000-0000-0000-0000-000000000001'`)
- AI: Google Gemini AI integration (SCERT CCE student remarks, Kashmiri/Urdu multilingual translation, school assistant)

## Conventions
- Every table/collection has `organization_id`; queries must be scoped to the tenant.
- Use explicit Supabase SDK error verification (`if (error) throw error / return { success: false, message }`).
- Normalize class identifiers using `normalizeClassId(id)` (`'c1'` -> `'c0000000-0000-0000-0000-000000000001'`).
- Multilingual support: English, Urdu (`ur`), Kashmiri (`ks`), Hindi (`hi`).

## Local Dev
- Frontend Dev Server: `cd frontend && npm run dev`
- Production Build: `cd frontend && npm run build`
- Run Diagnostics: Navigate to the `System Diagnostics` tab in the ERP
