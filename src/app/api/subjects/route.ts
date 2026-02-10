import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createSubjectSchema } from '@/lib/validation'
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

        const subjects = await prisma.subject.findMany({
            where: { userId: session.user.id },
            orderBy: { name: 'asc' }
        })

        return successResponse(subjects)
    } catch (error) {
        return errorResponse('FETCH_FAILED', 'Failed to fetch subjects')
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const body = await request.json()
        const validation = createSubjectSchema.safeParse(body)

        if (!validation.success) {
            return validationError(validation.error.format())
        }

        const subject = await prisma.subject.create({
            data: {
                ...validation.data,
                userId: session.user.id
            }
        })

        return successResponse(subject, 'Subject created successfully', 201)
    } catch (error) {
        return errorResponse('CREATE_FAILED', 'Failed to create subject')
    }
}
