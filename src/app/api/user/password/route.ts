import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { compare, hash } from 'bcrypt'
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const { currentPassword, newPassword } = await request.json()
        if (!currentPassword || !newPassword) {
            return errorResponse('VALIDATION_FAILED', 'Both current and new password are required')
        }
        if (newPassword.length < 8) {
            return errorResponse('VALIDATION_FAILED', 'New password must be at least 8 characters')
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user) return unauthorizedResponse()

        const isValid = await compare(currentPassword, user.passwordHash)
        if (!isValid) return errorResponse('INVALID_PASSWORD', 'Current password is incorrect', 400)

        const newHash = await hash(newPassword, 12)
        await prisma.user.update({
            where: { id: session.user.id },
            data: { passwordHash: newHash }
        })

        return successResponse(null, 'Password changed successfully')
    } catch (error) {
        return errorResponse('UPDATE_FAILED', 'Failed to change password')
    }
}
