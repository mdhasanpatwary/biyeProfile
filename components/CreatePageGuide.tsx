"use client"

import { useLanguage } from "@/components/LanguageContext"

export function CreatePageHeader() {
  const { t } = useLanguage()
  return (
    <div className="max-w-2xl mb-12">
      <h1 className="text-4xl font-serif text-foreground mb-6 italic">
        {t.create?.title || "Create Marriage Biodata"}
      </h1>
    </div>
  )
}

interface HowToStep {
  name: string
  text: string
}

interface FaqItem {
  name: string
  acceptedAnswer: { text: string }
}

interface CreatePageGuideProps {
  fallbackSteps: HowToStep[]
  fallbackFaqs: FaqItem[]
}

export function CreatePageGuide({ fallbackSteps, fallbackFaqs }: CreatePageGuideProps) {
  const { t } = useLanguage()

  const steps = t.create?.steps || fallbackSteps
  const faqs = t.create?.faqs
    ? t.create.faqs.map((f) => ({ name: f.question, acceptedAnswer: { text: f.answer } }))
    : fallbackFaqs

  return (
    <div className="mt-32 pt-24 border-t border-border-muted max-w-3xl mx-auto px-6 sm:px-0">
      <div className="mb-20">
        <h2 className="text-3xl font-serif text-foreground mb-8 italic">
          {t.create?.guideTitle || "Quick Guide to Creating a Biodata"}
        </h2>
        <div className="prose prose-sm prose-neutral">
          <p className="text-foreground-muted text-base leading-relaxed font-medium mb-6">
            {t.create?.guideDesc || "Creating a marriage biodata on BiyeProfile involves five simple steps: entering basic info, adding education/profession, providing family history, setting expectations, and exporting as PDF. Our tool ensures your profile is structured professionally and respects your privacy."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 bg-surface/30 p-8 rounded-sm">
            <div>
              <h3 className="text-sm font-mono font-black uppercase tracking-widest text-foreground-muted mb-4 underline decoration-foreground/20 underline-offset-4">
                {t.create?.stepsTitle || "Creation Steps"}
              </h3>
              <ul className="space-y-3 text-[13px] text-foreground-muted font-medium list-none">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-foreground-muted/40">{i + 1}.</span>
                    <span>
                      <span className="text-foreground font-bold">{step.name}:</span> {step.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-mono font-black uppercase tracking-widest text-foreground-muted mb-4 underline decoration-foreground/20 underline-offset-4">
                {t.create?.commonQuestionsTitle || "Common Questions"}
              </h3>
              <div className="space-y-6">
                {faqs.map((faq, i) => (
                  <div key={i}>
                    <p className="text-[13px] text-foreground font-bold mb-1">{faq.name}</p>
                    <p className="text-[12px] text-foreground-muted leading-relaxed font-medium">
                      {faq.acceptedAnswer.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
