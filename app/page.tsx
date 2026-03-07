import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      {/* Texture Overlay */}
      <div className="fixed inset-0 bg-grain pointer-events-none opacity-[0.03] z-50"></div>

      <Container className="max-w-[1400px] py-0 px-6 sm:px-6 lg:px-6">
        {/* HERO SECTION: Strict 12-column grid */}
        <Section className="pt-12 pb-16 md:py-32 grid grid-cols-12 gap-6 items-start">
          {/* Hero Left: Span 8 */}
          <div className="col-span-12 lg:col-span-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-4 mb-12">
              <span className="w-12 h-[1px] bg-foreground"></span>
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground-muted">Official Registry / 2026</span>
            </div>

            <h1 className="font-serif text-[clamp(2.5rem,10vw,8.5rem)] leading-[0.8] tracking-tighter text-foreground mb-12 md:mb-16">
              The Digital <br />
              Standard for <br />
              Marriage.
            </h1>

            <div className="max-w-md">
              <p className="text-xl text-foreground-muted leading-relaxed font-medium mb-12 uppercase tracking-tight">
                Premium digital marriage biodata builder. clear, secure, and engineered for intentional representation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={session?.user ? "/dashboard" : "/create"}>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto px-12 transition-all">
                    Create Biodata
                  </Button>
                </Link>
                <Link href="/biodata">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-12 transition-all">
                    Browse Profiles
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Hero Right: Span 4 */}
          <div className="hidden lg:col-span-4 lg:block pt-48 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="border-l-2 border-foreground pl-10 space-y-12">
              <div>
                <span className="block font-mono text-[9px] font-black text-foreground-muted uppercase tracking-[0.25em] mb-4">Core Integrity</span>
                <p className="text-sm font-medium leading-[1.8] text-foreground">
                  Our system architecture prioritizes legibility and privacy above all. Every document is generated using a precise typographic grid designed for institutional clarity.
                </p>
              </div>
              <div>
                <span className="block font-mono text-[9px] font-black text-foreground-muted uppercase tracking-[0.25em] mb-4">Encryption</span>
                <p className="text-sm font-medium leading-[1.8] text-foreground">
                  Sensitive data is encrypted at rest. Control exactly who views your profile with private shareable URLs.
                </p>
              </div>
              <div className="pt-10">
                <div className="text-6xl font-serif leading-none italic mb-2 tracking-tighter text-foreground">03</div>
                <span className="font-mono text-[9px] font-black text-foreground-muted uppercase tracking-[0.2em]">Core Principles Of Design</span>
              </div>
            </div>
          </div>
        </Section>

        {/* HOW IT WORKS SECTION: 12-column grid */}
        <Section className="py-16 md:py-32 border-t border-border">
          <div className="grid grid-cols-12 gap-6 mb-24">
            <div className="col-span-12 lg:col-span-4">
              <h2 className="font-serif text-5xl tracking-tighter italic text-foreground">The Process.</h2>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-6">
              <p className="text-foreground-muted font-medium uppercase tracking-tight leading-relaxed">
                Streamlining the traditional exchange of biodata into a secure, modern, and beautiful digital experience.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { step: "01", title: "Document Entry", desc: "Complete our comprehensive, multi-step biodata form with verified sections for personal, family, and professional details." },
              { step: "02", title: "Privacy Control", desc: "Set your visibility to private and generate a secure, unique URL that you can share with selected parties instantly." },
              { step: "03", title: "Final Delivery", desc: "Download a professionally formatted, print-optimized PDF of your biodata, ready for physical distribution if required." }
            ].map((item, i) => (
              <div key={i} className="group border-t border-border-muted pt-12 relative overflow-hidden">
                <div className="text-8xl font-serif text-foreground/5 absolute -top-4 -left-4 group-hover:text-foreground/10 transition-colors">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <span className="block font-mono text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em] mb-6">Step {item.step}</span>
                  <h3 className="text-3xl font-serif text-foreground mb-6 tracking-tight italic">{item.title}</h3>
                  <p className="text-foreground-muted text-sm leading-[1.8] font-medium max-w-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* PRINCIPLES SECTION */}
        <Section className="py-16 md:py-32 border-y border-border">
          <div className="grid grid-cols-12 gap-0 overflow-hidden border border-border-muted divide-y md:divide-y-0 md:divide-x divide-border-muted">
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
              <div key={i} className="col-span-12 md:col-span-4 p-10 sm:p-14 md:p-16 space-y-8 group transition-all hover:bg-surface">
                <div className="font-mono text-[10px] font-black text-foreground/30 tracking-[0.4em] mb-1.5 uppercase">Principle / {item.num}</div>
                <h3 className="text-4xl font-serif text-foreground tracking-tighter leading-none italic group-hover:underline underline-offset-8 decoration-foreground/10">
                  {item.title}
                </h3>
                <p className="text-foreground-muted font-medium leading-[2] text-[15px] max-w-xs">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* CTA BANNER */}
        <Section className="py-16 md:py-48 text-center bg-surface border-b border-border">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-5xl md:text-8xl font-serif text-foreground leading-[0.9] mb-12 tracking-tighter">
              A commitment to <br />
              <span className="italic">intentional marriage.</span>
            </h2>
            <Link href={session?.user ? "/dashboard" : "/api/auth/signin"}>
              <Button variant="primary" size="lg" className="px-20 transition-all">
                Join The Registry
              </Button>
            </Link>
          </div>
        </Section>
      </Container>
    </div>
  )
}
