import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Metadata } from "next"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

export default async function Home() {
  const session = await auth()

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is BiyeProfile a free marriage biodata maker?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. BiyeProfile is a free marriage biodata maker online. You can create, customize, and download a complete marriage biodata at no cost. Simply sign up, fill in your details, and export your professional PDF biodata for free."
        }
      },
      {
        "@type": "Question",
        "name": "How do I create a marriage biodata online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "BiyeProfile is the easiest free marriage biodata maker online. Create a marriage biodata by signing up, completing your personal, educational, and family information through our structured form, and publishing your profile. You can share it via a private link or download a professional PDF."
        }
      },
      {
        "@type": "Question",
        "name": "Is my marriage biodata private and secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, your marriage biodata is private by default. Our infrastructure is built on principles of isolation and encryption. You can generate a secure, private shareable link for guardians or keep it completely unlisted from search engines."
        }
      },
      {
        "@type": "Question",
        "name": "What is a marriage biodata?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A marriage biodata is a comprehensive document used in many cultures to introduce an individual's personal, educational, family, and professional background to potential life partners and their families. It serves as a formal profile for arranged marriage introductions."
        }
      },
      {
        "@type": "Question",
        "name": "Is BiyeProfile free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, BiyeProfile is 100% free to use. You can create a complete marriage biodata, share it via a secure link, and download it as a professionally formatted PDF without any hidden costs."
        }
      }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to create a marriage biodata online for free using BiyeProfile",
    "description": "BiyeProfile is the best free marriage biodata maker online. Create, manage, and export professional marriage biodata in PDF format with complete privacy controls at no cost.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Register Account",
        "text": "Sign up for a free BiyeProfile account using your email."
      },
      {
        "@type": "HowToStep",
        "name": "Input Biodata Details",
        "text": "Fill in your personal, educational, family, and professional information in our structured form."
      },
      {
        "@type": "HowToStep",
        "name": "Set Privacy Settings",
        "text": "Choose to keep your profile private or list it in our public directory."
      },
      {
        "@type": "HowToStep",
        "name": "Download PDF",
        "text": "Export your completed marriage biodata as a professionally formatted PDF document."
      }
    ]
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BiyeProfile",
    "url": "https://biye-profile.vercel.app",
    "logo": "https://biye-profile.vercel.app/icon.svg",
    "description": "BiyeProfile is a premium, secure digital platform dedicated to helping individuals create and manage professional marriage biodata with privacy and elegance.",
    "foundingDate": "2026-03-01",
    "sameAs": [
      "https://facebook.com/biyeprofile",
      "https://twitter.com/biyeprofile"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BiyeProfile",
    "url": "https://biye-profile.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://biye-profile.vercel.app/biodata?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Texture Overlay */}
      <div className="fixed inset-0 bg-grain pointer-events-none opacity-[0.03] z-50"></div>

      <Container className="max-w-[1400px] px-6 sm:px-8 lg:px-10">
        {/* HERO SECTION: Refactored for conversion and balance */}
        <Section className="pt-24 pb-20 md:pt-32 md:pb-40">
          <div className="max-w-[1000px] mx-auto flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-4 mb-12">
              <span className="w-12 h-[1px] bg-foreground/20"></span>
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground-muted">Digital Marriage Registry / 2026</span>
              <span className="w-12 h-[1px] bg-foreground/20"></span>
            </div>

            <h1 className="font-serif text-[clamp(2.5rem,8vw,7rem)] leading-[0.85] tracking-tighter text-foreground mb-12">
              Create, Share & Discover <br />
              <span className="italic">Professional</span> Marriage Biodata.
            </h1>

            <div className="max-w-[720px]">
              <p className="text-lg md:text-2xl text-foreground-muted leading-relaxed font-medium mb-16 tracking-tight">
                BiyeProfile is the digital home for intentional marriage. Create a stunning marriage biodata in minutes or browse verified profiles for your next introduction.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                <Link href={session?.user ? "/dashboard" : "/create"}>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto px-14 py-8 text-base transition-all">
                    {session?.user ? "Go to Dashboard" : "Create Biodata"}
                  </Button>
                </Link>
                <Link href="/biodata">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-14 py-8 text-base transition-all">
                    Browse Biodata
                  </Button>
                </Link>
              </div>

              {/* Trust Signal Row */}
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-12 border-t border-border-muted/30">
                {[
                  "Free biodata generator",
                  "Privacy-focused profiles",
                  "Professional PDF export",
                  "Trusted by families in Bangladesh"
                ].map((signal, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-success/60"></div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/40">{signal}</span>
                  </div>
                ))}
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
                  <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/30 px-3 py-1 border border-border/10 rounded-none bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-4xl font-serif text-foreground mb-6 tracking-tight italic group-hover:underline underline-offset-8 decoration-foreground/20">
                  {item.title}
                </h3>
                <p className="text-foreground-muted font-medium leading-[1.8] text-sm max-w-xs opacity-70 group-hover:opacity-100 transition-opacity">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* SECURITY SECTION */}
        <Section className="border-t border-x border-border bg-[#111111] text-[#eaeaea] py-24 md:py-32 -mx-6 sm:-mx-8 lg:-mx-10 px-6 sm:px-8 lg:px-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="col-span-12 lg:col-span-5 mb-12 lg:mb-0">
                <div className="flex items-center gap-4 mb-10">
                  <span className="w-12 h-[1px] bg-white/30"></span>
                  <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-success">Verified Security Protocol</span>
                </div>
                <h2 className="font-serif text-6xl md:text-8xl tracking-tight text-[#eaeaea] leading-[0.9] mb-10">
                  Secure by <br />
                  <span className="italic">Design.</span>
                </h2>
                <p className="text-[#eaeaea]/75 text-lg font-medium leading-relaxed max-w-md">
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
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-success/80">0{i + 1} / Verified</h4>
                    <h3 className="text-2xl font-serif italic text-[#eaeaea]">{item.title}</h3>
                    <p className="text-[#eaeaea]/75 text-sm leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* PRINCIPLES SECTION */}
        <Section className="px-0">
          <div className="grid grid-cols-12 gap-0 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-border border border-border border-t-0">
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


        {/* BROWSE BY DISTRICT SECTION */}
        <Section className="border-t border-border py-24">
          <div className="max-w-4xl mx-auto px-6 sm:px-0 text-center">
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 mb-6 block">Quick Directory / 02</span>
            <h2 className="font-serif text-5xl md:text-7xl tracking-tight text-foreground leading-[0.9] mb-12">
              Browse by <br />
              <span className="italic">Location.</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh",
                "Comilla", "Gazipur", "Narayanganj", "Bogura"
              ].map((district) => (
                <Link
                  key={district}
                  href={`/biodata?q=${district}`}
                  className="px-6 py-3 border border-border-muted text-foreground-muted hover:border-foreground hover:text-foreground transition-all font-mono text-[11px] uppercase tracking-widest"
                >
                  {district}
                </Link>
              ))}
              <Link
                href="/biodata"
                className="px-6 py-3 border border-foreground bg-foreground text-background transition-all font-mono text-[11px] uppercase tracking-widest"
              >
                All Districts
              </Link>
            </div>
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

        {/* SEO & KNOWLEDGE SECTION at bottom */}
        <Section id="knowledge" className="border-t border-border py-24 bg-surface/5">
          <div className="max-w-3xl mx-auto px-6 sm:px-0">
            {/* Identity & Definition */}
            <div className="mb-16 border-l-2 border-foreground/10 pl-8">
              <h2 className="font-serif text-3xl text-foreground mb-6">What is BiyeProfile?</h2>
              <p className="text-foreground-muted text-base font-medium leading-relaxed">
                BiyeProfile is a professional digital environment designed for creating, managing, and sharing marriage biodata. We provide structured tools to help individuals and families present their stories with dignity, clarity, and complete privacy control. Our platform is built for intentional connections in the modern age.
              </p>
            </div>

            <div className="mb-24">
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 mb-10 block text-center uppercase tracking-widest">Knowledge Center</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <h3 className="text-xl font-serif italic text-foreground border-b border-border pb-4">Essential Writing Tips</h3>
                  <ul className="space-y-4 text-[13px] text-foreground-muted leading-relaxed font-medium list-none">
                    <li className="flex gap-3"><span className="text-success">○</span> Be honest about your educational background and current professional status.</li>
                    <li className="flex gap-3"><span className="text-success">○</span> Describe your personality and hobbies to provide a glimpse into your daily life.</li>
                    <li className="flex gap-3"><span className="text-success">○</span> Clearly state your expectations regarding a partner&apos;s values, education, and location.</li>
                  </ul>
                </div>

                <div className="space-y-8">
                  <h3 className="text-xl font-serif italic text-foreground border-b border-border pb-4">Common Mistakes</h3>
                  <ul className="space-y-4 text-[13px] text-foreground-muted leading-relaxed font-medium list-none">
                    <li className="flex gap-3"><span className="text-error">×</span> Using informal or low-quality profile photos for a formal document.</li>
                    <li className="flex gap-3"><span className="text-error">×</span> Providing overly vague descriptions of family background or siblings.</li>
                    <li className="flex gap-3"><span className="text-error">×</span> Overlooking spelling and grammatical errors that impact professionalism.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-16 p-8 border border-border-muted bg-background rounded-sm">
                <h3 className="text-base font-serif italic text-foreground mb-3 font-bold">Biodata vs. Resume</h3>
                <p className="text-[13px] text-foreground-muted leading-relaxed italic">
                  &quot;While a resume focuses on professional skills for employment, a marriage biodata is a cultural document focused on personal identity, family values, and lifestyle compatibility for matrimony.&quot;
                </p>
              </div>
            </div>

            <div className="pt-16 border-t border-border">
               <h2 className="font-serif text-3xl text-foreground mb-12 text-center italic">Common Questions</h2>
               <div className="space-y-12">
                  {faqSchema.mainEntity.map((faq, i) => (
                    <div key={i} className="group">
                       <h3 className="text-lg md:text-xl font-serif text-foreground mb-3 opacity-90 group-hover:opacity-100 transition-opacity tracking-tight font-bold">
                         {faq.name}
                       </h3>
                       <p className="text-foreground-muted text-base font-medium tracking-tight leading-relaxed">
                         {faq.acceptedAnswer.text}
                       </p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </Section>
      </Container>
    </div>
  )
}
