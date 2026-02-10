# StudyOS - System Architecture Documentation

## 📋 Project Overview

**StudyOS** is a full-stack study productivity web application that helps students study consistently using Pomodoro timers, focus tracking, customizable study planners, and detailed analytics. The system tracks daily, weekly, and monthly study hours, compares planned vs actual effort, and encourages discipline through streaks and achievement badges.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        Browser[Web Browser]
        UI[React/Next.js UI]
        Store[React Query Cache]
    end
    
    subgraph Server["Application Server - Next.js"]
        Router[Next.js App Router]
        Auth[NextAuth.js]
        API[API Routes]
        Middleware[Auth & Rate Limit Middleware]
    end
    
    subgraph Backend["Backend Services"]
        SessionSvc[Session Service]
        PlannerSvc[Planner Service]
        GoalSvc[Goals Service]
        AnalyticsSvc[Analytics Service]
        StreakSvc[Streak Service]
    end
    
    subgraph Data["Data Layer"]
        Prisma[Prisma ORM]
        DB[(PostgreSQL Database)]
        Views[Database Views]
    end
    
    Browser --> UI
    UI --> Store
    UI --> Router
    Router --> Middleware
    Middleware --> Auth
    Middleware --> API
    
    API --> SessionSvc
    API --> PlannerSvc
    API --> GoalSvc
    API --> AnalyticsSvc
    API --> StreakSvc
    
    SessionSvc --> Prisma
    PlannerSvc --> Prisma
    GoalSvc --> Prisma
    AnalyticsSvc --> Prisma
    StreakSvc --> Prisma
    
    Prisma --> DB
    DB --> Views
    Views --> Prisma
    
    style Client fill:#e1f5ff
    style Server fill:#fff4e1
    style Backend fill:#e8f5e9
    style Data fill:#f3e5f5
```

---

## 🔄 Data Flow Diagrams

### User Authentication Flow
```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend
    participant Auth as NextAuth
    participant DB as Database
    
    U->>UI: Enter credentials
    UI->>Auth: Login request
    Auth->>DB: Verify user
    DB-->>Auth: User data
    Auth->>Auth: Generate JWT
    Auth-->>UI: Return token + session
    UI->>UI: Store session
    UI-->>U: Redirect to dashboard
```

### Study Session Flow
```mermaid
sequenceDiagram
    participant U as User
    participant UI as Timer UI
    participant API as Sessions API
    participant DB as Database
    
    U->>UI: Start Pomodoro
    UI->>API: POST /api/sessions (start_time)
    API->>DB: Create session record
    DB-->>API: Session ID
    API-->>UI: Session created
    
    loop Every 30 seconds
        UI->>API: PATCH /api/sessions/:id (progress)
        API->>DB: Update session
    end
    
    U->>UI: Complete session
    UI->>API: PATCH /api/sessions/:id (end_time, focus_score)
    API->>DB: Finalize session
    API->>API: Update streaks
    API->>API: Check achievements
    DB-->>API: Confirmation
    API-->>UI: Session completed
    UI-->>U: Show summary
```

### Analytics Generation Flow
```mermaid
sequenceDiagram
    participant U as User
    participant UI as Dashboard
    participant API as Analytics API
    participant Views as DB Views
    participant DB as Database
    
    U->>UI: Open dashboard
    UI->>API: GET /api/analytics/dashboard
    API->>Views: Query daily_study_stats
    API->>Views: Query subject_study_stats
    API->>DB: Query streaks
    Views-->>API: Aggregated data
    DB-->>API: Raw data
    API->>API: Calculate metrics
    API-->>UI: Analytics payload
    UI->>UI: Render charts
    UI-->>U: Display insights
