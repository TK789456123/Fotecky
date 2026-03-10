
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function GET() {
    const supabase = await createClient();
    if (supabase) {
        await supabase.auth.signOut();
    }
    revalidatePath('/', 'layout');
    return redirect('/login?message=Naschledanou! Těšíme se na vaši příští návštěvu. 👋');
}
