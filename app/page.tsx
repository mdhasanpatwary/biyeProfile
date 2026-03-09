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

      <Container className="max-w-[1400px] px-6 sm:px-8 lg:px-10">
        {/* HERO SECTION: Strict 12-column grid */}
        <Section className="pt-16 pb-16 md:pt-20 md:pb-24 grid grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Hero Left: Span 8 */}
          <div className="col-span-12 lg:col-span-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-[1px] bg-foreground"></span>
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground-muted">Official Registry / 2026</span>
            </div>

            <h1 className="font-serif text-[clamp(2.5rem,8vw,7.5rem)] leading-[0.8] tracking-tighter text-foreground mb-8">
              The Digital Standard <br />
              for Marriage.
            </h1>

            <div className="max-w-[540px]">
              <p className="text-[15px] sm:text-base text-foreground-muted leading-[1.6] font-medium mb-10 tracking-tight">
                Create, manage, and securely share your marriage biodata online with a professional digital profile and downloadable PDF.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={session?.user ? "/dashboard" : "/create"}>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto px-10 transition-all">
                    Create Biodata
                  </Button>
                </Link>
                <Link href="/biodata">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 transition-all">
                    See Example Biodata
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Hero Right: Span 4 */}
          <div className="hidden lg:col-span-4 lg:block pt-16 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="border-l-[1.5px] border-border-muted pl-12 space-y-10">
              <div>
                <span className="block font-mono text-[9px] font-black text-foreground-muted uppercase tracking-[0.25em] mb-4">01 / Privacy</span>
                <p className="text-[17px] font-serif italic leading-tight text-foreground">
                  Private shareable biodata links
                </p>
              </div>
              <div>
                <span className="block font-mono text-[9px] font-black text-foreground-muted uppercase tracking-[0.25em] mb-4">02 / Security</span>
                <p className="text-[17px] font-serif italic leading-tight text-foreground">
                  Secure encrypted data storage
                </p>
              </div>
              <div>
                <span className="block font-mono text-[9px] font-black text-foreground-muted uppercase tracking-[0.25em] mb-4">03 / Export</span>
                <p className="text-[17px] font-serif italic leading-tight text-foreground">
                  Professional PDF biodata export
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section className="border-t border-border">
          <div className="grid grid-cols-12 gap-8 md:gap-12 mb-10 md:mb-14">
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
              <div key={i} className="group border-t border-border-muted pt-8 relative overflow-hidden">
                <div className="text-6xl font-serif text-foreground/5 absolute -top-1 -left-1 group-hover:text-foreground/10 transition-colors">
                  {item.step}
                </div>
                <div className="relative z-10 pt-4">
                  <span className="block font-mono text-[10px] font-black text-foreground-muted uppercase tracking-[0.4em] mb-4">Step {item.step}</span>
                  <h3 className="text-4xl font-serif text-foreground mb-4 tracking-tight italic">{item.title}</h3>
                  <p className="text-foreground-muted/70 text-sm leading-[1.8] font-medium max-w-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* PRINCIPLES SECTION */}
        <Section className="border-y border-border px-0">
          <div className="grid grid-cols-12 gap-0 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-border">
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
              <div key={i} className="col-span-12 md:col-span-4 p-10 sm:p-12 space-y-8 group transition-all hover:bg-surface">
                <div className="font-mono text-[10px] font-black text-foreground/30 tracking-[0.4em] mb-4 uppercase">Principle / {item.num}</div>
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
        <Section className="text-center bg-surface border-b border-border-muted/50 py-16 md:py-24">
          <div className="max-w-[600px] mx-auto">
            <h2 className="text-5xl md:text-8xl font-serif text-foreground leading-[0.9] mb-8 tracking-tighter">
              A commitment to <br />
              <span className="italic">intentional marriage.</span>
            </h2>
            <Link href={session?.user ? "/dashboard" : "/api/auth/signin"}>
              <Button variant="primary" size="lg" className="px-10 transition-all">
                Join The Registry
              </Button>
            </Link>
          </div>
        </Section>
      </Container>
    </div>
  )
}
