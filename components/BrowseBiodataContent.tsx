"use client"

import Link from "next/link"
import { SearchInput } from "@/components/SearchInput"
import { BiodataCard } from "@/components/BiodataCard"
import { Button } from "@/components/ui/button"
import { type BiodataFormValues } from "@/lib/validations/biodata"
import { useLanguage } from "@/components/LanguageContext"

interface BrowseBiodataContentProps {
  biodata: {
    id: string
    user: { username: string | null }
    data: unknown
  }[]
  religion?: string
  q?: string
  religions: string[]
  browseFaqSchema: {
    mainEntity: { name: string; acceptedAnswer: { text: string } }[]
  }
}

export function BrowseBiodataContent({
  biodata,
  religion,
  q,
  religions,
  browseFaqSchema,
}: BrowseBiodataContentProps) {
  const { t, language } = useLanguage()

  const religionLabels: Record<string, string> = {
    "Islam": "ইসলাম",
    "Hinduism": "হিন্দু",
    "Christianity": "খ্রিস্টান",
    "Buddhism": "বৌদ্ধ",
    "Other": "অন্যান্য",
  }

  const getReligionLabel = (r: string) => {
    if (language === "bn" && religionLabels[r]) {
      return religionLabels[r]
    }
    return r
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 md:py-16">
        {/* Intro Header */}
        <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
          <div className="md:max-w-xl text-center md:text-left">
            <div className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-foreground-muted mb-8">
              {language === "bn" ? "ডিরেক্টরি / ০১" : "Directory / 01"}
            </div>
            <h1 className={`text-5xl font-serif text-foreground mb-8 ${
              language === "bn" ? "leading-snug md:leading-[1.25] tracking-normal" : "leading-none tracking-tight"
            }`}>
              {t.browse.title}
            </h1>

            <p className="text-foreground-muted font-medium text-lg leading-relaxed md:max-w-md mb-6">
              {t.browse.subtitle}
            </p>
          </div>

          {/* Minimal Filter & Search */}
          <div className="flex flex-col gap-6 md:min-w-[320px]">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-foreground-muted text-center md:text-left">
                {t.common.filterByReligion}
              </span>
              <div className="w-full overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex flex-nowrap justify-center md:justify-start md:flex-wrap gap-2 pb-2 md:pb-0">
                  <Link
                    href={`/biodata${q ? `?q=${encodeURIComponent(q)}` : ""}`}
                    aria-current={!religion ? "true" : undefined}
                    className={`shrink-0 px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest border transition-all ${
                      !religion
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground-muted border-border-muted hover:border-foreground-muted"
                    }`}
                  >
                    {t.common.allReligions}
                  </Link>
                  {religions.map((r) => (
                    <Link
                      key={r}
                      href={`/biodata?religion=${r}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                      aria-current={religion === r ? "true" : undefined}
                      className={`shrink-0 px-4 py-2 text-[10px] font-mono font-black uppercase tracking-widest border transition-all ${
                        religion === r
                          ? "bg-foreground text-background border-foreground"
                          : "bg-transparent text-foreground-muted border-border-muted hover:border-foreground-muted"
                      }`}
                    >
                      {getReligionLabel(r)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Input & Results Count */}
            <div className="w-full flex flex-col gap-3">
              <SearchInput initialQuery={q || ""} />
              <div className="text-right">
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-foreground-muted">
                  {biodata.length} {language === "bn" ? "টি পাওয়া গেছে" : "Results"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* The List */}
        {biodata.length > 0 ? (
          <div className="flex flex-col border-t border-border-muted pb-8 md:pb-12">
            {biodata.map((item) => (
              <BiodataCard
                key={item.id}
                username={item.user.username!}
                data={item.data as unknown as Partial<BiodataFormValues>}
              />
            ))}
          </div>
        ) : (
          <div className="pt-16 md:pt-24 pb-8 md:pb-12 text-center border-t border-border-muted">
            <div className="w-16 h-16 border border-border-muted flex items-center justify-center mx-auto mb-10">
              <svg className="w-6 h-6 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <p className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-foreground-muted mb-4">
              {t.common.noResults}
            </p>
            <h3 className="text-3xl md:text-4xl font-serif italic text-foreground mb-4 tracking-tight">
              {q ? (
                language === "bn" ? <>“{q}” এর জন্য কিছু পাওয়া যায়নি</> : <>Nothing found for &ldquo;{q}&rdquo;</>
              ) : (
                language === "bn" ? <>ফিল্টারে কোন বায়োডাটা নেই</> : <>No profiles match<br />these filters.</>
              )}
            </h3>
            <p className="text-sm text-foreground-muted font-medium max-w-xs mx-auto leading-relaxed mb-12">
              {t.common.noResultsSub}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/biodata">
                <Button variant="primary" className="px-8">
                  {language === "bn" ? "সকল বায়োডাটা দেখুন" : "Browse All Profiles"}
                </Button>
              </Link>
              {q && religion && (
                <Link href={`/biodata?religion=${religion}`}>
                  <Button variant="outline" className="px-8">
                    {t.common.clearFilters}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* FAQ Section at bottom */}
        <div className="mt-32 pt-24 border-t border-border-muted max-w-3xl mx-auto px-6 sm:px-0">
          <div className="pt-20 border-t border-border-muted">
            <h2 className="text-2xl font-serif text-foreground mb-12 italic">
              {t.home.faqTitle}
            </h2>
            <div className="space-y-12 pb-24">
              {(t.browse?.faqs
                ? t.browse.faqs.map((f) => ({ name: f.question, acceptedAnswer: { text: f.answer } }))
                : browseFaqSchema.mainEntity
              ).map((faq, i) => (
                <div key={i} className="group">
                  <h3 className="text-lg font-serif text-foreground mb-3 opacity-90 group-hover:opacity-100 transition-opacity tracking-tight font-bold">
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
      </main>
    </div>
  )
}
