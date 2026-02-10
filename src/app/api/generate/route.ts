import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // --- STEP 1: Generate Fresh Randomness ---
        const seed = Math.floor(Math.random() * 100000000);

        // --- STEP 2: Build Pure Random URLs (True Diversity & Maximum Speed) ---
        // We use keywords that Unsplash interprets broadly for high-quality random results
        const vibes = ['nature', 'space', 'architecture', 'abstract', 'travel', 'minimal', 'textures'];
        const randomVibe = vibes[seed % vibes.length];

        // Primary: Unsplash Source (Featured collection for guaranteed quality)
        const primaryUrl = `https://source.unsplash.com/featured/1024x1024?${randomVibe}&sig=${seed}`;

        // Backup 1: Picsum (Lightning fast fallback)
        const backup1 = `https://picsum.photos/1024/1024?random=${seed}`;

        // Backup 2: LoremFlickr (Robust shield)
        const backup2 = `https://loremflickr.com/1024/1024/nature,photography?lock=${seed}`;

        // --- STEP 3: Final Proxy Package ---
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(primaryUrl)}&backup=${encodeURIComponent(backup1)}&emergency=${encodeURIComponent(backup2)}&q=random`;

        return NextResponse.json({ url: proxyUrl });
    } catch (error) {
        console.error("[GENERATE] Error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
