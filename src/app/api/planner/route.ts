import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createDailyPlanSchema } from '@/lib/validation'
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
        const date = searchParams.get('date') // YYYY-MM-DD

        const plans = await prisma.dailyPlan.findMany({
            where: {
                userId: session.user.id,
                ...(date ? { planDate: new Date(date) } : {})
            },
            include: {
                tasks: {
                    orderBy: { taskOrder: 'asc' },
                    include: {
                        subject: { select: { name: true, color: true } }
                    }
                }
            },
            orderBy: { planDate: 'desc' }
        })

        return successResponse(plans)
    } catch (error) {
        console.error('Failed to fetch plans:', error)
        return errorResponse('FETCH_FAILED', 'Failed to fetch daily plans')
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const body = await request.json()
        const validation = createDailyPlanSchema.safeParse(body)

        if (!validation.success) {
            return validationError(validation.error.format())
        }

        const { planDate, notes } = validation.data

        const plan = await prisma.dailyPlan.upsert({
            where: {
                userId_planDate: {
                    userId: session.user.id,
                    planDate: new Date(planDate)
                }
            },
            update: { notes },
            create: {
                userId: session.user.id,
                planDate: new Date(planDate),
                notes
            }
        })

        return successResponse(plan, 'Daily plan created/updated successfully')
    } catch (error) {
        console.error('Failed to create plan:', error)
        return errorResponse('CREATE_FAILED', 'Failed to create daily plan')
    }
}
