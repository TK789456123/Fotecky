import ImageGenerator from "@/components/ImageGenerator";
import { createClient } from "@/utils/supabase/server";
import { logout } from "./login/actions";
import { LogOut, User } from "lucide-react";

export default async function Home() {
  let user = null;
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }
  } catch (err) {
    console.error("Auth check failed:", err);
  }

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-start pt-16 px-4 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"></div>

      {/* User Header */}
      {user && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
            <User size={14} className="text-yellow-500" />
            <span>{user.email}</span>
          </div>
          <form action={logout}>
            <button className="text-white/40 hover:text-white transition-colors">
              <LogOut size={16} />
            </button>
          </form>
        </div>
      )}

      <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-8 text-center">
        <div className="space-y-4 pt-12">
          <h1 className="text-4xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-500 glow-text tracking-tighter uppercase leading-tight">
            Random generátor obrázků
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
            Objevujte krásy světa v jediném kliknutí. Každý obrázek je unikátní moment <span className="text-yellow-400 font-bold">chaosu</span>.
          </p>
        </div>

        <ImageGenerator />
      </div>

      <footer className="absolute bottom-4 text-gray-600 text-sm z-10 flex flex-col items-center">
        <span>Powered by Cosmic Radiations & Next.js</span>
        <span className="text-[10px] opacity-20">Build: 2026.02.17.V4-SECURE</span>
      </footer>
    </main>
  );
}