```

---

## 🗄️ Database Schema Overview

### Entity Relationship Diagram
```mermaid
erDiagram
    USERS ||--o{ USER_PREFERENCES : has
    USERS ||--o{ SUBJECTS : creates
    USERS ||--o{ STUDY_SESSIONS : records
    USERS ||--o{ DAILY_PLANS : creates
    USERS ||--o{ WEEKLY_GOALS : sets
    USERS ||--o{ MONTHLY_GOALS : sets
    USERS ||--|| STREAKS : maintains
    USERS ||--o{ USER_ACHIEVEMENTS : earns
    
    SUBJECTS ||--o{ STUDY_SESSIONS : categorizes
    SUBJECTS ||--o{ PLAN_TASKS : organizes
    SUBJECTS ||--o{ WEEKLY_GOALS : targets
    
    DAILY_PLANS ||--o{ PLAN_TASKS : contains
    
    ACHIEVEMENTS ||--o{ USER_ACHIEVEMENTS : defines
    
    USERS {
        uuid id PK
        string email UK
        string password_hash
        string name
        timestamptz created_at
    }
    
    STUDY_SESSIONS {
        uuid id PK
        uuid user_id FK
        uuid subject_id FK
        string session_type
        timestamptz start_time
        timestamptz end_time
        int actual_duration
        int focus_score
    }
    
    DAILY_PLANS {
        uuid id PK
        uuid user_id FK
        date plan_date UK
        int total_planned_minutes
        int total_actual_minutes
    }
    
    PLAN_TASKS {
        uuid id PK
        uuid daily_plan_id FK
        uuid subject_id FK
        string task_name
        int planned_duration
        int actual_duration
        string status
    }
```

### Key Database Features
- **UUIDs as Primary Keys**: Better for distributed systems and security
- **Cascade Deletion**: User deletion automatically removes all related data
- **Indexes**: Optimized for common queries (user_id, dates, status)
- **Check Constraints**: Data validation at database level
- **Triggers**: Auto-update `updated_at` timestamps
- **Views**: Pre-computed statistics for analytics

---

## 🔌 API Architecture

### API Route Structure
```
/api
├── /auth
│   ├── /[...nextauth]      # NextAuth.js handlers (GET, POST)
│   └── /register           # User registration (POST)
│
├── /sessions
│   ├── /                   # List/create sessions (GET, POST)
│   └── /[id]               # Update/delete session (PATCH, DELETE)
│
├── /planner
│   ├── /                   # Create/list plans (GET, POST)
│   ├── /[id]               # Update plan (PATCH)
│   └── /tasks
│       ├── /               # Create task (POST)
│       └── /[id]           # Update/delete task (PATCH, DELETE)
│
├── /goals
│   ├── /weekly
│   │   ├── /               # List/create weekly goals (GET, POST)
│   │   └── /[id]           # Update weekly goal (PATCH)
│   └── /monthly
│       ├── /               # List/create monthly goals (GET, POST)
│       └── /[id]           # Update monthly goal (PATCH)
│
├── /analytics
│   ├── /dashboard          # Dashboard stats (GET)
│   └── /insights           # Advanced insights (GET)
│
├── /subjects
│   ├── /                   # List/create subjects (GET, POST)
│   └── /[id]               # Update/delete subject (PATCH, DELETE)
│
└── /preferences            # Get/update preferences (GET, PATCH)
```

### API Response Format
```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

---

## 🎨 Frontend Architecture

### Page Structure
```
app/
├── (auth)/
│   ├── login/              # Login page
│   └── register/           # Registration page
│
├── (dashboard)/
│   ├── layout.tsx          # Protected layout with sidebar
│   ├── dashboard/          # Main dashboard
│   ├── timer/              # Pomodoro/Focus timer
│   ├── planner/            # Daily planner
│   ├── goals/              # Goals management
│   ├── analytics/          # Analytics & insights
│   ├── history/            # Session history
│   └── settings/           # User settings
│
└── api/                    # API routes
```

### Component Hierarchy
```mermaid
graph TB
    Root[Root Layout]
    Root --> AuthLayout[Auth Layout]
    Root --> DashLayout[Dashboard Layout]
    
    AuthLayout --> Login[Login Page]
    AuthLayout --> Register[Register Page]
    
    DashLayout --> Sidebar[Sidebar Nav]
    DashLayout --> Header[Header]
    DashLayout --> Pages[Page Content]
    
    Pages --> Dashboard[Dashboard]
    Pages --> Timer[Timer]
    Pages --> Planner[Planner]
    Pages --> Goals[Goals]
    Pages --> Analytics[Analytics]
    
    Dashboard --> StatCards[Stat Cards]
    Dashboard --> Charts[Charts]
    Dashboard --> StreakDisplay[Streak Display]
    
    Timer --> PomodoroTimer[Pomodoro Timer]
    Timer --> SessionForm[Session Form]
    
    Planner --> TaskList[Task List - DnD]
    Planner --> TaskCard[Task Cards]
    
    Analytics --> HeatMap[Productivity Heatmap]
    Analytics --> StudyCharts[Study Charts]
```

### State Management Strategy
- **Server State**: React Query for API data caching and synchronization
- **UI State**: React useState for local component state
- **Global State**: React Context for theme, user preferences
- **Form State**: React Hook Form for form handling

---

## 🔐 Security Architecture

### Authentication & Authorization
```mermaid
flowchart LR
    Request[API Request] --> Middleware{Auth Middleware}
    Middleware -->|No Token| Reject[401 Unauthorized]
    Middleware -->|Invalid Token| Reject
    Middleware -->|Valid Token| Decode[Decode JWT]
    Decode --> Verify{Verify User}
    Verify -->|User Not Found| Reject
    Verify -->|User Inactive| Reject
    Verify -->|Valid User| Proceed[Process Request]
    Proceed --> RateLimit{Rate Limit Check}
    RateLimit -->|Exceeded| Throttle[429 Too Many Requests]
    RateLimit -->|OK| Execute[Execute API Handler]
```

### Security Measures
1. **Password Security**
   - bcrypt hashing with salt rounds (12)
   - Minimum password requirements enforced

2. **JWT Tokens**
   - Short-lived access tokens (1 hour)
   - HTTP-only cookies for session storage
   - Automatic token refresh

3. **API Protection**
   - Rate limiting (100 requests/15 min per user)
   - Input validation with Zod schemas
   - SQL injection prevention (Prisma ORM)
   - CORS configuration

4. **Data Privacy**
   - User data isolation (all queries filtered by user_id)
   - Cascade deletion on account removal
   - No sensitive data in client-side storage

---

## 📊 Analytics & Reporting

### Key Metrics Tracked
1. **Study Time Metrics**
   - Total study time (daily/weekly/monthly)
   - Subject-wise breakdown
   - Session count and average duration

2. **Quality Metrics**
   - Average focus score
   - Interruption count
   - Completion rate

3. **Planning Metrics**
   - Planned vs actual time comparison
   - Task completion rate
   - Goal achievement percentage

4. **Engagement Metrics**
   - Study streaks (current/longest)
   - Total study days
   - Achievements earned

### Database Views for Analytics
- `daily_study_stats`: Pre-aggregated daily statistics
- `subject_study_stats`: Subject-wise study time totals
- Real-time queries for custom date ranges

---

## 🚀 Performance Optimization

### Database Optimization
- Indexed columns for frequent queries
- Database views for complex aggregations
- Connection pooling with Prisma
- Efficient cascade rules

### Frontend Optimization
- Server-side rendering with Next.js
- React Query caching (5-minute stale time)
- Code splitting and lazy loading
- Optimized images with Next.js Image

### API Optimization
- Response pagination for large datasets
- Conditional requests (ETag, Last-Modified)
- Compression middleware
- Query optimization (select specific fields)

---

## 📱 Responsive Design Strategy

### Breakpoints
- Mobile: 0-640px
- Tablet: 641-1024px
- Desktop: 1025px+

### Mobile Adaptations
- Collapsible sidebar → Bottom navigation
- Stacked cards instead of grid
- Touch-optimized timer controls
- Simplified analytics charts

---

## 🔄 Data Synchronization

### Auto-Save Strategy
- Timer sessions auto-save every 30 seconds
- Optimistic updates for instant UI feedback
- Conflict resolution (last write wins)
- Local storage backup for offline resilience

### Real-time Features
- Session progress updates
- Streak calculations on session completion
- Achievement unlocks

---

## 📦 Deployment Architecture

```mermaid
flowchart TB
    subgraph Production
        Vercel[Vercel - Next.js App]
        DB[PostgreSQL Database]
        CDN[Vercel CDN]
    end
    
    subgraph Development
        Local[Local Dev Server]
        LocalDB[Local PostgreSQL]
    end
    
    GitHub[GitHub Repository]
    
    GitHub -->|Auto Deploy| Vercel
    Vercel --> DB
    Vercel --> CDN
    
    Local --> LocalDB
    Local -->|Git Push| GitHub
```

### Environment Strategy
- **Development**: Local PostgreSQL, hot reload
- **Production**: Managed PostgreSQL (e.g., Vercel Postgres, Supabase), CDN optimization

---

## 📚 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14, React 18 | Server-side rendering, routing |
| Styling | Tailwind CSS, shadcn/ui | Responsive design, components |
| State | React Query, Context | Server/client state management |
| Backend | Next.js API Routes | RESTful API endpoints |
| Auth | NextAuth.js | Authentication & sessions |
| Database | PostgreSQL | Relational data storage |
| ORM | Prisma | Type-safe database access |
| Validation | Zod | Input validation |
| Charts | Recharts | Data visualization |
| DnD | @dnd-kit/core | Drag-and-drop planner |

---

## 📝 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout

### Study Sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions?from=&to=&subject=` - List sessions
- `PATCH /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### Daily Planner
- `POST /api/planner` - Create daily plan
- `GET /api/planner?date=YYYY-MM-DD` - Get plan by date
- `POST /api/planner/tasks` - Add task
- `PATCH /api/planner/tasks/:id` - Update task
- `DELETE /api/planner/tasks/:id` - Delete task

### Goals
- `POST /api/goals/weekly` - Create weekly goal
- `GET /api/goals/weekly?week=YYYY-WW` - Get weekly goals
- `PATCH /api/goals/weekly/:id` - Update goal
- `POST /api/goals/monthly` - Create monthly goal
- `GET /api/goals/monthly?month=YYYY-MM` - Get monthly goals

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/insights?period=week|month` - Get insights

### Subjects
- `GET /api/subjects` - List user subjects
- `POST /api/subjects` - Create subject
- `PATCH /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Archive subject

### Preferences
- `GET /api/preferences` - Get user preferences
- `PATCH /api/preferences` - Update preferences

---

This architecture provides a scalable, secure, and maintainable foundation for StudyOS with clear separation of concerns and optimized performance.
