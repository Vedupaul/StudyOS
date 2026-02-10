import { z } from 'zod'

// Auth validation schemas
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
})

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

// Session validation
export const sessionSchema = z.object({
    duration: z.number().int().positive(),
    type: z.enum(['FOCUS', 'BREAK']).optional(),
    status: z.enum(['COMPLETED', 'PARTIAL', 'SKIPPED']).optional(),
    subjectId: z.string().uuid().optional(),
    notes: z.string().optional(),
    taskId: z.string().uuid().optional(),
})

export const createSessionSchema = z.object({
    subjectId: z.string().uuid().optional(),
    sessionType: z.enum(['pomodoro', 'focus', 'break']),
    taskName: z.string().optional(),
    plannedDuration: z.number().int().positive().optional(),
    startTime: z.string().datetime(),
})

export const updateSessionSchema = z.object({
    endTime: z.string().datetime().optional(),
    actualDuration: z.number().int().nonnegative().optional(),
    focusScore: z.number().int().min(1).max(5).optional(),
    notes: z.string().optional(),
    isCompleted: z.boolean().optional(),
    interruptions: z.number().int().nonnegative().optional(),
})

// Subject validation
export const createSubjectSchema = z.object({
    name: z.string().min(1, 'Subject name is required').max(100),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color code').optional(),
    icon: z.string().optional(),
    description: z.string().optional(),
})

export const updateSubjectSchema = createSubjectSchema.partial()

// Daily plan validation
export const createDailyPlanSchema = z.object({
    planDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    notes: z.string().optional(),
})

export const createPlanTaskSchema = z.object({
    dailyPlanId: z.string().uuid(),
    subjectId: z.string().uuid().optional(),
    taskName: z.string().min(1, 'Task name is required').max(200),
    description: z.string().optional(),
    plannedDuration: z.number().int().positive('Planned duration must be positive'),
    taskOrder: z.number().int().nonnegative().optional(),
})

export const updatePlanTaskSchema = z.object({
    taskName: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    actualDuration: z.number().int().nonnegative().optional(),
    taskOrder: z.number().int().nonnegative().optional(),
    status: z.enum(['pending', 'in_progress', 'completed', 'partially_completed', 'skipped']).optional(),
    skipReason: z.string().optional(),
})

// Goals validation
export const createWeeklyGoalSchema = z.object({
    subjectId: z.string().uuid().optional(),
    weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    weekEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    targetMinutes: z.number().int().positive(),
    description: z.string().optional(),
})

export const createMonthlyGoalSchema = z.object({
    goalName: z.string().min(1, 'Goal name is required').max(200),
    description: z.string().optional(),
    targetMinutes: z.number().int().positive(),
    monthYear: z.string().regex(/^\d{4}-\d{2}$/, 'Invalid month format (YYYY-MM)'),
    subjects: z.array(z.string().uuid()).optional(),
})

// Preferences validation
export const updatePreferencesSchema = z.object({
    pomodoroDuration: z.number().int().min(1).max(90).optional(),
    shortBreakDuration: z.number().int().min(1).max(30).optional(),
    longBreakDuration: z.number().int().min(1).max(60).optional(),
    timezone: z.string().optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
    notificationsEnabled: z.boolean().optional(),
    autoStartBreaks: z.boolean().optional(),
    autoStartPomodoros: z.boolean().optional(),
})

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type SessionInput = z.infer<typeof sessionSchema>
export type CreateSessionInput = z.infer<typeof createSessionSchema>
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>
export type CreateDailyPlanInput = z.infer<typeof createDailyPlanSchema>
export type CreatePlanTaskInput = z.infer<typeof createPlanTaskSchema>
export type UpdatePlanTaskInput = z.infer<typeof updatePlanTaskSchema>
export type CreateWeeklyGoalInput = z.infer<typeof createWeeklyGoalSchema>
export type CreateMonthlyGoalInput = z.infer<typeof createMonthlyGoalSchema>
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>
