import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Connect to Pollinations.ai for real image generation
        const enhancedPrompt = `${prompt}, unreal engine 5, cinematic, high resolution, 8k, vibrant colors, neon accents`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        const seed = Math.floor(Math.random() * 1000000);

        // Primary URL (Direct subdomain)
        const primaryUrl = `https://pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;

        // Backup URL (Image subdomain)
        const backupUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;

        // We use a local proxy to bypass any potential network/CORS issues and provide fallback
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(primaryUrl)}&backup=${encodeURIComponent(backupUrl)}`;

        return NextResponse.json({ url: proxyUrl });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
