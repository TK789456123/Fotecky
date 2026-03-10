
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    // Only run session update on the root path and login-related redirects
    // This dramatically reduces API calls to Supabase, bypassing the rate limit
    if (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/login')) {
        return await updateSession(request)
    }
    return
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Any image assets (jpg, png, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
