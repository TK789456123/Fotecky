import { NextResponse } from 'next/server';

async function translateToEnglish(text: string) {
    try {
        // Use Google's public gtx client for real-time translation
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=cs&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url, { next: { revalidate: 3600 } });
        const data = await res.json();
        // Google returns: [ [[translated, original, ...]], ... ]
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
        }
        return text;
    } catch (e) {
        console.error("[TRANSLATOR] Error:", e);
        export async function POST(request: Request) {
            try {
                // --- STEP 1: Generate Fresh Randomness ---
                const seed = Math.floor(Math.random() * 100000000);

                // --- STEP 2: Build Pure Random URLs (Maximum Speed, Zero Search) ---
                // Primary: Unsplash Random (High quality)
                const primaryUrl = `https://source.unsplash.com/random/1024x1024?sig=${seed}`;

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
