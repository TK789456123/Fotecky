import ImageGenerator from "@/components/ImageGenerator";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-start pt-24 px-4 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"></div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-8 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-500 glow-text tracking-tighter">
            NANO BANANA
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
            Unleash your imagination without limits. Create stunning visuals where the only rule is <span className="text-yellow-400 font-bold">chaos</span>.
          </p>
        </div>

        <ImageGenerator />
      </div>

      <footer className="absolute bottom-4 text-gray-600 text-sm z-10">
        Powered by Cosmic Radiations & Next.js
      </footer>
    </main>
  );
}
