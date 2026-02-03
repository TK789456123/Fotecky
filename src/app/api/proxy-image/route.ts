import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const backupUrl = searchParams.get('backup');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    const tryFetch = async (url: string) => {
        try {
            console.log(`[PROXY] Attempting: ${url}`);
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
                },
                next: { revalidate: 0 }
            });

            if (response.ok) return response;
            console.warn(`[PROXY] Failed (${response.status}): ${url}`);

            // SECONDARY BYPASS: Try via weserv.nl (Global Proxy) to bypass Vercel IP blocks
            const weservUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=${encodeURIComponent(url)}`;
            console.log(`[PROXY] Retrying via Weserv: ${weservUrl}`);
            const weservResponse = await fetch(weservUrl);
            if (weservResponse.ok) return weservResponse;

            return null;
        } catch (e) {
            console.error(`[PROXY] Error fetching: ${url}`, e);
            return null;
        }
    };

    try {
        let response = await tryFetch(imageUrl);

        // If primary fails (502, 404, etc), try backup
        if (!response && backupUrl) {
            console.log(`[PROXY] Primary + Weserv failed, trying backup...`);
            response = await tryFetch(backupUrl);
        }

        if (!response) {
            console.log(`[PROXY] All server-side attempts failed. Redirecting browser to direct URL...`);
            return NextResponse.redirect(imageUrl, { status: 302 });
        }

        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        return new Response(arrayBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (error) {
        console.error('[PROXY] Fatal error:', error);
        return new Response('Proxy error', { status: 500 });
    }
}
