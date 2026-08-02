"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { useLanguage } from "@/components/LanguageContext"

interface HomePageContentProps {
  hasUser: boolean
  faqSchema: {
    mainEntity: { name: string; acceptedAnswer: { text: string } }[]
  }
}

export function HomePageContent({ hasUser, faqSchema }: HomePageContentProps) {
  const { t, language } = useLanguage()

  const trustSignals = language === "bn"
    ? [
        "ফ্রি বায়োডাটা জেনারেটর",
        "গোপনীয়তা সুরক্ষিত প্রোফাইল",
        "প্রফেশনাল পিডিএফ এক্সপোর্ট",
        "সারা বাংলাদেশ থেকে পরিবারগুলোর ভরসা"
      ]
    : [
        "Free biodata generator",
        "Privacy-focused profiles",
        "Professional PDF export",
        "Trusted by families in Bangladesh"
      ]

  const workflowSteps = language === "bn"
    ? [
        {
          step: "০১",
          title: "তথ্য প্রদান",
          desc: "সহজ ও সুন্দর মাল্টি-স্টেপ ফর্মে আপনার ব্যক্তিগত, শিক্ষাগত ও পারিবারিক তথ্য প্রদান করুন।",
          tag: "ইনপুট"
        },
        {
          step: "০২",
          title: "প্রিভিউ যাচাই",
          desc: "রিয়েল-টাইম লাইভ প্রিভিউ প্যানেলের মাধ্যমে আপনার বায়োডাটার তথ্য যাচাই করুন।",
          tag: "যাচাই"
        },
        {
          step: "০৩",
          title: "শেয়ার ও ডাউনলোড",
          desc: "সিকিউর প্রাইভেট লিঙ্ক তৈরি করুন অথবা অভিভাবকদের সাথে শেয়ার করতে এইচডি পিডিএফ ডাউনলোড করুন।",
          tag: "এক্সপোর্ট"
        }
      ]
    : [
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
      ]

  const districts = [
    { en: "Dhaka", bn: "ঢাকা" },
    { en: "Chattogram", bn: "চট্টগ্রাম" },
    { en: "Sylhet", bn: "সিলেট" },
    { en: "Rajshahi", bn: "রাজশাহী" },
    { en: "Khulna", bn: "খুলনা" },
    { en: "Barishal", bn: "বরিশাল" },
    { en: "Rangpur", bn: "রংপুর" },
    { en: "Mymensingh", bn: "ময়মনসিংহ" },
    { en: "Comilla", bn: "কুমিল্লা" },
    { en: "Gazipur", bn: "গাজীপুর" },
    { en: "Narayanganj", bn: "নারায়ণগঞ্জ" },
    { en: "Bogura", bn: "বগুড়া" }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      {/* Texture Overlay */}
      <div className="fixed inset-0 bg-grain pointer-events-none opacity-[0.03] z-50"></div>

      <Container className="max-w-[1400px] px-6 sm:px-8 lg:px-10">
        {/* HERO SECTION */}
        <Section className="pt-24 pb-20 md:pt-32 md:pb-40">
          <div className="max-w-[1000px] mx-auto flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-4 mb-12">
              <span className="w-12 h-[1px] bg-foreground/20"></span>
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground-muted">
                {language === "bn" ? "ফ্রি ম্যারেজ বায়োডাটা মেকার" : "Digital Marriage Registry / 2026"}
              </span>
              <span className="w-12 h-[1px] bg-foreground/20"></span>
            </div>

            <h1 className={`font-serif text-[clamp(2.5rem,8vw,7rem)] text-foreground mb-12 ${
              language === "bn" ? "leading-snug md:leading-[1.3] tracking-normal" : "leading-[0.85] tracking-tighter"
            }`}>
              {language === "bn" ? (
                <>
                  সহজেই তৈরি করুন <br />
                  <span className="italic">সুন্দর ও মার্জিত</span> বিবাহ বায়োডাটা।
                </>
              ) : (
                <>
                  Create, Share & Discover <br />
                  <span className="italic">Professional</span> Marriage Biodata.
                </>
              )}
            </h1>

            <div className="max-w-[720px]">
              <p className="text-lg md:text-2xl text-foreground-muted leading-relaxed font-medium mb-16 tracking-tight">
                {t.home.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                <Link href={hasUser ? "/dashboard" : "/create"}>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto px-14 py-8 text-base transition-all">
                    {hasUser ? (language === "bn" ? "ড্যাশবোর্ডে যান" : "Go to Dashboard") : t.home.createBtn}
                  </Button>
                </Link>
                <Link href="/biodata">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-14 py-8 text-base transition-all">
                    {t.home.browseBtn}
                  </Button>
                </Link>
              </div>

              {/* Trust Signal Row */}
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-12 border-t border-border-muted/30">
                {trustSignals.map((signal, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-success/60"></div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/40">{signal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* WORKFLOW SECTION */}
        <Section className="border-t border-border">
          <div className="grid grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-24 px-0">
            <div className="col-span-12 lg:col-span-5">
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 mb-6 block">
                {language === "bn" ? "পদ্ধতি / ০১" : "Workflow / 01"}
              </span>
              <h2 className={`font-serif text-6xl md:text-8xl italic text-foreground ${
                language === "bn" ? "leading-snug md:leading-[1.25] tracking-normal" : "leading-[0.9] tracking-tight"
              }`}>
                {language === "bn" ? <>যেভাবে <br />কাজ করে।</> : <>How <br />it Works.</>}
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7 pt-12">
              <p className="text-foreground-muted text-lg font-medium tracking-tight leading-relaxed max-w-md">
                {language === "bn"
                  ? "আমরা ঐতিহ্যবাহী বায়োডাটা তৈরির পদ্ধতিকে একটি আধুনিক ও দ্রুত ডিজিটাল অভিজ্ঞতায় রূপান্তর করেছি।"
                  : "We've distilled the traditional biodata process into a seamless digital journey, prioritizing speed without compromising on detail."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border border-b-0">
            {workflowSteps.map((item, i) => (
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
                  <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-success">
                    {language === "bn" ? "প্রাইভেসি ও সিকিউরিটি" : "Verified Security Protocol"}
                  </span>
                </div>
                <h2 className={`font-serif text-6xl md:text-8xl text-[#eaeaea] mb-10 ${
                  language === "bn" ? "leading-snug md:leading-[1.25] tracking-normal" : "leading-[0.9] tracking-tight"
                }`}>
                  {language === "bn" ? <>সম্পূর্ণ <br /><span className="italic">সুরক্ষিত।</span></> : <>Secure by <br /><span className="italic">Design.</span></>}
                </h2>
                <p className="text-[#eaeaea]/75 text-lg font-medium leading-relaxed max-w-md">
                  {language === "bn"
                    ? "আপনার ব্যক্তিগত তথ্যের নিরাপত্তা আমাদের কাছে সবচেয়ে গুরুত্বপূর্ণ।"
                    : "We treat your personal data with the gravity it deserves. Our infrastructure is built on principles of isolation and encryption."}
                </p>
              </div>

              <div className="col-span-12 lg:col-span-6 lg:col-start-7 grid grid-cols-1 sm:grid-cols-2 gap-10">
                {[
                  {
                    title: language === "bn" ? "গোপনীয়তা সুরক্ষা" : "Encrypted Storage",
                    desc: language === "bn"
                      ? "আপনার সকল তথ্য সুরক্ষিত ডাটাবেসে সংরক্ষিত থাকে এবং আপনার অনুমতি ছাড়া শেয়ার হয় না।"
                      : "All biodata records are stored with industry-standard encryption, accessible only via secure session tokens."
                  },
                  {
                    title: language === "bn" ? "প্রাইভেট লিঙ্ক" : "Private URI",
                    desc: language === "bn"
                      ? "প্রাইভেট লিঙ্ক শুধুমাত্র যাদের সাথে শেয়ার করবেন তারাই দেখতে পাবেন।"
                      : "Share links are generated with high-entropy identifiers, making them impossible to discover without the URI."
                  },
                  {
                    title: language === "bn" ? "গুগল সার্চ বন্ধ" : "Zero Discovery",
                    desc: language === "bn"
                      ? "প্রাইভেট বায়োডাটা গুগল সার্চে আসবে না, সম্পূর্ণ নিয়ন্ত্রণ আপনার কাছে।"
                      : "We do not index private profiles on search engines, ensuring your data remains in your control at all times."
                  },
                  {
                    title: language === "bn" ? "নিরাপদ এক্সপোর্ট" : "Clean Export",
                    desc: language === "bn"
                      ? "হাই রেজোলিউশন ওয়াটারমার্কহীন পিডিএফ এক্সপোর্ট।"
                      : "High resolution watermark-free professional PDF export."
                  }
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-success/80">0{i + 1} / {language === "bn" ? "সুরক্ষিত" : "Verified"}</h4>
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

        {/* BROWSE BY DISTRICT SECTION */}
        <Section className="border-t border-border py-24">
          <div className="max-w-4xl mx-auto px-6 sm:px-0 text-center">
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 mb-6 block">
              {language === "bn" ? "জেলা ডিরেক্টরি / ০২" : "Quick Directory / 02"}
            </span>
            <h2 className={`font-serif text-5xl md:text-7xl text-foreground mb-12 ${
              language === "bn" ? "leading-snug md:leading-[1.25] tracking-normal" : "leading-[0.9] tracking-tight"
            }`}>
              {language === "bn" ? <>জেলা অনুযায়ী <br /><span className="italic">বায়োডাটা।</span></> : <>Browse by <br /><span className="italic">Location.</span></>}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {districts.map((d) => (
                <Link
                  key={d.en}
                  href={`/biodata?q=${d.en}`}
                  className="px-6 py-3 border border-border-muted text-foreground-muted hover:border-foreground hover:text-foreground transition-all font-mono text-[11px] uppercase tracking-widest"
                >
                  {language === "bn" ? d.bn : d.en}
                </Link>
              ))}
              <Link
                href="/biodata"
                className="px-6 py-3 border border-foreground bg-foreground text-background transition-all font-mono text-[11px] uppercase tracking-widest"
              >
                {language === "bn" ? "সকল জেলা" : "All Districts"}
              </Link>
            </div>
          </div>
        </Section>

        {/* CTA BANNER */}
        <Section className="text-center bg-surface border-b border-border-muted/50 py-16 md:py-24">
          <div className="max-w-[600px] mx-auto">
            <h2 className={`text-5xl md:text-8xl font-serif text-foreground mb-8 ${
              language === "bn" ? "leading-snug md:leading-[1.25] tracking-normal" : "leading-[0.9] tracking-tighter"
            }`}>
              {language === "bn" ? <>আপনার বায়োডাটা <br /><span className="italic">তৈরি করুন।</span></> : <>A commitment to <br /><span className="italic">intentional marriage.</span></>}
            </h2>
            <Link href={hasUser ? "/dashboard" : "/api/auth/signin"}>
              <Button variant="primary" size="lg" className="px-10 transition-all">
                {hasUser ? (language === "bn" ? "ড্যাশবোর্ডে যান" : "Go to Dashboard") : (language === "bn" ? "বায়োডাটা তৈরি করুন" : "Join The Registry")}
              </Button>
            </Link>
          </div>
        </Section>

        {/* FAQ SECTION */}
        <Section id="knowledge" className="border-t border-border py-24 bg-surface/5">
          <div className="max-w-3xl mx-auto px-6 sm:px-0">
            <div className="mb-16 border-l-2 border-foreground/10 pl-8">
              <h2 className="font-serif text-3xl text-foreground mb-6">
                {language === "bn" ? "BiyeProfile কী?" : "What is BiyeProfile?"}
              </h2>
              <p className="text-foreground-muted text-base font-medium leading-relaxed">
                {language === "bn"
                  ? "BiyeProfile হলো বিবাহের বায়োডাটা তৈরি, সংরক্ষণ ও নিরাপদে শেয়ার করার জন্য একটি প্রফেশনাল অনলাইন মাধ্যম। এর মাধ্যমে পাত্র-পাত্রী বা তাদের পরিবার অত্যন্ত সুশৃঙ্খল ও মার্জিতভাবে বায়োডাটা তৈরি করে সহজে পিডিএফ বা ডিজিটাল লিঙ্কে শেয়ার করতে পারেন।"
                  : "BiyeProfile is a professional digital environment designed for creating, managing, and sharing marriage biodata. We provide structured tools to help individuals and families present their stories with dignity, clarity, and complete privacy control."}
              </p>
            </div>

            <div className="pt-16 border-t border-border">
              <h2 className="font-serif text-3xl text-foreground mb-12 text-center italic">
                {t.home.faqTitle}
              </h2>
              <div className="space-y-12">
                {(t.home.faqs
                  ? t.home.faqs.map((f) => ({ name: f.question, acceptedAnswer: { text: f.answer } }))
                  : faqSchema.mainEntity
                ).map((faq, i) => (
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
