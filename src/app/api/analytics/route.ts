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

        return successResponse({
            totalMinutes: totalTime._sum.actualDuration || 0,
            sessionCount,
            subjectsBreakdown
        })
    } catch (error) {
        console.error('Analytics error:', error)
        return errorResponse('FETCH_FAILED', 'Failed to fetch analytics')
    }
}
