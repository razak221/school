# 🌐 Govt Middle School Awanpora ERP — Complete Publishing & Deployment Guide

Welcome to the production deployment and hosting guide for the **Govt Middle School Awanpora ERP & Multi-Role School Portal** (`v1.0.0 Live`).

---

## 🏗️ Architecture & Hosting Overview

| Component | Technology | Recommended Host | Cost (Free Tier Available) |
| :--- | :--- | :--- | :--- |
| **Public Portal & ERP Frontend** | React 18 + Vite + Tailwind CSS | **Vercel** / **Netlify** / **Cloudflare Pages** | **$0 / month** (100 GB bandwidth included) |
| **Backend REST API & Webhooks** | Node.js + Express + TypeScript | **Render** / **Railway** / **Fly.io** | **$0 / month** (Free tier available) |
| **Cloud Relational Database** | Supabase PostgreSQL + RLS | **Supabase Cloud** | **$0 / month** (500MB storage, 50,000 MAU) |
| **Payments & Invoicing** | Stripe Checkout & Webhooks | **Stripe** | **Pay-as-you-go** (No monthly fee) |
| **Full Stack Docker Container** | Multi-stage Docker + Compose | **DigitalOcean VPS / AWS / Linode** | **$4 - $6 / month** (Optional for self-hosting) |

---

## 💰 Total Cost to Publish

| Resource | Service | Monthly Cost | Annual Cost |
| :--- | :--- | :---: | :---: |
| **Frontend Hosting** | Vercel (Hobby Tier) | $0.00 | $0.00 |
| **Backend API Hosting** | Render / Railway (Hobby Tier) | $0.00 | $0.00 |
| **Database & Auth** | Supabase Cloud (Free Tier) | $0.00 | $0.00 |
| **SSL Certificates** | Automatic HTTPS (Let's Encrypt) | $0.00 | $0.00 |
| **Custom Domain (Optional)** | `.edu.in` / `.in` / `.org.in` / `.com` | — | ~$10 - $12 / year |
| **Total Minimum Cost** | **Zero-Cost Free Tier Setup** | **$0.00** | **$0.00** |

---

## 🚀 Step 1: Deploy Frontend to Vercel (Recommended)

1. Push your latest code to **GitHub / GitLab**:
   ```bash
   git add .
   git commit -m "chore: ready for production release"
   git push origin main
   ```
2. Log in to **[Vercel Dashboard](https://vercel.com/new)** and click **Add New Project**.
3. Import your `school` GitHub repository.
4. Configure the build settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Frontend Environment Variables:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `VITE_SUPABASE_URL` | `https://ryhtbvczmtuyfacjqfnm.supabase.co` | Supabase API endpoint |
   | `VITE_SUPABASE_ANON_KEY` | `sb_publishable_0jXMf-UljXH-10w0n_pFIw_U3DKDj_r` | Supabase publishable key |
   | `VITE_API_URL` | `https://your-backend-service.onrender.com` | Your live backend URL |
6. Click **Deploy**. Vercel will automatically detect [`frontend/vercel.json`](file:///Users/razakahmedkhan/Desktop/school/frontend/vercel.json) for client-side routing.

---

## ⚙️ Step 2: Deploy Backend API to Render / Railway

1. Open the **[Render Dashboard](https://dashboard.render.com/)** and click **New → Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name**: `gms-awanpora-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.js`
4. Add Backend Environment Variables:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `5001` | Express listening port |
   | `JWT_SECRET` | `your_secure_random_jwt_secret_2026` | Auth session token secret |
   | `SUPABASE_URL` | `https://ryhtbvczmtuyfacjqfnm.supabase.co` | Database endpoint |
   | `SUPABASE_ANON_KEY` | `sb_publishable_0jXMf-UljXH-10w0n_pFIw_U3DKDj_r` | Database access key |
   | `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` | For FinFlow payment sessions |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` | For Stripe webhook verification |
   | `GEMINI_API_KEY` | `AIzaSy...` *(Optional)* | For AI Marks remark generation |
5. Click **Create Web Service**. Your live backend endpoint will be available at `https://gms-awanpora-backend.onrender.com`.

---

## 🗄️ Step 3: Initialize Cloud Database (Supabase)

1. Open your Supabase SQL Editor:
   [https://supabase.com/dashboard/project/ryhtbvczmtuyfacjqfnm/sql](https://supabase.com/dashboard/project/ryhtbvczmtuyfacjqfnm/sql)
2. Copy the full contents of [`supabase_schema.sql`](file:///Users/razakahmedkhan/Desktop/school/supabase_schema.sql).
3. Paste into the SQL editor and click **Run** (▶️).
4. All tables (`organizations`, `users`, `students`, `teachers`, `parents`, `classes`, `attendance`, `marks`, `notices`, `grants`, `invoices`, `expenses`), Row Level Security policies, and initial school seed records will be initialized.

---

## 🐳 Step 4: Alternative 1-Click Docker Self-Hosting

If you prefer self-hosting on a single VPS (DigitalOcean, Hetzner, AWS EC2):

```bash
# Clone the repository
git clone <your-repo-url>
cd school

# Build and launch all services with Docker Compose
docker compose up --build -d
```

- Web Portal will run on: `http://<your-server-ip>:5001`
- Live Health Endpoint: `http://<your-server-ip>:5001/api/v1/health`

---

## 🔑 Default Portal Login Credentials

| Role | Username | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **👑 Admin (Headmaster)** | `admin@gmsawanpora.edu.in` | `admin123` | Full access, user creation, grants, timetables, finflow |
| **👨‍🏫 Teacher** | `teacher@gmsawanpora.edu.in` | `teacher123` | Class 8-A roll call, exam marks entry, CCE grades |
| **👨‍👩‍👧 Parent** | `parent@gmsawanpora.edu.in` | `parent123` | Child progress, report card, PM-POSHAN meal record |
| **🎓 Student** | `student@gmsawanpora.edu.in` | `student123` | Class schedule, exam results, attendance logs |

---

## 🌐 Public Routes & Entry Points

| URL Path | Target Audience | Description |
| :--- | :--- | :--- |
| **`/`** | **Public Visitors & Community** | Public School Portal, institutional stats, admissions circulars, faculty showcase |
| **`/login`** | **Staff & Students** | Multi-role authentication gateway for Teacher, Parent, Student, and Staff |
| **`/admin`** | **Headmaster & Admin** | Dedicated direct route to Administrative Console login |

---

## ✅ Pre-Publish Quality & Build Verification

- [x] **Frontend Production Bundle**: `npx vite build` clean (0 errors, 1.39s build time).
- [x] **Backend Compilation**: `npx tsc` clean (0 errors).
- [x] **SPA Client Routing**: Configured in [`frontend/vercel.json`](file:///Users/razakahmedkhan/Desktop/school/frontend/vercel.json).
- [x] **Strict RBAC Security**: Students & Parents have zero edit rights on attendance/timetable.
- [x] **Mobile Responsiveness**: Verified on phone, tablet, and desktop layouts.
- [x] **SEO & Meta Tags**: Configured in `frontend/index.html` with school UDISE `01061102301`.
