import { NextRequest } from 'next/server'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/db'
import { registerSchema } from '@/lib/validation'
import { successResponse, errorResponse, validationError } from '@/lib/api-response'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validation = registerSchema.safeParse(body)
        if (!validation.success) {
            return validationError(validation.error.format())
        }

        const { email, password, name } = validation.data

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return errorResponse('USER_EXISTS', 'Email already registered', 409)
        }

        // Hash password
        const passwordHash = await hash(password, 12)

        // Create user with default preferences
        const user = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash,
                preferences: {
                    create: {}, // Creates with default values
                },
                streak: {
                    create: {}, // Initialize streak record
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        })

        return successResponse(user, 'User registered successfully')
    } catch (error) {
        console.error('Registration error:', error)
        return errorResponse('REGISTRATION_FAILED', 'Failed to register user', 500)
    }
}
