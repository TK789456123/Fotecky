import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Connect to Pollinations.ai for real image generation
        // We encode the prompt to be URL-safe
        const encodedPrompt = encodeURIComponent(prompt);
        // Using a random seed for variety and appending styling keywords for "premium" look
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}%20highly%20detailed,%204k,%20cinematic%20lighting?width=1024&height=1024&nologo=true&seed=${seed}`;

        return NextResponse.json({ url: imageUrl });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate' }, { status: 500 });
    }
}
