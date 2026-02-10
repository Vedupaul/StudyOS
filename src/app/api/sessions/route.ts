import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sessionSchema } from '@/lib/validation'
import {
    successResponse,
    errorResponse,
    validationError,
    unauthorizedResponse
} from '@/lib/api-response'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const searchParams = request.nextUrl.searchParams
        const limit = parseInt(searchParams.get('limit') || '50')

        const userSessions = await prisma.studySession.findMany({
            where: { userId: session.user.id },
            orderBy: { startTime: 'desc' },
            take: limit,
            include: {
                subject: {
                    select: { name: true, color: true }
                }
            }
        })

        return successResponse(userSessions)
    } catch (error) {
        console.error('Failed to fetch sessions:', error)
        return errorResponse('FETCH_FAILED', 'Failed to fetch study sessions')
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const body = await request.json()
        const validation = sessionSchema.safeParse(body)

        if (!validation.success) {
            return validationError(validation.error.format())
        }

        const { duration, type, status, subjectId, notes, taskId } = validation.data

        const newSession = await prisma.studySession.create({
            data: {
                userId: session.user.id,
                actualDuration: duration,
                sessionType: type || 'FOCUS',
                isCompleted: status === 'COMPLETED',
                subjectId,
                notes,
                startTime: new Date(Date.now() - duration * 60 * 1000),
                endTime: new Date(),
            }
        })

        // Update user streak if this is a completed session
        if (status === 'COMPLETED') {
            await prisma.streak.upsert({
                where: { userId: session.user.id },
                update: {
                    currentStreak: { increment: 1 },
                    lastStudyDate: new Date(),
                },
                create: {
                    userId: session.user.id,
                    currentStreak: 1,
                    lastStudyDate: new Date(),
                }
            })
        }

        return successResponse(newSession, 'Study session recorded successfully', 201)
    } catch (error) {
        console.error('Failed to create session:', error)
        return errorResponse('CREATE_FAILED', 'Failed to record study session')
    }
}
