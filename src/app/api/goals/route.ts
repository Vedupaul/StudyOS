import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const weeklyGoals = await prisma.weeklyGoal.findMany({
            where: { userId: session.user.id },
            orderBy: { weekStartDate: 'desc' },
            take: 10
        })

        return successResponse(weeklyGoals)
    } catch (error) {
        return errorResponse('FETCH_FAILED', 'Failed to fetch goals')
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const body = await request.json()
        const goal = await prisma.weeklyGoal.create({
            data: {
                ...body,
                userId: session.user.id,
                weekStartDate: new Date(body.weekStartDate),
                weekEndDate: new Date(body.weekEndDate)
            }
        })

        return successResponse(goal, 'Goal created', 201)
    } catch (error) {
        return errorResponse('CREATE_FAILED', 'Failed to create goal')
    }
}
