
'use client';

import { LogOut, User as UserIcon } from "lucide-react";
import { logout } from "@/app/login/actions";

interface UserHeaderProps {
    email: string | undefined;
}

export default function UserHeader({ email }: UserHeaderProps) {
    return (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
                <UserIcon size={14} className="text-yellow-500" />
                <span>{email}</span>
            </div>
            <form action={logout}>
                <button 
                    type="submit"
                    className="text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    title="Odhlásit se"
                >
                    <LogOut size={16} />
                </button>
            </form>
        </div>
    );
}
