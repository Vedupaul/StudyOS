import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createPlanTaskSchema, updatePlanTaskSchema } from '@/lib/validation'
import {
    successResponse,
    errorResponse,
    validationError,
    unauthorizedResponse
} from '@/lib/api-response'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const body = await request.json()
        const validation = createPlanTaskSchema.safeParse(body)

        if (!validation.success) {
            return validationError(validation.error.format())
        }

        const task = await prisma.planTask.create({
            data: validation.data
        })

        return successResponse(task, 'Task added to plan', 201)
    } catch (error) {
        console.error('Failed to create task:', error)
        return errorResponse('CREATE_FAILED', 'Failed to add task to plan')
    }
}

export async function PATCH(request: NextRequest) {
    // Logic to update task status/order
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const body = await request.json()
        const { id, ...data } = body

        const task = await prisma.planTask.update({
            where: { id },
            data
        })

        return successResponse(task, 'Task updated successfully')
    } catch (error) {
        return errorResponse('UPDATE_FAILED', 'Failed to update task')
    }
}
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return unauthorizedResponse()

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return errorResponse('MISSING_ID', 'Task ID is required')

        await prisma.planTask.delete({
            where: { id }
        })

        return successResponse(null, 'Task deleted successfully')
    } catch (error) {
        return errorResponse('DELETE_FAILED', 'Failed to delete task')
    }
}
