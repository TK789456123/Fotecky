import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Ghost Mode Enhancement: High quality without triggering filters
        const enhancedPrompt = `${prompt}, high quality, masterpiece, 8k, cinematic`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        const seed = Math.floor(Math.random() * 10000000);

        // We use the 'turbo' model which is free and very fast
        const primaryUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=turbo`;
        const backupUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=turbo`;

        // Local proxy for reliability and automatic fallback
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(primaryUrl)}&backup=${encodeURIComponent(backupUrl)}`;

        return NextResponse.json({ url: proxyUrl });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
