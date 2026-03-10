
'use client';

import { useState, useEffect } from 'react';

interface WelcomeOverlayProps {
    email: string | undefined;
}

export default function WelcomeOverlay({ email }: WelcomeOverlayProps) {
    const [visible, setVisible] = useState(true);
    const name = email?.split('@')[0] || 'Uživatel';

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000); // Match or slightly exceed animation duration
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black pointer-events-none animate-welcome-fade">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-white/40 uppercase tracking-[0.3em] animate-pulse">Vítejte zpět</h2>
                <p className="text-5xl font-black text-white glow-text">{name}</p>
            </div>
        </div>
    );
}
