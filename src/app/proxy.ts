
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match only the root path and potential protected subroutes.
         * Explicitly exclude static assets and authentication pages.
         */
        '/',
    ],
}
