# AI Study Planner - Student Study Management Platform

**AI Study Planner** is a commercial-grade, full-stack, AI-powered student productivity and study management platform built for college students and academic administrators.

It empowers students to manage academic subjects, topics, exams, study schedules, spaced repetition revision, weak area tracking, daily comfort check-ins, freeform brain dumps, AI-generated quizzes, and personal study goals.

---

## Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router DOM, Recharts, Lucide React Icons.
- **Backend**: Node.js, Express.js REST API in TypeScript.
- **Database**: Supabase PostgreSQL with 15 tables, foreign key constraints, indexes, and Row-Level Security (RLS) policies.
- **AI Integration**: Google Gemini API (`@google/generative-ai`) proxying all AI operations server-side on the Express backend.

---

## Security Architecture

```
React 18 Frontend  ---> Express Backend Proxy  ---> Google Gemini API
(No AI Keys)            (Validates & Proxies)       (Secure Server Request)
```

- **Zero Client-Side Secret Exposure**: The `GEMINI_API_KEY` is strictly held on the Express backend server. No AI keys exist in Vite client bundles.
- **Supabase Authentication & RLS**: All tables in `database/schema.sql` feature PostgreSQL Row-Level Security. Students can only query/modify their own records, while administrators (role: `ADMIN`) can access aggregate administrative data.

---

## Core Features

1. **Split-Screen Academic Login**: Featuring visual college campus imagery, institutional crest branding, student/admin role toggling, and SSL data security notices.
2. **9-Step Student Onboarding Wizard**: Guided multi-step configuration for personal info, subjects, topics, exam dates, daily available study hours limit, preferred study windows, weak topics, and goals.
3. **Interactive Student Dashboard**: Includes greeting header, 6 KPI stat blocks (Today's study hours, completed tasks, overall progress %, closest exam countdown, study streak, pending tasks), Today's Study Plan, Upcoming Exams countdown cards, Weak Topics list, and Daily AI Recommendation card.
4. **AI Study Planner**: Structured daily task generator powered by Google Gemini. Respects daily study limits, prioritizes upcoming exams and weak topics, includes break intervals, and provides a **"Reschedule with AI"** engine for missed tasks.
5. **Smart Revision (Spaced Repetition)**: AI recommendations based on previous study dates, topic difficulty, confidence ratings, and exam proximity.
6. **Daily Comfort Check-In**: Captures student emotional state (*Very Comfortable, Comfortable, Normal, Stressed, Tired, Overwhelmed*) and workload difficulty to adapt study block lengths and break frequency without diagnostic claims.
7. **Freeform Brain Dump Parser**: Parses raw student text into actionable priorities, detected concerns, and recommended study steps.
8. **Interactive AI Quiz Generator**: Generates custom 5-20 question multiple choice quizzes with difficulty settings (*Easy, Medium, Hard*), score breakdowns, and step-by-step educational explanations.
9. **Progress Tracker & Recharts Analytics**: Visual charts for weekly study hours, subject syllabus completion, and practice test score trends.
10. **Institutional Admin Dashboard**: Role-protected dashboard displaying total students, active students, study plans generated, average progress, AI usage metrics, and searchable student directory.

---

## Quick Start & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Repository Setup & Environment Variables
Copy `.env.example` to backend `.env`:
```bash
GEMINI_API_KEY=your_google_gemini_api_key_here
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
PORT=5000
NODE_ENV=development
```

### 2. Database Migration (Supabase)
Run the SQL scripts in your Supabase SQL Editor:
1. Execute `database/schema.sql` to build tables, indexes, and RLS policies.
2. Execute `database/seed.sql` to populate initial demo data for **Sanjay Kumar** and an **Admin** user.

### 3. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
The Express backend will start at `http://localhost:5000`.

### 4. Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```
The React Vite frontend will run at `http://localhost:3000`.

---

## Deployment Guide

### Backend Deployment (Render)
1. Create a new **Web Service** on Render pointing to `backend/`.
2. Set Build Command: `npm install && npm run build`
3. Set Start Command: `npm run start`
4. Add Environment Variables: `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

### Frontend Deployment (Vercel or Render)
1. Deploy `frontend/` as a static site.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Add Environment Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/profile` | Sync Supabase profile data |
| `GET` | `/api/students/me` | Fetch student onboarding profile |
| `GET/POST` | `/api/subjects` | Manage academic subjects |
| `GET/POST` | `/api/topics` | Manage subject topics |
| `GET/POST` | `/api/exams` | Exam schedule & countdowns |
| `POST` | `/api/planner/generate` | Invoke Gemini AI to generate study schedule |
| `POST` | `/api/planner/reschedule` | AI redistribution of missed tasks |
| `POST` | `/api/ai/brain-dump` | Parse raw text brain dump |
| `POST` | `/api/ai/quiz` | Generate custom multiple choice quiz |
| `POST` | `/api/ai/chat` | AI Study Assistant chat proxy |
| `GET` | `/api/progress` | Analytics summary & charts data |
| `GET` | `/api/admin/analytics` | Admin system metrics (Admin Role Required) |

---
