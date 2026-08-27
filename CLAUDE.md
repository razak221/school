# Project: Govt Middle School Awanpora ERP — AI Coding Context

## What this is
A multi-tenant School ERP: role-based portals (Student, Teacher, Parent, Admin/Headmaster) + React Bento Grid web dashboard on a shared Node.js/Express/MongoDB TypeScript backend.
Tailored for: Govt Middle School Awanpora (Zone Mattan, District Anantnag, J&K). UDISE: 01061102301.

## Stack (locked — ask before changing)
- Backend: Node.js + Express + TypeScript
- DB: MongoDB + Mongoose (with embedded in-memory fallback for local dev)
- Mobile & Web Frontend: React + Vite + Tailwind CSS + Lucide (Wisdom Path Bento Grid UI)
- Auth: JWT + bcrypt, role-based access control
- Notifications: In-app & Broadcast notifications
- AI: Google Gemini API (assistive student remarks, regional translation, parent Q&A)

## Conventions
- All routes versioned under `/api/v1/`
- Every collection has `organizationId`; every query filters by it
- Role checks live in Express middleware (`verifyToken`, `requireRole`), never only in frontend
- `async`/`await` only, no callback style
- Multilingual support: English, Urdu, Kashmiri, Hindi

## Never do this
- Never drop the `organizationId` filter from a database query
- Never store plaintext passwords or bypass role authorization
- Never let one organization's data leak into another's response
- Never hardcode dynamic tenant settings

## Local Dev
- Backend: `cd backend && npm run dev`
- Seed Data: `cd backend && npm run seed`
- Frontend: `cd frontend && npm run dev`
