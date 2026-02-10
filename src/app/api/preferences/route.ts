import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
    successResponse,
    unauthorizedResponse,
    errorResponse
} from '@/lib/api-response'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const preferences = await prisma.userPreferences.findUnique({
            where: { userId: session.user.id }
        })

        return successResponse(preferences)
    } catch (error) {
        console.error('Fetch preferences error:', error)
        return errorResponse('FETCH_FAILED', 'Failed to fetch preferences')
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const body = await request.json()

        const preferences = await prisma.userPreferences.upsert({
            where: { userId: session.user.id },
            update: body,
            create: {
                ...body,
                userId: session.user.id
            }
        })

        return successResponse(preferences, 'Preferences updated')
    } catch (error) {
        console.error('Update preferences error:', error)
        return errorResponse('UPDATE_FAILED', 'Failed to update preferences')
    }
}
