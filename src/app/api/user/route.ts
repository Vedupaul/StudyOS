import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, name: true, email: true, createdAt: true }
        })

        return successResponse(user)
    } catch (error) {
        return errorResponse('FETCH_FAILED', 'Failed to fetch profile')
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const { name } = await request.json()
        if (!name?.trim()) return errorResponse('VALIDATION_FAILED', 'Name is required')

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: { name: name.trim() },
            select: { id: true, name: true, email: true }
        })

        return successResponse(user, 'Profile updated successfully')
    } catch (error) {
        return errorResponse('UPDATE_FAILED', 'Failed to update profile')
    }
}
