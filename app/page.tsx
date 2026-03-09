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
          <div className="grid grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-24 px-0">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 mb-6 block">Workflow / 01</span>
              <h2 className="font-serif text-6xl md:text-8xl tracking-tight italic text-foreground leading-[0.9]">
                How <br />
                it Works.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7 pt-12">
              <p className="text-foreground-muted text-lg font-medium tracking-tight leading-relaxed max-w-md">
                We&apos;ve distilled the traditional biodata process into a seamless digital journey, prioritizing speed without compromising on detail.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border border-b-0">
            {[
              {
                step: "01",
                title: "Drafting",
                desc: "Enter your personal, educational, and family details through our intuitive, structured multi-step interface.",
                tag: "Input"
              },
              {
                step: "02",
                title: "Validation",
                desc: "Review your profile in real-time with our live preview panel, ensuring every detail is represented accurately.",
                tag: "Review"
              },
              {
                step: "03",
                title: "Distribution",
                desc: "Generate a secure private link or download a professionally formatted PDF for sharing with guardians.",
                tag: "Export"
              }
            ].map((item, i) => (
              <div key={i} className="group p-10 md:p-12 border-b md:border-b-0 border-r-0 md:border-r border-border hover:bg-surface transition-all duration-500">
                <div className="flex justify-between items-start mb-12">
                  <span className="font-mono text-xs font-black text-foreground">{item.step}</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-foreground/30 px-3 py-1 border border-border/10 rounded-none bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-4xl font-serif text-foreground mb-6 tracking-tight italic group-hover:underline underline-offset-8 decoration-foreground/20">
                  {item.title}
                </h3>
                <p className="text-foreground-muted font-medium leading-[1.8] text-[15px] max-w-xs opacity-70 group-hover:opacity-100 transition-opacity">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* SECURITY SECTION */}
        <Section className="border-t border-border bg-foreground text-background py-24 md:py-32 -mx-6 sm:-mx-8 lg:-mx-10 px-6 sm:px-8 lg:px-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="col-span-12 lg:col-span-5 mb-12 lg:mb-0">
                <div className="flex items-center gap-4 mb-10">
                  <span className="w-12 h-[1px] bg-background/30"></span>
                  <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-background/50 text-success">Verified Security Protocol</span>
                </div>
                <h2 className="font-serif text-6xl md:text-8xl tracking-tight text-background leading-[0.9] mb-10">
                  Secure by <br />
                  <span className="italic">Design.</span>
                </h2>
                <p className="text-background/60 text-lg font-medium leading-relaxed max-w-md">
                  We treat your personal data with the gravity it deserves. Our infrastructure is built on principles of isolation and encryption.
                </p>
              </div>

              <div className="col-span-12 lg:col-span-6 lg:col-start-7 grid grid-cols-1 sm:grid-cols-2 gap-10">
                {[
                  {
                    title: "IP Masking",
                    desc: "Guest sessions use one-way IP hashing, ensuring unique visitors are tracked without storing actual IP addresses."
                  },
                  {
                    title: "Encrypted Storage",
                    desc: "All biodata records are stored with industry-standard encryption, accessible only via secure session tokens."
                  },
                  {
                    title: "Private URI",
                    desc: "Share links are generated with high-entropy identifiers, making them impossible to discover without the URI."
                  },
                  {
                    title: "Zero Discovery",
                    desc: "We do not index private profiles on search engines, ensuring your data remains in your control at all times."
                  }
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-success/80">0{i+1} / Verified</h4>
                    <h3 className="text-2xl font-serif italic text-background">{item.title}</h3>
                    <p className="text-background/50 text-sm leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* PRINCIPLES SECTION */}
        <Section className="border-b border-border px-0">
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
