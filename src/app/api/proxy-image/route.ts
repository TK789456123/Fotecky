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

    const fastFetch = async (url: string, timeout = 3000): Promise<Response | null> => {
        try {
            console.log(`[PROXY] Fetching (timeout ${timeout}ms): ${url}`);
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
            console.warn(`[PROXY] Skip slow source: ${url}`);
            return null;
        }
    };

    try {
        // Step 1: Try Primary AI (Fast)
        let response = await fastFetch(imageUrl, 4000);

        // Step 2: Try Backup AI if needed
        if (!response && backupUrl) {
            response = await fastFetch(backupUrl, 3000);
        }

        // Step 3: Try Emergency (LoremFlickr)
        if (!response && emergencyUrl) {
            response = await fastFetch(emergencyUrl, 2000);
        }

        // ABSOLUTE LAST RESORT: High-quality professional photo based on user query (Unsplash)
        if (!response) {
            console.log(`[PROXY] Everything failed. Using dynamic Unsplash fallback for: ${translatedQuery}`);
            const unsplashFallback = `https://source.unsplash.com/featured/1024x1024?${encodeURIComponent(translatedQuery)}`;
            response = await fetch(unsplashFallback);
        }

        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        return new Response(arrayBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Access-Control-Allow-Origin': '*',
                'X-Source': response.url.includes('unsplash') ? 'primary-web' : 'fallback-web'
            },
        });
    } catch (error) {
        console.error('[PROXY] Fatal error. Returning emergency shield.', error);
        // FORCE 200 with a guaranteed image
        const unsplashFallback = 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1024&q=80';
        const finalResponse = await fetch(unsplashFallback);
        const arrayBuffer = await finalResponse.arrayBuffer();

        return new Response(arrayBuffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'no-store',
                'X-Shield': 'Active'
            },
            status: 200
        });
    }
}
