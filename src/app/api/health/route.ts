import { createClient } from '@/utils/supabase/server';

export async function GET() {
    let dbHealth;
    try {
        const supabase = await createClient();

        if (!supabase) {
            throw new Error("Supabase internal error: Missing configuration.");
        }

        // Simple query to keep Supabase awake
        const { data, error } = await supabase.from('_keep_alive').select('*').limit(1);

        // Note: If table doesn't exist, it still counts as database activity
        // But we'll treat it as healthy if there's no fatal connection error
        dbHealth = !error || error.code !== 'PGRST301';
    } catch (err) {
        dbHealth = false;
    }

    return Response.json(
        {
            db: dbHealth,
        },
        { status: dbHealth ? 200 : 503 }
    );
}
