import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        // Loop mock waiting time to simulate generation
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Return a random cool image from Unsplash based on keywords if we could, but for now fixed or random
        const randomSeed = Math.floor(Math.random() * 1000);
        // Using simple unsplash source for variety
        const mockImageUrl = `https://picsum.photos/seed/${randomSeed}/1024/1024`;

        return NextResponse.json({ url: mockImageUrl });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate' }, { status: 500 });
    }
}
