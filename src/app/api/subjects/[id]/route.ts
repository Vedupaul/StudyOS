import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/api-response'

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        await prisma.subject.delete({
            where: {
                id: params.id,
                userId: session.user.id
            }
        })

        return successResponse(null, 'Subject deleted successfully')
    } catch (error) {
        console.error('Failed to delete subject:', error)
        return errorResponse('DELETE_FAILED', 'Failed to delete subject')
    }
}
