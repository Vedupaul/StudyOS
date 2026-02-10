import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: {
        code: string
        message: string
        details?: any
    }
    message?: string
}

export function successResponse<T>(data: T, message?: string, status: number = 200): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
            message,
        },
        { status }
    )
}

export function errorResponse(
    code: string,
    message: string,
    status: number = 400,
    details?: any
): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            success: false,
            error: {
                code,
                message,
                details,
            },
        },
        { status }
    )
}

export function validationError(errors: any): NextResponse<ApiResponse> {
    return errorResponse('VALIDATION_ERROR', 'Invalid input', 400, errors)
}

export function unauthorizedError(message = 'Unauthorized'): NextResponse<ApiResponse> {
    return errorResponse('UNAUTHORIZED', message, 401)
}

export const unauthorizedResponse = unauthorizedError

export function notFoundError(resource = 'Resource'): NextResponse<ApiResponse> {
    return errorResponse('NOT_FOUND', `${resource} not found`, 404)
}

export function serverError(message = 'Internal server error'): NextResponse<ApiResponse> {
    return errorResponse('INTERNAL_ERROR', message, 500)
}
