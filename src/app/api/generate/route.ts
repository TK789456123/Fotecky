import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // --- STEP 1: Generate Fresh Randomness ---
        const seed = Math.floor(Math.random() * 100000000);

        // --- STEP 2: Build Pure Random URLs (Maximum Speed, Zero Search) ---
        // Primary: Unsplash Random (High quality)
        // Note: Using ?sig= or ?random= to force fresh images from CDNs
        const primaryUrl = `https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1024&q=80&sig=${seed}`;

        // Backup 1: Picsum (Bleskově rychlá záloha)
        const backup1 = `https://picsum.photos/1024/1024?random=${seed}`;

        // Backup 2: LoremFlickr (Third layer defense)
        const backup2 = `https://loremflickr.com/1024/1024?lock=${seed}`;

        // --- STEP 3: Final Proxy Package ---
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(primaryUrl)}&backup=${encodeURIComponent(backup1)}&emergency=${encodeURIComponent(backup2)}&q=random`;

        return NextResponse.json({ url: proxyUrl });
    } catch (error) {
        console.error("[GENERATE] Error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
