
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
    // ONLY run session check on the root page
    if (request.nextUrl.pathname === '/') {
        return await updateSession(request)
    }
    return
}

export const config = {
    matcher: ['/'],
}
