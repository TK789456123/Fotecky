"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Download, Share2, Sparkles } from "lucide-react";

export default function ImageGenerator() {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setGeneratedImage(null);

        // Simulate API call
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const data = await response.json();

            if (data.url) {
                setGeneratedImage(data.url);
                setIsImageLoading(true);
            }
        } catch (error) {
            console.error("Failed to generate:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            {/* Input Section */}
            <div className="relative group z-10">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative glass-panel rounded-lg p-2 flex items-center gap-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Imagine anything... a cyberpunk banana in neon rain..."
                        className="w-full bg-transparent text-white placeholder-gray-400 p-4 outline-none text-lg font-medium"
                        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || isImageLoading || !prompt}
                        className="bg-white text-black px-6 py-3 rounded-md font-bold hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {(isLoading || isImageLoading) ? (
                            <span className="animate-spin">⏳</span>
                        ) : (
                            <>
                                <Wand2 size={20} />
                                Generate
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Result Display */}
            <AnimatePresence mode="wait">
                {(isLoading || isImageLoading || generatedImage) && (
                    <motion.div
                        key={generatedImage || 'loading'}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mt-12 relative"
                    >
                        {(isLoading || isImageLoading) && (
                            <div className="flex flex-col items-center justify-center p-12 space-y-4 glass-panel rounded-xl">
                                <div className="relative">
                                    <div className="w-24 h-24 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
                                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-400 animate-pulse" />
                                </div>
                                <p className="text-gray-400 animate-pulse">
                                    {isImageLoading ? "Almost there, perfecting the pixels..." : "Dreaming up your masterpiece..."}
                                </p>
                            </div>
                        )}

                        {generatedImage && (
                            <div className={isImageLoading ? "invisible absolute h-0 w-0" : "visible"}>
                                <motion.div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
                                    <img
                                        src={generatedImage}
                                        alt={prompt}
                                        onLoad={() => setIsImageLoading(false)}
                                        onError={() => setIsImageLoading(false)}
                                        className="w-full h-auto object-cover max-h-[600px] min-h-[300px] bg-white/5"
                                        loading="lazy"
                                    />

                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <a href={generatedImage} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
                                            <Download size={24} />
                                        </a>
                                        <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
                                            <Share2 size={24} />
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
