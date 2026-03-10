
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        if (supabase) {
            await supabase.auth.signOut();
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
    
    revalidatePath('/', 'layout');
    
    const url = new URL('/login', request.url);
    url.searchParams.set('message', 'Naschledanou! Těšíme se na vaši příští návštěvu. 👋');
    
    return NextResponse.redirect(url);
}
