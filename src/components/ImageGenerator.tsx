"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Download, AlertCircle } from "lucide-react";

export default function ImageGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);

    const addToHistory = (url: string) => {
        setHistory(prev => {
            if (prev.includes(url)) return prev;
            return [url, ...prev].slice(0, 3);
        });
    };

    const handleGenerate = async () => {
        try {
            console.log("[DEBUG] Clicked Generate");
            setError(null);
            setIsLoading(true);
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
            } else {
                throw new Error("No image URL returned from server.");
            }
        } catch (err) {
            console.error("[DEBUG] Error:", err);
            setError(err instanceof Error ? err.message : "Něco se pokazilo...");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center">
            {/* The Main Button */}
            <div className="py-10">
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

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 flex items-center gap-2 animate-bounce">
                    <AlertCircle size={20} />
                    <span>Error: {error}</span>
                </div>
            )}

            {/* Display Area */}
            <AnimatePresence mode="wait">
                {(isLoading || isImageLoading || generatedImage) && (
                    <motion.div
                        key={generatedImage || "loading"}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full relative"
                    >
                        {/* Internal Loading state */}
                        {(isLoading || isImageLoading) && (
                            <div className="w-full aspect-video flex flex-col items-center justify-center glass-panel rounded-3xl border border-white/10 bg-black/40">
                                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                                <p className="text-white/60 font-medium tracking-widest text-sm uppercase">Přenáším moment z vesmíru...</p>
                            </div>
                        )}

                        {/* The Image */}
                        {generatedImage && (
                            <div className={isImageLoading ? "hidden" : "block"}>
                                <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 bg-black/40 group">
                                    <img
                                        src={generatedImage}
                                        alt="Random World"
                                        onLoad={() => {
                                            setIsImageLoading(false);
                                            if (generatedImage) addToHistory(generatedImage);
                                        }}
                                        onError={() => {
                                            setIsImageLoading(false);
                                            setError("Obrázek se nepodařilo načíst (Network error).");
                                        }}
                                        className="w-full h-auto object-cover max-h-[75vh]"
                                    />

                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center gap-4 translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                                        <a
                                            href={generatedImage}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                                        >
                                            <Download size={18} /> Stáhnout
                                        </a>
                                        <div className="text-white/40 text-xs text-center">
                                            Nepracuje náhled? <a href={generatedImage} target="_blank" className="text-white/80 underline">Otevřít přímo</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History Section */}
            {history.length > 0 && (
                <div className="mt-20 w-full">
                    <h3 className="text-white/40 text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-4 py-4">
                        <span className="h-[1px] flex-1 bg-white/10"></span>
                        Poslední úlovky
                        <span className="h-[1px] flex-1 bg-white/10"></span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {history.map((url, i) => (
                            <motion.div
                                key={url}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-white/30 transition-all cursor-pointer group"
                                onClick={() => setGeneratedImage(url)}
                            >
                                <img src={url} alt="History" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Sparkles className="text-white" size={24} />
                                </div>
                            </motion.div>
                        ))}
                        {/* Placeholder slots to keep the 3-grid look */}
                        {Array.from({ length: 3 - history.length }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square rounded-xl border border-dashed border-white/5 flex items-center justify-center">
                                <span className="text-white/5 text-xs font-black">SLOT #{history.length + i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
