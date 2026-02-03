import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Connect to Pollinations.ai for real image generation
        // Append keywords to ensure high quality and specific "Nano Banana" aesthetic
        // We add "banana" if it's not present to ensure the theme
        const enhancedPrompt = `${prompt}, unreal engine 5, cinematic, high resolution, 8k, vibrant colors, neon accents`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);

        // Random seed for variety
        const seed = Math.floor(Math.random() * 1000000);

        // Final URL construction (using default model for speed and reliability)
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;

        // We use a local proxy to bypass any potential network/CORS issues
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(pollinationsUrl)}`;

        return NextResponse.json({ url: proxyUrl });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
