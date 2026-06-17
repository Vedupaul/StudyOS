# 📚 StudyOS – Study & Focus Management Platform

<div align="center">
  <h3>A comprehensive productivity suite for students combining Pomodoro timers, intelligent task planning, and analytics</h3>
  <p><strong>Built with modern web technologies for optimal performance and user experience</strong></p>
</div>

---

## 🎯 Overview

**StudyOS** is a full-stack web application designed to transform study habits through scientifically-backed productivity techniques and real-time analytics. The platform provides students and learners with tools to maximize focus, track progress, and build sustainable study routines.

Core value proposition:
- ⏱️ **Scientifically-backed Pomodoro technique** with customizable durations
- 📊 **Real-time analytics & heatmaps** to visualize study patterns
- 📝 **Intelligent task planning** with time estimation and tracking
- 🎯 **Smart goal setting** with weekly and monthly milestones
- 🏆 **Gamification system** with badges and achievement tracking
- 🌓 **Dark/Light theme support** optimized for all-day studying

---

## ✨ Key Features

### 1. **Smart Pomodoro Timer**
- Customizable work/break durations (default 45min/15min)
- Real-time progress visualization with animated circle
- Auto-transition between focus and break sessions
- Session persistence and recovery
- Subject-specific session tracking

### 2. **Interactive Study Heatmap**
- Visual representation of study hours per day
- Monthly overview with color-coded intensity
- One-click date navigation
- Real-time data updates

### 3. **Daily Task Planner**
- Drag-and-drop task management with dnd-kit
- Time estimation vs actual tracking
- Subject organization and categorization
- Quick task entry with keyboard shortcuts (Enter to submit)

### 4. **Goal Management**
- Weekly subject-based goal setting
- Monthly milestone tracking
- Progress visualization with percentage indicators
- Gamified milestone badges (Consistency King, Exam Crusher)

### 5. **Performance Analytics Dashboard**
- 7-day, 30-day, and custom date range filtering
- Multi-metric tracking:
  - Total study time and session count
  - Average session duration
  - Focus score calculation
  - Productivity windows (Morning, Afternoon, Evening, Night)
- Interactive charts powered by Recharts
- Activity visualizer for deep insights

### 6. **Session History & Export**
- Complete study session record with timeline view
- Academic focus categorization
- Energy expenditure tracking
- CSV export functionality for data analysis

### 7. **Authentication & User Management**
- Secure JWT-based authentication
- Profile customization
- Password management with strength indicators
- Session preferences (notification toggles, auto-start settings)

---

## 🛠 Technology Stack

### **Frontend**
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js 14** | React framework with App Router, SSR, API routes | 14.2.35 |
| **React 18** | UI component library and state management | 18.3.0 |
| **TypeScript** | Type safety and developer experience | 5.6.0 |
| **Tailwind CSS** | Utility-first styling and responsive design | 3.4.0 |
| **shadcn/ui** | Pre-built, accessible UI components | Latest |
| **Recharts** | Data visualization and analytics charts | 2.12.0 |
| **dnd-kit** | Drag-and-drop functionality for task management | 6.1.0 |
| **next-themes** | Dark/light theme management | 0.3.0 |
| **Lucide React** | Icon library (441+ icons) | 0.441.0 |

### **Backend**
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js API Routes** | RESTful API endpoints | 14.2.35 |
| **NextAuth.js** | Authentication & session management | 4.24.0 |
| **Bcrypt** | Password hashing & security | 5.1.1 |
| **Zod** | Runtime schema validation | 3.23.0 |

### **Database & ORM**
| Technology | Purpose | Version |
|-----------|---------|---------|
| **PostgreSQL** | Primary relational database | Latest |
| **Prisma** | Type-safe ORM with migrations | 5.20.0 |

### **State Management & Data Fetching**
| Technology | Purpose | Version |
|-----------|---------|---------|
| **TanStack React Query** | Server state management, caching, sync | 5.56.0 |
| **Sonner** | Toast notifications | 2.0.7 |

### **Development Tools**
- **ESLint** – Code quality and standards enforcement
- **TypeScript** – Compile-time type checking
- **Prisma Studio** – Database management UI
- **PostCSS** – CSS processing and Tailwind compilation

---

## 📱 Application Screenshots

### Dashboard - Overview & Quick Stats
![Dashboard Overview](./public/screenshots/Dashboard.png)
*Welcome screen displaying study statistics, current streak, tasks completed, and total sessions at a glance.*

### Pomodoro Timer - Focus Session
![Pomodoro Timer](./public/screenshots/Pomodoro.png)
*Real-time timer display with animated progress circle, session controls, and focus/break mode toggle.*

### Study Heatmap - Visual Progress
![Study Heatmap](./public/screenshots/Study%20Heatmap.png)
*Monthly heatmap showing study hours per day with color-coded intensity for effective habit tracking.*

### Daily Planner - Task Management
![Daily Planner](./public/screenshots/Daily%20Planner.png)
*Drag-and-drop task management with time estimation, subject categorization, and quick entry feature.*

### Study Goals - Milestone Tracking
![Study Goals](./public/screenshots/Study%20Goals.png)
*Weekly goal setting interface with progress tracking, badges, and gamified milestone achievements.*

