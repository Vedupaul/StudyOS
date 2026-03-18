import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        // Aggregated stats for the dashboard/analytics
        const totalTime = await prisma.studySession.aggregate({
            where: {
                userId: session.user.id,
                isCompleted: true
            },
            _sum: { actualDuration: true }
        })

        const sessionCount = await prisma.studySession.count({
            where: { userId: session.user.id }
        })

        const subjectsBreakdown = await prisma.studySession.groupBy({
            by: ['subjectId'],
            where: { userId: session.user.id },
            _sum: { actualDuration: true }
        })

        // Aggregate by time of day
        const sessions = await prisma.studySession.findMany({
            where: {
                userId: session.user.id,
                isCompleted: true
            },
            select: {
                startTime: true,
                actualDuration: true
            }
        })

        const timeOfDay = {
            morning: 0,   // 6-12
            afternoon: 0, // 12-17
            evening: 0,   // 17-21
            night: 0      // 21-6
        }

        sessions.forEach(s => {
            const hour = new Date(s.startTime).getHours()
            const duration = s.actualDuration || 0
            if (hour >= 6 && hour < 12) timeOfDay.morning += duration
            else if (hour >= 12 && hour < 17) timeOfDay.afternoon += duration
            else if (hour >= 17 && hour < 21) timeOfDay.evening += duration
            else timeOfDay.night += duration
        })

        return successResponse({
            totalMinutes: totalTime._sum.actualDuration || 0,
            sessionCount,
            subjectsBreakdown,
            timeOfDay
        })
    } catch (error) {
        console.error('Analytics error:', error)
        return errorResponse('FETCH_FAILED', 'Failed to fetch analytics')
    }
}
