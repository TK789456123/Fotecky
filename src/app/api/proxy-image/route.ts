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
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                },
                signal: controller.signal
            });
            clearTimeout(id);
            return response.ok ? response : null;
        } catch (e) {
            return null;
        }
    };

    try {
        // High-Speed Racing: Priority on fastest sources
        let response = await fastFetch(imageUrl, 3500);
        if (!response && backupUrl) response = await fastFetch(backupUrl, 2500);
        if (!response && emergencyUrl) response = await fastFetch(emergencyUrl, 2000);

        if (!response) {
            const fallback = `https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1024&q=80`;
            response = await fetch(fallback);
        }

        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        return new Response(arrayBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
                'Access-Control-Allow-Origin': '*',
                'X-Source': 'speed-gate'
            },
        });
    } catch (error) {
        const finalResponse = await fetch('https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1024&q=80');
        const arrayBuffer = await finalResponse.arrayBuffer();
        return new Response(arrayBuffer, {
            headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=3600' },
            status: 200
        });
    }
}
