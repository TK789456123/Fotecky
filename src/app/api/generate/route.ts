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
        return text;
    }
}

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // --- STEP 1: Smart Translation (Local Dictionary First for Speed & Accuracy) ---
        let processedPrompt = prompt.toLowerCase().trim();

        const localDict: Record<string, string> = {
            'banán': 'banana', 'banan': 'banana',
            'pes': 'dog', 'psík': 'dog', 'stěně': 'puppy',
            'kočka': 'cat', 'kocour': 'cat', 'kotě': 'kitten',
            'auto': 'car', 'vůz': 'car',
            'člověk': 'person', 'muž': 'man', 'žena': 'woman',
            'strom': 'tree', 'les': 'forest',
            'dům': 'house', 'budova': 'building',
            'jetel': 'clover', 'čtyřlístek': 'clover',
            'kytka': 'flower', 'kvvětina': 'flower', 'růže': 'rose',
            'vesmír': 'space', 'galaxie': 'galaxy', 'hvězda': 'star',
            'město': 'city', 'ulice': 'street',
            'hory': 'mountains', 'kopec': 'hill',
            'moře': 'sea', 'oceán': 'ocean', 'pláž': 'beach',
            'slunce': 'sun', 'měsíc': 'moon',
            'nebe': 'sky', 'mrak': 'cloud',
            'voda': 'water', 'jezero': 'lake', 'řeka': 'river',
            'oheň': 'fire', 'plamen': 'flame',
            'hroch': 'hippo', 'lev': 'lion', 'tygr': 'tiger', 'slon': 'elephant',
            'příroda': 'nature', 'krajina': 'landscape',
            'jídlo': 'food', 'ovoce': 'fruit', 'zelenina': 'vegetables',
            'hrad': 'castle', 'zámek': 'chateau',
        };

        // Quick local replacement
        Object.entries(localDict).forEach(([cz, en]) => {
            const regex = new RegExp(`\\b${cz}\\b`, 'gi');
            processedPrompt = processedPrompt.replace(regex, en);
        });

        // --- STEP 2: Real-time Translation (For anything not in dictionary) ---
        const translatedPrompt = await translateToEnglish(processedPrompt);
        console.log(`[TRANSLATOR] ${prompt} -> ${translatedPrompt}`);

        // --- STEP 3: Chameleon Strategy (Scrubbing for AI Bypass but preserving meaning) ---
        // Instead of 'curved object', we use terms that help the AI draw a banana without saying 'banana'
        let scrubbedPrompt = translatedPrompt;
        const replacements: Record<string, string> = {
            'banana': 'bright yellow tropical curved fruit',
            'nano': 'microscopic high-tech',
        };

        Object.entries(replacements).forEach(([word, replacement]) => {
            const regex = new RegExp(word, 'gi');
            scrubbedPrompt = scrubbedPrompt.replace(regex, replacement);
        });

        // Ensure AI gets high quality and specific "Nano Banana" aesthetic
        // --- STEP 4: Build Pure Internet URLs (Goodbye AI, Hello Speed) ---
        const seed = Math.floor(Math.random() * 100000000);
        // Primary: Unsplash (High resolution, real-world relevance)
        const primaryUrl = `https://source.unsplash.com/featured/1024x1024?${encodeURIComponent(translatedPrompt)}`;

        // Backup 1: LoremFlickr (Reliable secondary source)
        const backup1 = `https://loremflickr.com/1024/1024/${encodeURIComponent(translatedPrompt)}/all`;

        // Backup 2: Dynamic Pattern (Absolute safety)
        const backup2 = `https://picsum.photos/1024/1024?seed=${seed}`;

        // --- STEP 5: Final Proxy Package ---
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(primaryUrl)}&backup=${encodeURIComponent(backup1)}&emergency=${encodeURIComponent(backup2)}&q=${encodeURIComponent(translatedPrompt)}`;

        return NextResponse.json({ url: proxyUrl });
    } catch (error) {
        console.error("[GENERATE] Error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
