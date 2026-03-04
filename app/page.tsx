import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans overflow-x-hidden">
      {/* Texture Overlay (Consistent with Biodata) */}
      <div className="fixed inset-0 bg-grain pointer-events-none opacity-5 z-50"></div>

      {/* Hero Section */}
      <main className="relative pt-24 pb-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left Column: Heading & Intro */}
          <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-block px-3 py-1 bg-black text-white font-mono text-[9px] font-black uppercase tracking-[0.4em] mb-8">
              Registration Open / 2026
            </div>

            <h1 className="font-serif text-7xl md:text-[7.5rem] leading-[0.85] tracking-tight text-black mb-12">
              The Standard <br />
              for Marriage <br />
              Documentation.
            </h1>

            <p className="max-w-sm text-lg text-black/60 leading-relaxed font-medium mb-16 uppercase tracking-[-0.02em]">
              A refined, digital-first approach to traditional marriage biodata.
              Designed for clarity, privacy, and elegance.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                href={session?.user ? "/dashboard" : "/create"}
                className="px-10 py-5 bg-black text-white font-mono text-[11px] font-black uppercase tracking-[0.3em] hover:bg-black/90 active:scale-95 transition-all flex items-center justify-center shadow-2xl shadow-black/10"
              >
                Begin Registration
              </Link>
              <Link
                href="/biodata"
                className="px-10 py-5 bg-white text-black border border-black/10 font-mono text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center"
              >
                Browse Directory
              </Link>
            </div>
          </div>

          {/* Right Column: Key Metics/Numbers */}
          <div className="lg:col-span-4 lg:pt-16 border-l border-black/5 pl-12 hidden lg:block animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="space-y-8">
              <div>
                <span className="block font-mono text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-1.5">Integrity</span>
                <p className="text-sm font-medium leading-relaxed">
                  Every document follows the 96/32 vertical rhythm grid used by premium registries.
                </p>
              </div>
              <div>
                <span className="block font-mono text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-1.5">Privacy</span>
                <p className="text-sm font-medium leading-relaxed">
                  Total control over visibility. Your context is only shared on your terms.
                </p>
              </div>
              <div className="pt-8 border-t border-black/5">
                <div className="text-4xl font-serif text-black leading-none mb-1.5">100%</div>
                <span className="block font-mono text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Black & White Neutral</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Separator ─── */}
        <div className="w-full h-px bg-black/5 my-24"></div>

        {/* Features / Principles Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black/5 divide-y md:divide-y-0 md:divide-x divide-black/5 overflow-hidden">
          {[
            {
              num: "01",
              title: "Editorial Design",
              desc: "Moving away from cluttered interfaces to a clean, typographic experience that honors your identity."
            },
            {
              num: "02",
              title: "Digital Delivery",
              desc: "Get a secure, unique URL to share with guardians or interested parties instantly."
            },
            {
              num: "03",
              title: "Print Optimized",
              desc: "Engineered to look exactly as intended when converted to physical paper documents."
            }
          ].map((item, i) => (
            <div key={i} className="p-16 space-y-8 group animate-in fade-in slide-in-from-bottom-12 duration-700" style={{ transitionDelay: `${i * 200}ms` }}>
              <div className="font-mono text-[10px] font-black text-black/30 tracking-[0.4em] mb-1.5 uppercase">Principle / {item.num}</div>
              <h3 className="text-3xl font-serif text-black group-hover:underline underline-offset-8 decoration-black/5 transition-all italic">
                {item.title}
              </h3>
              <p className="text-black/60 font-medium leading-[2] text-[15px] max-w-xs">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* ─── CTA Banner ─── */}
        <section className="mt-32 py-32 border-y border-black/5 text-center relative overflow-hidden bg-gray-50/30">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-serif text-black leading-[1] mb-12 italic">
              Designed for the <br /> modern intentionality.
            </h2>
            <Link
              href={session?.user ? "/dashboard" : "/api/auth/signin"}
            >
              <Button size="lg" className="px-16 h-14">Get Started Free →</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
