import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const backupUrl = searchParams.get('backup');
    const emergencyUrl = searchParams.get('emergency');

    if (!imageUrl) {
        return new Response('Missing URL parameter', { status: 400 });
    }

    const fetchWithRetry = async (url: string, retries = 3, delay = 1000): Promise<Response | null> => {
        for (let i = 0; i < retries; i++) {
            try {
                console.log(`[PROXY] Attempt ${i + 1} for: ${url}`);
                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                        'Cache-Control': 'no-cache',
                    },
                    next: { revalidate: 0 },
                    signal: AbortSignal.timeout(45000) // Increase timeout to 45s
                });

                if (response.ok) return response;

                if (response.status >= 500) {
                    console.warn(`[PROXY] Status ${response.status}, retrying in ${delay}ms...`);
                    await new Promise(r => setTimeout(r, delay));
                    delay *= 2;
                    continue;
                }
                return null;
            } catch (e) {
                console.error(`[PROXY] Error:`, e);
                await new Promise(r => setTimeout(r, delay));
            }
        }
        return null;
    };

    try {
        let response = await fetchWithRetry(imageUrl);

        // Try Weserv bypass if primary failed
        if (!response) {
            console.log(`[PROXY] Primary failed. Trying Weserv...`);
            const weservUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}&default=${encodeURIComponent(imageUrl)}`;
            response = await fetchWithRetry(weservUrl, 2);
        }

        // Try Backup if everything else failed
        if (!response && backupUrl) {
            console.log(`[PROXY] Everything failed, trying backup...`);
            response = await fetchWithRetry(backupUrl);
        }

        // Try Emergency (Guaranteed CDN) if even backup failed
        if (!response && emergencyUrl) {
            console.log(`[PROXY] AI Providers dead. Using emergency fallback...`);
            response = await fetch(emergencyUrl);
        }

        // ABSOLUTE LAST RESORT: High-quality professional banana photo (Never show 502)
        if (!response) {
            console.log(`[PROXY] Everything failed. Using Unsplash placeholder.`);
            const unsplashFallback = 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1024&q=80';
            response = await fetch(unsplashFallback);
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
