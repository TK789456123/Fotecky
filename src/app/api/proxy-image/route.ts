import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const backupUrl = searchParams.get('backup');
    const emergencyUrl = searchParams.get('emergency');

    const query = searchParams.get('q') || 'nature';

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    const translatedQuery = query; // Already translated by generate route

    const fastFetch = async (url: string, timeout = 5000): Promise<Response | null> => {
        try {
            console.log(`[PROXY] Fetching: ${url}`);
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                    'Cache-Control': 'no-cache',
                },
                next: { revalidate: 0 },
                signal: AbortSignal.timeout(timeout)
            });
            return response.ok ? response : null;
        } catch (e) {
            console.warn(`[PROXY] Failed: ${url}`);
            return null;
        }
    };

    try {
        // High-Speed Racing: Try Primary and Backup with generous timeouts
        let response = await fastFetch(imageUrl, 6000);
        if (!response && backupUrl) response = await fastFetch(backupUrl, 4000);
        if (!response && emergencyUrl) response = await fastFetch(emergencyUrl, 3000);

        // ABSOLUTE LAST RESORT: Guaranteed High-Quality Unsplash
        if (!response) {
            console.log(`[PROXY] Fallback triggered.`);
            const fallback = `https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1024&q=80`;
            response = await fetch(fallback);
        }

        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        return new Response(arrayBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Access-Control-Allow-Origin': '*',
                'X-Source': 'balanced-gate'
            },
        });
    } catch (error) {
        console.error('[PROXY] Hard error.');
        const fallback = 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1024&q=80';
        const finalResponse = await fetch(fallback);
        const arrayBuffer = await finalResponse.arrayBuffer();

        return new Response(arrayBuffer, {
            headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' },
            status: 200
        });
    }
}
