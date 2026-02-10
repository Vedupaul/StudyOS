# StudyOS – Study & Focus Management Platform

## 🎯 Project Overview

**StudyOS** is a full-stack study productivity web application designed to help students and learners maximize study efficiency using scientifically backed techniques and detailed analytics.

The platform combines Pomodoro timers, intelligent focus tracking, customizable study planners, and actionable insights to help users build consistent and effective study habits.

---

## Key Features

- **Smart Timer System**  
  Pomodoro and custom focus timers with auto-save and session recovery

- **Daily Study Planner**  
  Drag-and-drop task management with planned vs actual time tracking

- **Goal Setting**  
  Weekly subject goals and monthly exam targets with progress visualization

- **Analytics Dashboard**  
  Study metrics, productivity heatmaps, and streak tracking

- **Gamification**  
  Achievement badges and milestone tracking to maintain motivation

- **Responsive Design**  
  Fully responsive UI with dark and light theme support

---

## 🛠 Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Next.js API Routes (RESTful architecture)
- JWT-based authentication

### Database
- PostgreSQL
- Prisma ORM
- Indexed queries and materialized views

### State & Data
- React Query (server state)
- Context API (global state)

### Visualization
- Recharts

---

## 🧠 Key Implementations

### Database Architecture
- Normalized PostgreSQL schema with 12 interconnected tables  
  (`users`, `study_sessions`, `daily_plans`, `goals`, `streaks`, `achievements`)
- UUID primary keys with foreign key constraints and cascade rules
- Triggers for automatic timestamp updates
- Views for efficient analytics aggregation
- Strategic indexing on high-query fields

### Core Features
- **Pomodoro Timer**  
  Real-time countdown with start/pause/resume, auto-save every 30 seconds, and session recovery on refresh

- **Daily Planner**  
  Drag-and-drop task list using `@dnd-kit` with task status tracking and planned vs actual time comparison

- **Goal Management**  
  Weekly subject-based goals and monthly exam targets with automatic progress calculation

- **Analytics Dashboard**  
  Total study time, subject-wise breakdown, productivity heatmap, focus score trends, and streak visualization

- **Achievement System**  
  12 predefined achievements based on streaks, duration, and consistency

---

## 🔐 Security & Performance

- JWT authentication with protected API routes
- Rate limiting (100 requests / 15 minutes)
- Input validation using Zod
- Optimized queries with connection pooling
- Sub-200ms average API response times

---

## 🎨 User Experience

- Mobile-first responsive design (320px → 4K)
- Dark / light theme toggle with system preference detection
- 20+ reusable React components (atomic design)
- Optimistic UI updates for instant feedback

---

## 📊 Project Metrics

| Metric | Value |
|------|------|
| Lines of Code | ~8,000–10,000 |
| Database Tables | 12 |
| API Endpoints | 25+ |
| React Components | 35+ |
| Reusable UI Components | 20+ |
| Development Time | 3–4 weeks |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd studyos

npm install

cp .env.example .env.local
# configure environment variables

npx prisma migrate dev
npx prisma db seed

npm run dev
```