### Performance Analytics - Detailed Insights
![Performance Analytics](./public/screenshots/Performance%20Analytics.png)
*Comprehensive analytics dashboard with time tracking, focus scores, and productivity window analysis.*

### Performance Analytics - Advanced Metrics
![Performance Analytics 2](./public/screenshots/Performance%20Analytics%202.png)
*Multi-metric dashboard showing activity visualizer, total time, and session efficiency data.*

### Session History - Complete Records
![Session History](./public/screenshots/Session%20History.png)
*Full study session record with timeline view, academic focus categorization, and CSV export options.*

### App Settings - User Preferences
![App Settings](./public/screenshots/App%20Settings.png)
*User profile management, notification preferences, timer configuration, and security settings in one interface.*

### Theme Selector & System Preferences
![Theme Selection](./public/screenshots/Theme%20Selection.png)
*Dark/Light theme toggle with system preference detection for optimized all-day studying experience.*

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **PostgreSQL** database (local or cloud-hosted)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd studyos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env.local`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/studyos
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Setup database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
studyos/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes (auth, analytics, sessions)
│   │   ├── (auth)/              # Authentication pages (login, register)
│   │   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── globals.css          # Global styles with Tailwind
│   │   ├── layout.tsx           # Root layout with providers
│   │   └── page.tsx             # Home/landing page
│   ├── components/
│   │   ├── timer/               # Pomodoro timer component
│   │   ├── layout/              # Header, Sidebar, Navigation
│   │   ├── ui/                  # Reusable UI components
│   │   └── branding/            # Logo and branding
│   ├── lib/
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── db.ts                # Database client
│   │   ├── api-response.ts      # Response formatting
│   │   └── utils.ts             # Utility functions
│   └── types/
│       └── next-auth.d.ts       # Auth type definitions
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding script
├── database/
│   └── schema.sql               # SQL schema reference
├── public/
│   └── studyos-logo.svg         # Application logo
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` – User registration
- `POST /api/auth/[...nextauth]` – NextAuth endpoints

### Sessions
- `GET /api/sessions` – Fetch user sessions
- `POST /api/sessions` – Create new session
- `GET /api/analytics` – Study analytics data

### Tasks & Planning
- `GET /api/planner` – Get daily tasks
- `POST /api/planner` – Create task
- `POST /api/planner/tasks` – Task operations

### User & Preferences
- `GET /api/user` – User profile
- `PATCH /api/user` – Update profile
- `POST /api/user/password` – Change password
- `GET/POST /api/preferences` – User settings

### Goals & Subjects
- `GET/POST /api/goals` – Study goals
- `GET/POST /api/subjects` – Subject management

---

## 🎨 Design & Branding

- **Primary Font**: Press Start 2P (retro gaming aesthetic)
- **Color Scheme**: Dark-first design with indigo accents
- **Theme Support**: Full dark/light mode with system preference detection
- **Responsive Design**: Mobile-first approach (sm, md, lg breakpoints)
- **Accessibility**: WCAG 2.1 AA compliant components

---

## 🏗 Architecture Highlights

### **Frontend Architecture**
- Component-based with React hooks and Context
- Server components for data fetching (Next.js App Router)
- Client components for interactivity and forms
- Reusable UI component library (shadcn/ui)

### **Backend Architecture**
- RESTful API with Next.js API Routes
- Middleware-based request handling
- JWT authentication with NextAuth.js
- Input validation with Zod schemas

### **Database Design**
- Normalized schema with proper indexing
- Foreign key relationships for data integrity
- Prisma migrations for version control
- Optimized queries with select projections

---

## 📊 Performance Optimizations

- **Image Optimization**: Next.js Image component for automatic compression
- **Code Splitting**: Route-based lazy loading with App Router
- **Caching Strategy**: React Query with smart cache invalidation
- **Database Indexing**: Strategic indexes on frequently queried columns
- **CSS**: Tailwind's JIT compilation for minimal bundle size

---

## 🔐 Security Features

- **Password Security**: Bcrypt hashing with salt rounds
- **Session Management**: Secure JWT tokens with NextAuth.js
- **Input Validation**: Zod schema validation on all API endpoints
- **CSRF Protection**: Built-in Next.js and NextAuth.js protection
- **HTTPS Ready**: Production-grade security headers

---

## 📈 Future Enhancements

- [ ] Real-time collaboration for study groups
- [ ] AI-powered study recommendations
- [ ] Mobile app (React Native)
- [ ] Integration with calendar services (Google Calendar, Outlook)
- [ ] Email reminders and digest reports
- [ ] Advanced data export (PDF, Excel reports)
- [ ] Social features (leaderboards, challenges)

---

## 📝 Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run db:migrate       # Create database migration
npm run db:push          # Push schema changes to database
npm run db:seed          # Seed database with initial data
npm run db:studio        # Open Prisma Studio GUI
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License – see LICENSE file for details.

---

## 👤 Author

**Vedavrat Paul**  
*Full-stack Developer | Focus Scholar*

---

## 🙏 Acknowledgments

- Pomodoro technique inspiration
- shadcn/ui component library
- Next.js and React communities
- Prisma ORM documentation

---

<div align="center">
  <p><strong>Built with ❤️ for students who want to study smarter, not harder</strong></p>
</div>

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
