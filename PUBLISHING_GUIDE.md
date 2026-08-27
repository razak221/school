# 🌐 Govt Middle School Awanpora ERP — Publishing & Deployment Guide

Welcome to the production deployment guide for the **Govt Middle School Awanpora ERP & Multi-Role Portal** (`v1.0.0-beta.1`).

---

## 🏗️ Architecture Overview

| Component | Technology | Recommended Host |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite + Tailwind CSS | **Vercel** / **Netlify** / **Cloudflare Pages** |
| **Backend** | Node.js + Express + TypeScript | **Render** / **Railway** / **Fly.io** |
| **Cloud Database** | PostgreSQL + RLS Policies | **Supabase** (`ryhtbvczmtuyfacjqfnm.supabase.co`) |
| **Local / Container** | Docker + Multi-stage Build | **DigitalOcean** / **AWS EC2** / **VPS** |

---

## 🚀 Option 1: Deploy to Vercel (Frontend) & Render (Backend) [Recommended]

### Step 1: Deploy Frontend to Vercel
1. Push your repository to **GitHub / GitLab**.
2. Go to **[Vercel Dashboard](https://vercel.com/new)** and import your repository.
3. Set **Root Directory** to `frontend`.
4. Framework Preset: **Vite**.
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`: `https://ryhtbvczmtuyfacjqfnm.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_0jXMf-UljXH-10w0n_pFIw_U3DKDj_r`
6. Click **Deploy**. Vercel will automatically read [`frontend/vercel.json`](file:///Users/razakahmedkhan/Desktop/school/frontend/vercel.json) for SPA client routing.

### Step 2: Deploy Backend to Render / Railway
1. In [Render Dashboard](https://dashboard.render.com/), create a **New Web Service**.
2. Connect your GitHub repository and set **Root Directory** to `backend`.
3. Build Command: `npm install && npm run build`
4. Start Command: `node dist/server.js`
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5001`
   - `JWT_SECRET`: `your_secure_random_jwt_secret_2026`
   - `SUPABASE_URL`: `https://ryhtbvczmtuyfacjqfnm.supabase.co`
   - `SUPABASE_ANON_KEY`: `sb_publishable_0jXMf-UljXH-10w0n_pFIw_U3DKDj_r`
   - *(Optional)* `GEMINI_API_KEY`: `your_google_ai_studio_api_key`

---

## 🐳 Option 2: 1-Click Docker Container Deployment

You can run the entire production-ready system anywhere with Docker:

```bash
# Clone repository
git clone <your-repo-url>
cd school

# Build and start container in background
docker compose up --build -d
```
The application will be live at `http://localhost:5001` (or your server's public IP).

---

## 🗄️ Option 3: Supabase Cloud Database Setup

1. Open your Supabase Dashboard: [https://supabase.com/dashboard/project/ryhtbvczmtuyfacjqfnm](https://supabase.com/dashboard/project/ryhtbvczmtuyfacjqfnm)
2. Go to **SQL Editor** -> **New Query**.
3. Copy all contents from [`supabase_schema.sql`](file:///Users/razakahmedkhan/Desktop/school/supabase_schema.sql) and paste them into the SQL editor.
4. Click **Run** (▶️).
5. All 13 tables, RLS policies, and institutional seed data for Classes 1 to 8, 11 Faculty staff, PM-POSHAN meals, and SSA grants will be initialized.

---

## 🔑 Default Portal Login Credentials

| Role | Username | Password | Notes |
| :--- | :--- | :--- | :--- |
| **👑 Admin (Headmaster)** | `admin@gmsawanpora.edu.in` | `admin123` | Full access, user creation, grants, timetables |
| **👨‍🏫 Teacher** | `shabir.teacher@gms.edu` | `teacher123` | Attendance, marks entry, timetable view |
| **👨‍👩‍👧 Parent** | `nissar.parent@gms.edu` | `parent123` | Child progress, report card, notices |
| **🎓 Student** | `aaqib.student@gms.edu` | `student123` | AI report card, attendance, homework, ID card |

---

## ✅ Pre-Publish Verification Checklist

- [x] **Frontend TypeScript & Bundle**: Passed (`npx tsc --noEmit && npx vite build` in 1.68s).
- [x] **Backend TypeScript & Compilation**: Passed (`npx tsc` output to `dist/`).
- [x] **SPA Routing**: Configured in `frontend/vercel.json`.
- [x] **Responsive Mobile/Desktop**: Optimized for smartphones, tablets, and desktops.
- [x] **Print Media Styling**: Student ID card generation and Timetable printing enabled.
- [x] **SEO & Social Meta Tags**: Configured in `frontend/index.html`.
- [x] **Multi-role Security**: JWT auth with bcrypt password hashing and multi-tenant isolation.
