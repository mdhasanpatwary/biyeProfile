import { type UseFormReturn } from "react-hook-form"
import { type BiodataFormValues } from "@/lib/validations/biodata"

interface ReviewSubmitStepProps {
  form: UseFormReturn<BiodataFormValues>
  lang: "en" | "bn"
  isGuest?: boolean
}

export function ReviewSubmitStep({ lang, isGuest }: ReviewSubmitStepProps) {
  const content = {
    en: {
      title: "Review & Finalize",
      description: "You're almost done! Please take a moment to review your biodata in the preview panel.",
      actionInstruction: isGuest
        ? "If everything looks good, you can click 'Download PDF' to get your finished biodata."
        : "If everything looks good, click 'Save & Finish' to publish and return to your dashboard.",
      previewNote: "Use the preview panel on the right (or tap Preview on mobile) to see exactly how your biodata will look to others.",
      congrats: "Great job completing your profile!"
    },
    bn: {
      title: "পর্যালোচনা এবং চূড়ান্ত করুন",
      description: "আপনার কাজ প্রায় শেষ! অনুগ্রহ করে প্রিভিউ প্যানেলে আপনার বায়োডাটা পর্যালোচনা করার জন্য একটু সময় নিন।",
      actionInstruction: isGuest
        ? "যদি সবকিছু ঠিক থাকে, তাহলে আপনার সম্পন্ন বায়োডাটা পেতে 'PDF ডাউনলোড করুন'-এ ক্লিক করুন।"
        : "যদি সবকিছু ঠিক থাকে, প্রকাশ করতে এবং ড্যাশবোর্ডে ফিরে যেতে 'সেভ এবং শেষ করুন'-এ ক্লিক করুন।",
      previewNote: "আপনার বায়োডাটা অন্যদের কাছে কেমন দেখাবে তা দেখতে ডানদিকের প্রিভিউ প্যানেল ব্যবহার করুন (বা মোবাইলে প্রিভিউ-এ ট্যাপ করুন)।",
      congrats: "প্রোফাইল সম্পূর্ণ করার জন্য অভিনন্দন!"
    }
  }

  const t = content[lang] || content.en

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto py-10">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="text-3xl font-serif text-foreground tracking-tight">
          {t.congrats}
        </h2>

        <div className="bg-muted p-8 rounded-none border-l-4 border-primary text-left space-y-4 shadow-sm border border-border-muted/50">
          <h3 className="text-xl font-medium text-foreground">{t.title}</h3>
          <p className="text-foreground-muted leading-relaxed">
            {t.description}
          </p>
          <p className="text-foreground-muted leading-relaxed font-medium bg-background p-4 border border-border-muted">
            <span className="text-xl mr-2">👀</span> {t.previewNote}
          </p>
          <p className="text-foreground-muted leading-relaxed pt-4 border-t border-border-muted">
            {t.actionInstruction}
          </p>
        </div>
      </div>
    </div>
  )
}
