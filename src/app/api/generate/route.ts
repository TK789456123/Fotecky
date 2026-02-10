import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // --- STEP 1: Generate Fresh Randomness ---
        const seed = Math.floor(Math.random() * 100000000);

        // --- STEP 2: Build Pure Random URLs (True Diversity & Maximum Speed) ---
        // We use keywords that Unsplash interprets broadly for high-quality random results
        const vibes = ['nature', 'space', 'architecture', 'abstract', 'travel', 'minimal', 'textures'];
        const randomVibe = vibes[seed % vibes.length];

        // Primary: Picsum (Instant & Fast)
        const primaryUrl = `https://picsum.photos/seed/${seed}/1024/1024`;

        // Backup 1: LoremFlickr (Robust)
        const backup1 = `https://loremflickr.com/1024/1024/${randomVibe}?lock=${seed}`;

        // Backup 2: Unsplash (High Quality but Slower)
        const backup2 = `https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1024&q=80&sig=${seed}`;

        // --- STEP 3: Final Proxy Package ---
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(primaryUrl)}&backup=${encodeURIComponent(backup1)}&emergency=${encodeURIComponent(backup2)}&q=${randomVibe}`;

        return NextResponse.json({ url: proxyUrl });
    } catch (error) {
        console.error("[GENERATE] Error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
