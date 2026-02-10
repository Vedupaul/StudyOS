-- StudyOS Database Schema
-- PostgreSQL with UUID primary keys, proper indexes, and constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- User preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pomodoro_duration INTEGER DEFAULT 25 CHECK (pomodoro_duration BETWEEN 1 AND 90),
    short_break_duration INTEGER DEFAULT 5 CHECK (short_break_duration BETWEEN 1 AND 30),
    long_break_duration INTEGER DEFAULT 15 CHECK (long_break_duration BETWEEN 1 AND 60),
    timezone VARCHAR(50) DEFAULT 'UTC',
    theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    notifications_enabled BOOLEAN DEFAULT true,
    auto_start_breaks BOOLEAN DEFAULT false,
    auto_start_pomodoros BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id)
);

-- Subjects table
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    icon VARCHAR(50),
    description TEXT,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT color_format CHECK (color ~* '^#[0-9A-Fa-f]{6}$'),
    UNIQUE(user_id, name)
);

-- Study sessions table
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('pomodoro', 'focus', 'break')),
    task_name VARCHAR(200),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    planned_duration INTEGER, -- in minutes
    actual_duration INTEGER, -- calculated in minutes
    focus_score INTEGER CHECK (focus_score BETWEEN 1 AND 5),
    notes TEXT,
    is_completed BOOLEAN DEFAULT false,
    interruptions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT end_after_start CHECK (end_time IS NULL OR end_time > start_time)
);

-- Daily plans table
CREATE TABLE daily_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    total_planned_minutes INTEGER DEFAULT 0,
    total_actual_minutes INTEGER DEFAULT 0,
    notes TEXT,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, plan_date)
);

-- Plan tasks table
CREATE TABLE plan_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    daily_plan_id UUID NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    task_name VARCHAR(200) NOT NULL,
    description TEXT,
    planned_duration INTEGER NOT NULL CHECK (planned_duration > 0), -- in minutes
    actual_duration INTEGER DEFAULT 0,
    task_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'partially_completed', 'skipped')),
    skip_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Weekly goals table
CREATE TABLE weekly_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    target_minutes INTEGER NOT NULL CHECK (target_minutes > 0),
    actual_minutes INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT week_dates CHECK (week_end_date > week_start_date),
    UNIQUE(user_id, subject_id, week_start_date)
);

-- Monthly goals table
CREATE TABLE monthly_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_name VARCHAR(200) NOT NULL,
    description TEXT,
    target_minutes INTEGER NOT NULL CHECK (target_minutes > 0),
    actual_minutes INTEGER DEFAULT 0,
    month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    subjects UUID[] DEFAULT '{}', -- Array of subject IDs
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT month_format CHECK (month_year ~* '^\d{4}-\d{2}$'),
    UNIQUE(user_id, month_year, goal_name)
);

-- Streaks table
CREATE TABLE streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_study_date DATE,
    total_study_days INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id)
);

-- Achievements table (predefined achievements)
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    category VARCHAR(50),
    requirement_value INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User achievements table (earned achievements)
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, achievement_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_study_sessions_user_date ON study_sessions(user_id, start_time DESC);
CREATE INDEX idx_study_sessions_subject ON study_sessions(subject_id);
CREATE INDEX idx_daily_plans_user_date ON daily_plans(user_id, plan_date DESC);
CREATE INDEX idx_plan_tasks_daily_plan ON plan_tasks(daily_plan_id);
CREATE INDEX idx_weekly_goals_user_week ON weekly_goals(user_id, week_start_date DESC);
CREATE INDEX idx_monthly_goals_user_month ON monthly_goals(user_id, month_year DESC);
CREATE INDEX idx_subjects_user ON subjects(user_id) WHERE is_archived = false;
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_sessions_updated_at BEFORE UPDATE ON study_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_plans_updated_at BEFORE UPDATE ON daily_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plan_tasks_updated_at BEFORE UPDATE ON plan_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_goals_updated_at BEFORE UPDATE ON weekly_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_goals_updated_at BEFORE UPDATE ON monthly_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for daily study statistics
CREATE OR REPLACE VIEW daily_study_stats AS
SELECT 
    user_id,
    DATE(start_time) as study_date,
    COUNT(*) as total_sessions,
    SUM(actual_duration) as total_minutes,
    AVG(focus_score) as avg_focus_score,
    COUNT(DISTINCT subject_id) as subjects_studied
FROM study_sessions
WHERE is_completed = true AND session_type IN ('pomodoro', 'focus')
GROUP BY user_id, DATE(start_time);

-- View for subject-wise study time
CREATE OR REPLACE VIEW subject_study_stats AS
SELECT 
    s.user_id,
    s.id as subject_id,
    s.name as subject_name,
    s.color as subject_color,
    COUNT(ss.id) as total_sessions,
    COALESCE(SUM(ss.actual_duration), 0) as total_minutes,
    COALESCE(AVG(ss.focus_score), 0) as avg_focus_score
FROM subjects s
LEFT JOIN study_sessions ss ON s.id = ss.subject_id AND ss.is_completed = true
GROUP BY s.user_id, s.id, s.name, s.color;

-- Seed initial achievements
INSERT INTO achievements (name, description, icon, category, requirement_value) VALUES
    ('First Session', 'Complete your first study session', '🎯', 'milestones', 1),
    ('Early Bird', 'Study before 8 AM', '🌅', 'habits', 1),
    ('Night Owl', 'Study after 10 PM', '🦉', 'habits', 1),
    ('Consistency King', 'Study for 7 consecutive days', '👑', 'streaks', 7),
    ('Marathon Master', 'Study for 4+ hours in a day', '🏃', 'duration', 240),
    ('Focus Champion', 'Achieve 5★ focus score 10 times', '⭐', 'quality', 10),
    ('Week Warrior', 'Complete 5 days of study in a week', '💪', 'weekly', 5),
    ('Month Master', 'Study every day for a month', '📅', 'monthly', 30),
    ('Pomodoro Pro', 'Complete 100 Pomodoro sessions', '🍅', 'technique', 100),
    ('Subject Scholar', 'Study 5 different subjects', '📚', 'variety', 5),
    ('Planner Perfectionist', 'Complete 10 daily plans 100%', '✅', 'planning', 10),
    ('Dedicated Student', 'Accumulate 100 hours of study time', '🎓', 'milestones', 6000);
