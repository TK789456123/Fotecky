
import { login, signup } from './actions'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const { message } = await searchParams
    return (
        <main className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"></div>

            <div className="z-10 w-full max-w-md bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-500 mb-2">
                    Vítejte zpět
                </h1>
                <p className="text-gray-400 mb-8 font-light italic">Vstupte do světa nekonečné inspirace...</p>

                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="vas@email.cz"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-white/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1" htmlFor="password">Heslo</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-white/20"
                        />
                    </div>

                    {message && (
                        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-sm italic">
                            {message}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 pt-4">
                        <button formAction={login} className="w-full bg-white text-black font-black py-4 rounded-full hover:bg-yellow-400 transition-colors shadow-lg">
                            Přihlásit se
                        </button>
                        <button formAction={signup} className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-full hover:bg-white/10 transition-colors">
                            Vytvořit účet
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}
