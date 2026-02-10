"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Download, AlertCircle } from "lucide-react";

export default function ImageGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // 1. Load history ONLY ONCE after mount to avoid SSR mismatch
    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem("nano_history");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setHistory(parsed.slice(0, 3));
                }
            } catch (e) {
                console.error("History recovery failed", e);
            }
        }
    }, []);

    // 2. Clear loading state safety
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isImageLoading) {
            timeout = setTimeout(() => {
                setIsImageLoading(false);
            }, 10000);
        }
        return () => clearTimeout(timeout);
    }, [isImageLoading]);

    // 3. Save history ONLY if mounted and NOT empty (unless explicitly cleared)
    useEffect(() => {
        if (isMounted && history.length > 0) {
            localStorage.setItem("nano_history", JSON.stringify(history));
        }
    }, [history, isMounted]);

    const addToHistory = (url: string) => {
        if (!url) return;
        setHistory(prev => {
            // High Resolution Unique ID: Strip the random 'r' or 'sig' if we want to collapse same images?
            // Actually, keep it simple: unique string
            const filtered = prev.filter(item => item !== url);
            return [url, ...filtered].slice(0, 3);
        });
    };

    const handleGenerate = async () => {
        try {
            console.log("[DEBUG] Clicked Generate");
            setError(null);
            setIsLoading(true);
            // Don't clear history here
            setGeneratedImage(null);

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ r: Math.random() }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            console.log("[DEBUG] Data received:", data);

            if (data.url) {
                setGeneratedImage(data.url);
                setIsImageLoading(true);
                // Proactive History: Add to history immediately so the user doesn't lose the link
                addToHistory(data.url);
            } else {
                throw new Error("Server nevrátil žádný odkaz.");
            }
        } catch (err) {
            console.error("[DEBUG] Error:", err);
            const msg = err instanceof Error ? err.message : "Neznámá chyba vesmíru.";
            setError(`${msg} Zkuste to znovu nebo použijte přímý odkaz níže.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDirectBypass = () => {
        const seed = Math.floor(Math.random() * 1000000);
        const directUrl = `https://images.unsplash.com/photo-${seed % 2 === 0 ? '1501854140801-50d01698950b' : '1470071459604-3b5ec3a7fe05'}?auto=format&fit=crop&w=1024&q=80&sig=${seed}`;
        setGeneratedImage(directUrl);
        setIsImageLoading(true);
        addToHistory(directUrl);
        setError(null);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center relative z-20">
            {/* The Main Button */}
            <div className="py-10 flex flex-col items-center gap-4">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="relative group px-12 py-6 bg-white text-black rounded-full font-black text-2xl hover:bg-gray-200 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 duration-200"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative flex items-center gap-3">
                        {isLoading ? (
                            <>
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span>Hledám...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-8 w-8 group-hover:animate-pulse" />
                                <span>Další náhodný obrázek</span>
                            </>
                        )}
                    </div>
                </button>
            </div>

            {/* Error Message & Bypass */}
            {error && (
                <div className="mb-6 flex flex-col items-center gap-4">
                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span className="text-sm">{error}</span>
                    </div>
                    <button
                        onClick={handleDirectBypass}
                        className="text-xs text-white/40 hover:text-white underline"
                    >
                        Nouzový režim (Přímé spojení)
                    </button>
                </div>
            )}

            {/* Display Area */}
            <div className="w-full min-h-[300px] mb-12 relative">
                <AnimatePresence mode="wait">
                    {/* Main API Loading Spinner (covers everything) */}
                    {isLoading && (
                        <motion.div
                            key="api-loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center glass-panel rounded-3xl border border-white/10 bg-black/40"
                        >
                            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                            <p className="text-white/60 font-medium tracking-widest text-sm uppercase text-center px-4">Vyhledávám nejlepší záběr...</p>
                        </motion.div>
                    )}

                    {generatedImage ? (
                        <motion.div
                            key={generatedImage}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full px-4"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-black/40 group max-w-2xl mx-auto">
                                {/* Image Fetching Spinner (Subtle Overlay) */}
                                {isImageLoading && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px] z-10">
                                        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                                        <p className="text-white/40 text-[10px] tracking-widest uppercase">Přenáším z vesmíru...</p>
                                    </div>
                                )}

                                <img
                                    src={generatedImage}
                                    alt="Random World"
                                    onLoad={() => setIsImageLoading(false)}
                                    onError={() => {
                                        setIsImageLoading(false);
                                        setError("Obrázek se nepodařilo zobrazit (Network Error).");
                                    }}
                                    className={`w-full h-auto object-cover max-h-[70vh] transition-all duration-500 ${isImageLoading ? 'scale-105 blur-sm opacity-50' : 'scale-100 blur-0 opacity-100'}`}
                                />

                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center gap-4 translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100 z-20">
                                    <a
                                        href={generatedImage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        <Download size={18} /> Stáhnout
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>

            {/* History Section */}
            {(history.length > 0) && (
                <div className="mt-10 w-full z-30">
                    <h3 className="text-white/40 text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-4 py-4">
                        <span className="h-[1px] flex-1 bg-white/10"></span>
                        Poslední úlovky
                        <span className="h-[1px] flex-1 bg-white/10"></span>
                    </h3>
                    <div className="grid grid-cols-3 gap-4 w-full">
                        {history.map((url, i) => (
                            <motion.div
                                key={url + i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer group shadow-lg"
                                onClick={() => setGeneratedImage(url)}
                            >
                                <img src={url} alt="History" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Sparkles className="text-white" size={20} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
